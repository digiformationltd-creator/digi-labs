/**
 * The studio itself — state, events, and the one polling loop.
 *
 * Multilingual TTS Architecture:
 * - Studio Voice (Gemini): Multilingual studio character profiles (Charon, Puck, Fenrir, Orus).
 * - Free Voice (Edge-TTS): 140+ global languages & dialects, 320+ natural neural voices.
 * - Dynamic language & locale selector with automatic RTL Nastaliq typography toggle.
 * - Generation polls a job rather than holding a request open.
 */
const Studio = (() => {
  const $ = (id) => document.getElementById(id);

  const state = {
    engines: [],
    engineId: null,
    locales: [],
    locale: "ur-PK",
    voice: "",
    style: "",
    speed: 1,
    rtl: false,
    polling: null,
  };

  const SAMPLES = {
    "ur-PK": "ڈیجی فارمیشن لمیٹڈ وہ سافٹ ویئر بناتا ہے جو خاموشی سے کام کرتا ہے۔ یہ آواز ڈیجی لیبز اسٹوڈیو میں تیار کی گئی ہے۔",
    "ur-IN": "ڈیجی فارمیشن لمیٹڈ وہ سافٹ ویئر بناتا ہے جو خاموشی سے کام کرتا ہے۔ یہ آواز ڈیجی لیبز اسٹوڈیو میں تیار کی گئی ہے۔",
    "hi-IN": "डिजी फॉर्मेशन ऐसा सॉफ्टवेयर बनाती है जो सहजता से काम करता है। यह ऑडियो क्लिप डिजी लैब्स स्टूडियो में तैयार की गई है।",
    "ar-SA": "تصنع ديجي فورميشن برمجيات تنجز العمل بهدوء وموثوقية. تم إنتاج هذا المقطع الصوتي في ديجي لابس استوديو.",
    "ar-AE": "تصنع ديجي فورميشن برمجيات تنجز العمل بهدوء وموثوقية. تم إنتاج هذا المقطع الصوتي في ديجي لابس استوديو.",
    "es-ES": "DigiFormation Ltd crea software que realiza el trabajo silencioso de su empresa. Este audio fue producido en DIGI LABS Studio.",
    "fr-FR": "DigiFormation Ltd crée des logiciels qui accomplissent le travail en toute discrétion. Ce clip a été produit dans DIGI LABS Studio.",
    "de-DE": "DigiFormation Ltd entwickelt Software, die im Hintergrund zuverlässig arbeitet. Dieser Audioclip wurde in DIGI LABS Studio erstellt.",
    "zh-CN": "数码实验室多语言智能语音生成平台。这段音频由 DIGI LABS Studio 制作生成。",
    "ja-JP": "DigiFormation Ltd は業務を円滑に進めるソフトウェアを開発しています。この音声は DIGI LABS Studio で作成されました。",
    "ko-KR": "디지포메이션은 비즈니스를 지원하는 최적의 소프트웨어를 만듭니다. 이 음성은 DIGI LABS Studio에서 제작되었습니다.",
    "pt-BR": "A DigiFormation Ltd desenvolve software inteligente para o seu negócio. Este áudio foi produzido no DIGI LABS Studio.",
    "it-IT": "DigiFormation Ltd crea software che semplifica il lavoro aziendale. Questo audio è stato prodotto in DIGI LABS Studio.",
    "tr-TR": "DigiFormation Ltd işinizi büyüten akıllı yazılımlar üretir. Bu ses kaydı DIGI LABS Studio ile oluşturulmuştur.",
    "ru-RU": "DigiFormation Ltd создает программное обеспечение для автоматизации бизнеса. Этот клип был создан в DIGI LABS Studio.",
    "bn-BD": "ডিজি ফরমেশন এমন সফটওয়্যার তৈরি করে যা ব্যবসার কাজ সহজ করে। এই অডিওটি ডিজি ল্যাবস স্টুডিওতে তৈরি।",
    "fa-IR": "دیجی فورمیشن نرم افزارهایی برای اتوماسیون کسب و کار می‌سازد. این کلیپ صوتی در دیجی لبز تولید شده است.",
    "id-ID": "DigiFormation Ltd menciptakan perangkat lunak pintar untuk bisnis Anda. Audio ini diproduksi di DIGI LABS Studio.",
    "vi-VN": "DigiFormation Ltd phát triển phần mềm thông minh hỗ trợ doanh nghiệp. Bản ghi âm này được tạo trong DIGI LABS Studio.",
    "th-TH": "DigiFormation Ltd สร้างซอฟต์แวร์อัจฉริยะสำหรับธุรกิจของคุณ คลิปเสียงนี้สร้างขึ้นใน DIGI LABS Studio",
    default: "DigiFormation Ltd builds software that does the quiet work: the reports nobody wants to write, the follow-ups nobody remembers to send, and the paperwork that keeps a company compliant. This clip was produced in DIGI LABS Studio."
  };

  // ── Toasts ────────────────────────────────────────────────────────────────
  function toast(message, kind) {
    const el = document.createElement("div");
    el.className = "toast" + (kind ? " " + kind : "");
    el.textContent = message;
    $("toasts").appendChild(el);
    setTimeout(() => el.remove(), kind === "err" ? 7000 : 4000);
  }

  // ── Header status ─────────────────────────────────────────────────────────
  async function refreshStatus() {
    const pill = $("statusPill"), text = $("statusText");
    try {
      const h = await API.health();
      pill.className = "status-pill online";
      text.textContent = h.gemini_keys
        ? `Studio online · ${h.gemini_keys} key${h.gemini_keys === 1 ? "" : "s"}`
        : "Studio online";
      if ($("aboutText")) $("aboutText").textContent = `DIGI LABS ${h.version} · DigiFormation Ltd`;
      $("keyBanner").classList.toggle("on", !h.gemini_keys);
    } catch {
      pill.className = "status-pill offline";
      text.textContent = "Studio offline";
    }
  }

  // ── Engines & Locales ─────────────────────────────────────────────────────
  async function loadEngines() {
    let data;
    try { data = await API.engines(); }
    catch (e) { toast(e.message, "err"); return; }

    state.engines = data.engines || [];

    try {
      const lData = await API.languages();
      state.locales = lData.locales || [];
    } catch {
      const freeEng = state.engines.find((e) => e.id === "free");
      state.locales = (freeEng && freeEng.locales) || [];
    }

    renderLocales();

    const list = $("engineList");
    list.innerHTML = "";

    for (const e of state.engines) {
      const b = document.createElement("button");
      b.className = "engine";
      b.type = "button";
      b.dataset.id = e.id;
      b.setAttribute("aria-pressed", "false");
      if (!e.ready) b.disabled = true;

      const quotaChip = e.quota
        ? `<span class="chip ${e.quota.remaining > 0 ? "ok" : "warn"}">${e.quota.remaining}/${e.quota.total} left today</span>`
        : `<span class="chip ok">unlimited</span>`;

      b.innerHTML =
        `<div class="engine-top">
           <div>
             <div class="engine-name">${e.name}</div>
             <div class="engine-sub">${e.subtitle}</div>
           </div>
           ${quotaChip}
         </div>
         <div class="engine-for">${e.best_for}</div>` +
        (e.ready ? "" : `<div class="engine-why">${e.reason}</div>`);

      b.addEventListener("click", () => selectEngine(e.id));
      list.appendChild(b);
    }

    // Open on the first engine that can actually run
    const firstReady = state.engines.find((e) => e.ready);
    if (firstReady) selectEngine(firstReady.id);
    else {
      $("generateBtn").disabled = true;
      toast("No voice engine is ready yet — open Settings.", "err");
    }
  }

  function renderLocales() {
    const sel = $("langSelect");
    if (!sel) return;
    const previous = state.locale || sel.value;
    sel.innerHTML = "";

    for (const loc of state.locales) {
      const opt = document.createElement("option");
      opt.value = loc.code;
      opt.textContent = `${loc.label} (${loc.voices.length} voice${loc.voices.length === 1 ? "" : "s"})`;
      if (loc.rtl) opt.dataset.rtl = "true";
      sel.appendChild(opt);
    }

    if (previous && state.locales.some((l) => l.code === previous)) {
      sel.value = previous;
      state.locale = previous;
    } else if (state.locales.length) {
      state.locale = state.locales[0].code;
      sel.value = state.locale;
    }

    applyLocaleDirection();
  }

  function applyLocaleDirection() {
    const loc = state.locales.find((l) => l.code === state.locale);
    const isRtl = !!(loc && loc.rtl);
    state.rtl = isRtl;
    $("textEditor").classList.toggle("rtl", isRtl);
    $("urduToggle").setAttribute("aria-pressed", String(isRtl));
  }

  function selectEngine(id) {
    const engine = state.engines.find((e) => e.id === id);
    if (!engine || !engine.ready) return;
    state.engineId = id;

    for (const b of document.querySelectorAll(".engine")) {
      b.setAttribute("aria-pressed", String(b.dataset.id === id));
    }

    updateVoicesForEngine();

    const style = $("styleSelect");
    style.innerHTML = "";
    for (const s of engine.styles || []) {
      const o = document.createElement("option");
      o.value = typeof s === "string" ? s : s.id;
      o.textContent = typeof s === "string" ? (s.charAt(0).toUpperCase() + s.slice(1)) : s.label;
      style.appendChild(o);
    }
    state.style = style.value;

    const speedOn = id === "free";
    $("speedSlider").disabled = !speedOn;
    $("speedReset").disabled = !speedOn;
  }

  function updateVoicesForEngine() {
    const engine = state.engines.find((e) => e.id === state.engineId);
    if (!engine) return;

    const voice = $("voiceSelect");
    const hint = $("voiceHint");
    voice.innerHTML = "";

    const currentLoc = state.locales.find((l) => l.code === state.locale);

    if (state.engineId === "studio") {
      // Gemini Studio Voice: Universal Multilingual generative audio
      for (const v of engine.voices || []) {
        const o = document.createElement("option");
        o.value = v.id;
        o.textContent = `${v.label} (Studio Multilingual)`;
        voice.appendChild(o);
      }
      if (hint) {
        hint.style.display = "block";
        hint.textContent = `⚡ Gemini 2.5 Studio: Speaks ${currentLoc ? currentLoc.label : "selected language"} with high-fidelity studio inflection.`;
      }
      $("generateBtn").disabled = false;
    } else {
      // Free Voice (Edge-TTS): Exact matching neural voices
      const compatibleVoices = (currentLoc && currentLoc.voices) || [];
      if (compatibleVoices.length > 0) {
        for (const v of compatibleVoices) {
          const o = document.createElement("option");
          o.value = v.id;
          o.textContent = v.label;
          voice.appendChild(o);
        }
        if (hint) {
          hint.style.display = "block";
          hint.textContent = `🎙️ Free Voice: ${compatibleVoices.length} native neural voice(s) for ${currentLoc.label}.`;
        }
        $("generateBtn").disabled = false;
      } else {
        const o = document.createElement("option");
        o.value = "";
        o.disabled = true;
        o.selected = true;
        o.textContent = `No Free Voice available for ${currentLoc ? currentLoc.label : "this language"}`;
        voice.appendChild(o);
        if (hint) {
          hint.style.display = "block";
          hint.textContent = `⚠️ No Free Voice for this dialect. Switch to Studio Voice for universal multilingual synthesis.`;
        }
        $("generateBtn").disabled = true;
      }
    }

    state.voice = voice.value;
  }

  // ── Editor ────────────────────────────────────────────────────────────────
  function counts() {
    const t = $("textEditor").value;
    $("charCount").textContent = String(t.length);
    $("wordCount").textContent = String((t.trim().match(/\S+/g) || []).length);
  }

  // ── Generate ──────────────────────────────────────────────────────────────
  async function generate() {
    const text = $("textEditor").value.trim();
    if (!text) { toast("Type or paste some text first."); return; }
    if (!state.engineId) { toast("Pick a voice engine first."); return; }
    if (!state.voice) { toast("Select a valid voice first."); return; }

    const btn = $("generateBtn");
    btn.disabled = true;
    showProgress("Queued", 0);
    $("resultPanel").classList.remove("on");

    let job;
    try {
      job = await API.generate({
        engine: state.engineId,
        text,
        voice: state.voice,
        language: state.locale || (state.rtl ? "ur-PK" : "en-US"),
        style: state.style,
        speed: state.speed,
      });
    } catch (e) {
      hideProgress(); btn.disabled = false; toast(e.message, "err"); return;
    }

    poll(job.job_id);
  }

  function poll(id) {
    clearInterval(state.polling);
    state.polling = setInterval(async () => {
      let j;
      try { j = await API.job(id); }
      catch (e) {
        clearInterval(state.polling); hideProgress();
        $("generateBtn").disabled = false; toast(e.message, "err"); return;
      }

      showProgress(j.stage, j.progress);

      if (j.status === "done") {
        clearInterval(state.polling);
        hideProgress();
        $("generateBtn").disabled = false;
        await showResult(j);
        toast("Voice ready.", "ok");
        loadHistory();
        loadEngines();
      } else if (j.status === "error") {
        clearInterval(state.polling);
        hideProgress();
        $("generateBtn").disabled = false;
        toast(j.error || "Generation failed.", "err");
      }
    }, 1200);
  }

  function showProgress(stage, pct) {
    $("progress").classList.add("on");
    $("progressStage").textContent = stage || "Working";
    $("progressPct").textContent = (pct || 0) + "%";
    $("progressFill").style.width = (pct || 0) + "%";
  }
  function hideProgress() { $("progress").classList.remove("on"); }

  async function showResult(j) {
    $("resultPanel").classList.add("on");
    $("resultHint").textContent = j.engine_display_name || "";
    $("resultMeta").innerHTML =
      [`${j.voice || "—"}`, `${j.duration_seconds ? j.duration_seconds + "s" : "—"}`,
       `${(j.output_format || "mp3").toUpperCase()}`,
       new Date(j.created_at).toLocaleTimeString()]
        .map((x) => `<span class="chip">${x}</span>`).join("");
    await Player.load(j.url);
    $("resultPanel").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // ── History ───────────────────────────────────────────────────────────────
  async function loadHistory() {
    const box = $("historyList");
    let items = [];
    try { items = (await API.history()).items || []; }
    catch { /* an empty history and an unreachable one look the same */ }

    if (!items.length) {
      box.innerHTML =
        `<div class="empty"><div class="empty-mark">♪</div>
         <div>Nothing here yet</div>
         <p>Clips you generate will be listed here.</p></div>`;
      return;
    }

    box.innerHTML = "";
    for (const it of items) {
      const row = document.createElement("div");
      row.className = "hist";
      row.innerHTML =
        `<button class="play-btn" aria-label="Play">▶</button>
         <div class="hist-body">
           <div class="hist-text"></div>
           <div class="hist-meta">${it.engine_display_name} · ${it.voice || "—"} · ${it.duration_seconds || "?"}s · ${new Date(it.created_at).toLocaleString()}</div>
         </div>
         <button class="btn btn-ghost btn-sm" data-act="del">Delete</button>`;
      row.querySelector(".hist-text").textContent = it.text;

      row.querySelector(".play-btn").addEventListener("click", async () => {
        await Player.load(it.url);
        Player.play();
        switchView("studio");
        $("resultPanel").classList.add("on");
        $("resultHint").textContent = it.engine_display_name;
        $("resultMeta").innerHTML = [it.voice || "—", (it.duration_seconds || "?") + "s", "MP3"]
          .map((x) => `<span class="chip">${x}</span>`).join("");
      });

      row.querySelector('[data-act="del"]').addEventListener("click", async () => {
        try { await API.removeHistory(it.id); loadHistory(); }
        catch (e) { toast(e.message, "err"); }
      });

      box.appendChild(row);
    }
  }

  // ── Settings ──────────────────────────────────────────────────────────────
  async function loadSettings() {
    let s;
    try { s = await API.settings(); }
    catch (e) { toast(e.message, "err"); return; }

    const box = $("slotList");
    box.innerHTML = "";
    s.slots.forEach((slot, i) => {
      const row = document.createElement("div");
      row.className = "slot";
      row.innerHTML =
        `<span class="slot-name">Gemini key ${i + 1}</span>
         <div class="grow"><input type="password" placeholder="${slot.filled ? "•••••••• saved" : "paste a key"}"></div>
         <button class="btn btn-sm">Save</button>` +
        (slot.filled ? `<button class="btn btn-ghost btn-sm" data-act="clear">Remove</button>` : "");

      const input = row.querySelector("input");
      row.querySelector(".btn").addEventListener("click", async () => {
        const v = input.value.trim();
        if (!v) { toast("Paste a key first."); return; }
        try {
          await API.saveKey(slot.name, v);
          input.value = "";
          toast("Key saved.", "ok");
          loadSettings(); loadEngines(); refreshStatus();
        } catch (e) { toast(e.message, "err"); }
      });

      const clear = row.querySelector('[data-act="clear"]');
      if (clear) clear.addEventListener("click", async () => {
        try { await API.saveKey(slot.name, ""); toast("Key removed."); loadSettings(); loadEngines(); refreshStatus(); }
        catch (e) { toast(e.message, "err"); }
      });

      box.appendChild(row);
    });
  }

  // ── Views ─────────────────────────────────────────────────────────────────
  function switchView(name) {
    for (const t of document.querySelectorAll(".tab")) {
      t.setAttribute("aria-selected", String(t.dataset.view === name));
    }
    for (const v of document.querySelectorAll(".view")) {
      v.classList.toggle("active", v.id === "view-" + name);
    }
    if (name === "history") loadHistory();
    if (name === "settings") loadSettings();
  }

  // ── Wiring ────────────────────────────────────────────────────────────────
  function init() {
    Wave.attach($("wave"));
    Player.attach({ play: $("playBtn"), seek: $("seek"), time: $("timeLabel") });

    // Window controls
    const win = window.studio || {};
    $("wcMin") && $("wcMin").addEventListener("click", () => win.minimize && win.minimize());
    $("wcMax") && $("wcMax").addEventListener("click", () => win.maximize && win.maximize());
    $("wcClose") && $("wcClose").addEventListener("click", () => win.close && win.close());

    // Key banner buttons
    $("kbGet") && $("kbGet").addEventListener("click", () => {
      const url = "https://aistudio.google.com/apikey";
      if (win.openExternal) win.openExternal(url); else window.open(url, "_blank");
    });
    $("kbAdd") && $("kbAdd").addEventListener("click", () => switchView("settings"));

    // DIGI BIZ OS CTA buttons
    const openDigiBizPricing = (e) => {
      e && e.preventDefault();
      const url = "https://www.digibizos.co.uk/pricing";
      if (win.openExternal) win.openExternal(url); else window.open(url, "_blank");
    };
    $("tryDigiBizBtn") && $("tryDigiBizBtn").addEventListener("click", openDigiBizPricing);
    $("tryDigiBizAside") && $("tryDigiBizAside").addEventListener("click", openDigiBizPricing);
    $("tryDigiBizMainBtn") && $("tryDigiBizMainBtn").addEventListener("click", openDigiBizPricing);

    for (const t of document.querySelectorAll(".tab")) {
      t.addEventListener("click", () => switchView(t.dataset.view));
    }

    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="http"], a[href^="https"], a[href^="mailto"]');
      if (link && win.openExternal) {
        e.preventDefault();
        win.openExternal(link.href);
      }
    });

    $("textEditor").addEventListener("input", counts);
    $("clearBtn").addEventListener("click", () => { $("textEditor").value = ""; counts(); });

    $("sampleBtn").addEventListener("click", () => {
      const sample = SAMPLES[state.locale] ||
                     SAMPLES[state.locale?.split("-")[0]] ||
                     (state.rtl ? SAMPLES["ur-PK"] : SAMPLES.default);
      $("textEditor").value = sample;
      counts();
    });

    $("urduToggle").addEventListener("click", (e) => {
      state.rtl = !state.rtl;
      e.currentTarget.setAttribute("aria-pressed", String(state.rtl));
      $("textEditor").classList.toggle("rtl", state.rtl);
    });

    $("langSelect").addEventListener("change", (e) => {
      state.locale = e.target.value;
      applyLocaleDirection();
      updateVoicesForEngine();
    });

    $("voiceSelect").addEventListener("change", (e) => { state.voice = e.target.value; });
    $("styleSelect").addEventListener("change", (e) => { state.style = e.target.value; });

    $("speedSlider").addEventListener("input", (e) => {
      state.speed = Number(e.target.value);
      $("speedVal").textContent = state.speed.toFixed(2) + "×";
    });
    $("speedReset").addEventListener("click", () => {
      state.speed = 1; $("speedSlider").value = "1"; $("speedVal").textContent = "1.00×";
    });

    $("generateBtn").addEventListener("click", generate);

    $("saveBtn").addEventListener("click", async () => {
      const url = Player.url();
      if (!url) { toast("Generate something first."); return; }
      await saveAudioFrom(url, "digi-labs.mp3");
    });

    $("folderBtn").addEventListener("click", () => {
      if (window.studio && window.studio.openFolder) window.studio.openFolder();
      else toast("The audio folder is only available in the desktop app.");
    });

    $("clearHistoryBtn").addEventListener("click", async () => {
      try { await API.clearHistory(); loadHistory(); toast("History cleared."); }
      catch (e) { toast(e.message, "err"); }
    });

    window.addEventListener("resize", () => Wave.paint(0));

    counts();
    refreshStatus();
    loadEngines();
    loadHistory();
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.readAsDataURL(blob);
    });
  }

  const fileToDataUrl = (file) => blobToDataUrl(file);

  async function saveAudioFrom(url, name) {
    if (window.studio && window.studio.saveAudio) {
      const dataUrl = await fetch(url).then((r) => r.blob()).then(blobToDataUrl);
      const r = await window.studio.saveAudio(name, dataUrl);
      if (r && r.ok) toast("Saved.", "ok");
      else if (r && !r.canceled) toast(r.error || "Could not save.", "err");
    } else {
      const a = document.createElement("a");
      a.href = url; a.download = name; a.click();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    init();
    Transcribe.init();
    Effects.init();
  });
  return { toast, switchView, blobToDataUrl, fileToDataUrl, saveAudioFrom };
})();
