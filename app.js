/* TecnoScore Task Desk — a tiny shared task manager for Anas & Zaid.
 * Data lives in data/tasks.json inside the GitHub repo. Anyone with the link can view;
 * edits are committed through the GitHub Contents API using a personal access token
 * that stays in the browser (localStorage). */
(() => {
  "use strict";

  // ---------------------------------------------------------------- config
  const base = window.TASK_DESK_CONFIG || {};
  const CFG = { ...base };
  if (location.hostname.endsWith(".github.io")) {
    CFG.owner = location.hostname.split(".")[0];
    const seg = location.pathname.split("/").filter(Boolean)[0];
    if (seg) CFG.repo = seg;
  }
  const API = `https://api.github.com/repos/${CFG.owner}/${CFG.repo}/contents/${CFG.path}`;
  const LS = { token: "tsd.token", me: "tsd.me", lang: "tsd.lang", view: "tsd.view" };

  // ---------------------------------------------------------------- i18n
  const I18N = {
    en: {
      brand: "TecnoScore Task Desk", brandSub: "Shared plan · Anas & Zaid",
      readonly: "View-only mode — changes can't be saved yet.", addToken: "Connect GitHub to edit",
      settings: "Settings", viewPeople: "By person", viewBoard: "Board", viewActivity: "Activity", newTask: "New task",
      s_todo: "To do", s_in_progress: "In progress", s_review: "In review", s_blocked: "Blocked", s_done: "Done",
      p_high: "High", p_medium: "Medium", p_low: "Low",
      eyebrow: "Delivery plan", started: "Started", target: "Target", progress: "{d} of {t} done",
      daysLeft: "days left", daysOver: "days past target", openTasks: "open tasks", inProgress: "in progress", attention: "overdue / blocked",
      briefTitle: "Manager's brief", briefSub: "What needs attention right now",
      i_pace: "{days} days to the target and {open} tasks open — aim for about {perWeek} per week.",
      i_pastTarget: "The target date has passed with {open} tasks still open — agree on a new date.",
      i_overdue: "{task} ({who}) is overdue since {date}.",
      i_blocked: "{task} is blocked — {who} needs help, unblock it first.",
      i_idle: "{who} has nothing in progress. Suggested next: {task}.",
      i_tooMany: "{who} has {n} tasks in progress at once — finish one before starting another.",
      i_review: "{task} is waiting for review — {reviewer}, please take a look.",
      i_stale: "{task} hasn't moved in {n} days — {who}, any update?",
      i_imbalance: "{a} has {na} open tasks vs {nb} for {b} — consider rebalancing.",
      i_coord: "Coordinate: {a} ({wa}) and {b} ({wb}) overlap — agree on the plan together.",
      i_noDue: "{n} open tasks have no due date — set dates so the pace can be tracked.",
      i_allDone: "All tasks are done — great work.",
      i_allGood: "No blockers or overdue work. Keep going.",
      groupActive: "Active", groupTodo: "To do", groupDone: "Done",
      openN: "{n} open", doneN: "{n} done", nothingHere: "Nothing here yet",
      titleEn: "Title (English)", titleAr: "Title (Arabic)", owner: "Owner", status: "Status", priority: "Priority",
      due: "Due date", notes: "Notes", notesPh: "Context, links, decisions…", checklist: "Checklist", addItem: "Add a step…",
      comments: "Discussion", commentPh: "Write an update…", send: "Send", related: "Related tasks", noRelated: "None",
      editRelated: "Link tasks", delete: "Delete", deleteSure: "Click again to delete", create: "Create task", close: "Close",
      newTaskTitle: "New task", taskTitle: "Task", created: "Created {t}", updatedAt: "Updated {t}",
      a_created: "{who} created {task}", a_status: "{who} moved {task} to {status}", a_comment: "{who} commented on {task}",
      a_updated: "{who} updated {task}", a_deleted: "{who} deleted {task}", a_checklist: "{who} updated the checklist of {task}",
      a_plan_created: "{who} set up the plan", a_plan_updated: "{who} updated the plan dates", a_owner: "{who} reassigned {task} to {owner}",
      noActivity: "No activity yet.",
      sync_loading: "Loading…", sync_saving: "Saving…", sync_ok: "Synced", sync_error: "Sync error", sync_local: "Offline copy",
      whoTitle: "Who are you?", whoSub: "Your name is attached to updates and comments you make.", iAm: "I'm {name}",
      settingsIntro: "Edits are saved straight into the GitHub repository, so both of you see the same plan.",
      tokenLabel: "GitHub access token", tokenPh: "github_pat_…", connect: "Connect", disconnect: "Disconnect",
      connectedAs: "Connected as {login} — you can edit.", notConnected: "Not connected — view only.",
      tokenSteps: "How to get a token:",
      step1: "Open github.com → Settings → Developer settings → Fine-grained tokens → Generate new token.",
      step2: "Repository access: Only select repositories → {repo}.",
      step3: "Permissions → Contents: Read and write. Generate, copy, paste here.",
      tokenLocal: "The token is stored only in this browser.",
      planSection: "Plan", startDate: "Start date", targetDate: "Target date", savePlan: "Save plan", cancel: "Cancel", save: "Save",
      t_saved: "Saved", t_saveFailed: "Couldn't save: {msg}", t_tokenOk: "Connected as {login}", t_tokenBad: "That token can't write to {repo}.",
      t_needWho: "Pick who you are first.", t_titleReq: "Give the task a title.", t_loadFailed: "Couldn't load the latest data — showing the bundled copy.",
      t_remote: "Updated with the latest changes.",
      cl: "{d}/{t}", comm: "{n}",
    },
    ar: {
      brand: "مكتب مهام تكنوسكور", brandSub: "خطة مشتركة · أنس وزيد",
      readonly: "وضع العرض فقط — لا يمكن حفظ التعديلات بعد.", addToken: "اربط GitHub للتعديل",
      settings: "الإعدادات", viewPeople: "حسب الشخص", viewBoard: "اللوحة", viewActivity: "النشاط", newTask: "مهمة جديدة",
      s_todo: "للتنفيذ", s_in_progress: "قيد التنفيذ", s_review: "قيد المراجعة", s_blocked: "متوقفة", s_done: "منجزة",
      p_high: "عالية", p_medium: "متوسطة", p_low: "منخفضة",
      eyebrow: "خطة التسليم", started: "البداية", target: "الموعد النهائي", progress: "أُنجز {d} من {t}",
      daysLeft: "يوماً متبقياً", daysOver: "يوماً بعد الموعد", openTasks: "مهام مفتوحة", inProgress: "قيد التنفيذ", attention: "متأخرة / متوقفة",
      briefTitle: "ملخّص المدير", briefSub: "ما يحتاج انتباهكم الآن",
      i_pace: "باقٍ {days} يوماً على الموعد النهائي و{open} مهام مفتوحة — الهدف تقريباً {perWeek} مهام أسبوعياً.",
      i_pastTarget: "تجاوزنا الموعد النهائي و{open} مهام ما زالت مفتوحة — اتفقا على موعد جديد.",
      i_overdue: "{task} ({who}) متأخرة منذ {date}.",
      i_blocked: "{task} متوقفة — {who} يحتاج إلى مساعدة، ابدأوا بحلّها.",
      i_idle: "لا توجد لدى {who} أي مهمة قيد التنفيذ. المقترح التالي: {task}.",
      i_tooMany: "لدى {who} {n} مهام قيد التنفيذ في آن واحد — أنهِ واحدة قبل البدء بأخرى.",
      i_review: "{task} بانتظار المراجعة — {reviewer}، يرجى الاطلاع عليها.",
      i_stale: "{task} لم تتحرك منذ {n} أيام — {who}، هل من جديد؟",
      i_imbalance: "لدى {a} {na} مهام مفتوحة مقابل {nb} لدى {b} — فكّرا في إعادة التوزيع.",
      i_coord: "تنسيق مطلوب: {a} ({wa}) و{b} ({wb}) متداخلتان — اتفقا على الخطة معاً.",
      i_noDue: "{n} مهام مفتوحة بلا تاريخ استحقاق — حدّدوا التواريخ لمتابعة الوتيرة.",
      i_allDone: "أُنجزت جميع المهام — عمل رائع.",
      i_allGood: "لا توجد عوائق أو تأخير. واصلوا.",
      groupActive: "نشطة", groupTodo: "للتنفيذ", groupDone: "منجزة",
      openN: "{n} مفتوحة", doneN: "{n} منجزة", nothingHere: "لا شيء هنا بعد",
      titleEn: "العنوان (إنجليزي)", titleAr: "العنوان (عربي)", owner: "المسؤول", status: "الحالة", priority: "الأولوية",
      due: "تاريخ الاستحقاق", notes: "ملاحظات", notesPh: "سياق، روابط، قرارات…", checklist: "قائمة الخطوات", addItem: "أضف خطوة…",
      comments: "النقاش", commentPh: "اكتب تحديثاً…", send: "إرسال", related: "مهام مرتبطة", noRelated: "لا يوجد",
      editRelated: "ربط المهام", delete: "حذف", deleteSure: "اضغط مجدداً للحذف", create: "إنشاء المهمة", close: "إغلاق",
      newTaskTitle: "مهمة جديدة", taskTitle: "المهمة", created: "أُنشئت {t}", updatedAt: "حُدّثت {t}",
      a_created: "{who} أنشأ {task}", a_status: "{who} نقل {task} إلى {status}", a_comment: "{who} علّق على {task}",
      a_updated: "{who} عدّل {task}", a_deleted: "{who} حذف {task}", a_checklist: "{who} حدّث خطوات {task}",
      a_plan_created: "{who} أعدّ الخطة", a_plan_updated: "{who} عدّل تواريخ الخطة", a_owner: "{who} أسند {task} إلى {owner}",
      noActivity: "لا يوجد نشاط بعد.",
      sync_loading: "جارٍ التحميل…", sync_saving: "جارٍ الحفظ…", sync_ok: "متزامن", sync_error: "خطأ في المزامنة", sync_local: "نسخة محلية",
      whoTitle: "من أنت؟", whoSub: "يُرفق اسمك بالتحديثات والتعليقات التي تضيفها.", iAm: "أنا {name}",
      settingsIntro: "تُحفظ التعديلات مباشرة في مستودع GitHub، فيرى كلاكما الخطة نفسها.",
      tokenLabel: "رمز الوصول إلى GitHub", tokenPh: "github_pat_…", connect: "ربط", disconnect: "فصل",
      connectedAs: "متصل باسم {login} — يمكنك التعديل.", notConnected: "غير متصل — عرض فقط.",
      tokenSteps: "كيف تحصل على الرمز:",
      step1: "افتح github.com ← Settings ← Developer settings ← Fine-grained tokens ← Generate new token.",
      step2: "Repository access: Only select repositories ← {repo}.",
      step3: "Permissions ← Contents: Read and write. أنشئ الرمز وانسخه والصقه هنا.",
      tokenLocal: "يُحفظ الرمز في هذا المتصفح فقط.",
      planSection: "الخطة", startDate: "تاريخ البداية", targetDate: "الموعد النهائي", savePlan: "حفظ الخطة", cancel: "إلغاء", save: "حفظ",
      t_saved: "تم الحفظ", t_saveFailed: "تعذّر الحفظ: {msg}", t_tokenOk: "تم الربط باسم {login}", t_tokenBad: "هذا الرمز لا يملك صلاحية الكتابة على {repo}.",
      t_needWho: "اختر من أنت أولاً.", t_titleReq: "أدخل عنواناً للمهمة.", t_loadFailed: "تعذّر تحميل أحدث البيانات — تُعرض النسخة المرفقة.",
      t_remote: "تم التحديث بآخر التغييرات.",
      cl: "{d}/{t}", comm: "{n}",
    },
  };
  const STATUSES = ["todo", "in_progress", "review", "blocked", "done"];
  const PRIORITIES = ["high", "medium", "low"];
  const PRIO_RANK = { high: 0, medium: 1, low: 2 };

  // ---------------------------------------------------------------- state
  const state = {
    data: null, sha: null, source: "remote",
    lang: localStorage.getItem(LS.lang) || ((navigator.language || "").startsWith("ar") ? "ar" : "en"),
    me: localStorage.getItem(LS.me) || "",
    view: localStorage.getItem(LS.view) || "people",
    token: localStorage.getItem(LS.token) || "",
    login: "", canWrite: false,
    openId: null, isNew: false, draft: null, deleteArmed: false,
    pending: 0, queue: Promise.resolve(),
  };

  // ---------------------------------------------------------------- helpers
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const t = (key, p = {}) => (I18N[state.lang][key] ?? I18N.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => (p[k] ?? ""));
  const uid = (p = "t") => `${p}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const nowIso = () => new Date().toISOString();
  const locale = () => (state.lang === "ar" ? "ar-u-nu-latn" : "en-GB");
  const todayStr = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
  const dayDiff = (a, b) => Math.round((Date.parse(b + "T00:00:00") - Date.parse(a + "T00:00:00")) / 86400000);
  const fmtDate = (s, opts = { day: "numeric", month: "short", year: "numeric" }) => s ? new Intl.DateTimeFormat(locale(), opts).format(new Date(s.length === 10 ? s + "T00:00:00" : s)) : "";
  const relTime = (iso) => {
    const rtf = new Intl.RelativeTimeFormat(locale(), { numeric: "auto" });
    const sec = (Date.parse(iso) - Date.now()) / 1000;
    const units = [["year", 31536000], ["month", 2592000], ["week", 604800], ["day", 86400], ["hour", 3600], ["minute", 60]];
    for (const [u, s] of units) if (Math.abs(sec) >= s) return rtf.format(Math.round(sec / s), u);
    return rtf.format(0, "second");
  };
  const person = (id) => state.data.people.find((p) => p.id === id) || { id, name: { en: id, ar: id }, color: "#777" };
  const pname = (id) => person(id).name[state.lang] || person(id).name.en;
  const other = (id) => state.data.people.find((p) => p.id !== id)?.id;
  const title = (task) => task.title[state.lang] || task.title.en || task.title.ar || "—";
  const taskById = (id) => state.data.tasks.find((x) => x.id === id);
  const isOpen = (x) => x.status !== "done";
  const isOverdue = (x) => isOpen(x) && x.due && x.due < todayStr();
  const tlink = (task) => `<a class="tlink" data-open-task="${esc(task.id)}">${esc(title(task))}</a>`;
  const canEdit = () => state.canWrite && state.source === "remote";

  const b64enc = (str) => {
    const bytes = new TextEncoder().encode(str); let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  };
  const b64dec = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, "")), (c) => c.charCodeAt(0)));

  const ICON = {
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    alert: '<svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
    trend: '<svg viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>',
    eye: '<svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    spark: '<svg viewBox="0 0 24 24"><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/></svg>',
    chat: '<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
    list: '<svg viewBox="0 0 24 24"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
    cal: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>',
    trash: '<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>',
  };

  // ---------------------------------------------------------------- toasts & sync
  function toast(msg, err = false) {
    const el = document.createElement("div");
    el.className = "toast" + (err ? " err" : ""); el.textContent = msg;
    $("#toasts").appendChild(el); setTimeout(() => el.remove(), err ? 5000 : 2200);
  }
  function setSync(s) {
    const el = $("#sync"); el.dataset.state = s;
    $(".sync-label", el).textContent = t("sync_" + s);
  }

  // ---------------------------------------------------------------- GitHub storage
  const headers = () => {
    const h = { Accept: "application/vnd.github+json" };
    if (state.token) h.Authorization = `Bearer ${state.token}`;
    return h;
  };
  async function fetchRemote() {
    const res = await fetch(`${API}?ref=${encodeURIComponent(CFG.branch)}&_=${Date.now()}`, { headers: headers(), cache: "no-store" });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const j = await res.json();
    return { data: normalize(JSON.parse(b64dec(j.content))), sha: j.sha };
  }
  async function putRemote(data, sha, message) {
    const res = await fetch(API, {
      method: "PUT", headers: { ...headers(), "Content-Type": "application/json" },
      body: JSON.stringify({ message, content: b64enc(JSON.stringify(data, null, 2) + "\n"), sha, branch: CFG.branch }),
    });
    if (res.status === 409 || res.status === 422) { const e = new Error("conflict"); e.conflict = true; throw e; }
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    return (await res.json()).content.sha;
  }
  function normalize(d) {
    d.people ||= []; d.tasks ||= []; d.activity ||= []; d.plan ||= { title: { en: "Plan", ar: "الخطة" }, start: todayStr(), target: "" };
    for (const x of d.tasks) { x.checklist ||= []; x.comments ||= []; x.links ||= []; x.title ||= { en: "", ar: "" }; }
    return d;
  }

  async function load(initial = false) {
    if (state.pending) return;
    if (initial) setSync("loading");
    try {
      const { data, sha } = await fetchRemote();
      const changed = sha !== state.sha;
      state.data = data; state.sha = sha; state.source = "remote";
      setSync("ok");
      if (changed) { if (!initial) toast(t("t_remote")); renderSafe(); }
    } catch (e) {
      if (initial) {
        try {
          const res = await fetch(`data/tasks.json?_=${Date.now()}`, { cache: "no-store" });
          state.data = normalize(await res.json()); state.source = "local";
          setSync("local"); toast(t("t_loadFailed"), true); render();
        } catch { setSync("error"); }
      } else setSync("error");
    }
  }

  async function verifyToken() {
    state.login = ""; state.canWrite = false;
    if (!state.token) return false;
    try {
      const [u, r] = await Promise.all([
        fetch("https://api.github.com/user", { headers: headers() }),
        fetch(`https://api.github.com/repos/${CFG.owner}/${CFG.repo}`, { headers: headers() }),
      ]);
      if (u.ok) state.login = (await u.json()).login;
      if (r.ok) state.canWrite = !!(await r.json()).permissions?.push;
    } catch { /* offline */ }
    return state.canWrite;
  }

  /** Apply a change locally (optimistic) and then commit it on top of the latest remote copy. */
  function mutate(action, taskId, fn, detail = "") {
    if (!canEdit()) { openSettings(); return false; }
    if (!state.me) { toast(t("t_needWho"), true); openWho(); return false; }
    const entry = { at: nowIso(), who: state.me, action, taskId, detail };
    const apply = (d) => { fn(d); d.activity.unshift(entry); d.activity = d.activity.slice(0, 400); };
    apply(state.data); render();

    const tk = taskId && (taskById(taskId) || {});
    const msg = `${pname(state.me)}: ${action}${tk && tk.title ? " — " + (tk.title.en || tk.title.ar) : ""}`;
    state.pending++; setSync("saving");
    state.queue = state.queue.then(async () => {
      for (let attempt = 0; attempt < 4; attempt++) {
        try {
          const { data, sha } = await fetchRemote();
          apply(data);
          state.sha = await putRemote(data, sha, msg);
          state.data = data;
          return;
        } catch (e) { if (!e.conflict || attempt === 3) throw e; }
      }
    }).then(() => { state.pending--; if (!state.pending) { setSync("ok"); renderSafe(); } })
      .catch((e) => { state.pending--; setSync("error"); toast(t("t_saveFailed", { msg: e.message }), true); load(); });
    return true;
  }

  // ---------------------------------------------------------------- render
  function renderSafe() {
    // don't yank the drawer from under someone typing
    const a = document.activeElement;
    if (a && $("#drawer").contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName)) { renderMain(); return; }
    render();
  }
  function render() {
    if (!state.data) return;
    renderChrome(); renderMain(); renderDrawer();
  }
  function renderChrome() {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
    document.title = `${t("brand")}`;
    document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
    document.querySelectorAll("[data-i18n-title]").forEach((el) => (el.title = t(el.dataset.i18nTitle)));
    $("#langBtn").textContent = state.lang === "ar" ? "EN" : "عربي";
    const me = state.me && person(state.me);
    $("#whoBtn").innerHTML = me ? `<span class="swatch" style="background:${me.color}"></span>${esc(t("iAm", { name: pname(state.me) }))}`
      : `${ICON.user}<span>${esc(t("whoTitle"))}</span>`;
    $("#readonlyBanner").hidden = canEdit();
    $("#newTaskBtn").disabled = false;
    document.querySelectorAll(".tab").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.view === state.view)));
    setSync($("#sync").dataset.state);
  }
  function renderMain() { renderHero(); renderBrief(); renderView(); }

  function counts(tasks) {
    const c = Object.fromEntries(STATUSES.map((s) => [s, 0]));
    tasks.forEach((x) => c[x.status]++);
    return c;
  }

  function renderHero() {
    const { plan, tasks } = state.data;
    const c = counts(tasks), total = tasks.length, open = total - c.done;
    const pct = total ? Math.round((c.done / total) * 100) : 0;
    const left = plan.target ? dayDiff(todayStr(), plan.target) : null;
    const attention = tasks.filter((x) => isOverdue(x) || x.status === "blocked").length;
    $("#hero").innerHTML = `
      <div class="hero-main">
        <div class="eyebrow">${esc(t("eyebrow"))}</div>
        <h1>${esc(plan.title[state.lang] || plan.title.en)}</h1>
        <div class="hero-dates">
          <div>${esc(t("started"))}<b>${esc(fmtDate(plan.start))}</b></div>
          <div>${esc(t("target"))}<b>${esc(fmtDate(plan.target) || "—")}</b></div>
        </div>
        <div class="progress-track" title="${pct}%">
          <span style="width:${total ? (c.done / total) * 100 : 0}%;background:var(--s-done)"></span>
          <span style="width:${total ? (c.review / total) * 100 : 0}%;background:var(--s-review)"></span>
          <span style="width:${total ? (c.in_progress / total) * 100 : 0}%;background:var(--s-in_progress)"></span>
        </div>
        <div class="progress-legend"><span>${esc(t("progress", { d: c.done, t: total }))}</span><span>${pct}%</span></div>
      </div>
      <div class="hero-stats">
        <div class="stat ${left !== null && left < 0 ? "warn" : ""}"><div class="num">${left === null ? "—" : Math.abs(left)}</div><div class="lbl">${esc(left !== null && left < 0 ? t("daysOver") : t("daysLeft"))}</div></div>
        <div class="stat"><div class="num">${open}</div><div class="lbl">${esc(t("openTasks"))}</div></div>
        <div class="stat"><div class="num">${c.in_progress}</div><div class="lbl">${esc(t("inProgress"))}</div></div>
        <div class="stat ${attention ? "warn" : ""}"><div class="num">${attention}</div><div class="lbl">${esc(t("attention"))}</div></div>
      </div>`;
  }

  /** The "manager": turns the raw task list into a short list of nudges. */
  function insights() {
    const { tasks, people, plan } = state.data;
    const out = [], today = todayStr();
    const open = tasks.filter(isOpen);
    const byPrio = (a, b) => PRIO_RANK[a.priority] - PRIO_RANK[b.priority] || (a.due || "9999").localeCompare(b.due || "9999");
    const P = (id) => `<b>${esc(pname(id))}</b>`;

    if (!tasks.length || !open.length) { out.push({ k: "good", i: ICON.spark, h: t(tasks.length ? "i_allDone" : "i_allGood") }); return out; }

    tasks.filter((x) => x.status === "blocked").forEach((x) => out.push({ k: "danger", i: ICON.alert, h: t("i_blocked", { task: tlink(x), who: P(x.owner) }) }));
    open.filter(isOverdue).sort((a, b) => a.due.localeCompare(b.due)).forEach((x) =>
      out.push({ k: "danger", i: ICON.clock, h: t("i_overdue", { task: tlink(x), who: P(x.owner), date: esc(fmtDate(x.due)) }) }));

    if (plan.target) {
      const days = dayDiff(today, plan.target);
      if (days < 0) out.push({ k: "danger", i: ICON.cal, h: t("i_pastTarget", { open: open.length }) });
      else {
        const perWeek = Math.max(1, Math.ceil(open.length / Math.max(1, days / 7)));
        out.push({ k: "info", i: ICON.trend, h: t("i_pace", { days, open: open.length, perWeek }) });
      }
    }

    tasks.filter((x) => x.status === "review").forEach((x) => out.push({ k: "warn", i: ICON.eye, h: t("i_review", { task: tlink(x), reviewer: P(other(x.owner)) }) }));

    for (const p of people) {
      const mine = open.filter((x) => x.owner === p.id);
      const active = mine.filter((x) => x.status === "in_progress");
      if (mine.length && !active.length && !mine.some((x) => x.status === "review")) {
        const next = mine.filter((x) => x.status === "todo").sort(byPrio)[0];
        if (next) out.push({ k: "warn", i: ICON.user, h: t("i_idle", { who: P(p.id), task: tlink(next) }) });
      }
      if (active.length >= 3) out.push({ k: "warn", i: ICON.list, h: t("i_tooMany", { who: P(p.id), n: active.length }) });
    }

    tasks.filter((x) => x.status === "in_progress" && dayDiff(x.updatedAt.slice(0, 10), today) >= 7).forEach((x) =>
      out.push({ k: "warn", i: ICON.clock, h: t("i_stale", { task: tlink(x), n: dayDiff(x.updatedAt.slice(0, 10), today), who: P(x.owner) }) }));

    if (people.length === 2) {
      const [a, b] = people.map((p) => ({ id: p.id, n: open.filter((x) => x.owner === p.id).length })).sort((x, y) => y.n - x.n);
      if (a.n - b.n >= 3) out.push({ k: "info", i: ICON.user, h: t("i_imbalance", { a: P(a.id), na: a.n, b: P(b.id), nb: b.n }) });
    }

    const seen = new Set();
    for (const x of open) for (const lid of x.links) {
      const y = taskById(lid);
      if (!y || !isOpen(y) || y.owner === x.owner) continue;
      const key = [x.id, y.id].sort().join("|"); if (seen.has(key)) continue; seen.add(key);
      out.push({ k: "info", i: ICON.link, h: t("i_coord", { a: tlink(x), wa: P(x.owner), b: tlink(y), wb: P(y.owner) }) });
    }

    const noDue = open.filter((x) => !x.due).length;
    if (noDue) out.push({ k: "info", i: ICON.cal, h: t("i_noDue", { n: noDue }) });

    if (!out.some((o) => o.k === "danger")) out.push({ k: "good", i: ICON.spark, h: t("i_allGood") });
    const order = { danger: 0, warn: 1, info: 2, good: 3 };
    return out.sort((a, b) => order[a.k] - order[b.k]);
  }

  function renderBrief() {
    $("#brief").innerHTML = `
      <div class="brief-head">
        <h2><span class="badge">${ICON.spark}</span>${esc(t("briefTitle"))}</h2>
        <span class="muted">${esc(t("briefSub"))}</span>
      </div>
      <ul class="brief-list">${insights().map((o) => `<li class="brief-item k-${o.k}"><span class="ico">${o.i}</span><span>${o.h}</span></li>`).join("")}</ul>`;
  }

  function cardHtml(x, showOwner = false, i = 0) {
    const done = x.checklist.filter((c) => c.done).length;
    const meta = [
      `<span class="pill status-pill" style="background:var(--s-${x.status})">${esc(t("s_" + x.status))}</span>`,
      `<span class="prio ${x.priority}">${esc(t("p_" + x.priority))}</span>`,
    ];
    if (showOwner) meta.push(`<span class="owner-chip"><i style="background:${person(x.owner).color}"></i>${esc(pname(x.owner))}</span>`);
    if (x.due) meta.push(`<span class="${isOverdue(x) ? "overdue" : ""}">${esc(fmtDate(x.due, { day: "numeric", month: "short" }))}</span>`);
    if (x.checklist.length) meta.push(`<span>☑ ${esc(t("cl", { d: done, t: x.checklist.length }))}</span>`);
    if (x.comments.length) meta.push(`<span>💬 ${x.comments.length}</span>`);
    return `<article class="card" data-status="${x.status}" data-open-task="${esc(x.id)}" draggable="${canEdit()}" data-drag="${esc(x.id)}" style="animation-delay:${Math.min(i, 12) * 25}ms">
      <button class="check ${x.status === "done" ? "on" : ""}" data-toggle-done="${esc(x.id)}" aria-label="done">${ICON.check}</button>
      <div class="card-title">${esc(title(x))}</div>
      <div class="card-meta">${meta.join("")}</div>
    </article>`;
  }
  const sortTasks = (arr) => arr.slice().sort((a, b) =>
    STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status) || PRIO_RANK[a.priority] - PRIO_RANK[b.priority] || (a.due || "9999").localeCompare(b.due || "9999"));

  function renderView() {
    const v = $("#view");
    if (state.view === "board") return (v.innerHTML = boardHtml());
    if (state.view === "activity") return (v.innerHTML = activityHtml());
    v.innerHTML = `<div class="people">${state.data.people.map(personHtml).join("")}</div>`;
  }

  function personHtml(p) {
    const mine = state.data.tasks.filter((x) => x.owner === p.id);
    const c = counts(mine), pct = mine.length ? c.done / mine.length : 0;
    const R = 24, C = 2 * Math.PI * R;
    const groups = [
      ["groupActive", sortTasks(mine.filter((x) => ["in_progress", "review", "blocked"].includes(x.status)))],
      ["groupTodo", sortTasks(mine.filter((x) => x.status === "todo"))],
      ["groupDone", sortTasks(mine.filter((x) => x.status === "done"))],
    ];
    let i = 0;
    return `<section class="person">
      <div class="person-head">
        <div class="avatar" style="background:${p.color}">${esc(pname(p.id).charAt(0))}</div>
        <div><h3>${esc(pname(p.id))}</h3><div class="meta">${esc(t("openN", { n: mine.length - c.done }))} · ${esc(t("doneN", { n: c.done }))}</div></div>
        <div class="ring"><svg viewBox="0 0 58 58"><circle class="bg" cx="29" cy="29" r="${R}"/><circle class="fg" cx="29" cy="29" r="${R}" stroke="${p.color}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg><b>${Math.round(pct * 100)}%</b></div>
      </div>
      <div class="mini-stats">${STATUSES.filter((s) => c[s]).map((s) => `<span class="pill"><span class="d" style="background:var(--s-${s})"></span>${esc(t("s_" + s))} · ${c[s]}</span>`).join("")}</div>
      <div class="task-list">
        ${groups.filter(([, arr]) => arr.length).map(([k, arr]) => `<div class="group-label">${esc(t(k))} · ${arr.length}</div>${arr.map((x) => cardHtml(x, false, i++)).join("")}`).join("") || `<div class="empty">${esc(t("nothingHere"))}</div>`}
      </div>
    </section>`;
  }

  function boardHtml() {
    let i = 0;
    return `<div class="board">${STATUSES.map((s) => {
      const arr = sortTasks(state.data.tasks.filter((x) => x.status === s));
      return `<div class="col" data-drop="${s}">
        <div class="col-head"><span class="d" style="background:var(--s-${s})"></span>${esc(t("s_" + s))}<span class="n">${arr.length}</span></div>
        <div class="task-list">${arr.map((x) => cardHtml(x, true, i++)).join("") || `<div class="empty">—</div>`}</div>
      </div>`;
    }).join("")}</div>`;
  }

  function activityText(a) {
    const tk = a.taskId && taskById(a.taskId);
    const snap = a.detail && typeof a.detail === "object" ? a.detail : null;
    const taskName = tk ? tlink(tk) : `<b>${esc(snap?.title?.[state.lang] || snap?.title?.en || "—")}</b>`;
    const who = `<b>${esc(pname(a.who))}</b>`;
    const p = { who, task: taskName };
    if (a.action === "status") p.status = `<b>${esc(t("s_" + (snap?.status || a.detail)))}</b>`;
    if (a.action === "owner") p.owner = `<b>${esc(pname(snap?.owner || a.detail))}</b>`;
    return t("a_" + a.action, p);
  }
  function activityHtml() {
    const items = state.data.activity.slice(0, 150);
    if (!items.length) return `<div class="empty">${esc(t("noActivity"))}</div>`;
    return `<ul class="timeline">${items.map((a) => `<li>
      <div class="av" style="background:${person(a.who).color}">${esc(pname(a.who).charAt(0))}</div>
      <div><div>${activityText(a)}</div><div class="when" title="${esc(new Date(a.at).toLocaleString(locale()))}">${esc(relTime(a.at))}</div></div>
    </li>`).join("")}</ul>`;
  }

  // ---------------------------------------------------------------- drawer
  function openTask(id) { state.openId = id; state.isNew = false; state.deleteArmed = false; renderDrawer(); showDrawer(true); }
  function newTask() {
    state.isNew = true; state.openId = null; state.deleteArmed = false;
    state.draft = { id: uid(), title: { en: "", ar: "" }, owner: state.me || state.data.people[0].id, status: "todo", priority: "medium", due: "", notes: "", links: [], checklist: [], comments: [] };
    renderDrawer(); showDrawer(true);
    setTimeout(() => $(state.lang === "ar" ? "#f-title-ar" : "#f-title-en")?.focus(), 250);
  }
  function showDrawer(on) {
    $("#drawer").classList.toggle("open", on); $("#drawer").setAttribute("aria-hidden", String(!on));
    $("#scrim").hidden = !on;
    if (!on) { state.openId = null; state.isNew = false; state.draft = null; }
  }
  const seg = (name, values, current, labeler, dot) => `<div class="seg" data-seg="${name}">${values.map((v) =>
    `<button type="button" data-val="${esc(v)}" aria-pressed="${v === current}">${dot ? `<span class="d" style="background:${dot(v)}"></span>` : ""}${esc(labeler(v))}</button>`).join("")}</div>`;

  function renderDrawer() {
    const d = $("#drawer");
    const x = state.isNew ? state.draft : state.openId && taskById(state.openId);
    if (!x) { if (state.openId) showDrawer(false); d.innerHTML = ""; return; }
    const ro = !canEdit();
    const dis = ro ? "disabled" : "";
    const others = state.data.tasks.filter((y) => y.id !== x.id);
    d.innerHTML = `
      <div class="drawer-head">
        <h3>${esc(state.isNew ? t("newTaskTitle") : t("taskTitle"))}</h3>
        <button class="icon-btn" data-close aria-label="${esc(t("close"))}">${ICON.close}</button>
      </div>
      <div class="drawer-body">
        <div class="row">
          <div class="field"><label for="f-title-en">${esc(t("titleEn"))}</label><input type="text" id="f-title-en" dir="ltr" value="${esc(x.title.en)}" ${dis} /></div>
          <div class="field"><label for="f-title-ar">${esc(t("titleAr"))}</label><input type="text" id="f-title-ar" dir="rtl" value="${esc(x.title.ar)}" ${dis} /></div>
        </div>
        <div class="field"><span class="field-label">${esc(t("owner"))}</span>${seg("owner", state.data.people.map((p) => p.id), x.owner, pname, (v) => person(v).color)}</div>
        <div class="field"><span class="field-label">${esc(t("status"))}</span>${seg("status", STATUSES, x.status, (v) => t("s_" + v), (v) => `var(--s-${v})`)}</div>
        <div class="row">
          <div class="field"><span class="field-label">${esc(t("priority"))}</span>${seg("priority", PRIORITIES, x.priority, (v) => t("p_" + v))}</div>
          <div class="field"><label for="f-due">${esc(t("due"))}</label><input type="date" id="f-due" value="${esc(x.due)}" ${dis} /></div>
        </div>
        <div class="field"><label for="f-notes">${esc(t("notes"))}</label><textarea id="f-notes" placeholder="${esc(t("notesPh"))}" ${dis}>${esc(x.notes)}</textarea></div>

        <div class="field"><span class="field-label">${esc(t("checklist"))}</span>
          <div class="checklist">${x.checklist.map((c) => `<div class="cl-item ${c.done ? "done" : ""}">
            <button class="check ${c.done ? "on" : ""}" data-cl-toggle="${esc(c.id)}" ${dis}>${ICON.check}</button><span>${esc(c.text)}</span>
            ${ro ? "" : `<button class="x" data-cl-del="${esc(c.id)}" aria-label="remove">${ICON.close}</button>`}</div>`).join("")}</div>
          ${ro ? "" : `<form class="inline-add" data-cl-add><input type="text" id="f-cl" placeholder="${esc(t("addItem"))}" /><button class="btn" type="submit">+</button></form>`}
        </div>

        <div class="field"><span class="field-label">${esc(t("related"))}</span>
          <div class="related">${x.links.map(taskById).filter(Boolean).map((y) => `<div>${ICON.link} ${tlink(y)} · <span class="muted">${esc(pname(y.owner))}</span></div>`).join("") || `<span class="muted">${esc(t("noRelated"))}</span>`}</div>
          ${ro ? "" : `<details><summary class="muted" style="cursor:pointer;margin-top:4px">${esc(t("editRelated"))}</summary>
            <div class="links-picker" style="margin-top:8px">${seg("links", others.map((y) => y.id), null, (id) => title(taskById(id)))}</div></details>`}
        </div>

        ${state.isNew ? "" : `<div class="field"><span class="field-label">${esc(t("comments"))}</span>
          <div class="comments">${x.comments.map((c) => `<div class="comment">
            <div class="av" style="background:${person(c.author).color}">${esc(pname(c.author).charAt(0))}</div>
            <div><div class="who"><b>${esc(pname(c.author))}</b> · ${esc(relTime(c.at))}</div><div class="bubble">${esc(c.text)}</div></div></div>`).join("")}</div>
          ${ro ? "" : `<form class="inline-add" data-comment><textarea id="f-comment" rows="2" style="min-height:44px" placeholder="${esc(t("commentPh"))}"></textarea><button class="btn dark" type="submit">${esc(t("send"))}</button></form>`}
          <div class="muted" style="font-size:12.5px">${esc(t("created", { t: fmtDate(x.createdAt) }))} · ${esc(t("updatedAt", { t: relTime(x.updatedAt) }))}</div>
        </div>`}
      </div>
      <div class="drawer-foot">
        ${state.isNew ? `<button class="btn" data-close>${esc(t("cancel"))}</button><button class="btn primary" data-create ${dis}>${esc(t("create"))}</button>`
          : `${ro ? "<span></span>" : `<button class="btn danger" data-delete>${ICON.trash}${esc(state.deleteArmed ? t("deleteSure") : t("delete"))}</button>`}<button class="btn" data-close>${esc(t("close"))}</button>`}
      </div>`;
    // mark linked tasks as pressed
    d.querySelectorAll('[data-seg="links"] button').forEach((b) => b.setAttribute("aria-pressed", String(x.links.includes(b.dataset.val))));
  }

  /** Update a field of the open task (or the draft). */
  function setField(field, value) {
    if (state.isNew) {
      if (field === "title.en") state.draft.title.en = value;
      else if (field === "title.ar") state.draft.title.ar = value;
      else if (field === "links") state.draft.links = value;
      else state.draft[field] = value;
      renderDrawer(); return;
    }
    const id = state.openId, x = taskById(id);
    const cur = field.startsWith("title.") ? x.title[field.slice(6)] : x[field];
    if (JSON.stringify(cur) === JSON.stringify(value)) return;
    const action = field === "status" ? "status" : field === "owner" ? "owner" : "updated";
    const detail = field === "status" ? { status: value } : field === "owner" ? { owner: value } : "";
    mutate(action, id, (d) => {
      const y = d.tasks.find((z) => z.id === id); if (!y) return;
      if (field.startsWith("title.")) y.title[field.slice(6)] = value; else y[field] = value;
      y.updatedAt = nowIso();
      if (field === "links") syncLinks(d, id, value);
    }, detail);
  }
  /** Keep links symmetric so both owners see the relationship. */
  function syncLinks(d, id, links) {
    for (const z of d.tasks) {
      if (z.id === id) continue;
      const has = z.links.includes(id), should = links.includes(z.id);
      if (should && !has) z.links.push(id);
      if (!should && has) z.links = z.links.filter((l) => l !== id);
    }
  }

  // ---------------------------------------------------------------- dialogs
  function openWho() {
    const dlg = $("#whoDlg");
    dlg.innerHTML = `<div class="dlg-body"><h3>${esc(t("whoTitle"))}</h3><p>${esc(t("whoSub"))}</p>
      <div class="who-grid">${state.data.people.map((p) => `<button class="who-card" data-pick-who="${p.id}" aria-pressed="${state.me === p.id}">
        <span class="avatar" style="background:${p.color}">${esc(pname(p.id).charAt(0))}</span>${esc(pname(p.id))}</button>`).join("")}</div></div>`;
    dlg.showModal();
  }

  async function openSettings() {
    const dlg = $("#settingsDlg"), plan = state.data.plan;
    const repo = `${CFG.owner}/${CFG.repo}`;
    dlg.innerHTML = `<form method="dialog" class="dlg-body" id="settingsForm">
        <h3>${esc(t("settings"))}</h3>
        <p>${esc(t("settingsIntro"))}</p>
        <div class="pill" style="align-self:flex-start;background:${canEdit() ? "rgba(63,143,79,.15)" : "var(--paper-2)"}">${esc(canEdit() ? t("connectedAs", { login: state.login || "?" }) : t("notConnected"))}</div>
        <div class="field"><label for="s-token">${esc(t("tokenLabel"))}</label>
          <div class="inline-add"><input type="password" id="s-token" dir="ltr" autocomplete="off" placeholder="${esc(t("tokenPh"))}" value="${esc(state.token)}" />
          <button class="btn dark" type="button" data-connect>${esc(t("connect"))}</button></div>
          <span class="muted" style="font-size:12.5px">${esc(t("tokenLocal"))}</span>
        </div>
        <div><div class="field-label" style="margin-bottom:4px">${esc(t("tokenSteps"))}</div>
          <ol class="steps"><li>${esc(t("step1"))}</li><li>${esc(t("step2", { repo }))}</li><li>${esc(t("step3"))}</li></ol></div>
        <hr style="border:0;border-top:1px solid var(--line);width:100%;margin:4px 0" />
        <div class="field-label">${esc(t("planSection"))}</div>
        <div class="row">
          <div class="field"><label for="s-start">${esc(t("startDate"))}</label><input type="date" id="s-start" value="${esc(plan.start)}" ${canEdit() ? "" : "disabled"} /></div>
          <div class="field"><label for="s-target">${esc(t("targetDate"))}</label><input type="date" id="s-target" value="${esc(plan.target)}" ${canEdit() ? "" : "disabled"} /></div>
        </div>
      </form>
      <div class="dlg-foot">
        ${state.token ? `<button class="btn danger" type="button" data-disconnect>${esc(t("disconnect"))}</button><span style="flex:1"></span>` : ""}
        <button class="btn" type="button" data-dlg-close>${esc(t("close"))}</button>
        ${canEdit() ? `<button class="btn primary" type="button" data-save-plan>${esc(t("savePlan"))}</button>` : ""}
      </div>`;
    if (!dlg.open) dlg.showModal();
  }

  // ---------------------------------------------------------------- events
  document.addEventListener("click", (e) => {
    const el = (sel) => e.target.closest(sel);
    let b;
    if (!state.data) return;

    if ((b = el("[data-toggle-done]"))) {
      e.stopPropagation();
      const id = b.dataset.toggleDone, x = taskById(id);
      const status = x.status === "done" ? "todo" : "done";
      mutate("status", id, (d) => { const y = d.tasks.find((z) => z.id === id); if (y) { y.status = status; y.updatedAt = nowIso(); } }, { status });
      return;
    }
    if ((b = el("[data-open-task]")) && !el("#drawer [data-seg]")) { e.preventDefault(); openTask(b.dataset.openTask); return; }
    if (el("[data-close]") || e.target.id === "scrim") { showDrawer(false); return; }

    if ((b = el("#drawer [data-seg] button"))) {
      const name = b.parentElement.dataset.seg, val = b.dataset.val;
      if (!canEdit() && !state.isNew) { openSettings(); return; }
      if (name === "links") {
        const x = state.isNew ? state.draft : taskById(state.openId);
        const links = x.links.includes(val) ? x.links.filter((l) => l !== val) : [...x.links, val];
        setField("links", links);
      } else setField(name, val);
      return;
    }
    if ((b = el("[data-cl-toggle]"))) {
      const cid = b.dataset.clToggle;
      if (state.isNew) { const c = state.draft.checklist.find((c) => c.id === cid); c.done = !c.done; renderDrawer(); return; }
      const id = state.openId;
      const val = !taskById(id).checklist.find((c) => c.id === cid).done;
      mutate("checklist", id, (d) => { const y = d.tasks.find((z) => z.id === id); const c = y?.checklist.find((c) => c.id === cid); if (c) { c.done = val; y.updatedAt = nowIso(); } });
      return;
    }
    if ((b = el("[data-cl-del]"))) {
      const cid = b.dataset.clDel;
      if (state.isNew) { state.draft.checklist = state.draft.checklist.filter((c) => c.id !== cid); renderDrawer(); return; }
      const id = state.openId;
      mutate("checklist", id, (d) => { const y = d.tasks.find((z) => z.id === id); if (y) { y.checklist = y.checklist.filter((c) => c.id !== cid); y.updatedAt = nowIso(); } });
      return;
    }
    if (el("[data-create]")) {
      const x = state.draft;
      x.title.en = $("#f-title-en").value.trim(); x.title.ar = $("#f-title-ar").value.trim();
      x.due = $("#f-due").value; x.notes = $("#f-notes").value;
      if (!x.title.en && !x.title.ar) { toast(t("t_titleReq"), true); return; }
      const task = { ...x, createdAt: nowIso(), updatedAt: nowIso() };
      if (mutate("created", task.id, (d) => { if (!d.tasks.some((z) => z.id === task.id)) d.tasks.push(structuredClone(task)); syncLinks(d, task.id, task.links); })) {
        state.isNew = false; state.draft = null; state.openId = task.id; renderDrawer();
      }
      return;
    }
    if (el("[data-delete]")) {
      if (!state.deleteArmed) { state.deleteArmed = true; renderDrawer(); return; }
      const id = state.openId, x = taskById(id);
      const snap = { title: { ...x.title } };
      showDrawer(false);
      mutate("deleted", id, (d) => { d.tasks = d.tasks.filter((z) => z.id !== id); d.tasks.forEach((z) => (z.links = z.links.filter((l) => l !== id))); }, snap);
      return;
    }
    if ((b = el("[data-pick-who]"))) {
      state.me = b.dataset.pickWho; localStorage.setItem(LS.me, state.me); $("#whoDlg").close(); render(); return;
    }
    if (el("[data-dlg-close]")) { $("#settingsDlg").close(); return; }
    if (el("[data-connect]")) {
      const tok = $("#s-token").value.trim();
      state.token = tok; localStorage.setItem(LS.token, tok);
      verifyToken().then(async (ok) => {
        if (ok) { toast(t("t_tokenOk", { login: state.login })); await load(); }
        else toast(t("t_tokenBad", { repo: `${CFG.owner}/${CFG.repo}` }), true);
        render(); openSettings();
      });
      return;
    }
    if (el("[data-disconnect]")) {
      state.token = ""; state.canWrite = false; state.login = ""; localStorage.removeItem(LS.token); render(); openSettings(); return;
    }
    if (el("[data-save-plan]")) {
      const start = $("#s-start").value, target = $("#s-target").value;
      $("#settingsDlg").close();
      mutate("plan_updated", "", (d) => { d.plan.start = start; d.plan.target = target; });
      return;
    }
    if (el("[data-open-settings]") || el("#settingsBtn")) { openSettings(); return; }
    if (el("#whoBtn")) { openWho(); return; }
    if (el("#langBtn")) { state.lang = state.lang === "ar" ? "en" : "ar"; localStorage.setItem(LS.lang, state.lang); render(); return; }
    if (el("#newTaskBtn")) { if (!canEdit()) { openSettings(); return; } newTask(); return; }
    if ((b = el(".tab[data-view]"))) { state.view = b.dataset.view; localStorage.setItem(LS.view, state.view); renderChrome(); renderView(); return; }
  });

  // text fields commit on change (blur)
  document.addEventListener("change", (e) => {
    const id = e.target.id;
    const map = { "f-title-en": "title.en", "f-title-ar": "title.ar", "f-due": "due", "f-notes": "notes" };
    if (!map[id]) return;
    const f = map[id], val = f === "notes" ? e.target.value : e.target.value.trim();
    if (!state.isNew) setField(f, val);
    else if (f.startsWith("title.")) state.draft.title[f.slice(6)] = val;
    else state.draft[f] = val;
  });

  document.addEventListener("submit", (e) => {
    if (e.target.matches("[data-cl-add]")) {
      e.preventDefault();
      const text = $("#f-cl").value.trim(); if (!text) return;
      const item = { id: uid("c"), text, done: false };
      if (state.isNew) state.draft.checklist.push(item), renderDrawer();
      else { const id = state.openId; mutate("checklist", id, (d) => { const y = d.tasks.find((z) => z.id === id); if (y && !y.checklist.some((c) => c.id === item.id)) { y.checklist.push({ ...item }); y.updatedAt = nowIso(); } }); }
      $("#f-cl")?.focus();
    }
    if (e.target.matches("[data-comment]")) {
      e.preventDefault();
      const text = $("#f-comment").value.trim(); if (!text) return;
      const c = { id: uid("m"), author: state.me, text, at: nowIso() };
      const id = state.openId;
      mutate("comment", id, (d) => { const y = d.tasks.find((z) => z.id === id); if (y && !y.comments.some((z) => z.id === c.id)) { y.comments.push({ ...c }); y.updatedAt = nowIso(); } });
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $("#drawer").classList.contains("open") && !document.querySelector("dialog[open]")) showDrawer(false);
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && e.target.id === "f-comment") e.target.form.requestSubmit();
  });

  // drag & drop on the board
  let dragId = null;
  document.addEventListener("dragstart", (e) => { const c = e.target.closest("[data-drag]"); if (c) { dragId = c.dataset.drag; e.dataTransfer.effectAllowed = "move"; } });
  document.addEventListener("dragover", (e) => { const col = e.target.closest("[data-drop]"); if (col && dragId) { e.preventDefault(); col.classList.add("drop"); } });
  document.addEventListener("dragleave", (e) => { const col = e.target.closest("[data-drop]"); if (col && !col.contains(e.relatedTarget)) col.classList.remove("drop"); });
  document.addEventListener("drop", (e) => {
    const col = e.target.closest("[data-drop]"); if (!col || !dragId) return;
    e.preventDefault(); col.classList.remove("drop");
    const id = dragId, status = col.dataset.drop; dragId = null;
    if (taskById(id)?.status === status) return;
    mutate("status", id, (d) => { const y = d.tasks.find((z) => z.id === id); if (y) { y.status = status; y.updatedAt = nowIso(); } }, { status });
  });

  // ---------------------------------------------------------------- boot
  (async () => {
    $("#hero").innerHTML = `<div class="skeleton"></div><div class="skeleton"></div>`;
    renderChromeLite();
    await verifyToken();
    await load(true);
    render();
    if (!state.me && state.data) openWho();
    // keep both people in sync
    setInterval(() => { if (!document.hidden) load(); }, state.token ? 45000 : 120000);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) load(); });
  })();
  function renderChromeLite() {
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
    setSync("loading");
  }
})();
