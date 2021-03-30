import { partyWithAvatar } from '@/utils';

const { __ } = require('../../src/translate'); //HELKYDS 30-03-2021

let title = __('General Ledger');

const viewConfig = {
  title,
  filterFields: [
    {
      fieldtype: 'Select',
      options: [
        { label: '', value: '' },
        { label: __('Sales Invoice'), value: 'SalesInvoice' },
        { label: __('Purchase Invoice'), value: 'PurchaseInvoice' },
        { label: __('Payment'), value: 'Payment' },
        { label: __('Journal Entry'), value: 'JournalEntry' }
      ],
      size: 'small',
      label: __('Reference Type'),
      fieldname: 'referenceType',
      placeholder: 'Reference Type'
    },
    {
      fieldtype: 'DynamicLink',
      size: 'small',
      placeholder: 'Reference Name',
      references: 'referenceType',
      label: __('Reference Name'),
      fieldname: 'referenceName'
    },
    {
      fieldtype: 'Link',
      target: 'Account',
      size: 'small',
      placeholder: 'Account',
      label: __('Account'),
      fieldname: 'account'
    },
    {
      fieldtype: 'Link',
      target: 'Party',
      label: __('Party'),
      size: 'small',
      placeholder: 'Party',
      fieldname: 'party'
    },
    {
      fieldtype: 'Date',
      size: 'small',
      placeholder: 'From Date',
      label: __('From Date'),
      fieldname: 'fromDate'
    },
    {
      fieldtype: 'Date',
      size: 'small',
      placeholder: 'To Date',
      label: __('To Date'),
      fieldname: 'toDate'
    }
  ],
  method: 'general-ledger',
  linkFields: [
    {
      label: __('Clear Filters'),
      type: 'secondary',
      action: async report => {
        await report.getReportData({});
        report.usedToReRender += 1;
      }
    },
    {
      label: 'Export',
      type: 'primary',
      action: () => {}
    }
  ],
  getColumns() {
    return [
      {
        label: __('Account'),
        fieldtype: 'Link',
        fieldname: 'account'
      },
      {
        label: __('Date'),
        fieldtype: 'Date',
        fieldname: 'date'
      },
      {
        label: __('Debit'),
        fieldtype: 'Currency',
        fieldname: 'debit',
        width: 0.5
      },
      {
        label: __('Credit'),
        fieldtype: 'Currency',
        fieldname: 'credit',
        width: 0.5
      },
      {
        label: __('Balance'),
        fieldtype: 'Currency',
        fieldname: 'balance',
        width: 0.5
      },
      {
        label: __('Reference Type'),
        fieldtype: 'Data',
        fieldname: 'referenceType'
      },
      {
        label: __('Reference Name'),
        fieldtype: 'Data',
        fieldname: 'referenceName'
      },
      {
        label: __('Party'),
        fieldtype: 'Link',
        fieldname: 'party',
        component(cellValue) {
          return partyWithAvatar(cellValue);
        }
      },
      {
        label: __('Description'),
        fieldtype: 'Data',
        fieldname: 'description'
      }
    ];
  }
};

export default viewConfig;
