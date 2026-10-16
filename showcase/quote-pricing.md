# Quote-pricing reference

A dependency-free calculator extracted into a small public example from the interactive quote prototype workflow.

- Annual prepayment with a 15% recurring discount
- Quarterly and monthly billing without that discount
- Optional recurring branding and one-time review service
- Separate recurring, one-time, due-now and first-year totals
- Integer USD cents, with a reconciliation check across installments

## Run
```sh
node --test pricing.test.cjs
```

There are 12 billing/option combinations plus invalid-input checks. Values are sample pricing, taxes are excluded, and the fixed sample catalog uses whole-cent installments. Extending the catalog may require a rounding/remainder allocation policy.

This is pricing logic only. It does not create HubSpot quotes, collect payments, record acceptance or enforce approval workflows.

[See the interactive quote prototype](https://siavash.tech/databiologics-quote/)
