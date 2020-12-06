<template>
  <div class="border h-full">
    <div>
      <div class="px-6 pt-6" v-if="printSettings && accountingSettings">
        <div class="flex text-sm text-gray-900 border-b pb-4">
          <div class="w-1/3">
            <div v-if="printSettings.displayLogo">
              <img
                class="h-12 max-w-32 object-contain"
                :src="printSettings.logo"
              />
            </div>
            <div class="text-xl text-gray-700 font-semibold" v-else>
              {{ accountingSettings.companyName }}
            </div>
            <div v-if="frappe.AccountingSettings.nifEmpresa">
              {{ 'NIF: ' + frappe.AccountingSettings.nifEmpresa }}
            </div>
          </div>
          <div class="w-1/3">
            <div>{{ printSettings.email }}</div>
            <div class="mt-1">{{ printSettings.phone }}</div>
          </div>
          <div class="w-1/3">
            <div v-if="address">{{ address.addressDisplay }}</div>
          </div>
          <div class="w-1/3 text-right text-lg font-semibold">
            <div>ORIGINAL</div>
            <div>{{ accountingSettings.regimeIva }}</div>
          </div>
        </div>
      </div>
      <div class="mt-8 px-6">
        <div class="flex justify-between">
          <div class="w-1/3">
            <h1 class="text-2xl font-semibold">
              {{ doc.docAgt || doc.name }}
            </h1>
            <div class="py-2 text-base">
              {{ _('Date')}}: {{ frappe.format(doc.date, 'Date') }}
            </div>
            <div class="py-2 text-base">
              <div text-lg>
                <div>{{ _('User')}}: {{ frappe.session.user }}</div>
              </div>
            </div>
          </div>
          <div class="w-1/3">
            <div class="py-1 text-right text-lg font-semibold">
              {{ doc[partyField.fieldname] }}
            </div>
            <div v-if="partyDoc" class="mt-1 text-xs text-gray-600 text-right">
              {{ partyDoc.addressDisplay }}
            </div>
            <div v-if="partyDoc && partyDoc.nif" class="mt-1 text-xs font-semibold text-right">NIF:{{ partyDoc.nif }}</div>
            <div v-else>Consumidor Final</div>
            <div
              v-if="partyDoc && partyDoc.gstin"
              class="mt-1 text-xs text-gray-600 text-right"
            >
              GSTIN: {{ partyDoc.gstin }}
            </div>
          </div>
        </div>
      </div>
      <div class="mt-2 px-6 text-base">
        <div>
          <Row class="text-gray-600 w-full" :ratio="ratio">
            <div class="py-4">
              {{ _('No') }}
            </div>
            <div
              class="py-4"
              v-for="df in itemFields"
              :key="df.fieldname"
              :class="textAlign(df)"
            >
              <div v-if="df.label == 'Tax'" class="text-right"> {{ df.label }} </div>
              <div v-else>{{ df.label }}</div>
            </div>
          </Row>
          <Row
            class="text-gray-900 w-full"
            v-for="row in doc.items"
            :key="row.name"
            :ratio="ratio"
          >
            <div class="py-4">
              {{ row.idx + 1 }}
            </div>
            <div
              class="py-4"
              v-for="df in itemFields"
              :key="df.fieldname"
              :class="textAlign(df)"
            >
              <!-- {{ frappe.format(row[df.fieldname], df) }} -->
              <div v-if="df.fieldname == 'tax'" class="text-right"> 
                <div v-if="row[df.fieldname] && row[df.fieldname].includes('IVA')"> {{ row[df.fieldname].replace('IVA-','') }}% </div> 
                <div v-else-if="row[df.fieldname] && row[df.fieldname].includes('Isencao')"> 0% </div> 
                <div v-else-if="row[df.fieldname]"> {{ row[df.fieldname] }}% </div> 
                <div v-else> 0% </div> 
              </div>
              <div v-else> {{ frappe.format(row[df.fieldname], df) }} </div> 
              <!--
              <div class="w-3/12 text-right" v-if="row.tax && row.tax.includes('IVA')">{{ row.tax.replace('IVA-','') }}%</div>
              <div class="w-3/12 text-right" v-else-if="row.tax && row.tax.includes('Isencao')">0%</div>
              <div class="w-3/12 text-right" v-else-if="row.tax">{{ row.tax }}%</div>
              <div class="w-3/12 text-right" v-else>0%</div>
              -->

            </div>
          </Row>
        </div>
      </div>
    </div>
    <div class="px-6 mt-2 flex justify-end text-base">
      <div class="w-64">
        <div class="flex pl-2 justify-between py-3 border-b">
          <div>{{ _('Total Iliquido') }}</div>
          <div>{{ frappe.format(doc.netTotal, 'Currency') }}</div>
        </div>
        <div class="flex pl-2 justify-between py-3 border-b">
          <div>{{ _('Line Discount') }}</div>
          <div>{{ frappe.format(0, 'Currency') }}</div>
        </div>
        <div class="flex pl-2 justify-between py-3 border-b">
          <div>{{ _('Discount') }}</div>
          <div>{{ frappe.format(0, 'Currency') }}</div>
        </div>

        <div class="flex pl-2 justify-between py-3 border-b">
          <div>{{ _('Subtotal') }}</div>
          <div>{{ frappe.format(doc.netTotal, 'Currency') }}</div>
        </div>
        <div
          class="flex pl-2 justify-between py-3"
          v-for="tax in doc.taxes"
          :key="tax.name"
        >
          <div v-if="tax.account.includes('3451')">
            IVA ({{ tax.rate }}%)
          </div>
          <div v-else>{{ tax.account }} ({{ tax.rate }}%)</div>        
          <div>{{ frappe.format(tax.amount, 'Currency') }}</div>
        </div>
        <div
          class="flex pl-2 justify-between py-3 border-t text-green-600 font-semibold text-base"
        >
          <div>{{ _('Grand Total') }}</div>
          <div>{{ frappe.format(doc.grandTotal, 'Currency') }}</div>
        </div>
      </div>
    </div>
    <div v-if="doc.submitted === 2" class="py-1 text-center text-lg font-semibold">
      <p style="color:black; font-size:55px; transform:rotate(300deg); -webkit-transform:rotate(300deg);"> <b> ANULACAO </b> </p>
    </div>
    <footer class="absolute w-full bottom-0 pb-6">
      <div class="text-center small">
        <p>Bens / Serviços colocados a disposição do adquirente a data do documento.</p>      
        <p v-if="doc.hashAgt"> {{ doc.hashAgt[0,1] }} {{ doc.hashAgt[10,11] }} {{ doc.hashAgt[20,21] }} {{ doc.hashAgt[30,31] }} - Processado por Programa Validado n. 16/AGT/19 © AngolaERP</p>
        <p v-else>Processado por Programa Validado n. 16/AGT/19 © AngolaERP</p>
      </div>
    </footer>
  </div>
</template>

<script>
import frappe from 'frappejs';
import Row from '@/components/Row';

export default {
  name: 'Default',
  props: ['doc', 'printSettings'],
  components: {
    Row
  },
  data() {
    return {
      accountingSettings: null
    };
  },
  computed: {
    meta() {
      return this.doc && this.doc.meta;
    },
    address() {
      return this.printSettings && this.printSettings.getLink('address');
    },
    partyDoc() {
      return this.doc.getLink(this.partyField.fieldname);
    },
    partyField() {
      let fieldname = {
        SalesInvoice: 'customer',
        PurchaseInvoice: 'supplier'
      }[this.doc.doctype];
      return this.meta.getField(fieldname);
    },
    itemFields() {
      let itemsMeta = frappe.getMeta(`${this.doc.doctype}Item`);
      console.log( ['item', 'quantity', 'rate', 'tax', 'amount'].map(fieldname =>
        itemsMeta.getField(fieldname)
      ));
      return ['item', 'quantity', 'rate', 'tax', 'amount'].map(fieldname =>
        itemsMeta.getField(fieldname)
      );
    },
    ratio() {
      return [0.3].concat(this.itemFields.map(() => 1));
    }
  },
  methods: {
    textAlign(df) {
      console.log( ['Currency', 'Int', 'Float'].includes(df.fieldtype)
        ? 'text-right'
        : ''
    );
      return ['Currency', 'Int', 'Float'].includes(df.fieldtype)
        ? 'text-right'
        : '';
    }
  },
  async mounted() {
    this.accountingSettings = await frappe.getSingle('AccountingSettings');
    await this.doc.loadLink(this.partyField.fieldname);
  }
};
</script>
