const frappe = require('frappejs');
const { __ } = require('../../src/translate'); //HELKYDS 30-03-2021

const title = 'Trial Balance';
module.exports = {
  title: __(title),
  method: 'trial-balance',
  treeView: true,
  filterFields: [
    {
      fieldtype: 'Date',
      fieldname: 'fromDate',
      label: __('From Date'),
      size: 'small',
      placeholder: 'From Date',
      required: 1,
      default: async () => {
        return (await frappe.getSingle('AccountingSettings')).fiscalYearStart;
      }
    },
    {
      fieldtype: 'Date',
      size: 'small',
      placeholder: 'To Date',
      fieldname: 'toDate',
      label: __('To Date'),
      required: 1,
      default: async () => {
        return (await frappe.getSingle('AccountingSettings')).fiscalYearEnd;
      }
    }
  ],
  linkFields: [
    {
      label: 'Clear Filters',
      type: 'secondary',
      action: async report => {
        await report.getReportData({});
        report.usedToReRender += 1;
      }
    }
  ],
  getColumns(data) {
    const columns = [
      {
        label: __('Account'),
        fieldtype: 'Data',
        fieldname: 'account',
        width: 2
      },
      {
        label: __('Opening (Dr)'),
        fieldtype: 'Currency',
        fieldname: 'openingDebit'
      },
      {
        label: __('Opening (Cr)'),
        fieldtype: 'Currency',
        fieldname: 'openingCredit'
      },
      { label: __('Debit'), fieldtype: 'Currency', fieldname: 'debit' },
      { label: __('Credit'), fieldtype: 'Currency', fieldname: 'credit' },
      {
        label: __('Closing (Dr)'),
        fieldtype: 'Currency',
        fieldname: 'closingDebit'
      },
      {
        label: __('Closing (Cr)'),
        fieldtype: 'Currency',
        fieldname: 'closingCredit'
      }
    ];

    return columns;
  }
};
