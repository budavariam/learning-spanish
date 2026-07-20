/**
 * Practice mode web components for conjugation tables and sentence pairs.
 *
 * Components:
 *   <practice-table>     - wraps a conjugation table with per-table controls
 *   <practice-pair>      - src/tgt sentence pair; blanks words on one side
 *   <practice-sentences> - groups practice-pair elements with shared controls
 *   <quiz-evaluator>     - collects quiz:result events and shows aggregate score
 *   <quiz-controls>      - optional page-level start/reset for all tables at once
 *
 * Event bus (document-level CustomEvents):
 *   quiz:start  { percent: number, seed: number }
 *   quiz:reset
 *   quiz:check
 *   quiz:result { correct: number, total: number }
 */

/* ── types ─────────────────────────────────────────────────── */

export type Direction = 'src' | 'tgt';

interface QuizStartDetail { percent: number; seed: number; }
interface QuizResultDetail { correct: number; total: number; }

/* ── utilities ─────────────────────────────────────────────── */

/**
 * Mulberry32 seeded PRNG. Returns a function yielding floats in [0, 1).
 */
export function createRng(seed: number): () => number {
  let s = seed >>> 0;
  return function (): number {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fisher-Yates shuffle. Returns a new array of indices 0..n-1 in random order.
 */
export function shuffleIndices(n: number, rng: () => number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Normalise an answer for comparison: collapse NBSP, trim, lowercase,
 * strip leading ¿/¡ and trailing punctuation so users don't need to type them.
 */
export function normalizeAnswer(text: string): string {
  return text
    .replace(/ /g, ' ')
    .trim()
    .toLowerCase()
    .replace(/^[¡¿]+/, '')
    .replace(/[.,!?;:¡¿]+$/, '');
}

/**
 * Returns true if a <td> cell has blanakable content
 * (not empty, not &nbsp;-only, not a bare dash placeholder).
 */
export function isBlankable(cell: HTMLTableCellElement): boolean {
  const text = cell.textContent?.replace(/ /g, '').trim() ?? '';
  return text !== '' && text !== '-';
}

/**
 * Build the set of cells to blank for a table, using a two-phase algorithm:
 *   1. Guarantee at least one blank per row.
 *   2. Fill additional cells up to the percentage target.
 */
export function selectCellsToBlank(
  rowGroups: HTMLTableCellElement[][],
  percent: number,
  rng: () => number,
): Set<HTMLTableCellElement> {
  const result = new Set<HTMLTableCellElement>();
  if (percent === 0 || rowGroups.length === 0) return result;

  const allCells = rowGroups.flat();
  const targetCount = Math.max(
    Math.round(allCells.length * percent / 100),
    rowGroups.length,
  );

  for (const rowCells of rowGroups) {
    result.add(rowCells[Math.floor(rng() * rowCells.length)]);
  }

  const pool    = allCells.filter(c => !result.has(c));
  const shuffled = shuffleIndices(pool.length, rng);
  const need    = targetCount - result.size;
  for (let i = 0; i < need && i < shuffled.length; i++) {
    result.add(pool[shuffled[i]]);
  }
  return result;
}

/**
 * Split a sentence into word/space tokens, blank `percent`% of words with
 * inline inputs, keep the rest as plain text. Returns an HTML string.
 * At percent=0 returns escaped text; at percent=100 all words are inputs.
 */
export function renderWordBlanks(text: string, percent: number, rng: () => number, lang = ''): string {
  const tokens = text.trim().split(/(\s+)/);
  const wordIdxs = tokens.reduce<number[]>((acc, t, i) => {
    if (t.trim().length > 0) acc.push(i);
    return acc;
  }, []);

  const target  = percent === 0 ? 0 : Math.max(Math.round(wordIdxs.length * percent / 100), 1);
  const shuffled = shuffleIndices(wordIdxs.length, rng);
  const toBlank  = new Set(shuffled.slice(0, target).map(si => wordIdxs[si]));
  const langAttr = lang ? ` lang="${lang}"` : '';

  return tokens.map((token, i) => {
    if (!toBlank.has(i)) {
      return token.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    const w = Math.max(token.length * 0.8, 2).toFixed(1);
    return `<input class="practice-input" type="text"` +
      ` data-answer="${token.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"` +
      ` aria-label="Kitöltendő szó"` +
      `${langAttr} style="width:${w}em" autocomplete="off" spellcheck="false" autocorrect="off" autocapitalize="none">`;
  }).join('');
}

/* ── shared helpers ─────────────────────────────────────────── */

const QUIZ_START          = 'quiz:start';
const QUIZ_RESET          = 'quiz:reset';
const QUIZ_CHECK          = 'quiz:check';
const QUIZ_RESULT         = 'quiz:result';
/** Fired by practice components when they activate (+1) or deactivate (−1). */
const QUIZ_ACTIVITY       = 'quiz:activity';
/** Fired when a user edits any practice input after evaluation. */
const QUIZ_ANSWER_CHANGED = 'quiz:answer-changed';

interface QuizActivityDetail { delta: 1 | -1; }

function dispatchActivity(delta: 1 | -1): void {
  document.dispatchEvent(new CustomEvent<QuizActivityDetail>(QUIZ_ACTIVITY, { detail: { delta } }));
}

function generateSeed(): number {
  return (typeof performance !== 'undefined'
    ? Math.floor(performance.now() * 1000)
    : Date.now()) >>> 0;
}

function applyBlank(cell: HTMLTableCellElement): void {
  const answer = (cell.textContent ?? '').replace(/ /g, ' ').trim();
  const w = Math.max(answer.length * 0.8, 3).toFixed(1);
  const th = cell.closest('table')?.querySelector('thead tr')
    ?.querySelectorAll('th')[cell.cellIndex];
  const lang = th?.getAttribute('lang') ?? '';
  const langAttr = lang ? ` lang="${lang}"` : '';
  cell.innerHTML =
    `<input class="practice-input" type="text"` +
    ` data-answer="${answer.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"` +
    ` aria-label="Kitöltendő"` +
    `${langAttr} style="width:${w}em" autocomplete="off" spellcheck="false" autocorrect="off" autocapitalize="none">`;
}

function checkInputs(container: HTMLElement): void {
  const inputs = container.querySelectorAll<HTMLInputElement>('.practice-input');
  let correct = 0;
  inputs.forEach(input => {
    const ok = normalizeAnswer(input.value) === normalizeAnswer(input.dataset.answer ?? '');
    input.classList.toggle('practice-input--correct', ok);
    input.classList.toggle('practice-input--wrong',   !ok);
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (!ok) {
      input.setAttribute('aria-label', `Helytelen - helyes: ${input.dataset.answer ?? ''}`);
      /* Remember the exact wrong value so we can re-highlight it on re-type. */
      input.dataset.checkedValue = input.value;
    } else {
      delete input.dataset.checkedValue;
    }
    if (ok) correct++;

    /* Wire the post-evaluation listener exactly once per input lifetime.
       After any edit: go gray; if the user re-types the same wrong answer, go red. */
    if (!input.dataset.listenerAttached) {
      input.dataset.listenerAttached = '1';
      input.addEventListener('input', () => {
        document.dispatchEvent(new CustomEvent(QUIZ_ANSWER_CHANGED));
        const isRepeatWrong =
          'checkedValue' in input.dataset && input.value === input.dataset.checkedValue;
        input.classList.toggle('practice-input--wrong', isRepeatWrong);
        input.classList.remove('practice-input--correct');
        if (isRepeatWrong) {
          input.setAttribute('aria-invalid', 'true');
        } else {
          input.removeAttribute('aria-invalid');
          input.setAttribute('aria-label', 'Kitöltendő');
        }
      });
    }
  });
  document.dispatchEvent(new CustomEvent<QuizResultDetail>(QUIZ_RESULT, {
    detail: { correct, total: inputs.length },
  }));
}

/* ── practice-table ─────────────────────────────────────────── */

class PracticeTable extends HTMLElement {
  private _originalTableHTML = '';
  private _isActive = false;
  private _handlers: {
    start: (e: Event) => void;
    reset: () => void;
    check: () => void;
  } | null = null;

  connectedCallback(): void {
    this._originalTableHTML = this.innerHTML;
    this._renderLayout();

    this._handlers = {
      start:  (e) => {
        const d = (e as CustomEvent<QuizStartDetail>).detail;
        this._activate(d.percent, d.seed);
        this._setActiveState(true, d.percent);
      },
      reset:  () => { this._deactivate(); this._setActiveState(false); },
      check:  () => checkInputs(this),
    };
    document.addEventListener(QUIZ_START, this._handlers.start);
    document.addEventListener(QUIZ_RESET, this._handlers.reset);
    document.addEventListener(QUIZ_CHECK, this._handlers.check);
  }

  disconnectedCallback(): void {
    if (!this._handlers) return;
    document.removeEventListener(QUIZ_START, this._handlers.start);
    document.removeEventListener(QUIZ_RESET, this._handlers.reset);
    document.removeEventListener(QUIZ_CHECK, this._handlers.check);
  }

  private _renderLayout(): void {
    const pct = parseInt(this.getAttribute('percent') ?? '50', 10);
    this.innerHTML =
      `<div class="ptable-content">${this._originalTableHTML}</div>` +
      `<div class="ptable-controls">` +
        `<details class="ptable-details">` +
          `<summary class="ptable-summary">✏ Önellenőrzés</summary>` +
          `<div class="ptable-panel">` +
            `<label class="ptable-label">` +
              `Erősség: <input class="ptable-slider" type="range" min="0" max="100" value="${pct}" aria-label="Erősség">` +
              `<output class="ptable-output">${pct}</output>%` +
            `</label>` +
            `<button class="ptable-start">▶ Indítás</button>` +
          `</div>` +
        `</details>` +
        `<div class="ptable-status" hidden aria-live="polite">` +
          `<span class="ptable-status-label">✏ <span class="ptable-percent">${pct}</span>%</span>` +
          `<button class="ptable-reset">↺ Visszaállítás</button>` +
        `</div>` +
      `</div>`;

    const slider = this.querySelector<HTMLInputElement>('.ptable-slider')!;
    const output = this.querySelector<HTMLOutputElement>('.ptable-output')!;
    const start  = this.querySelector<HTMLButtonElement>('.ptable-start')!;
    const reset  = this.querySelector<HTMLButtonElement>('.ptable-reset')!;

    slider.addEventListener('input', () => { output.value = slider.value; });

    start.addEventListener('click', () => {
      const percent = parseInt(slider.value, 10);
      const seed    = this._getSeed();
      this._activate(percent, seed);
      this._setActiveState(true, percent);
    });

    reset.addEventListener('click', () => {
      this._deactivate();
      this._setActiveState(false);
    });
  }

  private _getSeed(): number {
    const attr = this.getAttribute('data-seed');
    return attr !== null ? parseInt(attr, 10) : generateSeed();
  }

  private _setActiveState(active: boolean, percent?: number): void {
    if (active !== this._isActive) {
      this._isActive = active;
      dispatchActivity(active ? 1 : -1);
    }
    const details   = this.querySelector<HTMLDetailsElement>('.ptable-details');
    const status    = this.querySelector<HTMLElement>('.ptable-status');
    const percentEl = this.querySelector<HTMLElement>('.ptable-percent');

    if (active) {
      if (details) { details.open = false; details.hidden = true; }
      if (status)  status.hidden  = false;
      if (percentEl && percent !== undefined) percentEl.textContent = String(percent);
    } else {
      if (details) details.hidden = false;
      if (status)  status.hidden  = true;
    }
  }

  private _activate(percent: number, seed: number): void {
    const content = this.querySelector<HTMLElement>('.ptable-content')!;
    content.innerHTML = this._originalTableHTML;

    const rng = createRng(seed);
    const rowGroups = Array.from(content.querySelectorAll<HTMLTableRowElement>('tr'))
      .map(row =>
        Array.from(row.querySelectorAll<HTMLTableCellElement>('td'))
          .filter(cell => cell.cellIndex !== 0 && isBlankable(cell))
      )
      .filter(cells => cells.length > 0);

    const toBlank = selectCellsToBlank(rowGroups, percent, rng);
    toBlank.forEach(applyBlank);
  }

  private _deactivate(): void {
    const content = this.querySelector<HTMLElement>('.ptable-content');
    if (content) content.innerHTML = this._originalTableHTML;
  }
}

/* ── practice-pair ──────────────────────────────────────────── */

class PracticePair extends HTMLElement {
  private _handlers: {
    start: (e: Event) => void;
    reset: () => void;
    check: () => void;
  } | null = null;

  connectedCallback(): void {
    this._renderNormal();
    this._handlers = {
      start: (e) => {
        const d = (e as CustomEvent<QuizStartDetail>).detail;
        this.activate(d.percent, (this.getAttribute('direction') as Direction) ?? 'tgt', d.seed);
      },
      reset: () => this._renderNormal(),
      check: () => checkInputs(this),
    };
    document.addEventListener(QUIZ_START, this._handlers.start);
    document.addEventListener(QUIZ_RESET, this._handlers.reset);
    document.addEventListener(QUIZ_CHECK, this._handlers.check);
  }

  disconnectedCallback(): void {
    if (!this._handlers) return;
    document.removeEventListener(QUIZ_START, this._handlers.start);
    document.removeEventListener(QUIZ_RESET, this._handlers.reset);
    document.removeEventListener(QUIZ_CHECK, this._handlers.check);
  }

  private _renderNormal(): void {
    const src = this.getAttribute('src') ?? '';
    const tgt = this.getAttribute('tgt') ?? '';
    this.innerHTML = `<span class="practice-pair"><em>${src}</em> - ${tgt}</span>`;
  }

  /** Activate practice mode: blank `percent`% of words on the `direction` side. */
  activate(percent: number, direction: Direction = 'tgt', seed = 0): void {
    const src     = this.getAttribute('src') ?? '';
    const tgt     = this.getAttribute('tgt') ?? '';
    const shown   = direction === 'tgt' ? src : tgt;
    const blanked = direction === 'tgt' ? tgt : src;
    const lang    = direction === 'tgt' ? 'hu' : 'es';
    const rng     = createRng(seed >>> 0);
    this.innerHTML =
      `<span class="practice-pair practice-pair--active">` +
        `<em>${shown}</em> - ` +
        renderWordBlanks(blanked, percent, rng, lang) +
      `</span>`;
  }

  deactivate(): void { this._renderNormal(); }
}

/* ── practice-sentences ─────────────────────────────────────── */

let _psGroupCounter = 0;

class PracticeSentences extends HTMLElement {
  private _id = 0;
  private _isActive = false;
  private _originalOrder: PracticePair[] = [];
  /** All content children (pairs + labels + other elements) in original order. */
  private _allContent: HTMLElement[] = [];

  connectedCallback(): void {
    this._id = ++_psGroupCounter;
    this._parseListItems();
    /* Capture ALL content in original order BEFORE appending controls. */
    this._allContent = Array.from(this.children) as HTMLElement[];
    this._originalOrder = this._allContent.filter(
      el => el.tagName === 'PRACTICE-PAIR',
    ) as PracticePair[];
    const pct = 50;
    const uid = String(this._id);

    const ctrl = document.createElement('div');
    ctrl.className = 'psent-controls';
    ctrl.innerHTML =
      `<details class="psent-details">` +
        `<summary class="psent-summary">✏ Önellenőrzés</summary>` +
        `<div class="psent-panel">` +
          `<label class="psent-check-label">` +
            `<input type="checkbox" class="psent-randomize" checked>` +
            `Véletlenszerű sorrend` +
          `</label>` +
          `<div class="psent-direction" role="radiogroup" aria-label="Gyakorlás iránya">` +
            `<label><input type="radio" name="psent-dir-${uid}" value="tgt" checked> Spanyol → Magyar</label>` +
            `<label><input type="radio" name="psent-dir-${uid}" value="src"> Magyar → Spanyol</label>` +
          `</div>` +
          `<label class="psent-label">` +
            `Erősség: <input class="psent-slider" type="range" min="0" max="100" value="${pct}">` +
            `<output class="psent-output">${pct}</output>%` +
          `</label>` +
          `<button class="psent-start">▶ Indítás</button>` +
        `</div>` +
      `</details>` +
      `<div class="psent-status" hidden aria-live="polite">` +
        `<span class="psent-status-label">✏ aktív</span>` +
        `<button class="psent-reset">↺ Visszaállítás</button>` +
      `</div>`;
    this.append(ctrl);

    const slider    = ctrl.querySelector<HTMLInputElement>('.psent-slider')!;
    const output    = ctrl.querySelector<HTMLOutputElement>('.psent-output')!;
    const randomize = ctrl.querySelector<HTMLInputElement>('.psent-randomize')!;

    slider.addEventListener('input', () => { output.value = slider.value; });

    ctrl.querySelector<HTMLButtonElement>('.psent-start')!.addEventListener('click', () => {
      const percent   = parseInt(slider.value, 10);
      const direction = (ctrl.querySelector<HTMLInputElement>(`input[name="psent-dir-${uid}"]:checked`)?.value ?? 'tgt') as Direction;
      const baseSeed  = this._getSeed();
      if (randomize.checked) {
        this._shuffleOrder(baseSeed);
      } else {
        this._restoreOrder();
      }
      this._pairs().forEach((p, i) => {
        /* Show extra sentences during practice. */
        if (p.dataset['extra'] === 'true') p.hidden = false;
        const pairSeed = (baseSeed + i * 0x1000) >>> 0;
        p.activate(percent, direction, pairSeed);
      });
      this._setActive(true, percent, direction);
    });

    ctrl.querySelector<HTMLButtonElement>('.psent-reset')!.addEventListener('click', () => {
      this._restoreOrder();
      this._pairs().forEach(p => {
        p.deactivate();
        /* Re-hide extra sentences after reset. */
        if (p.dataset['extra'] === 'true') p.hidden = true;
      });
      this._setActive(false);
    });
  }

  /**
   * Convert any <li><em>src</em> [-/-] tgt</li> children into
   * <practice-pair src="…" tgt="…"> elements, preserving document order.
   * Lists with data-extras="true" produce pairs marked as extras (hidden until practice).
   * Non-matching list items and other elements are left untouched.
   */
  private _parseListItems(): void {
    const lists = Array.from(this.querySelectorAll<HTMLElement>('ul, ol'));
    lists.forEach(list => {
      const parent  = list.parentNode;
      if (!parent) return;
      const isExtra = list.hasAttribute('data-extras');
      const items   = Array.from(list.querySelectorAll<HTMLLIElement>(':scope > li'));
      items.forEach(li => {
        const em = li.querySelector<HTMLElement>('em');
        if (!em) return;
        const src = (em.textContent ?? '').trim();
        let raw = '';
        let node: ChildNode | null = em.nextSibling;
        while (node) { raw += node.textContent ?? ''; node = node.nextSibling; }
        const tgt = raw.replace(/^\s*[-—\-]\s*/, '').trim();
        if (!src || !tgt) return;
        const pair = document.createElement('practice-pair') as PracticePair;
        pair.setAttribute('src', src);
        pair.setAttribute('tgt', tgt);
        if (isExtra) {
          pair.dataset['extra'] = 'true';
          pair.hidden = true;
        }
        parent.insertBefore(pair, list);
        li.remove();
      });
      if (list.children.length === 0) list.remove();
    });
  }

  private _pairs(): PracticePair[] {
    return Array.from(this.querySelectorAll<PracticePair>('practice-pair'));
  }

  private _getSeed(): number {
    const attr = this.getAttribute('data-seed');
    return attr !== null ? parseInt(attr, 10) : generateSeed();
  }

  /**
   * Build groups of elements for intra-group shuffling.
   * Each group is: [label (optional), ...practice-pairs].
   * Sentences within a group shuffle; groups themselves stay in original order.
   * Extra pairs (data-extra="true") are merged into the first group so they
   * shuffle together with the main sentences, not as a separate tail section.
   */
  private _buildGroups(): { label: HTMLElement | null; pairs: PracticePair[] }[] {
    const groups: { label: HTMLElement | null; pairs: PracticePair[] }[] = [];
    let currentLabel: HTMLElement | null = null;
    let currentPairs: PracticePair[] = [];

    for (const el of this._allContent) {
      /* Skip extra pairs here; they are merged into the first group below. */
      if (el.tagName === 'PRACTICE-PAIR' && (el as PracticePair).dataset['extra'] === 'true') continue;

      if (el.tagName === 'PRACTICE-PAIR') {
        currentPairs.push(el as PracticePair);
      } else {
        if (currentPairs.length > 0) {
          groups.push({ label: currentLabel, pairs: currentPairs });
          currentLabel = null;
          currentPairs = [];
        }
        currentLabel = el;
      }
    }
    if (currentPairs.length > 0) groups.push({ label: currentLabel, pairs: currentPairs });

    /* Append extra pairs to the first group (or create a first group if empty). */
    const extraPairs = this._allContent.filter(
      el => el.tagName === 'PRACTICE-PAIR' && (el as PracticePair).dataset['extra'] === 'true',
    ) as PracticePair[];

    if (extraPairs.length > 0) {
      if (groups.length > 0) {
        groups[0].pairs.push(...extraPairs);
      } else {
        groups.push({ label: null, pairs: extraPairs });
      }
    }

    return groups;
  }

  /** Shuffle sentences within each labeled/unlabeled group independently. */
  private _shuffleOrder(seed: number): void {
    const ctrl   = this.querySelector('.psent-controls')!;
    const groups = this._buildGroups();
    let rng      = createRng(seed);

    groups.forEach(group => {
      /* Insert label first (if any), then shuffled pairs. */
      if (group.label) this.insertBefore(group.label, ctrl);
      shuffleIndices(group.pairs.length, rng).forEach(i => this.insertBefore(group.pairs[i], ctrl));
      /* Advance the RNG state between groups so each group gets a distinct shuffle. */
      rng = createRng((rng() * 0xFFFFFFFF) >>> 0);
    });
  }

  /** Restore all content to original document order. */
  private _restoreOrder(): void {
    const ctrl = this.querySelector('.psent-controls')!;
    this._allContent.forEach(el => this.insertBefore(el, ctrl));
  }

  private _setActive(on: boolean, percent?: number, direction?: Direction): void {
    if (on !== this._isActive) {
      this._isActive = on;
      dispatchActivity(on ? 1 : -1);
    }
    const det   = this.querySelector<HTMLDetailsElement>('.psent-details');
    const sta   = this.querySelector<HTMLElement>('.psent-status');
    const label = this.querySelector<HTMLElement>('.psent-status-label');
    if (on) {
      if (det) { det.open = false; det.hidden = true; }
      if (sta) sta.hidden = false;
      if (label && percent !== undefined) {
        const dirLabel = direction === 'src' ? '← Magyar' : 'Magyar →';
        label.textContent = `✏ aktív · ${percent}% · ${dirLabel}`;
      }
    } else {
      if (det) det.hidden = false;
      if (sta) sta.hidden = true;
    }
  }
}

/* ── quiz-evaluator ─────────────────────────────────────────── */

class QuizEvaluator extends HTMLElement {
  private _activeCount = 0;
  private _evHandlers: {
    activity: (e: Event) => void;
    reset: () => void;
    answerChanged: () => void;
  } | null = null;

  connectedCallback(): void {
    this.hidden = true;
    this._render();
    this._evHandlers = {
      activity: (e) => {
        const d = (e as CustomEvent<QuizActivityDetail>).detail;
        this._activeCount = Math.max(0, this._activeCount + d.delta);
        this._syncVisibility();
      },
      reset: () => {
        this._activeCount = 0;
        this._syncVisibility();
      },
      answerChanged: () => {
        const res = this.querySelector<HTMLElement>('.quiz-evaluator__result');
        if (res) res.textContent = '';
      },
    };
    document.addEventListener(QUIZ_ACTIVITY,       this._evHandlers.activity);
    document.addEventListener(QUIZ_RESET,          this._evHandlers.reset);
    document.addEventListener(QUIZ_ANSWER_CHANGED, this._evHandlers.answerChanged);
  }

  disconnectedCallback(): void {
    if (!this._evHandlers) return;
    document.removeEventListener(QUIZ_ACTIVITY,       this._evHandlers.activity);
    document.removeEventListener(QUIZ_RESET,          this._evHandlers.reset);
    document.removeEventListener(QUIZ_ANSWER_CHANGED, this._evHandlers.answerChanged);
  }

  private _syncVisibility(): void {
    this.hidden = this._activeCount === 0;
    if (this._activeCount === 0) {
      const res = this.querySelector<HTMLElement>('.quiz-evaluator__result');
      if (res) res.textContent = '';
    }
  }

  private _render(): void {
    this.innerHTML =
      `<div class="quiz-evaluator">` +
        `<hr class="quiz-evaluator__separator">` +
        `<div class="quiz-evaluator__row">` +
          `<button class="quiz-evaluator__check">✓ Pontozás</button>` +
          `<span class="quiz-evaluator__result" aria-live="polite"></span>` +
        `</div>` +
      `</div>`;
    this.querySelector('.quiz-evaluator__check')!.addEventListener('click', () => {
      this._evaluate();
    });
  }

  private _evaluate(): void {
    let totalCorrect   = 0;
    let totalQuestions = 0;
    const onResult = (e: Event): void => {
      const d = (e as CustomEvent<QuizResultDetail>).detail;
      totalCorrect   += d.correct;
      totalQuestions += d.total;
    };
    document.addEventListener(QUIZ_RESULT, onResult);
    document.dispatchEvent(new CustomEvent(QUIZ_CHECK));
    document.removeEventListener(QUIZ_RESULT, onResult);

    const res = this.querySelector<HTMLElement>('.quiz-evaluator__result');
    if (res) {
      const pct = totalQuestions > 0 ? Math.round(totalCorrect / totalQuestions * 100) : 0;
      res.textContent = `Eredmény: ${totalCorrect} / ${totalQuestions} (${pct}%)`;
    }
  }
}

/* ── quiz-controls (optional page-level global control) ──────── */

class QuizControls extends HTMLElement {
  connectedCallback(): void {
    this._render();
  }

  private _render(): void {
    const defaultPercent = parseInt(this.getAttribute('percent') ?? '50', 10);
    this.innerHTML =
      `<div class="quiz-controls">` +
        `<details class="quiz-controls__details">` +
          `<summary class="quiz-controls__summary">✏ Önellenőrzés (összes)</summary>` +
          `<div class="quiz-controls__panel">` +
            `<label class="quiz-controls__label">` +
              `Erősség: <input class="quiz-controls__slider" type="range" min="0" max="100" value="${defaultPercent}" aria-label="Erősség">` +
              `<output class="quiz-controls__output">${defaultPercent}</output>%` +
            `</label>` +
            `<div class="quiz-controls__buttons">` +
              `<button class="quiz-controls__start">▶ Indítás</button>` +
              `<button class="quiz-controls__reset" hidden>↺ Visszaállítás</button>` +
            `</div>` +
          `</div>` +
        `</details>` +
      `</div>`;

    const details   = this.querySelector<HTMLDetailsElement>('.quiz-controls__details')!;
    const slider    = this.querySelector<HTMLInputElement>('.quiz-controls__slider')!;
    const output    = this.querySelector<HTMLOutputElement>('.quiz-controls__output')!;
    const startBtn  = this.querySelector<HTMLButtonElement>('.quiz-controls__start')!;
    const resetBtn  = this.querySelector<HTMLButtonElement>('.quiz-controls__reset')!;

    slider.addEventListener('input', () => { output.value = slider.value; });

    startBtn.addEventListener('click', () => {
      const percent = parseInt(slider.value, 10);
      const seed = generateSeed();
      document.dispatchEvent(new CustomEvent<QuizStartDetail>(QUIZ_START, { detail: { percent, seed } }));
      details.open = false;
      startBtn.hidden = true;
      resetBtn.hidden = false;
    });

    resetBtn.addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent(QUIZ_RESET));
      startBtn.hidden = false;
      resetBtn.hidden = true;
    });
  }
}

/* ── registration ────────────────────────────────────────────── */

if (typeof customElements !== 'undefined') {
  customElements.define('quiz-controls',       QuizControls);
  customElements.define('practice-table',      PracticeTable);
  customElements.define('practice-pair',       PracticePair);
  customElements.define('practice-sentences',  PracticeSentences);
  customElements.define('quiz-evaluator',      QuizEvaluator);
}
