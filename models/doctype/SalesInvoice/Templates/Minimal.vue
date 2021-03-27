<template>
  <div
    class="bg-white border h-full"
    :style="{ 'font-family': printSettings.font }"
  >
    <div class="flex items-center justify-between px-12 py-10 border-b">
      <div class="flex items-center">
        <div class="flex items-center rounded h-16">
          <div class="mr-4" v-if="printSettings.displayLogo">
            <img
              class="h-12 max-w-32 object-contain"
              :src="printSettings.logo"
            />
          </div>
        </div>
        <div>
          <div
            class="font-semibold text-xl"
            :style="{ color: printSettings.color }"
          >
            {{ frappe.AccountingSettings.companyName }}
          </div>
          <div v-if="frappe.AccountingSettings.nifEmpresa">
            {{ 'NIF: ' + frappe.AccountingSettings.nifEmpresa }}
          </div>
          <div>{{ _('Date') }}: {{ frappe.format(doc.date, 'Date') }}</div>
          <div text-lg font-semibold>
            <div>{{ frappe.AccountingSettings.regimeIva }}</div>
          </div>
          <div text-lg>
            <div>{{ _('User') }}: {{ frappe.session.user }}</div>
          </div>
        </div>
      </div>
      <div class="text-right">
        <div
          class="font-semibold text-xl"
          :style="{ color: printSettings.color }"
        >
          {{ doc.doctype === 'SalesInvoice' ? 'Invoice' : 'Bill' }}
        </div>
        <div>
          {{ doc.docAgt || doc.name }}
        </div>
        <div class="text-lg font-semibold">
          <div>ORIGINAL</div>
        </div>
      </div>
    </div>
    <div class="flex px-12 py-10 border-b">
      <div class="w-1/2" v-if="party">
        <div
          class="uppercase text-sm font-semibold tracking-widest text-gray-800"
        >
          To
        </div>
        <div class="mt-4 text-black leading-relaxed text-lg">
          {{ party.name }} <br />
          {{ party.addressDisplay }} <br />
          <div v-if="party.nif">NIF:{{ party.nif }}</div>
          <div v-else>Consumidor Final</div>
        </div>
      </div>
      <div class="w-1/2" v-if="companyAddress">
        <div
          class="uppercase text-sm font-semibold tracking-widest text-gray-800"
        >
          From
        </div>
        <div class="mt-4 text-black leading-relaxed text-lg">
          {{ companyAddress.addressDisplay }}
        </div>
      </div>
    </div>
    <div class="px-12 py-10 border-b">
      <div
        class="mb-4 flex uppercase text-sm tracking-widest font-semibold text-gray-800"
      >
        <div class="w-4/12">Item</div>
        <div class="w-2/12 text-right">Quantity</div>
        <div class="w-3/12 text-right">Rate</div>
        <div class="w-3/12 text-right">Tax</div>
        <div class="w-3/12 text-right">Amount</div>
      </div>
      <div class="flex py-1 text-lg" v-for="row in doc.items" :key="row.name">
        <div class="w-4/12">{{ row.item }}</div>
        <div class="w-2/12 text-right">{{ format(row, 'quantity') }}</div>
        <div class="w-3/12 text-right">{{ format(row, 'rate') }}</div>
        <div
          class="w-3/12 text-right"
          v-if="row.tax && row.tax.includes('IVA')"
        >
          {{ row.tax.replace('IVA-', '') }}%
        </div>
        <div
          class="w-3/12 text-right"
          v-else-if="row.tax && row.tax.includes('Isencao')"
        >
          0%
        </div>
        <div class="w-3/12 text-right" v-else-if="row.tax">{{ row.tax }}%</div>
        <div class="w-3/12 text-right" v-else>0%</div>
        <div class="w-3/12 text-right">{{ format(row, 'amount') }}</div>
      </div>
    </div>
    <div class="flex px-12 py-10">
      <div class="w-1/2">
        <template v-if="doc.terms">
          <div
            class="uppercase text-sm tracking-widest font-semibold text-gray-800"
          >
            Notes
          </div>
          <div class="mt-4 text-lg whitespace-pre-line">
            {{ doc.terms }}
          </div>
        </template>
      </div>
      <div class="w-1/2 text-lg">
        <div class="flex pl-2 justify-between py-1">
          <div>{{ _('Total Iliquido') }}</div>
          <div>{{ frappe.format(doc.netTotal, 'Currency') }}</div>
        </div>
        <div class="flex pl-2 justify-between py-1">
          <div>{{ _('Line Discount') }}</div>
          <div>{{ frappe.format(0, 'Currency') }}</div>
        </div>
        <div class="flex pl-2 justify-between py-1">
          <div>{{ _('Discount') }}</div>
          <div>{{ frappe.format(0, 'Currency') }}</div>
        </div>

        <div class="flex pl-2 justify-between py-1">
          <div>{{ _('Subtotal') }}</div>
          <div>{{ frappe.format(doc.netTotal, 'Currency') }}</div>
        </div>
        <div
          class="flex pl-2 justify-between py-1"
          v-for="tax in doc.taxes"
          :key="tax.name"
        >
          <div v-if="tax.account.includes('3451')">IVA ({{ tax.rate }}%)</div>
          <div v-else>{{ tax.account }} ({{ tax.rate }}%)</div>
          <div>{{ frappe.format(tax.amount, 'Currency') }}</div>
        </div>
        <div
          class="flex pl-2 justify-between py-1 font-semibold"
          :style="{ color: printSettings.color }"
        >
          <div>{{ _('Grand Total') }}</div>
          <div>{{ frappe.format(doc.grandTotal, 'Currency') }}</div>
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
        <p>
          Bens / Serviços colocados a disposição do adquirente a data do
          documento.
        </p>
        <p v-if="doc.hashAgt">
          {{ doc.hashAgt[(0, 1)] }} {{ doc.hashAgt[(10, 11)] }}
          {{ doc.hashAgt[(20, 21)] }} {{ doc.hashAgt[(30, 31)] }} - Processado
          por Programa Validado n. 16/AGT/19 © AngolaERP
        </p>
        <p v-else>Processado por Programa Validado n. 16/AGT/19 © AngolaERP</p>
      </div>
    </footer>
  </div>
</template>

<script>
import Base from './Base';

export default {
  name: 'Minimal',
  extends: Base
};
</script>
