const frappe = require('frappejs');
const naming = require('frappejs/model/naming');
const registerServerMethods = require('./registerServerMethods');
const frappelerficheiro = require('frappejs/server/utils'); //HELKYD 26-03-2021
//import { readFile } from 'frappejs/server/utils'; //HELKYD 26-03-2021
const traduz = require('frappejs/utils');
//const csv2json = require('csvjson-csv2json');

module.exports = async function postStart() {
  // set server-side modules
  frappe.models.SalesInvoice.documentClass = require('../models/doctype/SalesInvoice/SalesInvoiceServer.js');
  frappe.models.Payment.documentClass = require('../models/doctype/Payment/PaymentServer.js');
  frappe.models.Party.documentClass = require('../models/doctype/Party/PartyServer.js');
  frappe.models.PurchaseInvoice.documentClass = require('../models/doctype/PurchaseInvoice/PurchaseInvoiceServer.js');
  frappe.models.JournalEntry.documentClass = require('../models/doctype/JournalEntry/JournalEntryServer.js');
  frappe.models.GSTR3B.documentClass = require('../models/doctype/GSTR3B/GSTR3BServer.js');

  //HELKYds 21-01-2021
  frappe.models.Quotation.documentClass = require('../models/doctype/Quotation/QuotationServer.js');

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
    let fact = 'FT ' + new Date().toISOString().slice(0, 4) + String('-');
    console.log('fact ', fact);
    //console.log((await frappe.getSingle('AccountingSettings')).currency);

    await naming.createNumberSeries(fact, 'SalesInvoiceSettings', 0);
    await naming.createNumberSeries(
      'INT-FT ' + new Date().toISOString().slice(0, 4) + String('-'),
      'SalesInvoiceSettings',
      0
    );

    await naming.createNumberSeries(
      'FF ' + new Date().toISOString().slice(0, 4) + String('-'),
      'PurchaseInvoiceSettings',
      0
    );
    await naming.createNumberSeries(
      'INT-FF ' + new Date().toISOString().slice(0, 4) + String('-'),
      'PurchaseInvoiceSettings',
      0
    );

    await naming.createNumberSeries(
      'RC ' + new Date().toISOString().slice(0, 4) + String('-'),
      'PaymentSettings',
      0
    );
    await naming.createNumberSeries(
      'INT-RC ' + new Date().toISOString().slice(0, 4) + String('-'),
      'PaymentSettings',
      0
    );

    await naming.createNumberSeries(
      'JV ' + new Date().toISOString().slice(0, 4) + String('-'),
      'JournalEntrySettings',
      0
    );

    await naming.createNumberSeries(
      'PP ' + new Date().toISOString().slice(0, 4) + String('-'),
      'QuotationSettings',
      0
    );
    await naming.createNumberSeries(
      'INT-PP ' + new Date().toISOString().slice(0, 4) + String('-'),
      'QuotationSettings',
      0
    );

    await naming.createNumberSeries(
      'OV ' + new Date().toISOString().slice(0, 4) + String('-'),
      'SalesOrderSettings',
      0
    );
    await naming.createNumberSeries(
      'INT-OV ' + new Date().toISOString().slice(0, 4) + String('-'),
      'SalesOrderSettings',
      0
    );

    await naming.createNumberSeries(
      'OF ' + new Date().toISOString().slice(0, 4) + String('-'),
      'FulfillmentSettings',
      0
    );

    await naming.createNumberSeries(
      'OC ' + new Date().toISOString().slice(0, 4) + String('-'),
      'PurchaseOrderSettings',
      0
    );
    await naming.createNumberSeries(
      'INT-OC ' + new Date().toISOString().slice(0, 4) + String('-'),
      'PurchaseOrderSettings',
      0
    );

    await naming.createNumberSeries(
      'REC ' + new Date().toISOString().slice(0, 4) + String('-'),
      'PurchaseReceiptSettings',
      0
    );

    console.log(
      await frappe.db.getAll({
        doctype: 'NumberSeries',
        fields: ['name', 'current']
      })
    );

    //List PAYments
    console.log('PAYMENTS...');
    console.log(
      await frappe.db.getAll({
        doctype: 'Payment'
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

    //Adds Languange PT
    frappe.AccountingSettings.linguasistema = 'PT-PT';

    //Carregar o file das traducoes...
    frappe._messages = {};
    //console.log(frappelerficheiro.readFile('./fixtures/verified/pt.csv'));
    frappe._messages = frappelerficheiro.readFile('./fixtures/verified/pt.csv');
    //console.log(frappe._messages.replace(/\n/g, "::").split('::'));

    //console.log(frappe._messages.replace(/\n/g, "::").split('::')[8]);
    //for (var ff in frappe._messages){
    //  console.log(frappe._messages[ff]);
    //};

    //let tradu = JSON.parse(frappe._messages.replace(/\n/g,"").replace('""', '&quot;'));
    //let tradu = JSON.stringify(frappe._messages);
    //let tradu1 = JSON.parse(JSON.stringify(frappe._messages.replace('",',':')));
    let tradu2 = JSON.parse(
      JSON.stringify(frappe._messages.replace(/\n/g, '::').split('::'))
    );

    //convert "," to dict
    frappe._traducao = {};
    //let trad = '';
    for (var xx in tradu2) {
      //console.log('aaaa');
      //console.log(tradu2[xx]);
      //console.log(tradu2[xx] == "");

      if (tradu2[xx] !== '') {
        //console.log(tradu2[xx].indexOf('","'));
        if (tradu2[xx].indexOf('","') != -1) {
          //trad = tradu2[xx].split('","');
          frappe._traducao[tradu2[xx].split('","')[0]] = tradu2[xx].split(
            '","'
          )[1];
        } else {
          //trad = tradu2[xx].split(',');
          frappe._traducao[tradu2[xx].split(',')[0]] = tradu2[xx].split(',')[1];
        }
        //console.log(trad);
      } else {
        break;
      }
    }
    console.log('frappe traducao');
    console.log(frappe._traducao);

    //console.log(tradu);
    //console.log(tradu1);
    //console.log(tradu2);

    //console.log(typeof(tradu));
    //console.log(typeof(tradu1));
    //console.log(typeof(tradu2));

    //const json = csvToJsonHandler(frappe._messages);
    //let file = './fixtures/verified/pt.csv';

    //getAsText('./fixtures/verified/pt.csv');
    //getAsText(frappelerficheiro.readFile('./fixtures/verified/pt.csv').replace(/\n/g,""));

    /*
    let file = new Blob('./fixtures/verified/pt.csv',{ type: 'text/plain' });
    let json = {};
    const reader = new FileReader();
    reader.onload = () => {
      const csv = reader.result;
      //const json = csvToJsonHandler(csv);
      json = csv2json(csv, { parseNumbers: true });
      //findMatchingReferences(json, report);
    };
    //reader.readAsBinaryString(file);
    reader.readAsText(file,'utf-8');
    */

    //const json = csv2json(frappe._messages, { parseNumbers: true });
    //console.log(frappe._messages);

    //console.log(json);
    //kk = json;
    console.log(traduz._('GSTR 3B Report', frappe._traducao));
    console.log('traducao');
    console.log(frappe._traducao['GSTR 3B Report']);

    //To clear.
    frappe._messages = {};
  } else {
    frappe.AccountingSettings.linguasistema = 'EN';
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

//TESTING
/*
export function traduzir(txt) {
  if(txt){
    return frappe._traducao[txt] ? (frappe._traducao[txt]): txt;
  }
}
*/
/*
function getAsText(fileToRead) {
  var reader = new FileReader();
  // Read file into memory as UTF-8      
  reader.readAsText(fileToRead);
  // Handle errors load
  reader.onload = loadHandler;
  reader.onerror = errorHandler;
}

function loadHandler(event) {
  var csv = event.target.result;
  processData(csv);
}

function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    for (var i=0; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(';');
            var tarr = [];
            for (var j=0; j<data.length; j++) {
                tarr.push(data[j]);
            }
            lines.push(tarr);
    }
  console.log(lines);
}

function errorHandler(evt) {
  if(evt.target.error.name == "NotReadableError") {
      alert("Canno't read file !");
  }
}
*/
