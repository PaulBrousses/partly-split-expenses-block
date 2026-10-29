/* Original implementation. SPDX-License-Identifier: GPL-2.0-or-later */
(function (root) {
  'use strict';
  var sequence = 0;
  function mount(container, options) {
    if (!container) throw new Error('Calculator container required');
    if (container.psbInstance) return container.psbInstance;
    options = options || {};
    var engine = root.PartlySplitEngine;
    var language = ['en', 'fr', 'es'].indexOf(options.locale) >= 0 ? options.locale : 'en';
    var currency = engine.currencies.indexOf(options.currency) >= 0 ? options.currency : 'EUR';
    var copy = root.PartlySplitCopy[language];
    var prefix = 'psb-' + (++sequence) + '-';
    var peopleSequence = 2;
    var expenseSequence = 0;
    var state = { participants: [{ id: 'p1', name: copy.person + ' 1' }, { id: 'p2', name: copy.person + ' 2' }], expenses: [] };
    var document = container.ownerDocument;
    var destroyed = false;
    function node(tag, text, className) {
      var item = document.createElement(tag);
      if (text !== undefined && text !== null) item.textContent = String(text);
      if (className) item.className = className;
      return item;
    }
    function empty(item) { while (item.firstChild) item.removeChild(item.firstChild); }
    function button(label, action, className) {
      var item = node('button', label, className || 'psb-button');
      item.type = 'button'; item.addEventListener('click', action); return item;
    }
    function labelInput(labelText, id, type, value) {
      var wrap = node('div', null, 'psb-field');
      var label = node('label', labelText); label.htmlFor = id;
      var input = node('input'); input.type = type; input.id = id; input.value = value || '';
      wrap.append(label, input); return { wrap: wrap, input: input, label: label };
    }
    function money(cents) { return new Intl.NumberFormat(language, { style: 'currency', currency: currency }).format(cents / 100); }
    function report(message, isError) {
      error.textContent = isError ? message : '';
      status.textContent = isError ? '' : message;
    }
    function invalidate() {
      if (!result.hidden) { result.hidden = true; empty(result); report(copy.updated, false); }
    }
    function nameFor(id) {
      var person = state.participants.find(function (item) { return item.id === id; });
      return person ? person.name : '';
    }
    empty(container); container.classList.add('psb-calculator'); container.lang = language;
    var heading = node('h2', copy.title); heading.id = prefix + 'title';
    var shell = node('section'); shell.setAttribute('aria-labelledby', heading.id);
    var privacy = node('p', copy.privacy, 'psb-muted');
    var currencyNote = node('p', copy.currency + ': ' + currency, 'psb-currency');
    var error = node('p', '', 'psb-error'); error.setAttribute('role', 'alert');
    var status = node('p', '', 'psb-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
    var peopleArea = node('section'); var peopleTitle = node('h3', copy.participants); peopleTitle.id = prefix + 'people-title';
    peopleArea.setAttribute('aria-labelledby', peopleTitle.id);
    var peopleList = node('div', null, 'psb-people');
    var addPersonButton = button(copy.addPerson, function () {
      if (state.participants.length >= engine.MAX_PEOPLE) return report(copy.maximum, true);
      peopleSequence++; state.participants.push({ id: 'p' + peopleSequence, name: copy.person + ' ' + peopleSequence });
      invalidate(); renderPeople(); refreshPayer(); renderShares();
      peopleList.lastElementChild.querySelector('input').focus();
    });
    peopleArea.append(peopleTitle, peopleList, addPersonButton);
    var form = node('form', null, 'psb-expense-form');
    // No action or named fields: the submit listener prevents navigation and network use.
    form.noValidate = true;
    var expenseTitle = node('h3', copy.expense); expenseTitle.id = prefix + 'expense-title'; form.setAttribute('aria-labelledby', expenseTitle.id);
    var description = labelInput(copy.description, prefix + 'description', 'text', ''); description.input.maxLength = 80; description.input.autocomplete = 'off';
    var amount = labelInput(copy.amount + ' (' + currency + ')', prefix + 'amount', 'text', ''); amount.input.inputMode = 'decimal'; amount.input.maxLength = 10; amount.input.autocomplete = 'off';
    var amountHint = node('small', copy.amountHint); amountHint.id = prefix + 'amount-hint'; amount.input.setAttribute('aria-describedby', amountHint.id); amount.wrap.append(amountHint);
    var payerWrap = node('div', null, 'psb-field'); var payerLabel = node('label', copy.payer); payerLabel.htmlFor = prefix + 'payer';
    var payer = node('select'); payer.id = payerLabel.htmlFor; payerWrap.append(payerLabel, payer);
    var shares = node('fieldset'); var legend = node('legend', copy.shares);
    var hint = node('p', copy.sharesHint, 'psb-muted'); hint.id = prefix + 'shares-hint'; shares.setAttribute('aria-describedby', hint.id);
    var sharesList = node('div', null, 'psb-shares'); shares.append(legend, hint, sharesList);
    var addExpenseButton = node('button', copy.addExpense, 'psb-button psb-primary'); addExpenseButton.type = 'submit';
    form.append(expenseTitle, description.wrap, amount.wrap, payerWrap, shares, addExpenseButton);
    var expensesArea = node('section'); var expensesTitle = node('h3', copy.expenses); expensesTitle.id = prefix + 'expenses-title';
    expensesArea.setAttribute('aria-labelledby', expensesTitle.id);
    var expenseList = node('div', null, 'psb-expenses'); expensesArea.append(expensesTitle, expenseList);
    var calculateButton = button(copy.calculate, calculate, 'psb-button psb-primary');
    var result = node('section', null, 'psb-result'); result.hidden = true; result.tabIndex = -1;
    var note = node('p', copy.note, 'psb-muted');
    var reset = button(copy.reset, function () {
      if (!root.confirm(copy.resetConfirm)) return;
      state.participants = [{ id: 'p1', name: copy.person + ' 1' }, { id: 'p2', name: copy.person + ' 2' }];
      state.expenses = []; peopleSequence = 2; expenseSequence = 0;
      description.input.value = ''; amount.input.value = '';
      result.hidden = true; empty(result); renderPeople(); refreshPayer(); renderShares(); renderExpenses(); report('', false);
      peopleList.querySelector('input').focus();
    }, 'psb-button psb-reset');
    shell.append(heading, privacy, currencyNote, peopleArea, form, expensesArea, error, status, calculateButton, result, note, reset);
    if (options.showCredit === true) {
      var credit = node('a', copy.credit, 'psb-credit');
      credit.href = 'https://partly-app.com/' + language + '/tools/split-expenses-calculator/';
      credit.rel = 'noreferrer noopener'; credit.referrerPolicy = 'no-referrer'; shell.append(credit);
    }
    container.append(shell);
    function renderPeople() {
      empty(peopleList);
      state.participants.forEach(function (person, index) {
        var field = labelInput(copy.name + ' ' + (index + 1), prefix + person.id, 'text', person.name);
        field.wrap.classList.add('psb-person'); field.input.maxLength = 60; field.input.autocomplete = 'off';
        field.input.addEventListener('input', function () {
          person.name = field.input.value; invalidate(); refreshPayer();
          remove.setAttribute('aria-label', copy.removePerson + ' ' + person.name);
          var shareLabel = sharesList.querySelector('label[for="' + prefix + 'weight-' + person.id + '"]');
          if (shareLabel) shareLabel.textContent = copy.share + ' ' + person.name;
          renderExpenses();
        });
        var remove = button('×', function () {
          if (state.expenses.some(function (expense) { return expense.payerId === person.id; })) return report(copy.personInUse, true);
          if (state.expenses.some(function (expense) {
            return expense.shares[person.id] > 0 && Object.keys(expense.shares).every(function (id) { return id === person.id || expense.shares[id] === 0; });
          })) return report(copy.removeShareError, true);
          state.expenses.forEach(function (expense) { delete expense.shares[person.id]; });
          state.participants = state.participants.filter(function (item) { return item.id !== person.id; });
          invalidate(); renderPeople(); refreshPayer(); renderShares(); renderExpenses(); addPersonButton.focus();
        }, 'psb-button psb-remove');
        remove.disabled = state.participants.length <= 2;
        remove.setAttribute('aria-label', copy.removePerson + ' ' + person.name);
        field.wrap.append(remove); peopleList.append(field.wrap);
      });
      addPersonButton.disabled = state.participants.length >= engine.MAX_PEOPLE;
    }
    function refreshPayer() {
      var previous = payer.value; empty(payer);
      state.participants.forEach(function (person) {
        var option = node('option', person.name); option.value = person.id; payer.append(option);
      });
      if (state.participants.some(function (person) { return person.id === previous; })) payer.value = previous;
    }
    function renderShares() {
      var previous = {};
      sharesList.querySelectorAll('input').forEach(function (input) { previous[input.dataset.personId] = input.value; });
      empty(sharesList);
      state.participants.forEach(function (person) {
        var field = labelInput(copy.share + ' ' + person.name, prefix + 'weight-' + person.id, 'number', Object.prototype.hasOwnProperty.call(previous, person.id) ? previous[person.id] : '1');
        field.input.min = '0'; field.input.max = '10000'; field.input.step = '1'; field.input.dataset.personId = person.id;
        sharesList.append(field.wrap);
      });
    }
    function renderExpenses() {
      empty(expenseList);
      if (!state.expenses.length) expenseList.append(node('p', copy.noExpenses, 'psb-muted'));
      state.expenses.forEach(function (expense, index) {
        var row = node('div', null, 'psb-expense');
        var detail = node('details');
        detail.append(node('summary', (expense.description || copy.expenses + ' ' + (index + 1)) + ' · ' + money(expense.amountCents) + ' · ' + copy.payer + ' ' + nameFor(expense.payerId)));
        var list = node('ul');
        state.participants.forEach(function (person) { list.append(node('li', person.name + ': ' + (expense.shares[person.id] || 0))); });
        detail.append(node('p', copy.expensePeople), list);
        var remove = button('×', function () {
          state.expenses = state.expenses.filter(function (item) { return item.id !== expense.id; });
          invalidate(); renderExpenses(); report(copy.removed, false); calculateButton.focus();
        }, 'psb-button psb-remove');
        remove.setAttribute('aria-label', copy.removeExpense + ' ' + (expense.description || String(index + 1)));
        row.append(detail, remove); expenseList.append(row);
      });
      addExpenseButton.disabled = state.expenses.length >= engine.MAX_EXPENSES;
    }
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      if (destroyed) return;
      if (state.expenses.length >= engine.MAX_EXPENSES) return report(copy.maximum, true);
      try {
        if (state.participants.some(function (person) { return !person.name.trim(); })) throw new Error('name');
        var cents = engine.parseAmount(amount.input.value);
        var weights = {};
        sharesList.querySelectorAll('input').forEach(function (input) {
          if (!/^\d{1,5}$/.test(input.value)) throw new Error('weights');
          if (Number(input.value) > 0) weights[input.dataset.personId] = Number(input.value);
        });
        var expense = { id: 'e' + (++expenseSequence), description: description.input.value, amountCents: cents, payerId: payer.value, shares: weights };
        // Validate the prospective full group, including its cumulative total limit.
        engine.calculate({ participants: state.participants, expenses: state.expenses.concat(expense), currency: currency });
        state.expenses.push(expense); invalidate(); renderExpenses();
        description.input.value = ''; amount.input.value = ''; report(copy.added, false); amount.input.focus();
      } catch (exception) { report(copy.invalid, true); }
    });
    function calculate() {
      if (!state.expenses.length) return report(copy.noExpensesError, true);
      try {
        var output = engine.calculate({ participants: state.participants, expenses: state.expenses, currency: currency });
        renderExpenses(); empty(result);
        var resultTitle = node('h3', copy.result); resultTitle.id = prefix + 'result-title'; result.setAttribute('aria-labelledby', resultTitle.id);
        result.append(resultTitle, node('p', copy.total + ': ' + money(output.totalCents), 'psb-total'));
        var tableWrap = node('div', null, 'psb-table-wrap'); var table = node('table'); table.append(node('caption', copy.summary));
        var head = node('thead'); var headerRow = node('tr');
        [copy.name, copy.paid, copy.owed, copy.balance].forEach(function (label) { var th = node('th', label); th.scope = 'col'; headerRow.append(th); });
        head.append(headerRow); table.append(head); var body = node('tbody');
        output.balances.forEach(function (balance) {
          var tr = node('tr'); var name = node('th', balance.name); name.scope = 'row'; tr.append(name);
          [balance.paidCents, balance.shareCents, balance.netCents].forEach(function (value) { tr.append(node('td', money(value))); }); body.append(tr);
        });
        table.append(body); tableWrap.append(table); result.append(tableWrap);
        var transfers = node('ul', null, 'psb-transfers');
        output.transfers.forEach(function (transfer) { transfers.append(node('li', nameFor(transfer.fromId) + ' ' + copy.pays + ' ' + nameFor(transfer.toId) + ' : ' + money(transfer.amountCents))); });
        if (output.transfers.length) result.append(transfers); else result.append(node('p', copy.settled));
        result.hidden = false; report(copy.result, false); result.focus();
      } catch (exception) { invalidate(); report(copy.invalid, true); }
    }
    renderPeople(); refreshPayer(); renderShares(); renderExpenses();
    var instance = { destroy: function () { destroyed = true; empty(container); delete container.psbInstance; } };
    container.psbInstance = instance; return instance;
  }
  root.PartlySplitBlockUI = Object.freeze({ mount: mount });
  function boot() {
    root.document.querySelectorAll('[data-psb-locale]').forEach(function (container) {
      mount(container, { locale: container.dataset.psbLocale, currency: container.dataset.psbCurrency, showCredit: container.dataset.psbCredit === '1' });
    });
  }
  if (root.document) {
    if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', boot, { once: true });
    else boot();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this));
