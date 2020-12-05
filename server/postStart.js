const frappe = require('frappejs');
const naming = require('frappejs/model/naming');
const registerServerMethods = require('./registerServerMethods');

module.exports = async function postStart() {
  // set server-side modules
  frappe.models.SalesInvoice.documentClass = require('../models/doctype/SalesInvoice/SalesInvoiceServer.js');
  frappe.models.Payment.documentClass = require('../models/doctype/Payment/PaymentServer.js');
  frappe.models.Party.documentClass = require('../models/doctype/Party/PartyServer.js');
  frappe.models.PurchaseInvoice.documentClass = require('../models/doctype/PurchaseInvoice/PurchaseInvoiceServer.js');
  frappe.models.JournalEntry.documentClass = require('../models/doctype/JournalEntry/JournalEntryServer.js');
  frappe.models.GSTR3B.documentClass = require('../models/doctype/GSTR3B/GSTR3BServer.js');

  frappe.metaCache = {};

  // init naming series if missing
  await naming.createNumberSeries('SINV-', 'SalesInvoiceSettings');
  await naming.createNumberSeries('PINV-', 'PurchaseInvoiceSettings');
  await naming.createNumberSeries('PAY-', 'PaymentSettings');
  await naming.createNumberSeries('JV-', 'JournalEntrySettings');
  await naming.createNumberSeries('QTN-', 'QuotationSettings');
  await naming.createNumberSeries('SO-', 'SalesOrderSettings');
  await naming.createNumberSeries('OF-', 'FulfillmentSettings');
  await naming.createNumberSeries('PO-', 'PurchaseOrderSettings');
  await naming.createNumberSeries('PREC-', 'PurchaseReceiptSettings');

  // fetch singles
  // so that they are available synchronously
  await frappe.getSingle('SystemSettings');
  await frappe.getSingle('AccountingSettings');
  await frappe.getSingle('GetStarted');

  // cache currency symbols for frappe.format
  frappe.currencySymbols = await getCurrencySymbols();

  registerServerMethods();
  //HELKYDs 29-11-2020; check if KZ currency and set AccountingSettigs WriteOff accounts
  if (frappe.AccountingSettings.currency === 'KZ') {
    console.log('roundoff ', frappe.AccountingSettings.roundOffAccount);
    if (frappe.AccountingSettings.roundOffAccount === 'Rounded Off') {
      frappe.AccountingSettings.roundOffAccount =
        '75890000 - Outras Despesas e Encargos';
      frappe.AccountingSettings.writeOffAccount =
        '75890000 - Outras Despesas e Encargos';

      frappe.AccountingSettings.update();
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

    console.log(frappe.AccountingSettings);
    console.log(frappe.AccountingSettings.email);
    let usuariodefault = 'Administrador';
    let usuaaaa = await frappe.db.sql('select * from User;');
    console.log(usuaaaa);

    if (usuaaaa.length === 0) {
      let usuarios = await frappe.getNewDoc('User');
      await usuarios.set({
        userId: usuariodefault,
        fullName: usuariodefault,
        name: String(frappe.AccountingSettings.email),
        password: '123465789'
      });
      await usuarios.insert();
    }
  }
};

function getCurrencySymbols() {
  return frappe.db
    .getAll({
      doctype: 'Currency',
      fields: ['name', 'symbol']
    })
    .then(data => {
      return data.reduce((obj, currency) => {
        obj[currency.name] = currency.symbol;
        return obj;
      }, {});
    });
}
