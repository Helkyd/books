const frappe = require('frappejs');
const countries = require('../fixtures/countryInfo.json');
const standardCOA = require('../fixtures/verified/standardCOA.json');
const accountFields = [
  'accountType',
  'rootType',
  'isGroup',
  'account_type',
  'root_type',
  'is_group',
  'account_number'
];

async function importAccounts(children, parent, rootType, rootAccount) {
  for (let accountName in children) {
    const child = children[accountName];
    if (rootAccount) {
      rootType = child.rootType || child.root_type;
    }
    let accname_number = ''; //HELKYds 29-11-2020
    if (child.account_number) {
      accname_number = child.account_number + ' - ' + accountName;
    }
    if (!accountFields.includes(accountName)) {
      let isGroup = identifyIsGroup(child);
      const doc = frappe.newDoc({
        doctype: 'Account',
        name: accname_number || accountName, //HELKyds 29-11-2020
        account_number: child.account_number || '', //HELKyds 29-11-2020
        parentAccount: parent,
        isGroup,
        rootType,
        balance: 0,
        accountType: child.accountType || child.account_type
      });
      await doc.insert();
      await importAccounts(child, accname_number || accountName, rootType);
    }
  }
}

function identifyIsGroup(child) {
  if (child.isGroup || child.is_group) {
    return child.isGroup || child.is_group;
  }

  const keys = Object.keys(child);
  const children = keys.filter(key => !accountFields.includes(key));

  if (children.length) {
    return 1;
  }

  return 0;
}

async function getCountryCOA() {
  const doc = await frappe.getDoc('AccountingSettings');
  const conCode = countries[doc.country].code;
  try {
    const countryCoa = require('../fixtures/verified/' + conCode + '.json');
    return countryCoa.tree;
  } catch (e) {
    return standardCOA;
  }
}

module.exports = async function importCharts() {
  const chart = await getCountryCOA();
  await importAccounts(chart, '', '', true);
};
