<template>
  <div>
    <TwoColumnForm v-if="doc" :doc="doc" :fields="fields" :autosave="true" />
  </div>
</template>

<script>
import frappe from 'frappejs';
import TwoColumnForm from '@/components/TwoColumnForm';

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
        'language', // 26-03-2021
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
