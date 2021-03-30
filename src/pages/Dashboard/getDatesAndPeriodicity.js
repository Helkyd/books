import frappe from 'frappejs';
import { DateTime } from 'luxon';

import { __ } from '../../translate'; //HELKYDS 30-03-2021

export async function getDatesAndPeriodicity(period) {
  let fromDate, toDate;
  let periodicity = 'Monthly';
  let accountingSettings = await frappe.getSingle('AccountingSettings');

  console.log('period ', period);
  console.log('period ', __(period));
  if (__(period) === __('This Year')) {
    fromDate = accountingSettings.fiscalYearStart;
    toDate = accountingSettings.fiscalYearEnd;
  } else if (__(period) === __('This Quarter')) {
    fromDate = DateTime.local()
      .startOf('quarter')
      .toISODate();
    toDate = DateTime.local()
      .endOf('quarter')
      .toISODate();
  } else if (__(period) === __('This Month')) {
    fromDate = DateTime.local()
      .startOf('month')
      .toISODate();
    toDate = DateTime.local()
      .endOf('month')
      .toISODate();
  }

  return {
    fromDate,
    toDate,
    periodicity
  };
}
