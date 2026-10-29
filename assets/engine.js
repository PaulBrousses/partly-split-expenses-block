/* Original implementation. SPDX-License-Identifier: GPL-2.0-or-later */
(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PartlySplitEngine = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  var MAX_PEOPLE = 30;
  var MAX_EXPENSES = 100;
  var MAX_CENTS = 100000000;
  var MAX_TOTAL_CENTS = 1000000000;
  var CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF', 'CAD'];
  function invalid(code) { var error = new Error(code); error.code = code; throw error; }
  function integer(value, min, max) {
    return typeof value === 'number' && Number.isSafeInteger(value) && value >= min && value <= max;
  }
  function parseAmount(value) {
    if (typeof value !== 'string') invalid('amount');
    var match = /^(0|[1-9]\d{0,6})(?:[.,](\d{1,2}))?$/.exec(value.trim());
    if (!match) invalid('amount');
    var cents = Number(match[1]) * 100 + Number(((match[2] || '') + '00').slice(0, 2));
    if (!integer(cents, 1, MAX_CENTS)) invalid('amount');
    return cents;
  }
  function validatePeople(people) {
    if (!Array.isArray(people) || people.length < 2 || people.length > MAX_PEOPLE) invalid('people');
    var seen = new Set();
    people.forEach(function (person) {
      if (!person || typeof person.id !== 'string' || !/^[a-zA-Z0-9_-]{1,40}$/.test(person.id) || seen.has(person.id)) invalid('people');
      if (typeof person.name !== 'string' || !person.name.trim() || Array.from(person.name.trim()).length > 60) invalid('name');
      seen.add(person.id);
    });
  }
  // Largest remainder assigns every cent exactly, with participant order breaking ties.
  function allocate(cents, weights) {
    if (!integer(cents, 1, MAX_CENTS) || !Array.isArray(weights) || weights.length < 2 || weights.length > MAX_PEOPLE) invalid('amount');
    var totalWeight = 0;
    weights.forEach(function (weight) {
      if (!integer(weight, 0, 10000)) invalid('weights');
      totalWeight += weight;
    });
    if (!totalWeight) invalid('weights');
    var rows = weights.map(function (weight, index) {
      var numerator = cents * weight;
      return { index: index, cents: Math.floor(numerator / totalWeight), remainder: numerator % totalWeight };
    });
    var remainder = cents - rows.reduce(function (sum, row) { return sum + row.cents; }, 0);
    var ranked = rows.slice().sort(function (a, b) { return b.remainder - a.remainder || a.index - b.index; });
    for (var i = 0; i < remainder; i++) ranked[i].cents += 1;
    return rows.map(function (row) { return row.cents; });
  }
  function calculate(input) {
    if (!input || typeof input !== 'object') invalid('input');
    validatePeople(input.participants);
    if (CURRENCIES.indexOf(input.currency) < 0) invalid('currency');
    if (!Array.isArray(input.expenses) || input.expenses.length < 1 || input.expenses.length > MAX_EXPENSES) invalid('expenses');
    var people = input.participants;
    var indexById = new Map(people.map(function (person, index) { return [person.id, index]; }));
    var rows = people.map(function (person) { return { id: person.id, name: person.name.trim(), paidCents: 0, shareCents: 0, netCents: 0 }; });
    var total = 0;
    var allocations = input.expenses.map(function (expense) {
      if (!expense || !integer(expense.amountCents, 1, MAX_CENTS) || !indexById.has(expense.payerId)) invalid('expense');
      if (expense.description !== undefined && (typeof expense.description !== 'string' || Array.from(expense.description).length > 80)) invalid('description');
      var shares = expense.shares;
      if (!shares || typeof shares !== 'object' || Array.isArray(shares)) invalid('weights');
      if (Object.keys(shares).some(function (id) { return !indexById.has(id) || !integer(shares[id], 1, 10000); })) invalid('weights');
      var weights = people.map(function (person) { return Object.prototype.hasOwnProperty.call(shares, person.id) ? shares[person.id] : 0; });
      var amounts = allocate(expense.amountCents, weights);
      rows[indexById.get(expense.payerId)].paidCents += expense.amountCents;
      amounts.forEach(function (amount, index) { rows[index].shareCents += amount; });
      total += expense.amountCents;
      if (total > MAX_TOTAL_CENTS) invalid('total');
      return amounts;
    });
    rows.forEach(function (row) { row.netCents = row.paidCents - row.shareCents; });
    var creditors = rows.map(function (row, i) { return { index: i, remaining: row.netCents }; }).filter(function (row) { return row.remaining > 0; });
    var debtors = rows.map(function (row, i) { return { index: i, remaining: -row.netCents }; }).filter(function (row) { return row.remaining > 0; });
    function byRemaining(a, b) { return b.remaining - a.remaining || a.index - b.index; }
    creditors.sort(byRemaining); debtors.sort(byRemaining);
    var transfers = []; var debtorIndex = 0; var creditorIndex = 0;
    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
      var debtor = debtors[debtorIndex]; var creditor = creditors[creditorIndex];
      var amount = Math.min(debtor.remaining, creditor.remaining);
      transfers.push({ fromId: rows[debtor.index].id, toId: rows[creditor.index].id, amountCents: amount });
      debtor.remaining -= amount; creditor.remaining -= amount;
      if (!debtor.remaining) debtorIndex++;
      if (!creditor.remaining) creditorIndex++;
    }
    return { currency: input.currency, totalCents: total, balances: rows, allocations: allocations, transfers: transfers };
  }
  return Object.freeze({ parseAmount: parseAmount, allocate: allocate, calculate: calculate, MAX_PEOPLE: MAX_PEOPLE, MAX_EXPENSES: MAX_EXPENSES, MAX_CENTS: MAX_CENTS, MAX_TOTAL_CENTS: MAX_TOTAL_CENTS, currencies: Object.freeze(CURRENCIES) });
}));
