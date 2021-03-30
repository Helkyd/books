const frappe = require('frappejs');
const { __ } = require('../../src/translate'); //HELKYDS 30-03-2021

module.exports = {
  title: __('Balance Sheet'),
  method: 'balance-sheet',
  filterFields: [
    {
      fieldtype: 'Date',
      fieldname: 'toDate',
      size: 'small',
      placeholder: 'ToDate',
      label: 'To Date',
      required: 1,
      default: async () => {
        return (await frappe.getSingle('AccountingSettings')).fiscalYearEnd;
      }
    },
    {
      fieldtype: 'Select',
      size: 'small',
      options: [
        'Select Period...',
        'Monthly',
        'Quarterly',
        'Half Yearly',
        'Yearly'
      ],
      label: __('Periodicity'),
      fieldname: 'periodicity',
      default: 'Monthly'
    }
  ],
  getColumns(data) {
    const columns = [
      {
        label: __('Account'),
        fieldtype: 'Data',
        fieldname: 'account',
        width: 2
      }
    ];

    if (data && data.columns) {
      const currencyColumns = data.columns;
      const columnDefs = currencyColumns.map(name => ({
        label: name,
        fieldname: name,
        fieldtype: 'Currency'
      }));

      columns.push(...columnDefs);
    }

    return columns;
  }
};
