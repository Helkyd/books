const frappe = require('frappejs');
const frappelerficheiro = require('frappejs/server/utils'); //HELKYD 26-03-2021
const AccountingSettings = require('../models/doctype/AccountingSettings/AccountingSettings');

async function ling() {
  //if (!linguadosistema){
  console.log(AccountingSettings);
  await frappe.getSingle('AccountingSettings');
  console.log(AccountingSettings.linguasistema);
  console.log(
    await frappe.db.getAll({
      doctype: 'SingleValue',
      fields: ['parent', 'fieldname', 'value']
    })
  );
  console.log('adfsadfsdfsa');
  var lingua = await frappe.db.sql(
    "select parent,fieldname,value from SingleValue where fieldname='linguasistema' and parent='AccountingSettings' ;"
  );
  //await frappe.getSingle('AccountingSettings');
  console.log('Ja tem linguadosistema');
  console.log(lingua);
  //return linguadosistema;
  //} else {
  //    console.log('Ja tem linguadosistema');
  //}
}

frappe._ = function(txt, replace) {
  if (!txt) return txt;
  if (typeof txt != 'string') return txt;
  var ret = frappe._messages[txt.replace(/\n/g, '')] || txt;
  if (replace && typeof replace === 'object') {
    ret = $.format(ret, replace);
  }
  return ret;
};

function __(txt, replace, lingua = 'PT-PT') {
  //Carregar o file das traducoes...
  //Vendo que ja carregou no Server POSTSTART e no Transaction... NO NEED TO DO AGAIN...

  if (!frappe._traducao) {
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
  }

  //Somente traduz se for PT-PT

  //console.log(frappe.AccountingSettings.linguasistema);
  if (frappe.AccountingSettings) {
    console.log('lingua ', frappe.AccountingSettings.linguasistema);
    if (frappe.AccountingSettings.linguasistema != 'PT-PT') return txt;
  }
  //if (frappe.AccountingSettings.linguasistema != 'PT-PT') return txt;
  //console.log('frappe._traducao ', frappe._traducao);

  if (!txt) return txt;
  if (typeof txt != 'string') return txt;
  var ret = frappe._traducao[txt.replace(/\n/g, '')] || txt;
  if (replace && typeof replace === 'object') {
    ret = $.format(ret, replace);
  }

  return ret;
}

function _t(txt, replace) {
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
  //console.log('frappe traducao');
  //console.log(frappe._traducao);

  if (!txt) return txt;
  if (typeof txt != 'string') return txt;
  var ret = frappe._traducao[txt.replace(/\n/g, '')] || txt;
  if (replace && typeof replace === 'object') {
    ret = $.format(ret, replace);
  }
  console.log('Traduzido para');
  console.log(ret);

  return ret;
}

module.exports = {
  __,
  _t,
  ling
};
