const frappe = require('frappejs');
const { __ } = require('../../src/translate'); //HELKYDS 30-03-2021

const title = 'Profit and Loss';
module.exports = {
  title: __(title),
  method: 'profit-and-loss',
  treeView: true,
  filterFields: [
    {
      fieldtype: 'Date',
      fieldname: 'fromDate',
      size: 'small',
      placeholder: 'From Date',
      label: 'From Date',
      required: 1,
      default: async () => {
        return (await frappe.getSingle('AccountingSettings')).fiscalYearStart;
      }
    },
    {
      fieldtype: 'Date',
      fieldname: 'toDate',
      size: 'small',
      placeholder: 'To Date',
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
      default: 'Monthly',
      label: 'Periodicity',
      fieldname: 'periodicity'
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
