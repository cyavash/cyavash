'use strict';
const assert = require('node:assert/strict');
const {test} = require('node:test');
const {calculateQuote} = require('./pricing.cjs');
const expected = {
  annual: [[2074200,2074200],[2254200,2254200],[2227200,2227200],[2407200,2407200]],
  quarterly: [[843000,2382000],[1023000,2562000],[888000,2562000],[1068000,2742000]],
  monthly: [[501000,2382000],[681000,2562000],[516000,2562000],[696000,2742000]]
};
for (const billing of Object.keys(expected)) {
  let i = 0;
  for (const branding of [false,true]) for (const review of [false,true]) {
    const [dueNow,total] = expected[billing][i++];
    test(billing + ' branding=' + branding + ' review=' + review, () => {
      const q = calculateQuote({billing,branding,review});
      assert.equal(q.dueNow,dueNow); assert.equal(q.firstYearTotal,total);
      assert.equal(q.dueNow + (q.installments - 1) * q.recurringPerInstallment,q.firstYearTotal);
      for(const key of ['dueNow','firstYearTotal','discount','oneTime']) assert.ok(Number.isSafeInteger(q[key]));
    });
  }
}
test('rejects invalid options',()=>{
 assert.throws(()=>calculateQuote({billing:'weekly'}),RangeError);
 assert.throws(()=>calculateQuote({branding:'true'}),TypeError);
 assert.throws(()=>calculateQuote({review:1}),TypeError);
});
