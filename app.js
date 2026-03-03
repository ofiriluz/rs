const STORAGE_KEY = "tlv-birthday-plan-v1";

// Set to an ISO date string to fake "today" for testing (e.g. "2026-03-05" to test day 1 + day 2). Set to null for real date.
const DEBUG_FAKE_TODAY_ISO = null;

function pad2(n) {
  return String(n).padStart(2, "0");
}

function toISODateLocal(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function todayISODate() {
  if (DEBUG_FAKE_TODAY_ISO) return DEBUG_FAKE_TODAY_ISO;
  return toISODateLocal(new Date());
}

function addDaysISO(isoDate, days) {
  const base = new Date(`${isoDate}T00:00:00`);
  base.setDate(base.getDate() + days);
  return toISODateLocal(base);
}

function formatDateHuman(isoDate) {
  try {
    const d = new Date(`${isoDate}T00:00:00`);
    return new Intl.DateTimeFormat("he-IL", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(d);
  } catch {
    return isoDate;
  }
}

function normalizeAnswer(s) {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[\u200f\u200e]/g, "");
}

// ערוך פה את התוכן: ימים + slots מתוכננים ו־slots לבחירה.
// type: planned = מתוכנן, choose = את בוחרת מתוך אופציות
const PLAN = {
  title: "3 ימים בתל אביב — Birthday Edition",
  startDateISO: "2026-03-10",
  days: [
    {
      id: "day1",
      title: "יום ראשון",
      theme: "יקב, מלון קמפינסקי וסדנה יפנית",
      dateISO: null,
      image: "./assets/day1.jpg",
      imageFallback: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&q=80",
      imageAlt: "סיור ביקב, גבינות ויין",
      unlock: {
        question: "לאיזה מיוזיקל הלכנו בלונדון?",
        answers: ["הארי פוטר", "South Park", "Hamilton", "Harry Potter", "סאות פארק", "המילטון"],
      },
      items: [
        { id: "d1-morning", time: "11:00", type: "planned", title: "סיור ביקב + ארוחת גבינות ויין", meta: "מתחילים את היום בסגנון" },
        { id: "d1-noon", time: "צהריים", type: "planned", title: "הגעה למלון קמפינסקי", meta: "צ'ק-אין, חדר, מתארגנים" },
        { id: "d1-lunch", time: "צהריים", type: "planned", title: "ארוחת צהריים במסעדת המלון", meta: "או מנוחה :)" },
        { id: "d1-choices", time: "אחה\"צ", type: "choose", title: "אחר הצהריים יחדיו", meta: "לבחירתך", slotKey: "day1-choices" },
        { id: "d1-19", time: "19:00", type: "planned", title: "סדנה יפנית", meta: "מבשלים עם השושו" },
        { id: "d1-late", time: "22:30", type: "planned", title: "מגזינו — קינוח", meta: "נומנומנומ" },
        { id: "d1-late", time: "אל תוך הלילה", type: "planned", title: "Potion Bar, חגיגה!", meta: "שותים ונהנים" },
      ],
    },
    {
      id: "day2",
      title: "יום שני",
      theme: "ספא, סושי ובחירתה של רוני",
      dateISO: null,
      image: "./assets/day2.jpg",
      imageFallback: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
      imageAlt: "ספא ובריאות",
      unlock: {
        question: "מהו המשפט המפורסם של ז'וז'ו חלסטרה בסוף כל פינה?",
        answers: ["ותחשבו על זה"],
      },
      items: [
        { id: "d2-breakfast", time: "בוקר", type: "planned", title: "ארוחת בוקר במלון", meta: "רק אם נצליח לקום" },
        { id: "d2-spa", time: "11:30", type: "planned", title: "ספא", meta: "רוגע יחדיו" },
        { id: "d2-noon", time: "צהריים", type: "planned", title: "חזרה לחדר, מסתובבים", meta: "לנשום" },
        { id: "d2-lunch", time: "צהריים", type: "planned", title: "קוקו נקו צהריים", meta: "ראמן סאן!" },
        { id: "d2-choices", time: "אחה\"צ", type: "choose", title: "אחר הצהריים יחדיו", meta: "לבחירתך", slotKey: "day2-choices" },
        { id: "d2-21", time: "21:00", type: "planned", title: "סושי אומקאסה", meta: "אמרתי כבר יפן?" },
      ],
    },
    {
      id: "day3",
      title: "יום שלישי",
      theme: "Work Off Art, כנסיית השכל, ובחירתה של שושו!",
      dateISO: null,
      image: "./assets/day3.jpg",
      imageFallback: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=800&q=80",
      imageAlt: "תערוכת Work Off Art",
      unlock: {
        question: "איך קוראים לך בישראל האילוזית?",
        answers: ["שושו", "שושית", "אנגרי", "מתוקיתוקי", "שי חולוד", "שממונקה"],
      },
      items: [
        { id: "d3-morning", time: "בוקר", type: "planned", title: "ארוחת בוקר במלון", meta: "" },
        { id: "d3-workoff", time: "בוקר", type: "planned", title: "Work Off Art", meta: "תערוכה" },
        { id: "d3-noon", time: "צהריים", type: "choose", title: "צהריים — את בוחרת", meta: "בחירה 1", slotKey: "day3-choices", choiceIndex: 0 },
        { id: "d3-afternoon", time: "אחה\"צ", type: "choose", title: "אחרי הצהריים — את בוחרת", meta: "בחירה 2", slotKey: "day3-choices", choiceIndex: 1 },
        { id: "d3-evening", time: "20:00", type: "planned", title: "מסיבה עם כנסיית השכל", meta: "סיום בסטייל" },
      ],
    },
  ],
  choices: {
    "day1-choices": { title: "יום 1 · את בוחרת", subtitle: "בחרי אופציה אחת", optionsKey: "extra", multiPick: false },
    "day2-choices": { title: "יום 2 · את בוחרת", subtitle: "בחרי אופציה אחת", optionsKey: "extra", multiPick: false },
    "day3-choices": { title: "יום 3 · צהריים ואחה\"צ — את בוחרת", subtitle: "בחרי עד 2 אופציות (צהריים + אחה\"צ)", optionsKey: "extra", multiPick: true, maxPicks: 2 },
  },
};

const SINGLE_USE_EXTRA_VALUES = new Set(["wildchild", "horses", "axes", "escaperoom", "tour_ajami"]);

const EXTRA_OPTIONS = [
  { value: "wildchild", label: "Wild Child Quest", hint: "הרפתקה בנווה צדק", singleUse: true, day2Only: false },
  { value: "horses", label: "טיול סוסים", hint: "אם התאריך עדיין פנוי", singleUse: true, day2Only: false },
  { value: "beach_rest", label: "מנוחה בחוף ים", hint: "", singleUse: false, day2Only: false },
  { value: "chill_hotel", label: "צ'ל במלון", hint: "", singleUse: false, day2Only: false },
  { value: "axes", label: "גרזנים ונהנים", hint: "שושו קולעת למטרה", singleUse: true, day2Only: false },
  { value: "escaperoom", label: "אסקייפ רום", hint: "מפצחי השושוים", singleUse: true, day2Only: false },
  { value: "tour_ajami", label: "סיור בעג'מי", hint: "11.3, 17:00–19:00", singleUse: true, day2Only: true },
  { value: "shopping", label: "שופינג", hint: "סיבוב סטייל בנווה צדק", singleUse: false, day2Only: false },
  { value: "carmel_market", label: "סיור בשוק הכרמל", hint: "אוכלים, שותים ונהנים", singleUse: false, day2Only: false },
];

function getSelectedValues(slotKey, state) {
  const raw = state.selections[slotKey];
  if (Array.isArray(raw)) return raw;
  if (raw != null && raw !== "") return [raw];
  return [];
}

function getAlreadyPickedSingleUseValues(state, beforeDayIndex) {
  const picked = new Set();
  for (let i = 0; i < beforeDayIndex && i < PLAN.days.length; i++) {
    const slotKey = `day${i + 1}-choices`;
    const vals = getSelectedValues(slotKey, state);
    for (const val of vals) {
      if (SINGLE_USE_EXTRA_VALUES.has(val)) picked.add(val);
    }
  }
  return picked;
}

function getExtraOptionsForDay(dayIndex, state) {
  const pickedSingleUse = getAlreadyPickedSingleUseValues(state, dayIndex);
  const isDay2 = dayIndex === 1;
  return EXTRA_OPTIONS.filter((opt) => {
    if (opt.singleUse && pickedSingleUse.has(opt.value)) return false;
    if (opt.day2Only && !isDay2) return false;
    return true;
  });
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { selections: {}, unlocked: {}, viewDayId: null };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { selections: {}, unlocked: {}, viewDayId: null };
    const selections =
      parsed.selections && typeof parsed.selections === "object" ? { ...parsed.selections } : {};
    const unlocked =
      parsed.unlocked && typeof parsed.unlocked === "object" ? { ...parsed.unlocked } : {};
    const viewDayId =
      typeof parsed.viewDayId === "string" && PLAN.days.some((d) => d.id === parsed.viewDayId)
        ? parsed.viewDayId
        : null;
    return { selections, unlocked, viewDayId };
  } catch {
    return { selections: {}, unlocked: {}, viewDayId: null };
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, viewDayId: state.viewDayId ?? null }));
}

function byId(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getChosenLabel(slotKey, state, choiceIndex) {
  const slot = PLAN.choices[slotKey];
  const values = getSelectedValues(slotKey, state);
  if (values.length === 0) return null;
  const index = choiceIndex != null && Number.isInteger(choiceIndex) ? choiceIndex : 0;
  const value = values[index];
  if (value == null) return null;
  if (slot?.optionsKey === "extra") {
    return EXTRA_OPTIONS.find((o) => o.value === value)?.label ?? value;
  }
  return slot?.options?.find((o) => o.value === value)?.label ?? value;
}

function buildDaysWithDates() {
  const start = PLAN.startDateISO || todayISODate();
  return PLAN.days.map((day, i) => ({
    ...day,
    dateISO: day.dateISO || addDaysISO(start, i),
  }));
}

function getDayOpenableDateISO(day) {
  return addDaysISO(day.dateISO, -1);
}

function isDayAvailable(day, nowISO) {
  return getDayOpenableDateISO(day) <= nowISO;
}

function isDayUnlocked(day, state) {
  return Boolean(state.unlocked?.[day.id]);
}

function pickActiveDay(days, nowISO) {
  let active = days[0];
  for (const d of days) {
    if (getDayOpenableDateISO(d) <= nowISO) active = d;
  }
  return active;
}

function isAllUnlocked(state) {
  return PLAN.days.every((d) => state.unlocked?.[d.id]);
}

function getActiveDay(state, days, nowISO) {
  if (state.viewDayId && days.some((d) => d.id === state.viewDayId)) {
    return days.find((d) => d.id === state.viewDayId);
  }
  return pickActiveDay(days, nowISO);
}

function renderDayMeta(day, state, nowISO) {
  const el = document.getElementById("dayMeta");
  if (!el) return;

  const available = isDayAvailable(day, nowISO);
  const unlocked = isDayUnlocked(day, state);
  const dateText = formatDateHuman(day.dateISO);
  const openableDateText = formatDateHuman(getDayOpenableDateISO(day));

  if (!available) {
    el.textContent = `נפתח ב־${openableDateText} (יום לפני)`;
  } else if (!unlocked) {
    el.textContent = `${dateText} · צריך לענות על שאלה כדי לפתוח`;
  } else {
    el.textContent = `${dateText} · ${day.theme}`;
  }
}

function renderTimeline(state) {
  const timeline = byId("timeline");

  const nowISO = todayISODate();
  const days = buildDaysWithDates();
  const activeDay = getActiveDay(state, days, nowISO);
  renderDayMeta(activeDay, state, nowISO);

  const allUnlocked = isAllUnlocked(state);
  const available = allUnlocked || isDayAvailable(activeDay, nowISO);
  const unlocked = allUnlocked || isDayUnlocked(activeDay, state);

  const showDayDescription = unlocked;
  const dateSubText = formatDateHuman(activeDay.dateISO).replace(/^יום\s/, "");
  const bannerSubText = showDayDescription
    ? `${escapeHtml(activeDay.theme)} · ${escapeHtml(dateSubText)}`
    : escapeHtml(dateSubText);
  const banner = `
    <section class="dayBanner" aria-label="${escapeHtml(activeDay.title)}">
      <div class="dayBanner__media">
        ${activeDay.image || activeDay.imageFallback
        ? `<img src="${escapeHtml(activeDay.image || activeDay.imageFallback)}" alt="${escapeHtml(activeDay.imageAlt || "")}" ${activeDay.imageFallback ? `data-fallback="${escapeHtml(activeDay.imageFallback)}" onerror="if(this.dataset.fallback){this.onerror=null;this.src=this.dataset.fallback}"` : ""} loading="lazy" />`
        : ""}
      </div>
      <div class="dayBanner__body">
        <h3 class="dayBanner__title">${escapeHtml(activeDay.title)}</h3>
        <p class="dayBanner__sub">${bannerSubText}</p>
      </div>
    </section>
  `;

  const daySwitcherHtml = `<section class="daySwitcher" aria-label="בחירת יום">
      <span class="daySwitcher__label">להצגה:</span>
      ${PLAN.days
        .map(
          (d) =>
            `<button type="button" class="daySwitcher__btn ${d.id === activeDay.id ? "daySwitcher__btn--active" : ""}" data-day-id="${escapeHtml(d.id)}">${escapeHtml(d.title)}</button>`
        )
        .join("")}
    </section>`;

  if (!available) {
    const openableDateText = formatDateHuman(getDayOpenableDateISO(activeDay));
    timeline.innerHTML = `${daySwitcherHtml}${banner}
      <section class="unlock" aria-label="נעול">
        <h3 class="unlock__title">היום הזה עדיין לא נפתח</h3>
        <p class="unlock__sub">יפתח ב־${escapeHtml(openableDateText)} (יום לפני היום עצמו).</p>
      </section>
    `;
    attachDaySwitcher(state);
    return;
  }

  if (!unlocked) {
    const q = activeDay.unlock?.question || "שאלה לפתיחה";
    timeline.innerHTML = `${daySwitcherHtml}${banner}
      <section class="unlock" aria-label="פתיחת היום">
        <h3 class="unlock__title">כדי לפתוח את היום</h3>
        <p class="unlock__sub">${escapeHtml(q)}</p>
        <form class="unlock__form" id="unlockForm">
          <div class="field">
            <label for="unlockAnswer">התשובה שלך</label>
            <input id="unlockAnswer" name="answer" type="text" autocomplete="off" inputmode="text" required />
          </div>
          <div class="unlock__actions">
            <button class="btn btn--primary" type="submit">לפתוח</button>
            <span class="unlock__error" id="unlockError" aria-live="polite"></span>
          </div>
        </form>
      </section>
    `;

    const form = document.getElementById("unlockForm");
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("unlockAnswer");
      const err = document.getElementById("unlockError");
      const val = input instanceof HTMLInputElement ? input.value : "";
      const answers = Array.isArray(activeDay.unlock?.answers) ? activeDay.unlock.answers : [];

      const ok = answers.map(normalizeAnswer).includes(normalizeAnswer(val));
      if (!ok) {
        if (err) err.textContent = "לא בדיוק 🙂 נסי שוב";
        return;
      }

      const nextState = {
        ...state,
        unlocked: { ...(state.unlocked || {}), [activeDay.id]: true },
      };
      saveState(nextState);
      setSavedHint("נפתח ✅");
      renderTimeline(nextState);
      renderChoices(nextState);
    });

    attachDaySwitcher(state);
    return;
  }

  const itemsHtml = activeDay.items
    .map((item) => {
      const isPlanned = item.type === "planned";
      const isChoose = item.type === "choose";

      let badgeText = "Planned";
      let badgeClass = "badge badge--planned";

      let title = item.title;
      let meta = item.meta;

      if (isChoose) {
        const chosen = getChosenLabel(item.slotKey, state, item.choiceIndex);
        if (chosen) {
          badgeText = "Chosen";
          badgeClass = "badge badge--chosen";
          title = chosen;
          meta = "בחירה שלך";
        } else {
          badgeText = "You choose";
          badgeClass = "badge badge--choose";
        }
      }

      if (!isPlanned && !isChoose) {
        badgeText = "Planned";
        badgeClass = "badge badge--planned";
      }

      return `
        <li class="item" role="listitem">
          <div class="item__time">${escapeHtml(item.time || "—")}</div>
          <div>
            <p class="item__title">${escapeHtml(title)}</p>
            <p class="item__meta">${escapeHtml(meta || "")}</p>
          </div>
          <div class="badge ${badgeClass.replace("badge ", "")}">${escapeHtml(badgeText)}</div>
        </li>
      `;
    })
    .join("");

  timeline.innerHTML = `${daySwitcherHtml}${banner}
    <section class="day" aria-label="${escapeHtml(activeDay.title)}">
      <div class="day__header">
        <h3 class="day__title">הלו\"ז</h3>
        <p class="day__theme">${escapeHtml(activeDay.theme)}</p>
      </div>
      <ol class="items">${itemsHtml}</ol>
    </section>
  `;

  attachDaySwitcher(state);
}

function attachDaySwitcher(state) {
  const timeline = byId("timeline");
  timeline.querySelectorAll(".daySwitcher__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const dayId = btn.getAttribute("data-day-id");
      if (!dayId) return;
      const nextState = { ...state, viewDayId: dayId };
      saveState(nextState);
      renderTimeline(nextState);
      renderChoices(nextState);
    });
  });
}

function getSlotsInUse(activeDay) {
  const slotsInUse = new Set();
  for (const item of activeDay.items) {
    if (item.type === "choose") slotsInUse.add(item.slotKey);
  }
  return slotsInUse;
}

function buildChoiceCardsHtml(activeDay, state, idPrefix = "") {
  const slotsInUse = getSlotsInUse(activeDay);
  const dayIndex = PLAN.days.findIndex((d) => d.id === activeDay.id);
  if (dayIndex < 0) return "";
  return Object.entries(PLAN.choices)
    .filter(([slotKey]) => slotsInUse.has(slotKey))
    .map(([slotKey, slot]) => {
      const selectedValues = getSelectedValues(slotKey, state);
      const multiPick = slot.multiPick === true;
      const options =
        slot.optionsKey === "extra"
          ? getExtraOptionsForDay(dayIndex, state)
          : slot.options || [];
      const maxPicks = slot.maxPicks ?? Infinity;
      const atMax = multiPick && selectedValues.length >= maxPicks;
      const optionsHtml = options
        .map((opt) => {
          const checked = multiPick
            ? selectedValues.includes(opt.value)
              ? "checked"
              : ""
            : selectedValues[0] === opt.value
              ? "checked"
              : "";
          const isDisabled = atMax && !selectedValues.includes(opt.value);
          const disabledAttr = isDisabled ? " disabled" : "";
          const inputId = idPrefix ? `${idPrefix}-${slotKey}-${opt.value}` : `${slotKey}-${opt.value}`;
          const inputType = multiPick ? "checkbox" : "radio";
          return `
            <label class="choice" for="${escapeHtml(inputId)}">
              <input
                id="${escapeHtml(inputId)}"
                type="${inputType}"
                name="${escapeHtml(slotKey)}"
                value="${escapeHtml(opt.value)}"
                ${checked}${disabledAttr}
              />
              <span>
                <span class="choice__label">${escapeHtml(opt.label)}</span>
                <span class="choice__hint">${escapeHtml(opt.hint || "")}</span>
              </span>
            </label>
          `;
        })
        .join("");
      if (options.length === 0 && slot.optionsKey === "extra") return "";
      return `
        <section class="choiceCard" aria-label="${escapeHtml(slot.title)}">
          <h3 class="choiceCard__title">${escapeHtml(slot.title)}</h3>
          <p class="choiceCard__sub">${escapeHtml(slot.subtitle || "")}</p>
          <div class="choiceList">${optionsHtml}</div>
        </section>
      `;
    })
    .join("");
}

function attachChoiceListeners(container, state) {
  if (!container) return;
  container.querySelectorAll("input[type=radio], input[type=checkbox]").forEach((input) => {
    input.addEventListener("change", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLInputElement)) return;
      const key = target.name;
      const value = target.value;
      let nextSelection;
      const slotConfig = PLAN.choices[key];
      if (slotConfig?.multiPick) {
        const current = getSelectedValues(key, state);
        const maxPicks = slotConfig.maxPicks ?? Infinity;
        const next = target.checked
          ? [...current.filter((v) => v !== value), value].slice(0, maxPicks)
          : current.filter((v) => v !== value);
        nextSelection = { ...state.selections, [key]: next };
      } else {
        nextSelection = { ...state.selections, [key]: value };
      }
      const nextState = { ...state, selections: nextSelection };
      saveState(nextState);
      setSavedHint("נשמר ✅");
      renderTimeline(nextState);
      renderChoices(nextState);
    });
  });
}

function renderChoices(state) {
  const choicesRoot = byId("choices");
  const nowISO = todayISODate();
  const days = buildDaysWithDates();
  const activeDay = getActiveDay(state, days, nowISO);
  const allUnlocked = isAllUnlocked(state);
  const available = allUnlocked || isDayAvailable(activeDay, nowISO);
  const unlocked = allUnlocked || isDayUnlocked(activeDay, state);

  if (!available) {
    choicesRoot.innerHTML = `<p class="muted">הבחירות של היום יופיעו כשהיום ייפתח.</p>`;
    return;
  }

  if (!unlocked) {
    choicesRoot.innerHTML = `<p class="muted">תעני על שאלת הפתיחה כדי לראות את הבחירות.</p>`;
    return;
  }

  const html = buildChoiceCardsHtml(activeDay, state);
  choicesRoot.innerHTML = html || `<p class="muted">אין slots לבחירה כרגע.</p>`;

  attachChoiceListeners(choicesRoot, state);
}

let savedHintTimer = null;
function setSavedHint(text) {
  const hint = document.getElementById("savedHint");
  if (!hint) return;
  hint.textContent = text;
  if (savedHintTimer) window.clearTimeout(savedHintTimer);
  savedHintTimer = window.setTimeout(() => {
    hint.textContent = "";
  }, 1600);
}

function unlockAllDays() {
  const unlocked = {};
  for (const day of PLAN.days) {
    unlocked[day.id] = true;
  }
  return unlocked;
}

function triggerShowAll() {
  const nextState = {
    ...loadState(),
    unlocked: unlockAllDays(),
    viewDayId: PLAN.days[0]?.id ?? null,
  };
  saveState(nextState);
  setSavedHint("הכל פתוח — בחרי יום למעלה");
  renderTimeline(nextState);
  renderChoices(nextState);
  document.getElementById("main")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function init() {
  const startBtn = byId("startBtn");
  const resetBtn = byId("resetBtn");
  const secretShortcut = document.getElementById("secretShortcut");

  const state = loadState();
  renderTimeline(state);
  renderChoices(state);

  startBtn.addEventListener("click", () => {
    document.getElementById("main")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  if (secretShortcut) {
    let secretStep = 0;
    let secretTimer = null;
    const SECRET_TIMEOUT_MS = 2500;

    secretShortcut.querySelectorAll(".hero__secret-dot").forEach((dot) => {
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        const want = parseInt(dot.getAttribute("data-secret"), 10);
        if (want === secretStep + 1) {
          secretStep++;
          if (secretTimer) clearTimeout(secretTimer);
          if (secretStep === 3) {
            secretStep = 0;
            triggerShowAll();
          } else {
            secretTimer = setTimeout(() => {
              secretStep = 0;
              secretTimer = null;
            }, SECRET_TIMEOUT_MS);
          }
        } else {
          secretStep = 0;
          if (secretTimer) clearTimeout(secretTimer);
          secretTimer = null;
        }
      });
    });
  }

  resetBtn.addEventListener("click", () => {
    const nextState = { selections: {}, unlocked: {}, viewDayId: null };
    saveState(nextState);
    setSavedHint("אופס… אפסתי את הבחירות");
    renderTimeline(nextState);
    renderChoices(nextState);
  });
}

document.addEventListener("DOMContentLoaded", init);
