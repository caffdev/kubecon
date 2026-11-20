/* The ten draft's deck-wide pieces. Load after ../theme/range.js, before ../../_kit/runtime/slide.js.

     Ten.takeaway(1)   // the tag above the headline: which of the three takeaways this slide argues

   The three takeaways are the old journey slide, spread across the deck as a tag. */
(() => {
  'use strict';
  const TAKEAWAYS = ['There’s always another cluster', 'No manual way keeps up', 'AI brings problems as it solves them'];
  function takeaway(n) {
    const el = document.querySelector('.slide');
    if (!el || !TAKEAWAYS[n - 1]) return;
    const bars = TAKEAWAYS.map((_, i) => `<i${i === n - 1 ? ' class="on"' : ''}></i>`).join('');
    el.insertAdjacentHTML('afterbegin', `<p class="tk-tag tk-${n}" aria-hidden="true"><span class="tk-bars">${bars}</span>${TAKEAWAYS[n - 1]}</p>`);
  }
  window.Ten = { takeaway, TAKEAWAYS };
})();
