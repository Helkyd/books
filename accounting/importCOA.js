const frappe = require('frappejs');
const countries = require('../fixtures/countryInfo.json');
const standardCOA = require('../fixtures/verified/standardCOA.json');
const accountFields = [
  'accountType',
  'rootType',
  'isGroup',
  'account_type',
  'root_type',
  'is_group'
];

async function importAccounts(children, parent, rootType, rootAccount) {
  for (let accountName in children) {
    const child = children[accountName];

    if (rootAccount) {
      rootType = child.rootType || child.root_type;
    }
    //HELKYds 29-11-2020
    let accname_number = '';
    if (child.account_number) {
      accname_number = accountName + ' - ' + child.account_number;
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
      //HELKYds 29-11-2020
      console.log(doc);
      await doc.insert();

      await importAccounts(child, accountName, rootType);
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
  //HELKYds 28-11-2020
  console.log('getcountryCOA');
  console.log('conCode ', conCode);
  try {
    const countryCoa = require('../fixtures/verified/' + conCode + '.json');
    return countryCoa.tree;
  } catch (e) {
    return standardCOA;
  }
}

module.exports = async function importCharts() {
  console.log('importCharts');
  const chart = await getCountryCOA();
  await importAccounts(chart, '', '', true);
};
