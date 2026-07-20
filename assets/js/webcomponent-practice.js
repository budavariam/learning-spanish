"use strict";
(() => {
  // src/webcomponent-practice.ts
  function createRng(seed) {
    let s = seed >>> 0;
    return function() {
      s = s + 1831565813 >>> 0;
      let t = Math.imul(s ^ s >>> 15, 1 | s);
      t = Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function shuffleIndices(n, rng) {
    const arr = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  function normalizeAnswer(text) {
    return text.replace(/ /g, " ").trim().toLowerCase().replace(/^[¡¿]+/, "").replace(/[.,!?;:¡¿]+$/, "");
  }
  function isBlankable(cell) {
    var _a, _b;
    const text = (_b = (_a = cell.textContent) == null ? void 0 : _a.replace(/ /g, "").trim()) != null ? _b : "";
    return text !== "" && text !== "-";
  }
  function selectCellsToBlank(rowGroups, percent, rng) {
    const result = /* @__PURE__ */ new Set();
    if (percent === 0 || rowGroups.length === 0) return result;
    const allCells = rowGroups.flat();
    const targetCount = Math.max(
      Math.round(allCells.length * percent / 100),
      rowGroups.length
    );
    for (const rowCells of rowGroups) {
      result.add(rowCells[Math.floor(rng() * rowCells.length)]);
    }
    const pool = allCells.filter((c) => !result.has(c));
    const shuffled = shuffleIndices(pool.length, rng);
    const need = targetCount - result.size;
    for (let i = 0; i < need && i < shuffled.length; i++) {
      result.add(pool[shuffled[i]]);
    }
    return result;
  }
  function renderWordBlanks(text, percent, rng, lang = "") {
    const tokens = text.trim().split(/(\s+)/);
    const wordIdxs = tokens.reduce((acc, t, i) => {
      if (t.trim().length > 0) acc.push(i);
      return acc;
    }, []);
    const target = percent === 0 ? 0 : Math.max(Math.round(wordIdxs.length * percent / 100), 1);
    const shuffled = shuffleIndices(wordIdxs.length, rng);
    const toBlank = new Set(shuffled.slice(0, target).map((si) => wordIdxs[si]));
    const langAttr = lang ? ` lang="${lang}"` : "";
    return tokens.map((token, i) => {
      if (!toBlank.has(i)) {
        return token.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      }
      const w = Math.max(token.length * 0.8, 2).toFixed(1);
      return `<input class="practice-input" type="text" data-answer="${token.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}" aria-label="Kit\xF6ltend\u0151 sz\xF3"${langAttr} style="width:${w}em" autocomplete="off" spellcheck="false" autocorrect="off" autocapitalize="none">`;
    }).join("");
  }
  var QUIZ_START = "quiz:start";
  var QUIZ_RESET = "quiz:reset";
  var QUIZ_CHECK = "quiz:check";
  var QUIZ_RESULT = "quiz:result";
  var QUIZ_ACTIVITY = "quiz:activity";
  var QUIZ_ANSWER_CHANGED = "quiz:answer-changed";
  function dispatchActivity(delta) {
    document.dispatchEvent(new CustomEvent(QUIZ_ACTIVITY, { detail: { delta } }));
  }
  function generateSeed() {
    return (typeof performance !== "undefined" ? Math.floor(performance.now() * 1e3) : Date.now()) >>> 0;
  }
  function applyBlank(cell) {
    var _a, _b, _c, _d;
    const answer = ((_a = cell.textContent) != null ? _a : "").replace(/ /g, " ").trim();
    const w = Math.max(answer.length * 0.8, 3).toFixed(1);
    const th = (_c = (_b = cell.closest("table")) == null ? void 0 : _b.querySelector("thead tr")) == null ? void 0 : _c.querySelectorAll("th")[cell.cellIndex];
    const lang = (_d = th == null ? void 0 : th.getAttribute("lang")) != null ? _d : "";
    const langAttr = lang ? ` lang="${lang}"` : "";
    cell.innerHTML = `<input class="practice-input" type="text" data-answer="${answer.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}" aria-label="Kit\xF6ltend\u0151"${langAttr} style="width:${w}em" autocomplete="off" spellcheck="false" autocorrect="off" autocapitalize="none">`;
  }
  function checkInputs(container) {
    const inputs = container.querySelectorAll(".practice-input");
    let correct = 0;
    inputs.forEach((input) => {
      var _a, _b;
      const ok = normalizeAnswer(input.value) === normalizeAnswer((_a = input.dataset.answer) != null ? _a : "");
      input.classList.toggle("practice-input--correct", ok);
      input.classList.toggle("practice-input--wrong", !ok);
      input.setAttribute("aria-invalid", ok ? "false" : "true");
      if (!ok) {
        input.setAttribute("aria-label", `Helytelen - helyes: ${(_b = input.dataset.answer) != null ? _b : ""}`);
        input.dataset.checkedValue = input.value;
      } else {
        delete input.dataset.checkedValue;
      }
      if (ok) correct++;
      if (!input.dataset.listenerAttached) {
        input.dataset.listenerAttached = "1";
        input.addEventListener("input", () => {
          document.dispatchEvent(new CustomEvent(QUIZ_ANSWER_CHANGED));
          const isRepeatWrong = "checkedValue" in input.dataset && input.value === input.dataset.checkedValue;
          input.classList.toggle("practice-input--wrong", isRepeatWrong);
          input.classList.remove("practice-input--correct");
          if (isRepeatWrong) {
            input.setAttribute("aria-invalid", "true");
          } else {
            input.removeAttribute("aria-invalid");
            input.setAttribute("aria-label", "Kit\xF6ltend\u0151");
          }
        });
      }
    });
    document.dispatchEvent(new CustomEvent(QUIZ_RESULT, {
      detail: { correct, total: inputs.length }
    }));
  }
  var PracticeTable = class extends HTMLElement {
    constructor() {
      super(...arguments);
      this._originalTableHTML = "";
      this._isActive = false;
      this._handlers = null;
    }
    connectedCallback() {
      this._originalTableHTML = this.innerHTML;
      this._renderLayout();
      this._handlers = {
        start: (e) => {
          const d = e.detail;
          this._activate(d.percent, d.seed);
          this._setActiveState(true, d.percent);
        },
        reset: () => {
          this._deactivate();
          this._setActiveState(false);
        },
        check: () => checkInputs(this)
      };
      document.addEventListener(QUIZ_START, this._handlers.start);
      document.addEventListener(QUIZ_RESET, this._handlers.reset);
      document.addEventListener(QUIZ_CHECK, this._handlers.check);
    }
    disconnectedCallback() {
      if (!this._handlers) return;
      document.removeEventListener(QUIZ_START, this._handlers.start);
      document.removeEventListener(QUIZ_RESET, this._handlers.reset);
      document.removeEventListener(QUIZ_CHECK, this._handlers.check);
    }
    _renderLayout() {
      var _a;
      const pct = parseInt((_a = this.getAttribute("percent")) != null ? _a : "50", 10);
      this.innerHTML = `<div class="ptable-content">${this._originalTableHTML}</div><div class="ptable-controls"><details class="ptable-details"><summary class="ptable-summary">\u270F \xD6nellen\u0151rz\xE9s</summary><div class="ptable-panel"><label class="ptable-label">Er\u0151ss\xE9g: <input class="ptable-slider" type="range" min="0" max="100" value="${pct}" aria-label="Er\u0151ss\xE9g"><output class="ptable-output">${pct}</output>%</label><button class="ptable-start">\u25B6 Ind\xEDt\xE1s</button></div></details><div class="ptable-status" hidden aria-live="polite"><span class="ptable-status-label">\u270F <span class="ptable-percent">${pct}</span>%</span><button class="ptable-reset">\u21BA Vissza\xE1ll\xEDt\xE1s</button></div></div>`;
      const slider = this.querySelector(".ptable-slider");
      const output = this.querySelector(".ptable-output");
      const start = this.querySelector(".ptable-start");
      const reset = this.querySelector(".ptable-reset");
      slider.addEventListener("input", () => {
        output.value = slider.value;
      });
      start.addEventListener("click", () => {
        const percent = parseInt(slider.value, 10);
        const seed = this._getSeed();
        this._activate(percent, seed);
        this._setActiveState(true, percent);
      });
      reset.addEventListener("click", () => {
        this._deactivate();
        this._setActiveState(false);
      });
    }
    _getSeed() {
      const attr = this.getAttribute("data-seed");
      return attr !== null ? parseInt(attr, 10) : generateSeed();
    }
    _setActiveState(active, percent) {
      if (active !== this._isActive) {
        this._isActive = active;
        dispatchActivity(active ? 1 : -1);
      }
      const details = this.querySelector(".ptable-details");
      const status = this.querySelector(".ptable-status");
      const percentEl = this.querySelector(".ptable-percent");
      if (active) {
        if (details) {
          details.open = false;
          details.hidden = true;
        }
        if (status) status.hidden = false;
        if (percentEl && percent !== void 0) percentEl.textContent = String(percent);
      } else {
        if (details) details.hidden = false;
        if (status) status.hidden = true;
      }
    }
    _activate(percent, seed) {
      const content = this.querySelector(".ptable-content");
      content.innerHTML = this._originalTableHTML;
      const rng = createRng(seed);
      const rowGroups = Array.from(content.querySelectorAll("tr")).map(
        (row) => Array.from(row.querySelectorAll("td")).filter((cell) => cell.cellIndex !== 0 && isBlankable(cell))
      ).filter((cells) => cells.length > 0);
      const toBlank = selectCellsToBlank(rowGroups, percent, rng);
      toBlank.forEach(applyBlank);
    }
    _deactivate() {
      const content = this.querySelector(".ptable-content");
      if (content) content.innerHTML = this._originalTableHTML;
    }
  };
  var PracticePair = class extends HTMLElement {
    constructor() {
      super(...arguments);
      this._handlers = null;
    }
    connectedCallback() {
      this._renderNormal();
      this._handlers = {
        start: (e) => {
          var _a;
          const d = e.detail;
          this.activate(d.percent, (_a = this.getAttribute("direction")) != null ? _a : "tgt", d.seed);
        },
        reset: () => this._renderNormal(),
        check: () => checkInputs(this)
      };
      document.addEventListener(QUIZ_START, this._handlers.start);
      document.addEventListener(QUIZ_RESET, this._handlers.reset);
      document.addEventListener(QUIZ_CHECK, this._handlers.check);
    }
    disconnectedCallback() {
      if (!this._handlers) return;
      document.removeEventListener(QUIZ_START, this._handlers.start);
      document.removeEventListener(QUIZ_RESET, this._handlers.reset);
      document.removeEventListener(QUIZ_CHECK, this._handlers.check);
    }
    _renderNormal() {
      var _a, _b;
      const src = (_a = this.getAttribute("src")) != null ? _a : "";
      const tgt = (_b = this.getAttribute("tgt")) != null ? _b : "";
      this.innerHTML = `<span class="practice-pair"><em>${src}</em> - ${tgt}</span>`;
    }
    /** Activate practice mode: blank `percent`% of words on the `direction` side. */
    activate(percent, direction = "tgt", seed = 0) {
      var _a, _b;
      const src = (_a = this.getAttribute("src")) != null ? _a : "";
      const tgt = (_b = this.getAttribute("tgt")) != null ? _b : "";
      const shown = direction === "tgt" ? src : tgt;
      const blanked = direction === "tgt" ? tgt : src;
      const lang = direction === "tgt" ? "hu" : "es";
      const rng = createRng(seed >>> 0);
      this.innerHTML = `<span class="practice-pair practice-pair--active"><em>${shown}</em> - ` + renderWordBlanks(blanked, percent, rng, lang) + `</span>`;
    }
    deactivate() {
      this._renderNormal();
    }
  };
  var _psGroupCounter = 0;
  var PracticeSentences = class extends HTMLElement {
    constructor() {
      super(...arguments);
      this._id = 0;
      this._isActive = false;
      this._originalOrder = [];
      /** All content children (pairs + labels + other elements) in original order. */
      this._allContent = [];
    }
    connectedCallback() {
      this._id = ++_psGroupCounter;
      this._parseListItems();
      this._allContent = Array.from(this.children);
      this._originalOrder = this._allContent.filter(
        (el) => el.tagName === "PRACTICE-PAIR"
      );
      const pct = 50;
      const uid = String(this._id);
      const ctrl = document.createElement("div");
      ctrl.className = "psent-controls";
      ctrl.innerHTML = `<details class="psent-details"><summary class="psent-summary">\u270F \xD6nellen\u0151rz\xE9s</summary><div class="psent-panel"><label class="psent-check-label"><input type="checkbox" class="psent-randomize" checked>V\xE9letlenszer\u0171 sorrend</label><div class="psent-direction" role="radiogroup" aria-label="Gyakorl\xE1s ir\xE1nya"><label><input type="radio" name="psent-dir-${uid}" value="tgt" checked> Spanyol \u2192 Magyar</label><label><input type="radio" name="psent-dir-${uid}" value="src"> Magyar \u2192 Spanyol</label></div><label class="psent-label">Er\u0151ss\xE9g: <input class="psent-slider" type="range" min="0" max="100" value="${pct}"><output class="psent-output">${pct}</output>%</label><button class="psent-start">\u25B6 Ind\xEDt\xE1s</button></div></details><div class="psent-status" hidden aria-live="polite"><span class="psent-status-label">\u270F akt\xEDv</span><button class="psent-reset">\u21BA Vissza\xE1ll\xEDt\xE1s</button></div>`;
      this.append(ctrl);
      const slider = ctrl.querySelector(".psent-slider");
      const output = ctrl.querySelector(".psent-output");
      const randomize = ctrl.querySelector(".psent-randomize");
      slider.addEventListener("input", () => {
        output.value = slider.value;
      });
      ctrl.querySelector(".psent-start").addEventListener("click", () => {
        var _a, _b;
        const percent = parseInt(slider.value, 10);
        const direction = (_b = (_a = ctrl.querySelector(`input[name="psent-dir-${uid}"]:checked`)) == null ? void 0 : _a.value) != null ? _b : "tgt";
        const baseSeed = this._getSeed();
        if (randomize.checked) {
          this._shuffleOrder(baseSeed);
        } else {
          this._restoreOrder();
        }
        this._pairs().forEach((p, i) => {
          if (p.dataset["extra"] === "true") p.hidden = false;
          const pairSeed = baseSeed + i * 4096 >>> 0;
          p.activate(percent, direction, pairSeed);
        });
        this._setActive(true, percent, direction);
      });
      ctrl.querySelector(".psent-reset").addEventListener("click", () => {
        this._restoreOrder();
        this._pairs().forEach((p) => {
          p.deactivate();
          if (p.dataset["extra"] === "true") p.hidden = true;
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
    _parseListItems() {
      const lists = Array.from(this.querySelectorAll("ul, ol"));
      lists.forEach((list) => {
        const parent = list.parentNode;
        if (!parent) return;
        const isExtra = list.hasAttribute("data-extras");
        const items = Array.from(list.querySelectorAll(":scope > li"));
        items.forEach((li) => {
          var _a, _b;
          const em = li.querySelector("em");
          if (!em) return;
          const src = ((_a = em.textContent) != null ? _a : "").trim();
          let raw = "";
          let node = em.nextSibling;
          while (node) {
            raw += (_b = node.textContent) != null ? _b : "";
            node = node.nextSibling;
          }
          const tgt = raw.replace(/^\s*[-—\-]\s*/, "").trim();
          if (!src || !tgt) return;
          const pair = document.createElement("practice-pair");
          pair.setAttribute("src", src);
          pair.setAttribute("tgt", tgt);
          if (isExtra) {
            pair.dataset["extra"] = "true";
            pair.hidden = true;
          }
          parent.insertBefore(pair, list);
          li.remove();
        });
        if (list.children.length === 0) list.remove();
      });
    }
    _pairs() {
      return Array.from(this.querySelectorAll("practice-pair"));
    }
    _getSeed() {
      const attr = this.getAttribute("data-seed");
      return attr !== null ? parseInt(attr, 10) : generateSeed();
    }
    /**
     * Build groups of elements for intra-group shuffling.
     * Each group is: [label (optional), ...practice-pairs].
     * Sentences within a group shuffle; groups themselves stay in original order.
     * Extra pairs (data-extra="true") are merged into the first group so they
     * shuffle together with the main sentences, not as a separate tail section.
     */
    _buildGroups() {
      const groups = [];
      let currentLabel = null;
      let currentPairs = [];
      for (const el of this._allContent) {
        if (el.tagName === "PRACTICE-PAIR" && el.dataset["extra"] === "true") continue;
        if (el.tagName === "PRACTICE-PAIR") {
          currentPairs.push(el);
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
      const extraPairs = this._allContent.filter(
        (el) => el.tagName === "PRACTICE-PAIR" && el.dataset["extra"] === "true"
      );
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
    _shuffleOrder(seed) {
      const ctrl = this.querySelector(".psent-controls");
      const groups = this._buildGroups();
      let rng = createRng(seed);
      groups.forEach((group) => {
        if (group.label) this.insertBefore(group.label, ctrl);
        shuffleIndices(group.pairs.length, rng).forEach((i) => this.insertBefore(group.pairs[i], ctrl));
        rng = createRng(rng() * 4294967295 >>> 0);
      });
    }
    /** Restore all content to original document order. */
    _restoreOrder() {
      const ctrl = this.querySelector(".psent-controls");
      this._allContent.forEach((el) => this.insertBefore(el, ctrl));
    }
    _setActive(on, percent, direction) {
      if (on !== this._isActive) {
        this._isActive = on;
        dispatchActivity(on ? 1 : -1);
      }
      const det = this.querySelector(".psent-details");
      const sta = this.querySelector(".psent-status");
      const label = this.querySelector(".psent-status-label");
      if (on) {
        if (det) {
          det.open = false;
          det.hidden = true;
        }
        if (sta) sta.hidden = false;
        if (label && percent !== void 0) {
          const dirLabel = direction === "src" ? "\u2190 Magyar" : "Magyar \u2192";
          label.textContent = `\u270F akt\xEDv \xB7 ${percent}% \xB7 ${dirLabel}`;
        }
      } else {
        if (det) det.hidden = false;
        if (sta) sta.hidden = true;
      }
    }
  };
  var QuizEvaluator = class extends HTMLElement {
    constructor() {
      super(...arguments);
      this._activeCount = 0;
      this._evHandlers = null;
    }
    connectedCallback() {
      this.hidden = true;
      this._render();
      this._evHandlers = {
        activity: (e) => {
          const d = e.detail;
          this._activeCount = Math.max(0, this._activeCount + d.delta);
          this._syncVisibility();
        },
        reset: () => {
          this._activeCount = 0;
          this._syncVisibility();
        },
        answerChanged: () => {
          const res = this.querySelector(".quiz-evaluator__result");
          if (res) res.textContent = "";
        }
      };
      document.addEventListener(QUIZ_ACTIVITY, this._evHandlers.activity);
      document.addEventListener(QUIZ_RESET, this._evHandlers.reset);
      document.addEventListener(QUIZ_ANSWER_CHANGED, this._evHandlers.answerChanged);
    }
    disconnectedCallback() {
      if (!this._evHandlers) return;
      document.removeEventListener(QUIZ_ACTIVITY, this._evHandlers.activity);
      document.removeEventListener(QUIZ_RESET, this._evHandlers.reset);
      document.removeEventListener(QUIZ_ANSWER_CHANGED, this._evHandlers.answerChanged);
    }
    _syncVisibility() {
      this.hidden = this._activeCount === 0;
      if (this._activeCount === 0) {
        const res = this.querySelector(".quiz-evaluator__result");
        if (res) res.textContent = "";
      }
    }
    _render() {
      this.innerHTML = `<div class="quiz-evaluator"><hr class="quiz-evaluator__separator"><div class="quiz-evaluator__row"><button class="quiz-evaluator__check">\u2713 Pontoz\xE1s</button><span class="quiz-evaluator__result" aria-live="polite"></span></div></div>`;
      this.querySelector(".quiz-evaluator__check").addEventListener("click", () => {
        this._evaluate();
      });
    }
    _evaluate() {
      let totalCorrect = 0;
      let totalQuestions = 0;
      const onResult = (e) => {
        const d = e.detail;
        totalCorrect += d.correct;
        totalQuestions += d.total;
      };
      document.addEventListener(QUIZ_RESULT, onResult);
      document.dispatchEvent(new CustomEvent(QUIZ_CHECK));
      document.removeEventListener(QUIZ_RESULT, onResult);
      const res = this.querySelector(".quiz-evaluator__result");
      if (res) {
        const pct = totalQuestions > 0 ? Math.round(totalCorrect / totalQuestions * 100) : 0;
        res.textContent = `Eredm\xE9ny: ${totalCorrect} / ${totalQuestions} (${pct}%)`;
      }
    }
  };
  var QuizControls = class extends HTMLElement {
    connectedCallback() {
      this._render();
    }
    _render() {
      var _a;
      const defaultPercent = parseInt((_a = this.getAttribute("percent")) != null ? _a : "50", 10);
      this.innerHTML = `<div class="quiz-controls"><details class="quiz-controls__details"><summary class="quiz-controls__summary">\u270F \xD6nellen\u0151rz\xE9s (\xF6sszes)</summary><div class="quiz-controls__panel"><label class="quiz-controls__label">Er\u0151ss\xE9g: <input class="quiz-controls__slider" type="range" min="0" max="100" value="${defaultPercent}" aria-label="Er\u0151ss\xE9g"><output class="quiz-controls__output">${defaultPercent}</output>%</label><div class="quiz-controls__buttons"><button class="quiz-controls__start">\u25B6 Ind\xEDt\xE1s</button><button class="quiz-controls__reset" hidden>\u21BA Vissza\xE1ll\xEDt\xE1s</button></div></div></details></div>`;
      const details = this.querySelector(".quiz-controls__details");
      const slider = this.querySelector(".quiz-controls__slider");
      const output = this.querySelector(".quiz-controls__output");
      const startBtn = this.querySelector(".quiz-controls__start");
      const resetBtn = this.querySelector(".quiz-controls__reset");
      slider.addEventListener("input", () => {
        output.value = slider.value;
      });
      startBtn.addEventListener("click", () => {
        const percent = parseInt(slider.value, 10);
        const seed = generateSeed();
        document.dispatchEvent(new CustomEvent(QUIZ_START, { detail: { percent, seed } }));
        details.open = false;
        startBtn.hidden = true;
        resetBtn.hidden = false;
      });
      resetBtn.addEventListener("click", () => {
        document.dispatchEvent(new CustomEvent(QUIZ_RESET));
        startBtn.hidden = false;
        resetBtn.hidden = true;
      });
    }
  };
  if (typeof customElements !== "undefined") {
    customElements.define("quiz-controls", QuizControls);
    customElements.define("practice-table", PracticeTable);
    customElements.define("practice-pair", PracticePair);
    customElements.define("practice-sentences", PracticeSentences);
    customElements.define("quiz-evaluator", QuizEvaluator);
  }
})();
