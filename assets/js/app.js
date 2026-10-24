"use strict";

(function () {
  try {
    const root = document.getElementById("root");
    root.innerHTML = ""; 

    // --- DEFAULT SETTINGS ---
    const DEFAULT_SETTINGS = {
      autoCloak: false,
      antiClose: false,
      subtexts: true,
      tabDisguise: "none"
    };

    function getSettings() {
      try {
        const raw = localStorage.getItem("diamondSettings");
        return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
      } catch (e) { return { ...DEFAULT_SETTINGS }; }
    }

    function saveSettings(patch) {
      const next = { ...getSettings(), ...patch };
      try { localStorage.setItem("diamondSettings", JSON.stringify(next)); } catch (e) {}
      return next;
    }

    // --- BUILD THE APP CONTAINER ---
    const app = document.createElement("div");
    app.className = "material-app";
    app.setAttribute("data-theme", "dark");

    const bg = document.createElement("div");
    bg.className = "bg-layer";
    app.appendChild(bg);

    // --- BUILD NAVIGATION ---
    const nav = document.createElement("nav");
    nav.className = "glass-nav";
    nav.setAttribute("aria-label", "Main navigation");
    const links = document.createElement("div");
    links.className = "nav-links";
    
    const btnHome = document.createElement("button");
    btnHome.setAttribute("aria-current", "page");
    btnHome.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg><span>Home</span>';
    btnHome.addEventListener("click", () => showView("home"));

    const btnGames = document.createElement("button");
    btnGames.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="11" x2="10" y2="11"></line><line x1="8" y1="9" x2="8" y2="13"></line><line x1="15" y1="12" x2="15.01" y2="12"></line><line x1="18" y1="10" x2="18.01" y2="10"></line><rect x="2" y="6" width="20" height="12" rx="2"></rect></svg><span>Games</span>';
    btnGames.addEventListener("click", () => showView("games"));

    const btnSettings = document.createElement("button");
    btnSettings.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg><span>Settings</span>';
    btnSettings.addEventListener("click", () => showView("settings"));

    links.appendChild(btnHome);
    links.appendChild(btnGames);
    links.appendChild(btnSettings);
    nav.appendChild(links);
    app.appendChild(nav);

    // --- BUILD HOME PAGE ---
    const home = document.createElement("main");
    home.className = "home-page";
    home.innerHTML = `
      <div class="home-center">
        <div class="home-title">
          <h1>diamond</h1>
          <p class="home-sub" id="diamond-subtitle"></p>
        </div>
      </div>
    `;
    app.appendChild(home);

    // --- BUILD GAMES PAGE ---
    const games = document.createElement("main");
    games.className = "games-page";
    games.hidden = true;
    games.innerHTML = `
      <div class="games-inner">
        <div class="games-head">
          <h1>games</h1>
          <p class="games-sub">Pick a game to play.</p>
        </div>
        <div class="games-grid" id="games-grid"></div>
      </div>
    `;
    app.appendChild(games);

    // --- BUILD SETTINGS PAGE ---
    const settings = document.createElement("main");
    settings.className = "settings-page";
    settings.hidden = true;
    settings.innerHTML = `
      <div class="settings-inner">
        <div class="settings-head">
          <h1>settings</h1>
          <p class="settings-sub">Personalize your experience.</p>
        </div>
        <div class="settings-list">
          <section class="setting-row">
            <div class="setting-info">
              <h2>About:Blank Cloak</h2>
              <p>Disguises the page as an about:blank url.</p>
            </div>
            <div class="setting-control">
              <button id="cloak-now" type="button" class="ghost-btn">Cloak now</button>
              <button id="set-autoCloak" type="button" class="switch" role="switch" aria-checked="false"><span class="knob"></span></button>
            </div>
          </section>
          <section class="setting-row">
            <div class="setting-info">
              <h2>Anti-Close</h2>
              <p>Shows a popup before the tab closes.</p>
            </div>
            <div class="setting-control">
              <button id="set-antiClose" type="button" class="switch" role="switch" aria-checked="false"><span class="knob"></span></button>
            </div>
          </section>
          <section class="setting-row">
            <div class="setting-info">
              <h2>Subtexts</h2>
              <p>Toggles the rotating tagline beneath the title.</p>
            </div>
            <div class="setting-control">
              <button id="set-subtexts" type="button" class="switch" role="switch" aria-checked="false"><span class="knob"></span></button>
            </div>
          </section>
          <section class="setting-row">
            <div class="setting-info">
              <h2>Tab Disguise</h2>
              <p>Disguises the tab into looking like another site.</p>
            </div>
            <div class="setting-control">
              <select id="disguise-select" class="select" aria-label="Tab Disguise">
                <option value="none">None</option>
                <option value="google">Google</option>
                <option value="drive">Google Drive</option>
                <option value="classroom">Google Classroom</option>
                <option value="docs">Google Docs</option>
              </select>
            </div>
          </section>
        </div>
        <div class="settings-foot">
          <span class="settings-note">diamond</span>
          <span id="settings-status" class="settings-status" role="status"></span>
          <button id="settings-reset" type="button" class="ghost-btn">Reset settings</button>
        </div>
      </div>
    `;
    app.appendChild(settings);

    root.appendChild(app);

    // --- TAB SWITCHING LOGIC ---
    function showView(viewName) {
      home.hidden = true;
      games.hidden = true;
      settings.hidden = true;
      
      btnHome.removeAttribute("aria-current");
      btnGames.removeAttribute("aria-current");
      btnSettings.removeAttribute("aria-current");

      if (viewName === "home") {
        home.hidden = false;
        btnHome.setAttribute("aria-current", "page");
      } else if (viewName === "games") {
        games.hidden = false;
        btnGames.setAttribute("aria-current", "page");
      } else {
        settings.hidden = false;
        btnSettings.setAttribute("aria-current", "page");
      }
    }

    // --- SUBTEXTS LOGIC ---
    const subtexts = [
      "welcome to diamond!",
      "best unblocker!",
      "diamond on top",
      "def not vibecoded",
      "fully unblocked! i think..",
      "diamond > schoolwork",
      "if youre seeing this, you are now a catboy",
      "insert tuff text",
      "do your work NOW 💔",
      "index.html",
      "poorly coded 😔",
      "please note: some/most of the games may not work",
      "mercuryworkshop the goat"
    ];
    
    function applySubtexts() {
      const el = document.getElementById("diamond-subtitle");
      if (!el) return;
      const enabled = getSettings().subtexts;
      if (enabled) {
        el.hidden = false;
        el.textContent = subtexts[Math.floor(Math.random() * subtexts.length)];
      } else {
        el.hidden = true;
        el.textContent = "";
      }
    }

    // --- TAB DISGUISE LOGIC ---
    const disguises = {
      google: { title: "Google", icon: "https://www.google.com/favicon.ico" },
      drive: { title: "Google Drive", icon: "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png" },
      classroom: { title: "Google Classroom", icon: "https://ssl.gstatic.com/classroom/favicon.png" },
      docs: { title: "Google Docs", icon: "https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico" }
    };

    function applyTabDisguise() {
      const key = getSettings().tabDisguise;
      if (key !== "none" && disguises[key]) {
        document.title = disguises[key].title;
        const link = document.querySelector("link[rel*='icon']");
        if (link) link.href = disguises[key].icon;
      } else {
        document.title = "Diamond";
        const link = document.querySelector("link[rel*='icon']");
        if (link) link.href = "icon.png"; 
      }
    }

    // --- ANTI-CLOSE LOGIC ---
    function beforeUnloadHandler(e) {
      if (e) { e.preventDefault(); e.returnValue = ""; }
      return "";
    }

    function applyAntiClose() {
      window.removeEventListener("beforeunload", beforeUnloadHandler);
      if (getSettings().antiClose) {
        window.addEventListener("beforeunload", beforeUnloadHandler);
        window.onbeforeunload = beforeUnloadHandler;
      } else {
        if (window.onbeforeunload === beforeUnloadHandler) window.onbeforeunload = null;
      }
    }

    // --- CLOAK LOGIC ---
    function doCloak() {
      let popup = window.open("about:blank", "_blank");
      if (!popup || popup.closed) {
        alert("Pop-ups are blocked. Please allow pop-ups to use the cloak feature.");
        return;
      }
      try {
        const iframe = popup.document.createElement("iframe");
        iframe.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;border:none;margin:0;padding:0;";
        iframe.src = window.location.href;
        popup.document.body.style.margin = "0";
        popup.document.body.appendChild(iframe);
        window.location.replace("https://www.google.com");
      } catch (e) {}
    }

    // --- BIND SETTINGS UI ---
    const statusEl = document.getElementById("settings-status");
    function showStatus(msg) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.classList.add("show");
      setTimeout(() => statusEl.classList.remove("show"), 1500);
    }

    function bindSwitch(id, key, callback) {
      const el = document.getElementById(id);
      el.setAttribute("aria-checked", String(getSettings()[key]));
      el.classList.toggle("on", getSettings()[key]);
      
      el.addEventListener("click", () => {
        const next = saveSettings({ [key]: !getSettings()[key] });
        el.setAttribute("aria-checked", String(next[key]));
        el.classList.toggle("on", next[key]);
        if (callback) callback();
        showStatus("Updated!");
      });
    }

    bindSwitch("set-autoCloak", "autoCloak");
    bindSwitch("set-antiClose", "antiClose", applyAntiClose);
    bindSwitch("set-subtexts", "subtexts", applySubtexts);

    const disguiseSelect = document.getElementById("disguise-select");
    disguiseSelect.value = getSettings().tabDisguise;
    disguiseSelect.addEventListener("change", () => {
      saveSettings({ tabDisguise: disguiseSelect.value });
      applyTabDisguise();
      showStatus("Updated!");
    });

    document.getElementById("cloak-now").addEventListener("click", doCloak);

    document.getElementById("settings-reset").addEventListener("click", () => {
      localStorage.removeItem("diamondSettings");
      applySubtexts();
      applyAntiClose();
      applyTabDisguise();
      document.querySelectorAll(".switch").forEach(el => {
        el.setAttribute("aria-checked", "false");
        el.classList.remove("on");
      });
      disguiseSelect.value = "none";
      showStatus("Settings reset!");
    });

    // --- INITIALIZE SETTINGS ON LOAD ---
    applySubtexts();
    applyTabDisguise();
    applyAntiClose();
    
    if (getSettings().autoCloak) {
      setTimeout(doCloak, 500); 
    }

    // ==========================================
    // 👇 YOUR GAMES LIST 👇
    // ==========================================
    const myGames = [
      { name: "Eagle Craft", url: "https://db.duckmath.org/html/minecraft/index.html", icon: "https://cdn.jsdelivr.net/gh/mathlesson/mathlesson.github.io/img/eagle-craft.jpg" },
      { name: "Gun Spin", url: "https://db.duckmath.org/html/gun_spin/index.html", icon: "https://cdn.jsdelivr.net/gh/mathlesson/mathlesson.github.io/img/gun-spin.jpg" },
      { name: "Golf Orbit", url: "https://db.duckmath.org/html/golf_orbit/index.html", icon: "https://cdn.jsdelivr.net/gh/mathlesson/mathlesson.github.io/img/Golf-Orbit-Play-Online.jpg" },
      { name: "Escape Car", url: "https://db.duckmath.org/html/escape_car/index.html", icon: "https://cdn.jsdelivr.net/gh/mathlesson/mathlesson.github.io/img/Escape-Car.jpg" },
      { name: "Granny", url: "https://db.duckmath.org/html/granny/index.html", icon: "https://cdn.jsdelivr.net/gh/mathlesson/mathlesson.github.io/granny.webp" },
      { name: "Race Survival", url: "https://db.duckmath.org/html/race_survival_arena_king/index.html", icon: "https://cdn.jsdelivr.net/gh/mathlesson/mathlesson.github.io/img/race-survival-arena-king.jpg" },
      { name: "Global Guesser", url: "https://db2.duckmath.org/2025/html/global-guesser/pre.html", icon: "https://cdn.jsdelivr.net/gh/mathlesson/mathlesson.github.io/img3/global-guesser.webp" }
    ];

    // --- RENDER GAMES ---
    const gamesGrid = document.getElementById("games-grid");
    myGames.forEach(game => {
      const card = document.createElement("button");
      card.className = "game-card";
      card.innerHTML = `
        <div class="game-card-thumb">
          ${game.icon ? `<img class="game-card-icon" src="${game.icon}" alt="" loading="lazy" />` : `<span class="game-card-initial">${game.name.charAt(0)}</span>`}
        </div>
        <span class="game-card-name">${game.name}</span>
      `;
      
      card.addEventListener("click", () => openGame(game.url));
      gamesGrid.appendChild(card);
    });

    // --- FULL SCREEN GAME PLAYER ---
    function openGame(url) {
      const iframe = document.createElement("iframe");
      iframe.src = url;
      iframe.style.position = "fixed";
      iframe.style.top = "0";
      iframe.style.left = "0";
      iframe.style.width = "100vw";
      iframe.style.height = "100vh";
      iframe.style.border = "none";
      iframe.style.zIndex = "9999";
      iframe.style.backgroundColor = "#000";
      
      const closeBtn = document.createElement("button");
      closeBtn.innerHTML = "✖";
      closeBtn.style.position = "fixed";
      closeBtn.style.top = "15px";
      closeBtn.style.right = "15px";
      closeBtn.style.zIndex = "10000";
      closeBtn.style.width = "40px";
      closeBtn.style.height = "40px";
      closeBtn.style.borderRadius = "50%";
      closeBtn.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
      closeBtn.style.color = "white";
      closeBtn.style.fontSize = "20px";
      closeBtn.style.border = "none";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.display = "flex";
      closeBtn.style.alignItems = "center";
      closeBtn.style.justifyContent = "center";
      
      closeBtn.onclick = () => {
        document.body.removeChild(iframe);
        document.body.removeChild(closeBtn);
      };

      document.body.appendChild(iframe);
      document.body.appendChild(closeBtn);
    }

  } catch (err) {
    document.getElementById("root").innerHTML = `
      <div style="color: white; padding: 50px; font-family: monospace; background: #000; height: 100vh;">
        <h2 style="color: #ff4444;">JavaScript Error</h2>
        <p>${err.message}</p>
      </div>
    `;
  }
})();