<template>
  <div>
    <TwoColumnForm v-if="doc" :doc="doc" :fields="fields" :autosave="true" />
  </div>
</template>

<script>
import frappe from 'frappejs';
import TwoColumnForm from '@/components/TwoColumnForm';
import { writeFile } from 'frappejs/server/utils'; //HELKYD 30-03-2021

export default {
  name: 'TabGeneral',
  components: {
    TwoColumnForm
  },
  data() {
    return {
      doc: null
    };
  },
  async mounted() {
    this.doc = await frappe.getSingle('AccountingSettings');
    console.log(this.doc);
  },
  async updated() {
    console.log('Updated...');
    console.log(this.doc.linguasistema);
    console.log('escreve no file....');
    var directorio = frappe.db.dbPath.substring(
      0,
      frappe.db.dbPath.lastIndexOf('/')
    );
    writeFile(directorio + '/lang.txt', this.doc.linguasistema);

    const fs = require('fs');
    if (fs.existsSync('c://temp//', 'utf-8')) {
      writeFile('c://temp//lang.txt', this.doc.linguasistema);
      console.log('C');
    } else {
      writeFile('/tmp/lang.txt', this.doc.linguasistema);
      console.log('U');
    }
    console.log(frappe.db.dbPath);
  },

  computed: {
    fields() {
      let meta = frappe.getMeta('AccountingSettings');
      return [
        'companyName',
        'country',
        'bankName',
        'nifEmpresa', //HELKyds 29-11-2020
        'regimeIva', // 01-12-2020
        'linguasistema', // 26-03-2021
        'currency',
        'writeOffAccount',
        'roundOffAccount',
        'fiscalYearStart',
        'fiscalYearEnd'
      ].map(fieldname => meta.getField(fieldname));
    }
  }
};
</script>
