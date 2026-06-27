import {
  createRng,
  shuffleIndices,
  normalizeAnswer,
  isBlankable,
  selectCellsToBlank,
  renderWordBlanks,
  type Direction,
} from './webcomponent-practice';

/* ── createRng ─────────────────────────────────────────────── */

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
    for (let i = 0; i < 50; i++) expect(a()).toBe(b());
  });

  test('different seeds produce different sequences', () => {
    const a = Array.from({ length: 10 }, createRng(1));
    const b = Array.from({ length: 10 }, createRng(2));
    expect(a).not.toEqual(b);
  });
});

/* ── shuffleIndices ────────────────────────────────────────── */

describe('shuffleIndices', () => {
  test('returns a permutation of 0..n-1', () => {
    const r = shuffleIndices(8, createRng(99));
    expect(r).toHaveLength(8);
    expect([...r].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  test('is deterministic for the same seed', () => {
    expect(shuffleIndices(10, createRng(7))).toEqual(shuffleIndices(10, createRng(7)));
  });

  test('handles n=0 and n=1', () => {
    expect(shuffleIndices(0, createRng(1))).toEqual([]);
    expect(shuffleIndices(1, createRng(1))).toEqual([0]);
  });

  test('is not identity for larger n', () => {
    expect(shuffleIndices(10, createRng(42))).not.toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

/* ── normalizeAnswer ───────────────────────────────────────── */

describe('normalizeAnswer', () => {
  test('lowercases', () => expect(normalizeAnswer('Hablo')).toBe('hablo'));
  test('trims', () => expect(normalizeAnswer('  hablo  ')).toBe('hablo'));
  test('replaces NBSP', () => expect(normalizeAnswer(' hablo ')).toBe('hablo'));
  test('preserves accents', () => expect(normalizeAnswer('Él habló')).toBe('él habló'));
  test('strips leading ¿¡', () => expect(normalizeAnswer('¿Dónde?')).toBe('dónde'));
  test('strips trailing punctuation', () => {
    expect(normalizeAnswer('hablo,')).toBe('hablo');
    expect(normalizeAnswer('¡Habla!')).toBe('habla');
  });
});

/* ── isBlankable ───────────────────────────────────────────── */

describe('isBlankable', () => {
  function td(text: string): HTMLTableCellElement {
    const el = document.createElement('td');
    el.textContent = text;
    return el;
  }
  test('true for normal text', () => expect(isBlankable(td('hablo'))).toBe(true));
  test('false for empty',      () => expect(isBlankable(td(''))).toBe(false));
  test('false for &nbsp;', () => {
    const el = document.createElement('td');
    el.innerHTML = '&nbsp;';
    expect(isBlankable(el)).toBe(false);
  });
  test('false for dash',       () => expect(isBlankable(td('-'))).toBe(false));
});

/* ── selectCellsToBlank ────────────────────────────────────── */

describe('selectCellsToBlank', () => {
  function row(texts: string[]): HTMLTableCellElement[] {
    return texts.map(t => { const td = document.createElement('td'); td.textContent = t; return td; });
  }
  const ROWS = [row(['hablo', 'como']), row(['hablas', 'comes']), row(['habla', 'come'])];

  test('returns empty for percent=0',      () => expect(selectCellsToBlank(ROWS, 0, createRng(1)).size).toBe(0));
  test('returns empty for empty rowGroups',() => expect(selectCellsToBlank([], 50, createRng(1)).size).toBe(0));

  test('every row has at least one blank when percent > 0', () => {
    const blanked = selectCellsToBlank(ROWS, 10, createRng(42));
    for (const rowCells of ROWS) {
      expect(rowCells.some(c => blanked.has(c))).toBe(true);
    }
  });

  test('50% of 6 cells in 3 rows → 3 blanked', () => {
    expect(selectCellsToBlank(ROWS, 50, createRng(1)).size).toBe(3);
  });

  test('higher percent → more blanks', () => {
    const lo = selectCellsToBlank(ROWS, 33, createRng(1)).size;
    const hi = selectCellsToBlank(ROWS, 67, createRng(1)).size;
    expect(hi).toBeGreaterThan(lo);
  });

  test('is deterministic', () => {
    expect(selectCellsToBlank(ROWS, 50, createRng(7))).toEqual(selectCellsToBlank(ROWS, 50, createRng(7)));
  });

  test('100% blanks all', () => expect(selectCellsToBlank(ROWS, 100, createRng(1)).size).toBe(6));
});

/* ── renderWordBlanks ──────────────────────────────────────── */

describe('renderWordBlanks', () => {
  test('percent=0 returns plain escaped text', () => {
    const out = renderWordBlanks('Yo hablo.', 0, createRng(1));
    expect(out).not.toContain('<input');
    expect(out).toContain('Yo');
  });

  test('percent=100 blanks all words', () => {
    const out = renderWordBlanks('Yo hablo español.', 100, createRng(1));
    const inputs = (out.match(/practice-input/g) ?? []).length;
    expect(inputs).toBe(3); // "Yo", "hablo", "español."
  });

  test('preserves spaces between tokens', () => {
    const out = renderWordBlanks('a b c', 0, createRng(1));
    expect(out).toContain('a b c');
  });

  test('blanked words store original as data-answer', () => {
    const out = renderWordBlanks('hola mundo', 100, createRng(1));
    expect(out).toContain('data-answer="hola"');
    expect(out).toContain('data-answer="mundo"');
  });

  test('is deterministic for same seed', () => {
    expect(renderWordBlanks('foo bar baz', 50, createRng(7)))
      .toBe(renderWordBlanks('foo bar baz', 50, createRng(7)));
  });

  test('at least one word blanked when percent > 0', () => {
    const out = renderWordBlanks('solo', 10, createRng(1));
    expect(out).toContain('<input');
  });
});

/* ── DOM helpers ───────────────────────────────────────────── */

function attachEl<T extends HTMLElement>(tag: string, attrs?: Record<string, string>, innerHTML?: string): T {
  const el = document.createElement(tag) as T;
  if (attrs) Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (innerHTML) el.innerHTML = innerHTML;
  document.body.appendChild(el);
  return el;
}
function detachEl(el: HTMLElement | null): void {
  if (el?.parentNode) el.parentNode.removeChild(el);
}
function dispatch(name: string, detail?: object): void {
  document.dispatchEvent(new CustomEvent(name, detail ? { detail } : {}));
}

/* ── quiz-controls ─────────────────────────────────────────── */

describe('quiz-controls', () => {
  let el: HTMLElement;

  beforeEach(() => { el = attachEl('quiz-controls', { percent: '60' }); });
  afterEach(()  => detachEl(el));

  test('renders summary', () => expect(el.querySelector('.quiz-controls__summary')).not.toBeNull());
  test('details closed initially', () => expect(el.querySelector<HTMLDetailsElement>('.quiz-controls__details')!.open).toBe(false));

  test('dispatches quiz:start with percent and seed on start click', () => {
    el.querySelector<HTMLDetailsElement>('.quiz-controls__details')!.open = true;
    const events: { percent: number; seed: number }[] = [];
    const listener = (e: Event) => events.push((e as CustomEvent).detail);
    document.addEventListener('quiz:start', listener);
    el.querySelector<HTMLButtonElement>('.quiz-controls__start')!.click();
    document.removeEventListener('quiz:start', listener);
    expect(events).toHaveLength(1);
    expect(events[0].percent).toBe(60);
    expect(typeof events[0].seed).toBe('number');
  });

  test('slider output updates on input', () => {
    const slider = el.querySelector<HTMLInputElement>('.quiz-controls__slider')!;
    const output = el.querySelector<HTMLOutputElement>('.quiz-controls__output')!;
    slider.value = '75';
    slider.dispatchEvent(new Event('input'));
    expect(output.value).toBe('75');
  });
});

/* ── practice-table ────────────────────────────────────────── */

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
  let el: HTMLElement;
  const SEED = 42;
  const PERCENT = 50;

  function startTable(el: HTMLElement, percent: number, seed: number): void {
    el.setAttribute('data-seed', String(seed));
    el.querySelector<HTMLDetailsElement>('.ptable-details')!.open = true;
    const slider = el.querySelector<HTMLInputElement>('.ptable-slider')!;
    slider.value = String(percent);
    slider.dispatchEvent(new Event('input'));
    el.querySelector<HTMLButtonElement>('.ptable-start')!.click();
  }

  function resetTable(el: HTMLElement): void {
    el.querySelector<HTMLButtonElement>('.ptable-reset')!.click();
  }

  beforeEach(() => { el = attachEl('practice-table', {}, SAMPLE_TABLE); });
  afterEach(() => { detachEl(el); dispatch('quiz:reset'); });

  test('renders summary and slider', () => {
    expect(el.querySelector('.ptable-summary')).not.toBeNull();
    expect(el.querySelector('.ptable-slider')).not.toBeNull();
  });

  test('table in .ptable-content before controls', () => {
    expect(el.querySelector('.ptable-content table')).not.toBeNull();
    /* controls must come after content in the DOM */
    const content  = el.querySelector('.ptable-content')!;
    const controls = el.querySelector('.ptable-controls')!;
    expect(content.compareDocumentPosition(controls) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('replaces cells with inputs after start', () => {
    startTable(el, PERCENT, SEED);
    expect(el.querySelectorAll('.practice-input').length).toBeGreaterThan(0);
  });

  test('every tbody row has at least one input (per-row guarantee)', () => {
    startTable(el, PERCENT, SEED);
    for (const row of Array.from(el.querySelectorAll('tbody tr'))) {
      expect(row.querySelector('.practice-input')).not.toBeNull();
    }
  });

  test('blanks expected count (50% of 6 non-first-col cells, min 3 rows → 3)', () => {
    const totalBlankable = Array.from(el.querySelectorAll('td'))
      .filter(cell => (cell as HTMLTableCellElement).cellIndex !== 0 && isBlankable(cell as HTMLTableCellElement)).length;
    const minCount = el.querySelectorAll('tbody tr').length;
    const expected = Math.max(Math.round(totalBlankable * PERCENT / 100), minCount);
    startTable(el, PERCENT, SEED);
    expect(el.querySelectorAll('.practice-input')).toHaveLength(expected);
  });

  test('higher percent → more blanks', () => {
    startTable(el, 33, SEED);
    const lo = el.querySelectorAll('.practice-input').length;
    resetTable(el);
    startTable(el, 67, SEED);
    const hi = el.querySelectorAll('.practice-input').length;
    expect(hi).toBeGreaterThan(lo);
  });

  test('same seed → same blanked cells', () => {
    startTable(el, PERCENT, SEED);
    const a = Array.from(el.querySelectorAll<HTMLInputElement>('.practice-input')).map(i => i.dataset.answer);
    resetTable(el);
    startTable(el, PERCENT, SEED);
    const b = Array.from(el.querySelectorAll<HTMLInputElement>('.practice-input')).map(i => i.dataset.answer);
    expect(a).toEqual(b);
  });

  test('active state: details hidden, status shown with percent', () => {
    startTable(el, PERCENT, SEED);
    expect(el.querySelector<HTMLDetailsElement>('.ptable-details')!.hidden).toBe(true);
    expect(el.querySelector<HTMLElement>('.ptable-status')!.hidden).toBe(false);
    expect(el.querySelector('.ptable-percent')!.textContent).toBe(String(PERCENT));
  });

  test('reset restores table', () => {
    startTable(el, 100, SEED);
    resetTable(el);
    expect(el.querySelectorAll('.practice-input')).toHaveLength(0);
    expect(el.querySelector('.ptable-content table')).not.toBeNull();
  });

  test('correct/wrong classes after quiz:check', () => {
    startTable(el, 100, SEED);
    const inputs = Array.from(el.querySelectorAll<HTMLInputElement>('.practice-input'));
    if (inputs[0]) inputs[0].value = inputs[0].dataset.answer!;
    dispatch('quiz:check');
    if (inputs[0]) expect(inputs[0].classList.contains('practice-input--correct')).toBe(true);
    if (inputs[1]) expect(inputs[1].classList.contains('practice-input--wrong')).toBe(true);
  });

  test('case-insensitive answer comparison', () => {
    startTable(el, 100, SEED);
    const inp = el.querySelector<HTMLInputElement>('.practice-input');
    if (inp) { inp.value = inp.dataset.answer!.toUpperCase(); }
    dispatch('quiz:check');
    if (inp) expect(inp.classList.contains('practice-input--correct')).toBe(true);
  });

  test('responds to global quiz:start / quiz:reset', () => {
    dispatch('quiz:start', { percent: PERCENT, seed: SEED });
    expect(el.querySelectorAll('.practice-input').length).toBeGreaterThan(0);
    dispatch('quiz:reset');
    expect(el.querySelectorAll('.practice-input')).toHaveLength(0);
  });
});

/* ── practice-pair ─────────────────────────────────────────── */

describe('practice-pair', () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = attachEl('practice-pair', { src: 'Yo hablo español.', tgt: 'Én spanyolul beszélek.' });
  });
  afterEach(() => { detachEl(el); dispatch('quiz:reset'); });

  test('normal view shows both sides', () => {
    expect(el.innerHTML).toContain('Yo hablo español.');
    expect(el.innerHTML).toContain('Én spanyolul beszélek.');
    expect(el.querySelector('.practice-input')).toBeNull();
  });

  test('activate() blanks target words', () => {
    (el as any).activate(100, 'tgt', 1);
    expect(el.querySelector('.practice-input')).not.toBeNull();
    expect(el.innerHTML).toContain('Yo hablo español.');
  });

  test('activate() with direction src blanks source', () => {
    (el as any).activate(100, 'src', 1);
    expect(el.innerHTML).toContain('Én spanyolul beszélek.');
    expect(el.querySelector('.practice-input')).not.toBeNull();
  });

  test('deactivate() restores normal view', () => {
    (el as any).activate(100, 'tgt', 1);
    (el as any).deactivate();
    expect(el.querySelector('.practice-input')).toBeNull();
  });

  test('partial blanking at 50% blanks some but not all words', () => {
    (el as any).activate(50, 'tgt', 42);
    const html = el.innerHTML;
    // some words blanked, some plain
    expect(html).toContain('<input');
    // not all 3 words blanked (span should have some plain text too)
    const inputCount = (html.match(/practice-input/g) ?? []).length;
    expect(inputCount).toBeGreaterThan(0);
    expect(inputCount).toBeLessThan(3); // "Én spanyolul beszélek." = 3 words
  });

  test('correct quiz:result when all answers match', () => {
    dispatch('quiz:start', { percent: 100, seed: 1 });
    const inputs = Array.from(el.querySelectorAll<HTMLInputElement>('.practice-input'));
    inputs.forEach(i => { i.value = i.dataset.answer!; });
    const results: { correct: number; total: number }[] = [];
    const l = (e: Event) => results.push((e as CustomEvent).detail);
    document.addEventListener('quiz:result', l);
    dispatch('quiz:check');
    document.removeEventListener('quiz:result', l);
    expect(results[0]?.correct).toBe(results[0]?.total);
  });

  test('editing after check removes color classes (goes gray)', () => {
    (el as any).activate(100, 'tgt', 1);
    const inp = el.querySelector<HTMLInputElement>('.practice-input')!;
    inp.value = 'wrong';
    dispatch('quiz:check');
    expect(inp.classList.contains('practice-input--wrong')).toBe(true);
    inp.value = 'something else';
    inp.dispatchEvent(new Event('input'));
    expect(inp.classList.contains('practice-input--wrong')).toBe(false);
    expect(inp.classList.contains('practice-input--correct')).toBe(false);
  });

  test('re-typing the exact wrong answer restores red', () => {
    (el as any).activate(100, 'tgt', 1);
    const inp = el.querySelector<HTMLInputElement>('.practice-input')!;
    inp.value = 'wrong';
    dispatch('quiz:check');
    inp.value = 'other';
    inp.dispatchEvent(new Event('input'));
    inp.value = 'wrong';
    inp.dispatchEvent(new Event('input'));
    expect(inp.classList.contains('practice-input--wrong')).toBe(true);
  });

  test('editing dispatches quiz:answer-changed', () => {
    (el as any).activate(100, 'tgt', 1);
    const inp = el.querySelector<HTMLInputElement>('.practice-input')!;
    dispatch('quiz:check');
    const events: Event[] = [];
    const l = (e: Event) => events.push(e);
    document.addEventListener('quiz:answer-changed', l);
    inp.dispatchEvent(new Event('input'));
    document.removeEventListener('quiz:answer-changed', l);
    expect(events).toHaveLength(1);
  });
});

/* ── practice-sentences list parsing ──────────────────────── */

describe('practice-sentences list parsing', () => {
  function make(html: string): HTMLElement {
    const el = document.createElement('practice-sentences');
    el.innerHTML = html;
    document.body.appendChild(el);
    return el;
  }

  test('converts li items to practice-pair elements', () => {
    const el = make('<ul>' +
      '<li><em>Hola.</em> - Szia.</li>' +
      '<li><em>Adiós.</em> - Viszlát.</li>' +
      '</ul>');
    const pairs = el.querySelectorAll('practice-pair');
    expect(pairs).toHaveLength(2);
    expect(pairs[0].getAttribute('src')).toBe('Hola.');
    expect(pairs[0].getAttribute('tgt')).toBe('Szia.');
    expect(pairs[1].getAttribute('src')).toBe('Adiós.');
    expect(pairs[1].getAttribute('tgt')).toBe('Viszlát.');
    detachEl(el);
  });

  test('removes the list element after all items are parsed', () => {
    const el = make('<ul><li><em>Hola.</em> – Szia.</li></ul>');
    expect(el.querySelector('ul')).toBeNull();
    detachEl(el);
  });

  test('accepts hyphen as separator', () => {
    const el = make('<ul><li><em>Hola.</em> - Szia.</li></ul>');
    expect(el.querySelector('practice-pair')?.getAttribute('tgt')).toBe('Szia.');
    detachEl(el);
  });

  test('accepts em-dash as separator', () => {
    const el = make('<ul><li><em>Hola.</em> — Szia.</li></ul>');
    expect(el.querySelector('practice-pair')?.getAttribute('tgt')).toBe('Szia.');
    detachEl(el);
  });

  test('leaves non-matching li items (no <em>) in place', () => {
    const el = make('<ul><li>No em here</li></ul>');
    expect(el.querySelector('practice-pair')).toBeNull();
    expect(el.querySelector('ul')).not.toBeNull();
    detachEl(el);
  });

  test('preserves surrounding non-list elements (e.g. label codes)', () => {
    const el = make(
      '<p><code>Label:</code></p>' +
      '<ul><li><em>Hola.</em> - Szia.</li></ul>'
    );
    expect(el.querySelector('code')).not.toBeNull();
    expect(el.querySelector('practice-pair')).not.toBeNull();
    detachEl(el);
  });

  test('parsed pairs are captured in _originalOrder for reset', () => {
    const el = make(
      '<ul>' +
        '<li><em>A.</em> – a.</li>' +
        '<li><em>B.</em> – b.</li>' +
        '<li><em>C.</em> – c.</li>' +
      '</ul>'
    );
    el.setAttribute('data-seed', '1');
    el.querySelector<HTMLButtonElement>('.psent-start')!.click();
    el.querySelector<HTMLButtonElement>('.psent-reset')!.click();
    const srcs = Array.from(el.querySelectorAll('practice-pair')).map(p => p.getAttribute('src'));
    expect(srcs).toEqual(['A.', 'B.', 'C.']);
    detachEl(el);
  });
});

/* ── practice-sentences ────────────────────────────────────── */

describe('practice-sentences', () => {
  let wrapper: HTMLElement;

  beforeEach(() => {
    wrapper = document.createElement('practice-sentences');
    wrapper.innerHTML =
      '<practice-pair src="Yo hablo." tgt="Én beszélek."></practice-pair>' +
      '<practice-pair src="Tú hablas." tgt="Te beszélsz."></practice-pair>';
    document.body.appendChild(wrapper);
  });
  afterEach(() => detachEl(wrapper));

  test('appends controls after child pairs', () => {
    expect(wrapper.querySelector('.psent-summary')).not.toBeNull();
    /* controls must be the last child */
    const lastChild = wrapper.lastElementChild;
    expect(lastChild?.classList.contains('psent-controls')).toBe(true);
  });

  test('randomize checkbox is checked by default', () => {
    const cb = wrapper.querySelector<HTMLInputElement>('.psent-randomize')!;
    expect(cb).not.toBeNull();
    expect(cb.checked).toBe(true);
  });

  test('shuffling keeps labels in place and shuffles sentences within their group', () => {
    const el = document.createElement('practice-sentences') as HTMLElement;
    /* Two labeled groups: each label must stay immediately before its group. */
    el.innerHTML =
      '<p><code>Label A</code></p>' +
      '<practice-pair src="A1" tgt="a1"></practice-pair>' +
      '<practice-pair src="A2" tgt="a2"></practice-pair>' +
      '<p><code>Label B</code></p>' +
      '<practice-pair src="B1" tgt="b1"></practice-pair>' +
      '<practice-pair src="B2" tgt="b2"></practice-pair>';
    document.body.appendChild(el);
    el.setAttribute('data-seed', '42');
    el.querySelector<HTMLButtonElement>('.psent-start')!.click();

    const children = Array.from(el.children).filter(c => !c.classList.contains('psent-controls'));
    /* Labels must still be in positions 0 and 2 (before their respective groups). */
    expect(children[0].textContent).toContain('Label A');
    expect(children[3].textContent).toContain('Label B');
    /* Pairs after Label A must be A1/A2 in some order. */
    const groupA = [children[1].getAttribute('src'), children[2].getAttribute('src')].sort();
    expect(groupA).toEqual(['A1', 'A2']);
    const groupB = [children[4].getAttribute('src'), children[5].getAttribute('src')].sort();
    expect(groupB).toEqual(['B1', 'B2']);
    detachEl(el);
    dispatch('quiz:reset');
  });

  test('extra pairs are hidden initially and shown during practice', () => {
    const el = document.createElement('practice-sentences') as HTMLElement;
    el.innerHTML =
      '<ul><li><em>Normal.</em> - Normális.</li></ul>' +
      '<ul data-extras="true"><li><em>Extra.</em> - Extra.</li></ul>';
    document.body.appendChild(el);
    const extra = el.querySelector<HTMLElement>('practice-pair[data-extra]')!;
    expect(extra).not.toBeNull();
    expect(extra.hidden).toBe(true);
    el.querySelector<HTMLButtonElement>('.psent-start')!.click();
    expect(extra.hidden).toBe(false);
    el.querySelector<HTMLButtonElement>('.psent-reset')!.click();
    expect(extra.hidden).toBe(true);
    detachEl(el);
    dispatch('quiz:reset');
  });

  test('extra pairs shuffle with first group, not as a separate tail section', () => {
    const el = document.createElement('practice-sentences') as HTMLElement;
    el.innerHTML =
      '<practice-pair src="R1" tgt="r1"></practice-pair>' +
      '<practice-pair src="R2" tgt="r2"></practice-pair>' +
      '<p><code>Label</code></p>' +
      '<practice-pair src="L1" tgt="l1"></practice-pair>' +
      '<practice-pair src="E1" tgt="e1" data-extra="true"></practice-pair>' +
      '<practice-pair src="E2" tgt="e2" data-extra="true"></practice-pair>';
    /* Mark extras hidden as the component would after _parseListItems */
    (el.querySelectorAll('[data-extra]') as NodeListOf<HTMLElement>).forEach(p => { p.hidden = true; });
    document.body.appendChild(el);
    el.setAttribute('data-seed', '42');
    el.querySelector<HTMLButtonElement>('.psent-start')!.click();

    const children = Array.from(el.children).filter(c => !c.classList.contains('psent-controls'));
    const labelIdx = children.findIndex(c => c.textContent?.includes('Label'));
    /* Everything before the label must be exactly {R1, R2, E1, E2} in some order. */
    const beforeLabel = children.slice(0, labelIdx).map(c => c.getAttribute('src')).sort();
    expect(beforeLabel).toEqual(['E1', 'E2', 'R1', 'R2']);
    /* Label must be followed immediately by its pair. */
    expect(children[labelIdx + 1]?.getAttribute('src')).toBe('L1');
    detachEl(el);
    dispatch('quiz:reset');
  });

  test('starting with randomize=false preserves original order', () => {
    const cb = wrapper.querySelector<HTMLInputElement>('.psent-randomize')!;
    cb.checked = false;
    wrapper.setAttribute('data-seed', '42');
    const originalSrcs = Array.from(wrapper.querySelectorAll<HTMLElement>('practice-pair'))
      .map(p => p.getAttribute('src'));
    wrapper.querySelector<HTMLButtonElement>('.psent-start')!.click();
    const newSrcs = Array.from(wrapper.querySelectorAll<HTMLElement>('practice-pair'))
      .map(p => p.getAttribute('src'));
    expect(newSrcs).toEqual(originalSrcs);
  });

  test('details closed and status hidden initially', () => {
    expect(wrapper.querySelector<HTMLDetailsElement>('.psent-details')!.open).toBe(false);
    expect(wrapper.querySelector<HTMLElement>('.psent-status')!.hidden).toBe(true);
  });

  test('start activates all child pairs with word blanks', () => {
    wrapper.setAttribute('data-seed', '42');
    wrapper.querySelector<HTMLButtonElement>('.psent-start')!.click();
    const inputs = wrapper.querySelectorAll('.practice-input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  test('after start: details hidden, status visible', () => {
    wrapper.querySelector<HTMLButtonElement>('.psent-start')!.click();
    expect(wrapper.querySelector<HTMLDetailsElement>('.psent-details')!.hidden).toBe(true);
    expect(wrapper.querySelector<HTMLElement>('.psent-status')!.hidden).toBe(false);
  });

  test('reset deactivates all pairs', () => {
    wrapper.querySelector<HTMLButtonElement>('.psent-start')!.click();
    wrapper.querySelector<HTMLButtonElement>('.psent-reset')!.click();
    expect(wrapper.querySelectorAll('.practice-input')).toHaveLength(0);
  });

  test('src direction blanks Spanish side', () => {
    const radio = wrapper.querySelector<HTMLInputElement>('input[value="src"]')!;
    radio.checked = true;
    wrapper.querySelector<HTMLButtonElement>('.psent-start')!.click();
    // The shown side should be Hungarian (tgt), input is in the Spanish (src) side
    expect(wrapper.innerHTML).toContain('Én');
  });

  test('pairs respond to quiz:check after activation', () => {
    wrapper.querySelector<HTMLButtonElement>('.psent-start')!.click();
    wrapper.querySelectorAll<HTMLInputElement>('.practice-input').forEach(i => { i.value = i.dataset.answer!; });
    const results: { correct: number; total: number }[] = [];
    const l = (e: Event) => results.push((e as CustomEvent).detail);
    document.addEventListener('quiz:result', l);
    dispatch('quiz:check');
    document.removeEventListener('quiz:result', l);
    expect(results.every(r => r.correct === r.total)).toBe(true);
  });
});

/* ── quiz-evaluator ────────────────────────────────────────── */

describe('quiz-evaluator', () => {
  let evaluator: HTMLElement;

  beforeEach(() => { evaluator = attachEl('quiz-evaluator'); });
  afterEach(() => { detachEl(evaluator); dispatch('quiz:reset'); });

  test('hidden by default (no active components)', () => {
    expect(evaluator.hidden).toBe(true);
  });

  test('shown when quiz:activity delta=+1 fired', () => {
    dispatch('quiz:activity', { delta: 1 });
    expect(evaluator.hidden).toBe(false);
  });

  test('hidden again when all components deactivate', () => {
    dispatch('quiz:activity', { delta: 1 });
    dispatch('quiz:activity', { delta: 1 });
    dispatch('quiz:activity', { delta: -1 });
    expect(evaluator.hidden).toBe(false);
    dispatch('quiz:activity', { delta: -1 });
    expect(evaluator.hidden).toBe(true);
  });

  test('hidden after quiz:reset', () => {
    dispatch('quiz:activity', { delta: 1 });
    dispatch('quiz:reset');
    expect(evaluator.hidden).toBe(true);
  });

  test('result is inline (span, not paragraph)', () => {
    expect(evaluator.querySelector('span.quiz-evaluator__result')).not.toBeNull();
  });

  test('shows 100% result inline after correct answers', () => {
    const table = attachEl('practice-table', {}, SAMPLE_TABLE);
    dispatch('quiz:start', { percent: 100, seed: 42 });
    table.querySelectorAll<HTMLInputElement>('.practice-input').forEach(i => { i.value = i.dataset.answer!; });
    evaluator.querySelector<HTMLButtonElement>('.quiz-evaluator__check')!.click();
    const res = evaluator.querySelector<HTMLElement>('.quiz-evaluator__result')!;
    expect(res.textContent).toContain('100%');
    detachEl(table);
  });

  test('result cleared when any input is edited after check', () => {
    const table = attachEl('practice-table', {}, SAMPLE_TABLE);
    dispatch('quiz:start', { percent: 100, seed: 42 });
    evaluator.querySelector<HTMLButtonElement>('.quiz-evaluator__check')!.click();
    const res = evaluator.querySelector<HTMLElement>('.quiz-evaluator__result')!;
    expect(res.textContent).not.toBe('');
    dispatch('quiz:answer-changed');
    expect(res.textContent).toBe('');
    detachEl(table);
  });
});
