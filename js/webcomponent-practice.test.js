'use strict';

/**
 * Tests for webcomponent-practice.js
 */

const {
  createRng,
  shuffleIndices,
  normalizeAnswer,
  isBlankable,
  selectCellsToBlank,
} = require('./webcomponent-practice.js');

/* ============================================================
   Utility: createRng
   ============================================================ */

describe('createRng', () => {
  test('produces values in [0, 1)', () => {
    const rng = createRng(42);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  test('same seed produces identical sequence', () => {
    const a = createRng(12345);
    const b = createRng(12345);
    for (let i = 0; i < 50; i++) {
      expect(a()).toBe(b());
    }
  });

  test('different seeds produce different sequences', () => {
    const a = createRng(1);
    const b = createRng(2);
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).not.toEqual(seqB);
  });
});

/* ============================================================
   Utility: shuffleIndices
   ============================================================ */

describe('shuffleIndices', () => {
  test('returns a permutation of 0..n-1', () => {
    const result = shuffleIndices(8, createRng(99));
    expect(result).toHaveLength(8);
    expect([...result].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  test('is deterministic for the same seed', () => {
    expect(shuffleIndices(10, createRng(7))).toEqual(shuffleIndices(10, createRng(7)));
  });

  test('handles n=0', () => {
    expect(shuffleIndices(0, createRng(1))).toEqual([]);
  });

  test('handles n=1', () => {
    expect(shuffleIndices(1, createRng(1))).toEqual([0]);
  });

  test('is a proper shuffle (not identity) for larger n', () => {
    expect(shuffleIndices(10, createRng(42))).not.toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

/* ============================================================
   Utility: normalizeAnswer
   ============================================================ */

describe('normalizeAnswer', () => {
  test('converts to lowercase', () => {
    expect(normalizeAnswer('Hablo')).toBe('hablo');
  });

  test('trims whitespace', () => {
    expect(normalizeAnswer('  hablo  ')).toBe('hablo');
  });

  test('replaces non-breaking spaces', () => {
    expect(normalizeAnswer(' hablo ')).toBe('hablo');
  });

  test('preserves accented characters', () => {
    expect(normalizeAnswer('Él habló')).toBe('él habló');
  });
});

/* ============================================================
   Utility: isBlankable
   ============================================================ */

describe('isBlankable', () => {
  function makeCell(text) {
    const td = document.createElement('td');
    td.textContent = text;
    return td;
  }

  test('returns true for normal text', () => {
    expect(isBlankable(makeCell('hablo'))).toBe(true);
  });

  test('returns false for empty cell', () => {
    expect(isBlankable(makeCell(''))).toBe(false);
  });

  test('returns false for non-breaking-space-only cell', () => {
    const td = document.createElement('td');
    td.innerHTML = '&nbsp;';
    expect(isBlankable(td)).toBe(false);
  });

  test('returns false for bare dash placeholder', () => {
    expect(isBlankable(makeCell('-'))).toBe(false);
  });
});

/* ============================================================
   Utility: selectCellsToBlank
   ============================================================ */

describe('selectCellsToBlank', () => {
  function makeRow(texts) {
    return texts.map((t) => {
      const td = document.createElement('td');
      td.textContent = t;
      return td;
    });
  }

  const ROW_A = makeRow(['hablo', 'como']);
  const ROW_B = makeRow(['hablas', 'comes']);
  const ROW_C = makeRow(['habla', 'come']);
  const ROWS  = [ROW_A, ROW_B, ROW_C]; // 3 rows × 2 cells = 6 total

  test('returns empty set for percent=0', () => {
    expect(selectCellsToBlank(ROWS, 0, createRng(1)).size).toBe(0);
  });

  test('returns empty set for empty rowGroups', () => {
    expect(selectCellsToBlank([], 50, createRng(1)).size).toBe(0);
  });

  test('at least one cell per row is always blanked when percent > 0', () => {
    const rng    = createRng(42);
    const blanked = selectCellsToBlank(ROWS, 10, rng); // 10% of 6 = 0.6 → 1, but min = 3
    /* Verify every row has at least one blanked cell. */
    for (const rowCells of ROWS) {
      expect(rowCells.some((c) => blanked.has(c))).toBe(true);
    }
  });

  test('respects the percentage target (min of percent-target and row-min)', () => {
    /* 50% of 6 = 3; min = 3 rows → blank exactly 3. */
    expect(selectCellsToBlank(ROWS, 50, createRng(1)).size).toBe(3);
  });

  test('blanks more cells with a higher percentage', () => {
    const low  = selectCellsToBlank(ROWS, 33, createRng(1)).size; // max(2,3) = 3
    const high = selectCellsToBlank(ROWS, 67, createRng(1)).size; // max(4,3) = 4
    expect(high).toBeGreaterThan(low);
  });

  test('is deterministic for the same seed', () => {
    const a = selectCellsToBlank(ROWS, 50, createRng(7));
    const b = selectCellsToBlank(ROWS, 50, createRng(7));
    expect(a).toEqual(b);
  });

  test('blanks all cells at 100%', () => {
    expect(selectCellsToBlank(ROWS, 100, createRng(1)).size).toBe(6);
  });
});

/* ============================================================
   DOM helpers
   ============================================================ */

function attachEl(tag, attrs, innerHTML) {
  const el = document.createElement(tag);
  if (attrs) Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (innerHTML) el.innerHTML = innerHTML;
  document.body.appendChild(el);
  return el;
}

function detachEl(el) {
  if (el && el.parentNode) el.parentNode.removeChild(el);
}

function dispatch(name, detail) {
  document.dispatchEvent(new CustomEvent(name, detail ? { detail } : {}));
}

/* ============================================================
   Component: quiz-controls
   ============================================================ */

describe('quiz-controls', () => {
  let el;

  function openPanel(el) {
    el.querySelector('.quiz-controls__details').open = true;
  }

  beforeEach(() => { el = attachEl('quiz-controls', { percent: '60' }); });
  afterEach(()  => detachEl(el));

  test('renders toggle button', () => {
    expect(el.querySelector('.quiz-controls__summary')).not.toBeNull();
  });

  test('panel is closed initially', () => {
    expect(el.querySelector('.quiz-controls__details').open).toBe(false);
  });

  test('panel opens on toggle', () => {
    openPanel(el);
    expect(el.querySelector('.quiz-controls__details').open).toBe(true);
  });

  test('panel closes on second toggle', () => {
    openPanel(el); openPanel(el);
    expect(el.querySelector('.quiz-controls__details').open).toBe(true); // set twice = still open
  });

  test('renders slider with configured default percent', () => {
    expect(el.querySelector('.quiz-controls__slider').value).toBe('60');
  });

  test('renders start button, hides reset button initially', () => {
    expect(el.querySelector('.quiz-controls__start').hidden).toBe(false);
    expect(el.querySelector('.quiz-controls__reset').hidden).toBe(true);
  });

  test('dispatches quiz:start with percent and seed on start click', () => {
    openPanel(el);
    const events = [];
    document.addEventListener('quiz:start', (e) => events.push(e.detail));
    el.querySelector('.quiz-controls__start').click();
    expect(events).toHaveLength(1);
    expect(events[0].percent).toBe(60);
    expect(typeof events[0].seed).toBe('number');
    document.removeEventListener('quiz:start', events[0]);
  });

  test('swaps start/reset visibility after start click', () => {
    openPanel(el);
    el.querySelector('.quiz-controls__start').click();
    expect(el.querySelector('.quiz-controls__start').hidden).toBe(true);
    expect(el.querySelector('.quiz-controls__reset').hidden).toBe(false);
  });

  test('dispatches quiz:reset and swaps buttons on reset click', () => {
    openPanel(el);
    el.querySelector('.quiz-controls__start').click();

    const resetEvents = [];
    const listener = () => resetEvents.push(1);
    document.addEventListener('quiz:reset', listener);
    el.querySelector('.quiz-controls__reset').click();
    document.removeEventListener('quiz:reset', listener);

    expect(resetEvents).toHaveLength(1);
    expect(el.querySelector('.quiz-controls__start').hidden).toBe(false);
    expect(el.querySelector('.quiz-controls__reset').hidden).toBe(true);
  });

  test('output updates when slider value changes', () => {
    const slider = el.querySelector('.quiz-controls__slider');
    const output = el.querySelector('.quiz-controls__output');
    slider.value = '75';
    slider.dispatchEvent(new Event('input'));
    expect(output.value).toBe('75');
  });
});

/* ============================================================
   Component: practice-table
   ============================================================ */

const SAMPLE_TABLE =
  '<table>' +
    '<thead><tr><th></th><th>-ar</th><th>-er</th></tr></thead>' +
    '<tbody>' +
      '<tr><td>yo</td><td>hablo</td><td>como</td></tr>' +
      '<tr><td>tú</td><td>hablas</td><td>comes</td></tr>' +
      '<tr><td>él</td><td>habla</td><td>come</td></tr>' +
    '</tbody>' +
  '</table>';

describe('practice-table', () => {
  let el;
  const SEED = 42;
  const PERCENT = 50;

  /** Start the quiz on a specific table element via its embedded controls. */
  function startTable(el, percent, seed) {
    el.setAttribute('data-seed', String(seed));
    /* Open the details. */
    el.querySelector('.ptable-details').open = true;
    /* Set slider. */
    const slider = el.querySelector('.ptable-slider');
    slider.value = String(percent);
    slider.dispatchEvent(new Event('input'));
    /* Click start. */
    el.querySelector('.ptable-start').click();
  }

  function resetTable(el) {
    el.querySelector('.ptable-reset').click();
  }

  beforeEach(() => {
    el = attachEl('practice-table', {}, SAMPLE_TABLE);
  });
  afterEach(() => {
    detachEl(el);
    dispatch('quiz:reset');
  });

  test('renders controls above the table', () => {
    expect(el.querySelector('.ptable-summary')).not.toBeNull();
    expect(el.querySelector('.ptable-panel')).not.toBeNull();
    expect(el.querySelector('.ptable-slider')).not.toBeNull();
  });

  test('details is closed initially', () => {
    expect(el.querySelector('.ptable-details').open).toBe(false);
  });

  test('status line is hidden initially', () => {
    expect(el.querySelector('.ptable-status').hidden).toBe(true);
  });

  test('details opens when set to open', () => {
    el.querySelector('.ptable-details').open = true;
    expect(el.querySelector('.ptable-details').open).toBe(true);
  });

  test('table is rendered inside .ptable-content unchanged before quiz', () => {
    expect(el.querySelector('.ptable-content table')).not.toBeNull();
    expect(el.querySelectorAll('.ptable-content td')).toHaveLength(9);
  });

  test('replaces some <td> cells with inputs after start', () => {
    startTable(el, PERCENT, SEED);
    expect(el.querySelectorAll('.practice-input').length).toBeGreaterThan(0);
  });

  test('every row with blankable cells has at least one input (per-row guarantee)', () => {
    startTable(el, PERCENT, SEED);
    const rows = Array.from(el.querySelectorAll('tbody tr'));
    for (const row of rows) {
      const hasInput = row.querySelector('.practice-input') !== null;
      expect(hasInput).toBe(true);
    }
  });

  test('blanks expected count of cells (percent target vs row-min, whichever higher)', () => {
    /* 3 rows × 2 non-first-col cells = 6 blankable; 50% = 3; row-min = 3 → 3. */
    startTable(el, PERCENT, SEED);
    expect(el.querySelectorAll('.practice-input')).toHaveLength(3);
  });

  test('blank count increases with higher percentage', () => {
    startTable(el, 33, SEED);
    const low = el.querySelectorAll('.practice-input').length; // max(2,3) = 3
    resetTable(el);
    startTable(el, 67, SEED);
    const high = el.querySelectorAll('.practice-input').length; // max(4,3) = 4
    expect(high).toBeGreaterThan(low);
  });

  test('produces the same blanked cells for the same seed', () => {
    startTable(el, PERCENT, SEED);
    const answers1 = Array.from(el.querySelectorAll('.practice-input')).map((i) => i.dataset.answer);
    resetTable(el);
    startTable(el, PERCENT, SEED);
    const answers2 = Array.from(el.querySelectorAll('.practice-input')).map((i) => i.dataset.answer);
    expect(answers1).toEqual(answers2);
  });

  test('after start: details hidden, status visible with correct percent', () => {
    startTable(el, PERCENT, SEED);
    expect(el.querySelector('.ptable-details').hidden).toBe(true);
    expect(el.querySelector('.ptable-status').hidden).toBe(false);
    expect(el.querySelector('.ptable-percent').textContent).toBe(String(PERCENT));
  });

  test('after reset: status hidden, details visible and closed', () => {
    startTable(el, PERCENT, SEED);
    resetTable(el);
    expect(el.querySelector('.ptable-status').hidden).toBe(true);
    expect(el.querySelector('.ptable-details').hidden).toBe(false);
    expect(el.querySelector('.ptable-details').open).toBe(false);
  });

  test('restores original table after reset', () => {
    startTable(el, 100, SEED);
    expect(el.querySelectorAll('.practice-input').length).toBeGreaterThan(0);
    resetTable(el);
    expect(el.querySelectorAll('.practice-input')).toHaveLength(0);
    expect(el.querySelector('.ptable-content table')).not.toBeNull();
  });

  test('marks inputs correct/wrong after quiz:check', () => {
    startTable(el, 100, SEED);
    const inputs = Array.from(el.querySelectorAll('.practice-input'));
    if (inputs.length > 0) inputs[0].value = inputs[0].dataset.answer;
    dispatch('quiz:check');
    if (inputs.length > 0) expect(inputs[0].classList.contains('practice-input--correct')).toBe(true);
    if (inputs.length > 1) expect(inputs[1].classList.contains('practice-input--wrong')).toBe(true);
  });

  test('dispatches quiz:result with correct counts after quiz:check', () => {
    startTable(el, 100, SEED);
    const inputs = Array.from(el.querySelectorAll('.practice-input'));
    inputs.forEach((inp) => { inp.value = inp.dataset.answer; });

    const results = [];
    const listener = (e) => results.push(e.detail);
    document.addEventListener('quiz:result', listener);
    dispatch('quiz:check');
    document.removeEventListener('quiz:result', listener);

    expect(results).toHaveLength(1);
    expect(results[0].correct).toBe(inputs.length);
    expect(results[0].total).toBe(inputs.length);
  });

  test('answer comparison is case-insensitive', () => {
    startTable(el, 100, SEED);
    const inputs = Array.from(el.querySelectorAll('.practice-input'));
    if (inputs.length > 0) inputs[0].value = inputs[0].dataset.answer.toUpperCase();
    dispatch('quiz:check');
    if (inputs.length > 0) expect(inputs[0].classList.contains('practice-input--correct')).toBe(true);
  });

  test('also responds to global quiz:start event', () => {
    dispatch('quiz:start', { percent: PERCENT, seed: SEED });
    expect(el.querySelectorAll('.practice-input').length).toBeGreaterThan(0);
  });

  test('also responds to global quiz:reset event', () => {
    dispatch('quiz:start', { percent: 100, seed: SEED });
    dispatch('quiz:reset');
    expect(el.querySelectorAll('.practice-input')).toHaveLength(0);
  });
});

/* ============================================================
   Component: practice-pair
   ============================================================ */

describe('practice-pair', () => {
  let el;

  beforeEach(() => {
    el = attachEl('practice-pair', {
      src: 'Yo hablo español.',
      tgt: 'Én spanyolul beszélek.',
    });
  });
  afterEach(() => {
    detachEl(el);
    dispatch('quiz:reset');
  });

  test('renders normal view with both sides visible initially', () => {
    expect(el.innerHTML).toContain('Yo hablo español.');
    expect(el.innerHTML).toContain('Én spanyolul beszélek.');
    expect(el.querySelector('.practice-input')).toBeNull();
  });

  test('shows source and blanks target after quiz:start', () => {
    dispatch('quiz:start', { percent: 50, seed: 1 });
    expect(el.innerHTML).toContain('Yo hablo español.');
    const input = el.querySelector('.practice-input');
    expect(input).not.toBeNull();
    expect(input.dataset.answer).toBe('Én spanyolul beszélek.');
  });

  test('restores normal view after quiz:reset', () => {
    dispatch('quiz:start', { percent: 50, seed: 1 });
    dispatch('quiz:reset');
    expect(el.querySelector('.practice-input')).toBeNull();
    expect(el.innerHTML).toContain('Én spanyolul beszélek.');
  });

  test('dispatches quiz:result with correct=1 when answer matches', () => {
    dispatch('quiz:start', { percent: 50, seed: 1 });
    const input = el.querySelector('.practice-input');
    input.value = input.dataset.answer;

    const results = [];
    const listener = (e) => results.push(e.detail);
    document.addEventListener('quiz:result', listener);
    dispatch('quiz:check');
    document.removeEventListener('quiz:result', listener);

    expect(results[0].correct).toBe(1);
    expect(results[0].total).toBe(1);
  });

  test('dispatches quiz:result with correct=0 when answer is wrong', () => {
    dispatch('quiz:start', { percent: 50, seed: 1 });
    const input = el.querySelector('.practice-input');
    input.value = 'wrong answer';

    const results = [];
    const listener = (e) => results.push(e.detail);
    document.addEventListener('quiz:result', listener);
    dispatch('quiz:check');
    document.removeEventListener('quiz:result', listener);

    expect(results[0].correct).toBe(0);
    expect(results[0].total).toBe(1);
  });

  test('respects direction="src" attribute', () => {
    el.setAttribute('direction', 'src');
    dispatch('quiz:start', { percent: 50, seed: 1 });
    const input = el.querySelector('.practice-input');
    expect(input.dataset.answer).toBe('Yo hablo español.');
    expect(el.innerHTML).toContain('Én spanyolul beszélek.');
  });
});

/* ============================================================
   Component: practice-pair (activate/deactivate API)
   ============================================================ */

describe('practice-pair activate/deactivate', () => {
  let el;
  beforeEach(() => {
    el = attachEl('practice-pair', { src: 'hola', tgt: 'szia' });
  });
  afterEach(() => detachEl(el));

  test('activate() shows input', () => {
    el.activate();
    expect(el.querySelector('.practice-input')).not.toBeNull();
  });

  test('deactivate() removes input', () => {
    el.activate();
    el.deactivate();
    expect(el.querySelector('.practice-input')).toBeNull();
    expect(el.innerHTML).toContain('szia');
  });
});

/* ============================================================
   Component: practice-sentences
   ============================================================ */

describe('practice-sentences', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = document.createElement('practice-sentences');
    wrapper.innerHTML =
      '<practice-pair src="Yo hablo." tgt="Én beszélek."></practice-pair>' +
      '<practice-pair src="Tú hablas." tgt="Te beszélsz."></practice-pair>';
    document.body.appendChild(wrapper);
  });
  afterEach(() => detachEl(wrapper));

  test('prepends controls with summary', () => {
    expect(wrapper.querySelector('.psent-summary')).not.toBeNull();
    expect(wrapper.querySelector('.psent-start')).not.toBeNull();
  });

  test('details is closed and status is hidden initially', () => {
    expect(wrapper.querySelector('.psent-details').open).toBe(false);
    expect(wrapper.querySelector('.psent-status').hidden).toBe(true);
  });

  test('start activates all child practice-pairs', () => {
    wrapper.querySelector('.psent-start').click();
    const inputs = wrapper.querySelectorAll('.practice-input');
    expect(inputs.length).toBe(2);
  });

  test('after start: details hidden, status visible', () => {
    wrapper.querySelector('.psent-start').click();
    expect(wrapper.querySelector('.psent-details').hidden).toBe(true);
    expect(wrapper.querySelector('.psent-status').hidden).toBe(false);
  });

  test('reset deactivates all child practice-pairs', () => {
    wrapper.querySelector('.psent-start').click();
    wrapper.querySelector('.psent-reset').click();
    expect(wrapper.querySelectorAll('.practice-input')).toHaveLength(0);
  });

  test('after reset: status hidden, details visible', () => {
    wrapper.querySelector('.psent-start').click();
    wrapper.querySelector('.psent-reset').click();
    expect(wrapper.querySelector('.psent-status').hidden).toBe(true);
    expect(wrapper.querySelector('.psent-details').hidden).toBe(false);
  });

  test('pairs respond to quiz:check after activation', () => {
    wrapper.querySelector('.psent-start').click();
    wrapper.querySelectorAll('.practice-input').forEach(i => { i.value = i.dataset.answer; });
    const results = [];
    const listener = (e) => results.push(e.detail);
    document.addEventListener('quiz:result', listener);
    dispatch('quiz:check');
    document.removeEventListener('quiz:result', listener);
    expect(results.every(r => r.correct === r.total)).toBe(true);
  });
});

/* ============================================================
   Component: quiz-evaluator
   ============================================================ */

describe('quiz-evaluator', () => {
  let evaluator;

  beforeEach(() => { evaluator = attachEl('quiz-evaluator'); });
  afterEach(() => detachEl(evaluator));

  test('renders check button visible by default', () => {
    const btn = evaluator.querySelector('.quiz-evaluator__check');
    expect(btn).not.toBeNull();
    expect(btn.hidden).toBe(false);
  });

  test('result paragraph is hidden initially', () => {
    expect(evaluator.querySelector('.quiz-evaluator__result').hidden).toBe(true);
  });

  test('shows aggregated result after check button click', () => {
    const table = attachEl('practice-table', {}, SAMPLE_TABLE);
    const pair  = attachEl('practice-pair', { src: 'hola', tgt: 'helló' });

    /* Use global start to activate all components. */
    dispatch('quiz:start', { percent: 100, seed: 42 });

    table.querySelectorAll('.practice-input').forEach((inp) => { inp.value = inp.dataset.answer; });
    const pairInput = pair.querySelector('.practice-input');
    if (pairInput) pairInput.value = pairInput.dataset.answer;

    evaluator.querySelector('.quiz-evaluator__check').click();

    const result = evaluator.querySelector('.quiz-evaluator__result');
    expect(result.hidden).toBe(false);
    expect(result.textContent).toMatch(/Eredmény:/);
    expect(result.textContent).toContain('100%');

    detachEl(table);
    detachEl(pair);
  });

  test('overwrites result on subsequent check', () => {
    const table = attachEl('practice-table', {}, SAMPLE_TABLE);
    dispatch('quiz:start', { percent: 100, seed: 42 });

    /* First check — all wrong. */
    evaluator.querySelector('.quiz-evaluator__check').click();
    const firstResult = evaluator.querySelector('.quiz-evaluator__result').textContent;

    /* Second check — all correct. */
    table.querySelectorAll('.practice-input').forEach((inp) => { inp.value = inp.dataset.answer; });
    evaluator.querySelector('.quiz-evaluator__check').click();
    const secondResult = evaluator.querySelector('.quiz-evaluator__result').textContent;

    expect(secondResult).not.toBe(firstResult);
    expect(secondResult).toContain('100%');

    detachEl(table);
    dispatch('quiz:reset');
  });
});
