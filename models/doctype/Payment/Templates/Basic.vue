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
              {{ _('Date') }}: {{ frappe.format(doc.date, 'Date') }}
            </div>
            <div class="py-2 text-base">
              <div text-lg>
                <div>{{ _('User') }}: {{ frappe.session.user }}</div>
              </div>
            </div>
          </div>
          <div class="w-1/3">
            <div class="py-1 text-right text-2xl font-semibold">
              {{ doc.party }}
            </div>
            <div class="mt-1 text-base text-1xl text-right">
              {{ _('Mode of Payment')}}: {{ doc.paymentMethod }}
            </div>
            <div class="py-2 text-base text-right text-green-600 font-semibold">
              {{ _('Paid Amount')}}: {{ frappe.format(doc.amount, 'Currency') }}
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
              <div v-if="df.label == 'PurchaseInvoice'" class="text-right">
                {{ _('Purchase Invoice') }}
              </div>
              <div v-else-if="df.label == 'SalesInvoice'">
                  {{ _('Sales Invoice') }}
              </div>
              <div v-else>{{ df.label }}</div>
            </div>
          </Row>
          <Row
            class="text-gray-900 w-full"
            v-for="row in doc.payfor"
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
                <div
                  v-if="row[df.fieldname] && row[df.fieldname].includes('IVA')"
                >
                  {{ row[df.fieldname].replace('IVA-', '') }}%
                </div>
                <div
                  v-else-if="
                    row[df.fieldname] && row[df.fieldname].includes('Isencao')
                  "
                >
                  0%
                </div>
                <div v-else-if="row[df.fieldname]">
                  {{ row[df.fieldname] }}%
                </div>
                <div v-else>0%</div>
              </div>
              
              <div v-else-if="row[df.fieldname] && row[df.fieldname] == 'PurchaseInvoice'">
                {{ _('Purchase Invoice') }}
              </div>
              <div v-else-if="row[df.fieldname] && row[df.fieldname] == 'SalesInvoice'">
                {{ _('Sales Invoice') }}
              </div>
              <div v-else-if="df.fieldname == 'referenceName'">
                {{ numerodocAgt }}
              </div>
              <div v-else>{{ frappe.format(row[df.fieldname], df) }}</div>
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
    <div class="mt-8 px-6">
        <div class="flex justify-between">
          <div class="w-1/3">
            <div class="py-2 text-base">
              <b>{{ _('Reference ID') }}:</b> {{ doc.referenceId }}
            </div>
          </div>
          <div class="w-1/3">
            <div v-if="doc.clearenceDate" class="mt-1 text-base text-1xl text-right">
              <b>{{ _('Clearence Date')}}:</b> {{ doc.clearenceDate }}
            </div>

          </div>
        </div>
    </div>

    <div
      v-if="doc.submitted === 2"
      class="py-1 text-center text-lg font-semibold"
    >
      <p
        style="color:black; font-size:55px; transform:rotate(300deg); -webkit-transform:rotate(300deg);"
      >
        <b> ANULACAO </b>
      </p>
    </div>
    <footer class="absolute w-full bottom-0 pb-6">
      <div class="text-center small">
        <p>Processado por Programa Validado n. 16/AGT/19 © AngolaERP</p>
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
      accountingSettings: null, numerodocAgt: null
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
      console.log('partydoc');
      console.log(this.doc.getLink(this.doc.party));
      return this.doc.getLink(this.doc.party);
    },
    partyField() {
      let fieldname = {
        SalesInvoice: 'customer',
        PurchaseInvoice: 'supplier'
      }[this.doc.payfor[0].referenceType];
      console.log('Partyfield');
      console.log(fieldname);
      console.log(this.doc.doctype);
      console.log(this.doc.payfor[0].referenceType);


      return this.meta.getField(fieldname);
    },
    itemFields() {
      let itemsMeta = frappe.getMeta(`PaymentFor`);
      console.log(
        [
          'referenceType',
          'referenceName',
          'amount'
        ].map(fieldname => itemsMeta.getField(fieldname))
      );
      return [
        'referenceType',
        'referenceName',
        'amount'
      ].map(fieldname => itemsMeta.getField(fieldname));
    },
    ratio() {
      return [0.3].concat(this.itemFields.map(() => 1));
    }
  },
  methods: {
    textAlign(df) {
      console.log(
        ['Currency', 'Int', 'Float'].includes(df.fieldtype) ? 'text-right' : ''
      );
      return ['Currency', 'Int', 'Float'].includes(df.fieldtype)
        ? 'text-right'
        : '';
    }
  },
  async mounted() {
    console.log('mounted');
    console.log(this.doc);
    console.log(this.doc.payfor[0].referenceType);
    console.log(this.doc.payfor[0].referenceName);
    if (this.doc.payfor[0].referenceType == 'PurchaseInvoice') {
        this.numerodocAgt = await frappe.db.getValue('PurchaseInvoice',this.doc.payfor[0].referenceName,'docAgt')
    } else if (this.doc.payfor[0].referenceType == 'SalesInvoice') {
        this.numerodocAgt = await frappe.db.getValue('SalesInvoice',this.doc.payfor[0].referenceName,'docAgt')
    }
    console.log('numerodocagt');
    console.log(this.numerodocAgt);
    
    this.accountingSettings = await frappe.getSingle('AccountingSettings');
    await this.doc.loadLink(this.partyField.fieldname);
  }
};
</script>
