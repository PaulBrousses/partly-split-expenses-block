/* Original implementation. SPDX-License-Identifier: GPL-2.0-or-later */
(function (root) {
  'use strict';
  root.PartlySplitCopy = {
    en: {
      title: 'Split shared expenses', privacy: 'Calculations stay on this page. Nothing is sent or saved. Reloading clears your entries.',
      participants: 'Participants', person: 'Person', name: 'Name', addPerson: 'Add participant', removePerson: 'Remove participant',
      expense: 'Add an expense', description: 'Description (optional)', amount: 'Amount', payer: 'Paid by', shares: 'Shares',
      sharesHint: 'Use 1 each to split equally. Use 0 to exclude someone, or larger whole numbers for custom shares.',
      share: 'Share for', addExpense: 'Add expense', expenses: 'Expenses', removeExpense: 'Remove expense', noExpenses: 'No expenses yet.',
      calculate: 'Calculate reimbursements', result: 'Settlement suggestions', total: 'Total expenses', paid: 'Paid', owed: 'Share', balance: 'Balance',
      summary: 'Participant balances', transfers: 'Suggested reimbursements', pays: 'pays', settled: 'Everyone is settled.',
      note: 'These are suggestions, not payments. No transfers are made. All expenses use the same currency; no conversion is performed.',
      invalid: 'Check participant names, a positive amount with at most two decimals, a payer and at least one non-zero whole-number share (0–10000).',
      maximum: 'Limit reached: 30 participants or 100 expenses.', personInUse: 'Remove this person’s expenses first. Their shares in other expenses will also be removed.',
      updated: 'Entries changed. Calculate again for updated suggestions.', added: 'Expense added.', removed: 'Expense removed.',
      currency: 'Currency', reset: 'Clear all entries', resetConfirm: 'Clear all participants, expenses and results?',
      credit: 'Calculator by Partly', weight: 'Weight', count: 'expenses', amountHint: 'For example 12.50 or 12,50. Maximum 1,000,000.00.',
      expensePeople: 'Participants and weights', emptyName: 'Enter a name for every participant.',
      noExpensesError: 'Add at least one expense before calculating.', removeShareError: 'This person is the only participant sharing an expense. Remove that expense first.'
    },
    fr: {
      title: 'Répartir les frais partagés', privacy: 'Les calculs restent sur cette page. Rien n’est envoyé ni enregistré. Recharger efface vos saisies.',
      participants: 'Participants', person: 'Personne', name: 'Nom', addPerson: 'Ajouter un participant', removePerson: 'Retirer le participant',
      expense: 'Ajouter une dépense', description: 'Description (facultative)', amount: 'Montant', payer: 'Payé par', shares: 'Parts',
      sharesHint: 'Mettez 1 pour chacun pour partager à parts égales, 0 pour exclure une personne, ou des entiers plus grands pour personnaliser.',
      share: 'Part de', addExpense: 'Ajouter la dépense', expenses: 'Dépenses', removeExpense: 'Retirer la dépense', noExpenses: 'Aucune dépense pour le moment.',
      calculate: 'Calculer les remboursements', result: 'Remboursements suggérés', total: 'Total des dépenses', paid: 'Payé', owed: 'Part', balance: 'Solde',
      summary: 'Soldes des participants', transfers: 'Remboursements suggérés', pays: 'rembourse à', settled: 'Tous les comptes sont équilibrés.',
      note: 'Ce sont des suggestions, pas des paiements. Aucun virement n’est effectué. Toutes les dépenses utilisent la même devise, sans conversion.',
      invalid: 'Vérifiez les noms, un montant positif avec au plus deux décimales, le payeur et au moins une part entière non nulle (0 à 10000).',
      maximum: 'Limite atteinte : 30 participants ou 100 dépenses.', personInUse: 'Retirez d’abord les dépenses payées par cette personne. Ses parts dans les autres dépenses seront aussi retirées.',
      updated: 'Les saisies ont changé. Relancez le calcul pour actualiser les suggestions.', added: 'Dépense ajoutée.', removed: 'Dépense retirée.',
      currency: 'Devise', reset: 'Tout effacer', resetConfirm: 'Effacer tous les participants, les dépenses et les résultats ?',
      credit: 'Calculateur par Partly', weight: 'Poids', count: 'dépenses', amountHint: 'Par exemple 12,50 ou 12.50. Maximum 1 000 000,00.',
      expensePeople: 'Participants et poids', emptyName: 'Saisissez un nom pour chaque participant.',
      noExpensesError: 'Ajoutez au moins une dépense avant de calculer.', removeShareError: 'Cette personne est la seule à partager une dépense. Retirez d’abord cette dépense.'
    },
    es: {
      title: 'Repartir gastos compartidos', privacy: 'Los cálculos se quedan en esta página. Nada se envía ni se guarda. Recargar borra los datos.',
      participants: 'Participantes', person: 'Persona', name: 'Nombre', addPerson: 'Añadir participante', removePerson: 'Quitar participante',
      expense: 'Añadir un gasto', description: 'Descripción (opcional)', amount: 'Importe', payer: 'Pagado por', shares: 'Partes',
      sharesHint: 'Usa 1 para cada persona para dividir por igual, 0 para excluirla o enteros mayores para personalizar las partes.',
      share: 'Parte de', addExpense: 'Añadir gasto', expenses: 'Gastos', removeExpense: 'Quitar gasto', noExpenses: 'Todavía no hay gastos.',
      calculate: 'Calcular reembolsos', result: 'Reembolsos sugeridos', total: 'Total de gastos', paid: 'Pagado', owed: 'Parte', balance: 'Saldo',
      summary: 'Saldos de participantes', transfers: 'Reembolsos sugeridos', pays: 'reembolsa a', settled: 'Todas las cuentas están saldadas.',
      note: 'Son sugerencias, no pagos. No se realiza ninguna transferencia. Todos los gastos usan la misma moneda, sin conversión.',
      invalid: 'Revisa los nombres, un importe positivo con un máximo de dos decimales, quién pagó y al menos una parte entera distinta de cero (0–10000).',
      maximum: 'Límite alcanzado: 30 participantes o 100 gastos.', personInUse: 'Quita primero los gastos pagados por esta persona. También se eliminarán sus partes en otros gastos.',
      updated: 'Los datos han cambiado. Vuelve a calcular para actualizar las sugerencias.', added: 'Gasto añadido.', removed: 'Gasto eliminado.',
      currency: 'Moneda', reset: 'Borrar todos los datos', resetConfirm: '¿Borrar todos los participantes, gastos y resultados?',
      credit: 'Calculadora de Partly', weight: 'Peso', count: 'gastos', amountHint: 'Por ejemplo 12,50 o 12.50. Máximo 1.000.000,00.',
      expensePeople: 'Participantes y pesos', emptyName: 'Escribe un nombre para cada participante.',
      noExpensesError: 'Añade al menos un gasto antes de calcular.', removeShareError: 'Esta persona es la única que comparte un gasto. Quita primero ese gasto.'
    }
  };
}(typeof globalThis !== 'undefined' ? globalThis : this));
