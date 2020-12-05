import frappe from 'frappejs';
import countryList from '~/fixtures/countryInfo.json';
import config from '@/config';
//import { userSetter } from 'core-js/fn/symbol';

export default async function setupCompany(setupWizardValues) {
  const {
    companyLogo,
    companyName,
    country,
    nifEmpresa,
    regimeIva,
    name,
    email,
    bankName,
    fiscalYearStart,
    fiscalYearEnd
  } = setupWizardValues;

  const accountingSettings = frappe.AccountingSettings;
  await accountingSettings.update({
    companyName,
    country,
    nifEmpresa,
    regimeIva,
    fullname: name,
    email,
    bankName,
    fiscalYearStart,
    fiscalYearEnd,
    currency: countryList[country]['currency']
  });

  const printSettings = await frappe.getSingle('PrintSettings');
  printSettings.update({
    logo: companyLogo,
    companyName,
    email,
    nifEmpresa, //HELKYds 30-11-2020
    regimeIva, //01-12-2020
    displayLogo: companyLogo ? 1 : 0
  });

  await setupGlobalCurrencies(countryList);
  await setupChartOfAccounts(bankName);
  await setupRegionalChanges(country);
  updateCompanyNameInConfig();

  await frappe.GetStarted.update({ systemSetup: 1, companySetup: 1 });
  await accountingSettings.update({ setupComplete: 1 });
  frappe.AccountingSettings = accountingSettings;
}

async function setupGlobalCurrencies(countries) {
  const promises = [];
  const queue = [];
  for (let country of Object.values(countries)) {
    const {
      currency,
      currency_fraction: fraction,
      currency_fraction_units: fractionUnits,
      smallest_currency_fraction_value: smallestValue,
      currency_symbol: symbol,
      number_format: numberFormat
    } = country;

    if (currency) {
      const exists = queue.includes(currency);
      if (!exists) {
        const doc = await frappe.newDoc({
          doctype: 'Currency',
          name: currency,
          fraction,
          fractionUnits,
          smallestValue,
          symbol,
          numberFormat: numberFormat || '#,###.##'
        });
        promises.push(doc.insert());
        queue.push(currency);
      }
    }
  }
  return Promise.all(promises);
}

async function setupChartOfAccounts(bankName) {
  await frappe.call({
    method: 'import-coa'
  });

  const accountDoc = await frappe.newDoc({
    doctype: 'Account'
  });
  Object.assign(accountDoc, {
    name: bankName,
    rootType: 'Asset',
    parentAccount: 'Bank Accounts',
    accountType: 'Bank',
    isGroup: 0
  });
  accountDoc.insert();
}

async function setupRegionalChanges(country) {
  console.log('setupRegionalChanges');

  const generateRegionalTaxes = require('~/models/doctype/Tax/RegionalChanges');
  await generateRegionalTaxes(country);
  if (country === 'India') {
    frappe.models.Party = require('~/models/doctype/Party/RegionalChanges');
    await frappe.db.migrate();
  } else if (country === 'Angola') {
    //HELKYDs 29-11-2020; check if KZ currency and set AccountingSettigs WriteOff accounts
    frappe.models.Party = require('~/models/doctype/Party/RegionalChanges');
    await frappe.db.migrate();

    const naming = require('frappejs/model/naming');
    if (frappe.AccountingSettings.currency === 'KZ') {
      console.log('roundoff ', frappe.AccountingSettings.roundOffAccount);
      if (frappe.AccountingSettings.roundOffAccount === 'Rounded Off') {
        frappe.AccountingSettings.roundOffAccount =
          '75890000 - Outras Despesas e Encargos';
        frappe.AccountingSettings.writeOffAccount =
          '75890000 - Outras Despesas e Encargos';

        //frappe.AccountingSettings.update();
      }
      // init naming series if missing
      //await naming.createNumberSeries('FT.YY./.#', 'SalesInvoiceSettings');
      console.log('series ');
      console.log('ft ' + new Date().toISOString().slice(0, 4));
      let fact = 'FT ' + new Date().toISOString().slice(0, 4) + '-';
      console.log('fact ', fact);
      //console.log((await frappe.getSingle('AccountingSettings')).currency);

      await naming.createNumberSeries(fact, 'SalesInvoiceSettings', 0);
      await naming.createNumberSeries(
        'INT-FT ' + new Date().toISOString().slice(0, 4) + '-',
        'SalesInvoiceSettings',
        0
      );

      await naming.createNumberSeries(
        'FF ' + new Date().toISOString().slice(0, 4) + '-',
        'PurchaseInvoiceSettings',
        0
      );
      await naming.createNumberSeries(
        'INT-FF ' + new Date().toISOString().slice(0, 4) + '-',
        'PurchaseInvoiceSettings',
        0
      );

      await naming.createNumberSeries(
        'RC ' + new Date().toISOString().slice(0, 4) + '-',
        'PaymentSettings',
        0
      );
      await naming.createNumberSeries(
        'INT-RC ' + new Date().toISOString().slice(0, 4) + '-',
        'PaymentSettings',
        0
      );

      await naming.createNumberSeries(
        'JV ' + new Date().toISOString().slice(0, 4) + '-',
        'JournalEntrySettings',
        0
      );

      await naming.createNumberSeries(
        'PP ' + new Date().toISOString().slice(0, 4) + '-',
        'QuotationSettings',
        0
      );
      await naming.createNumberSeries(
        'INT-PP ' + new Date().toISOString().slice(0, 4) + '-',
        'QuotationSettings',
        0
      );

      await naming.createNumberSeries(
        'OV ' + new Date().toISOString().slice(0, 4) + '-',
        'SalesOrderSettings',
        0
      );
      await naming.createNumberSeries(
        'INT-OV ' + new Date().toISOString().slice(0, 4) + '-',
        'SalesOrderSettings',
        0
      );

      await naming.createNumberSeries(
        'OF ' + new Date().toISOString().slice(0, 4) + '-',
        'FulfillmentSettings',
        0
      );

      await naming.createNumberSeries(
        'OC ' + new Date().toISOString().slice(0, 4) + '-',
        'PurchaseOrderSettings',
        0
      );
      await naming.createNumberSeries(
        'INT-OC ' + new Date().toISOString().slice(0, 4) + '-',
        'PurchaseOrderSettings',
        0
      );

      await naming.createNumberSeries(
        'REC ' + new Date().toISOString().slice(0, 4) + '-',
        'PurchaseReceiptSettings',
        0
      );

      console.log(
        await frappe.db.getAll({
          doctype: 'NumberSeries',
          fields: ['name', 'current']
        })
      );

      //TODO: Create Username based on the Fullname given; Create default Administrador and pwd 123456789 and user typed

      console.log('Full name ');

      //console.log(frappe.AccountingSettings.fullname);

      console.log(frappe.AccountingSettings);
      console.log(frappe.AccountingSettings.email);
      /*
      let usuariodefault = 'Administrador';

      let usuarios = await frappe.getNewDoc('User');
      await usuarios.set({        
        userId: usuariodefault,
        email: String(frappe.AccountingSettings.email),
        password: '123465789'
      });
      await usuarios.insert();
      */

      /*
      if (this.fullname) {
        usuariodefault = this.fullname.replace(' ');
        usuarios = await frappe.getNewDoc('User');
        await usuarios.set({
          fullname: usuariodefault,
          userId: usuariodefault,
          email: usuariodefault,
          password: '123465789'
        });
        await usuarios.insert();
  
      }
      */
    }
  }
}

function updateCompanyNameInConfig() {
  let filePath = frappe.db.dbPath;
  let files = config.get('files', []);
  files.forEach(file => {
    if (file.filePath === filePath) {
      file.companyName = frappe.AccountingSettings.companyName;
    }
  });
  config.set('files', files);
}
