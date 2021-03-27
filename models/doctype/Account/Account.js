const frappe = require('frappejs');

module.exports = {
  name: 'Account',
  label: 'Account',
  doctype: 'DocType',
  documentClass: require('./AccountDocument.js'),
  isSingle: 0,
  isTree: 1,
  keywordFields: ['name', 'rootType', 'accountType', 'account_number'],
  fields: [
    {
      fieldname: 'name',
      label: 'Account Name',
      fieldtype: 'Data',
      required: 1
    },
    {
      fieldname: 'account_number',  //HELKYds 29-11-2020
      label: 'Account Number',
      fieldtype: 'Data',
      required: 0
    },    
    {
      fieldname: 'rootType',
      label: 'Root Type',
      fieldtype: 'Select',
      options: ['', 'Asset', 'Liability', 'Equity', 'Income', 'Expense'],
      required: 1
    },
    {
      fieldname: 'parentAccount',
      label: 'Parent Account',
      fieldtype: 'Link',
      target: 'Account',
      getFilters: (query, doc) => {
        const filter = {
          isGroup: 1
        };
        doc.rootType ? (filter.rootType = doc.rootType) : '';
        return filter;
      }
    },
    {
      fieldname: 'accountType',
      label: 'Account Type',
      fieldtype: 'Select',
      options: [
        '',
        'Accumulated Depreciation',
        'Bank',
        'Cash',
        'Chargeable',
        'Cost of Goods Sold',
        'Depreciation',
        'Equity',
        'Expense Account',
        'Expenses Included In Valuation',
        'Fixed Asset',
        'Income Account',
        'Payable',
        'Receivable',
        'Round Off',
        'Stock',
        'Stock Adjustment',
        'Stock Received But Not Billed',
        'Tax',
        'Temporary'
      ]
    },
    {
      fieldname: 'balance',
      label: 'Balance',
      fieldtype: 'Currency',
      default: '0',
      readOnly: 1
    },
    {
      fieldname: 'isGroup',
      label: 'Is Group',
      fieldtype: 'Check'
    }
  ],

  quickEditFields: [
    'name',
    'account_number',
    'rootType',
    'parentAccount',
    'accountType',
    'isGroup'
  ],

  treeSettings: {
    parentField: 'parentAccount',
    async getRootLabel() {
      let accountingSettings = await frappe.getSingle('AccountingSettings');
      return accountingSettings.companyName;
    }
  }
};
