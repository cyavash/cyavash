'use strict';
// All money is integer USD cents. Sample commercial rules, not client pricing.
function calculateQuote({billing = 'annual', branding = false, review = false} = {}) {
  if (!['annual', 'quarterly', 'monthly'].includes(billing)) throw new RangeError('Unknown billing period');
  if (typeof branding !== 'boolean' || typeof review !== 'boolean') throw new TypeError('Options must be booleans');
  const monthlyRecurring = 3 * 37500 + 8 * 4500 + 22500 + (branding ? 15000 : 0);
  const undiscountedAnnual = monthlyRecurring * 12;
  const discount = billing === 'annual' ? Math.round(undiscountedAnnual * 15 / 100) : 0;
  const annualRecurring = undiscountedAnnual - discount;
  const oneTime = 240000 + 90000 + 60000 - 60000 + (review ? 180000 : 0);
  const installments = {annual:1, quarterly:4, monthly:12}[billing];
  const recurringPerInstallment = annualRecurring / installments;
  const dueNow = recurringPerInstallment + oneTime;
  return {currency:'USD', billing, monthlyRecurring, discount, annualRecurring, oneTime,
    installments, recurringPerInstallment, dueNow, firstYearTotal:annualRecurring + oneTime};
}
module.exports = {calculateQuote};
