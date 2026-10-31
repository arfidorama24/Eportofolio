/* ============================================================
   E-Portfolio Arfido — Admin Studio Logic
   CRUD konten, upload media, Google Drive, backup.
   ============================================================ */
(function () {
  "use strict";

  const Store = window.PortfolioStore;
  const Media = window.PortfolioMedia;
  const Drive = window.PortfolioDrive;
  const icon = Store.icon;
  const esc = Store.escapeHTML;

  const SESSION_KEY = "eportfolio:admin:session";
  const COLLECTIONS = {
    lesson: "lessons",
    video: "videos",
    reflection: "reflections",
    archive: "archives"
  };
  const VIEW_META = {
    dashboard: { title: "Ringkasan", crumb: "Ringkasan" },
    profil: { title: "Profil Mahasiswa", crumb: "Profil" },
    rancangan: { title: "Rancangan Pembelajaran", crumb: "Rancangan" },
    video: { title: "Video Praktik Mengajar", crumb: "Video" },
    refleksi: { title: "Analisis & Refleksi", crumb: "Refleksi" },
    arsip: { title: "Arsip Google Drive", crumb: "Arsip" },
    drive: { title: "Google Drive", crumb: "Drive" },
    pengaturan: { title: "Pengaturan", crumb: "Pengaturan" }
  };

  let data = Store.load();
  let saveTimer = null;
  let editing = null;

  const $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };
  const $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  /* ----------------------------- boot ----------------------------- */

  function init() {
    injectIcons();
    Drive.configure(data.settings.drive);
    bindLogin();
    bindShell();
    bindProfile();
    bindSettings();
    bindDrivePanel();
    bindEditor();
    bindDelegates();
    renderAll();

    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      showApp();
    } else {
      showLogin();
    }
  }

  function injectIcons(root) {
    $$("[data-icon]", root).forEach(function (el) {
      el.innerHTML = icon(el.getAttribute("data-icon"), Number(el.getAttribute("data-size") || 18));
    });
  }

  function toast(message) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("is-visible");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      el.classList.remove("is-visible");
    }, 2800);
  }

  /* ----------------------------- auth ----------------------------- */

  async function hashPass(value) {
    const text = String(value);
    if (window.crypto && window.crypto.subtle && window.isSecureContext) {
      const buf = await window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      return Array.from(new Uint8Array(buf))
        .map(function (b) {
          return b.toString(16).padStart(2, "0");
        })
        .join("");
    }
    let h = 5381;
    for (let i = 0; i < text.length; i++) {
      h = ((h << 5) + h) ^ text.charCodeAt(i);
    }
    return "fb" + (h >>> 0).toString(16);
  }

  async function verifyPass(value) {
    const stored = data.settings.passHash;
    if (!stored) return value === Store.DEFAULT_PASSCODE;
    return (await hashPass(value)) === stored;
  }

  function bindLogin() {
    const form = document.getElementById("loginForm");
    const error = document.getElementById("loginError");
    const pass = document.getElementById("loginPass");
    const hint = document.getElementById("loginHint");

    if (hint && data.settings.passHash) hint.hidden = true;

    const toggle = document.getElementById("togglePass");
    if (toggle && pass) {
      toggle.addEventListener("click", function () {
        const show = pass.type === "password";
        pass.type = show ? "text" : "password";
        toggle.setAttribute("aria-label", show ? "Sembunyikan passcode" : "Tampilkan passcode");
      });
    }

    if (!form) return;
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (error) error.hidden = true;

      const value = pass.value;
      if (!value) return;

      try {
        const ok = await verifyPass(value);
        if (!ok) {
          if (error) {
            error.textContent = "Passcode salah. Silakan coba lagi.";
            error.hidden = false;
          }
          pass.select();
          return;
        }

        if (!data.settings.passHash) {
          data.settings.passHash = await hashPass(value);
          Store.save(data);
          if (hint) hint.hidden = true;
        }

        sessionStorage.setItem(SESSION_KEY, "1");
        pass.value = "";
        showApp();
        toast("Selamat datang di Studio, Arfido.");
      } catch (err) {
        if (error) {
          error.textContent = "Terjadi kesalahan: " + err.message;
          error.hidden = false;
        }
      }
    });
  }

  function showLogin() {
    document.getElementById("loginView").hidden = false;
    document.getElementById("adminApp").hidden = true;
    document.body.classList.remove("modal-open");
  }

  function showApp() {
    document.getElementById("loginView").hidden = true;
    document.getElementById("adminApp").hidden = false;
    renderAll();
    updateStorage();
  }

  /* ----------------------------- save ----------------------------- */

  function markSaving() {
    const el = document.getElementById("saveStatus");
    if (!el) return;
    el.classList.add("is-saving");
    el.innerHTML = '<span class="save-dot"></span> Menyimpan…';
  }

  function saveNow(showToast) {
    Store.save(data);
    const el = document.getElementById("saveStatus");
    if (el) {
      el.classList.remove("is-saving");
      const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
      el.innerHTML = '<span class="save-dot"></span> Tersimpan · ' + time;
    }
    updateStorage();
    if (showToast) toast("Perubahan tersimpan.");
  }

  function scheduleSave() {
    markSaving();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      saveNow(false);
    }, 700);
  }

  /* ----------------------------- bindings ----------------------------- */

  function fillBindings(root) {
    $$("[data-bind]", root).forEach(function (el) {
      const path = el.getAttribute("data-bind");
      const value = Store.getPath(data, path);
      if (el.type === "checkbox") {
        el.checked = Boolean(value);
      } else if (el.type === "number") {
        el.value = value == null || value === "" ? "" : value;
      } else {
        el.value = value == null ? "" : value;
      }
    });
  }

  function bindInputs(root) {
    $$("[data-bind]", root).forEach(function (el) {
      if (el.dataset.bound === "1") return;
      el.dataset.bound = "1";

      const handler = function () {
        const path = el.getAttribute("data-bind");
        let value;
        if (el.type === "checkbox") value = el.checked;
        else if (el.type === "number") value = el.value === "" ? "" : Number(el.value);
        else value = el.value;

        Store.setPath(data, path, value);

        if (path.indexOf("settings.drive") === 0) {
          Drive.configure(data.settings.drive);
          updateDriveUI();
        }

        scheduleSave();
      };

      el.addEventListener("input", handler);
      el.addEventListener("change", handler);
    });
  }

  function renderAll() {
    fillBindings(document);
    bindInputs(document);
    renderUnique();
    renderProfilePhoto();
    renderLists();
    renderDashboard();
    updateDriveUI();
    updateAbout();
    updateStorage();
    updatePassHint();
    injectIcons();
  }

  function renderLists() {
    renderLessons();
    renderVideos();
    renderReflections();
    renderArchives();
    updateCounts();
    renderDashboard();
  }

  function updateCounts() {
    setText("countLessons", (data.lessons || []).length);
    setText("countVideos", (data.videos || []).length);
    setText("countReflections", (data.reflections || []).length);
    setText("countArchives", (data.archives || []).length);
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function updatePassHint() {
    const hint = document.getElementById("loginHint");
    if (hint) hint.hidden = Boolean(data.settings.passHash);
  }

  /* ----------------------------- navigation ----------------------------- */

  function setView(view) {
    if (!VIEW_META[view]) return;
    $$(".side-link").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-view") === view);
    });
    $$("[data-panel]").forEach(function (panel) {
      panel.classList.toggle("is-active", panel.getAttribute("data-panel") === view);
    });
    setText("viewTitle", VIEW_META[view].title);
    setText("crumb", VIEW_META[view].crumb);
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.classList.remove("sidebar-open");

    if (view === "dashboard") renderDashboard();
    if (view === "drive") updateDriveUI();
    if (view === "profil") {
      fillBindings(document.querySelector('[data-panel="profil"]'));
      renderProfilePhoto();
    }
  }

  function bindShell() {
    $$(".side-link").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setView(btn.getAttribute("data-view"));
      });
    });

    $$(".quick-btn[data-view]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setView(btn.getAttribute("data-view"));
      });
    });

    const open = document.getElementById("sidebarOpen");
    const close = document.getElementById("sidebarClose");
    const scrim = document.getElementById("sidebarScrim");
    if (open)
      open.addEventListener("click", function () {
        document.body.classList.add("sidebar-open");
      });
    if (close)
      close.addEventListener("click", function () {
        document.body.classList.remove("sidebar-open");
      });
    if (scrim)
      scrim.addEventListener("click", function () {
        document.body.classList.remove("sidebar-open");
      });

    const logout = document.getElementById("logoutBtn");
    if (logout) {
      logout.addEventListener("click", function () {
        sessionStorage.removeItem(SESSION_KEY);
        location.reload();
      });
    }

    const settings = document.getElementById("originHint");
    if (settings) settings.textContent = location.origin;
  }

  function setViewFromEvent(e) {
    const viewBtn = e.target.closest("[data-view]");
    if (viewBtn && !viewBtn.classList.contains("side-link")) {
      const view = viewBtn.getAttribute("data-view");
      if (VIEW_META[view]) setView(view);
    }
  }

  /* ----------------------------- profile ----------------------------- */

  function bindProfile() {
    const input = document.getElementById("profilePhotoInput");
    const remove = document.getElementById("profilePhotoRemove");
    const addUnique = document.getElementById("addUnique");

    if (input) {
      input.addEventListener("change", async function () {
        const file = input.files && input.files[0];
        if (!file) return;
        try {
          const result = await Media.put(file, { name: "Foto profil" });
          data.profile.photo = result.id;
          saveNow(false);
          await renderProfilePhoto();
          toast("Foto profil diperbarui.");
        } catch (err) {
          toast(err.message);
        }
        input.value = "";
      });
    }

    if (remove) {
      remove.addEventListener("click", async function () {
        if (!data.profile.photo) return;
        const id = data.profile.photo;
        data.profile.photo = null;
        saveNow(false);
        await Media.remove(id);
        renderProfilePhoto();
        toast("Foto profil dihapus.");
      });
    }

    if (addUnique) {
      addUnique.addEventListener("click", function () {
        const list = data.profile.story.uniqueness || [];
        if (list.length >= 6) {
          toast("Maksimal 6 kartu keunikan.");
          return;
        }
        list.push({ icon: "sparkles", title: "Keunikan baru", text: "" });
        data.profile.story.uniqueness = list;
        saveNow(false);
        renderUnique();
      });
    }
  }

  async function renderProfilePhoto() {
    const wrap = document.getElementById("profilePhotoPreview");
    if (!wrap) return;
    const img = wrap.querySelector("img");
    const initials = wrap.querySelector("span");
    if (initials) initials.textContent = data.profile.initials || "AR";

    if (data.profile.photo) {
      const url = await Media.url(data.profile.photo);
      if (url && img) {
        img.src = url;
        img.hidden = false;
        if (initials) initials.style.display = "none";
        return;
      }
    }
    if (img) {
      img.hidden = true;
      img.removeAttribute("src");
    }
    if (initials) initials.style.display = "";
  }

  const UNIQUE_ICONS = [
    ["mountain", "Gunung / dataran"],
    ["users", "Masyarakat / gotong royong"],
    ["leaf", "Alam / pertanian"],
    ["sparkles", "Ciri khas / kreativitas"],
    ["code", "Teknologi / kode"],
    ["cpu", "Komputer"],
    ["database", "Data"],
    ["award", "Prestasi"],
    ["sun", "Budaya / cuaca"],
    ["star", "Nilai / keunggulan"],
    ["compass", "Arah / tujuan"]
  ];

  function renderUnique() {
    const wrap = document.getElementById("uniqueRepeater");
    if (!wrap) return;
    const list = data.profile.story.uniqueness || [];

    wrap.innerHTML = list
      .map(function (item, i) {
        const options = UNIQUE_ICONS.map(function (pair) {
          return (
            '<option value="' +
            pair[0] +
            '"' +
            (item.icon === pair[0] ? " selected" : "") +
            ">" +
            esc(pair[1]) +
            "</option>"
          );
        }).join("");
        return (
          '<div class="rep-item">' +
          '<div class="rep-head"><strong>Kartu ' +
          (i + 1) +
          '</strong><button class="icon-btn danger" data-remove-unique="' +
          i +
          '" title="Hapus" aria-label="Hapus kartu">' +
          icon("trash", 14) +
          "</button></div>" +
          '<div class="rep-grid">' +
          '<label class="field"><span>Ikon</span><select data-bind="profile.story.uniqueness.' +
          i +
          '.icon">' +
          options +
          "</select></label>" +
          '<label class="field"><span>Judul</span><input type="text" data-bind="profile.story.uniqueness.' +
          i +
          '.title" /></label>' +
          '<label class="field"><span>Deskripsi</span><textarea rows="2" data-bind="profile.story.uniqueness.' +
          i +
          '.text"></textarea></label>' +
          "</div></div>"
        );
      })
      .join("");

    fillBindings(wrap);
    bindInputs(wrap);
    injectIcons(wrap);

    $$("[data-remove-unique]", wrap).forEach(function (btn) {
      btn.addEventListener("click", function () {
        const idx = Number(btn.getAttribute("data-remove-unique"));
        data.profile.story.uniqueness.splice(idx, 1);
        saveNow(false);
        renderUnique();
      });
    });
  }

  /* ----------------------------- dashboard ----------------------------- */

  function renderDashboard() {
    const wrap = document.getElementById("dashStats");
    if (!wrap) return;

    const lessons = data.lessons || [];
    const videos = data.videos || [];
    const archives = data.archives || [];
    const reflections = data.reflections || [];
    const modulLinked = lessons.filter(function (l) {
      return l.driveUrl;
    }).length;
    const videoLinked = videos.filter(function (v) {
      return v.url;
    }).length;
    const archiveLinked = archives.filter(function (a) {
      return a.driveUrl;
    }).length;

    const cards = [
      { icon: "book", value: lessons.length, label: "Modul Ajar" },
      { icon: "video", value: videos.length, label: "Video Praktik" },
      { icon: "folder", value: archives.length, label: "Arsip Drive" },
      { icon: "refresh", value: reflections.length, label: "Refleksi Siklus" }
    ];
    wrap.innerHTML = cards
      .map(function (c) {
        return (
          '<div class="dash-stat"><span class="ds-icon">' +
          icon(c.icon, 17) +
          "</span><strong>" +
          c.value +
          "</strong><span>" +
          c.label +
          "</span></div>"
        );
      })
      .join("");

    const checks = [
      { label: "Foto profil diunggah", done: Boolean(data.profile.photo) },
      {
        label: "Narasi asal daerah terisi",
        done: String(data.profile.story.origin || "").length > 80
      },
      { label: "Empat modul ajar tersedia (siklus 1–4)", done: lessons.length >= 4 },
      {
        label: "Semua modul memiliki tautan Google Drive",
        done: lessons.length > 0 && modulLinked === lessons.length
      },
      { label: "Minimal satu video praktik tertaut", done: videoLinked > 0 },
      { label: "Arsip Google Drive sudah ditautkan", done: archiveLinked > 0 },
      { label: "Folder Google Drive tersambung", done: Boolean(data.settings.drive.folderId) },
      { label: "Passcode admin sudah diganti", done: Boolean(data.settings.passHash) }
    ];
    const done = checks.filter(function (c) {
      return c.done;
    }).length;
    const pct = Math.round((done / checks.length) * 100);

    setText("completePct", pct + "%");
    const bar = document.getElementById("completeBar");
    if (bar) bar.style.width = pct + "%";

    const list = document.getElementById("checklist");
    if (list) {
      list.innerHTML = checks
        .map(function (c) {
          return (
            '<li class="' +
            (c.done ? "done" : "") +
            '"><span class="ck">' +
            icon("check", 12) +
            "</span>" +
            esc(c.label) +
            "</li>"
          );
        })
        .join("");
    }

    const table = document.getElementById("statusTable");
    if (table) {
      const rows = [
        { label: "Modul ajar", total: lessons.length, linked: modulLinked, note: "tautan Drive" },
        { label: "Video praktik", total: videos.length, linked: videoLinked, note: "video tertaut" },
        { label: "Arsip Drive", total: archives.length, linked: archiveLinked, note: "berkas tertaut" },
        {
          label: "Refleksi",
          total: reflections.length,
          linked: reflections.length,
          note: "terisi"
        }
      ];
      table.innerHTML = rows
        .map(function (r) {
          return (
            '<div class="status-row"><span>' +
            r.label +
            "</span><span>" +
            r.total +
            "</span><span>" +
            r.linked +
            " " +
            r.note +
            "</span></div>"
          );
        })
        .join("");
    }

    updateCounts();
    updateDriveUI();
    updateAbout();
  }

  /* ----------------------------- lists ----------------------------- */

  function linkedBadge(ok, okText, warnText) {
    return ok
      ? '<span class="badge-ok">' + icon("check", 11) + " " + okText + "</span>"
      : '<span class="badge-warn">' + icon("alert", 11) + " " + warnText + "</span>";
  }

  function actionButtons(kind, id) {
    return (
      '<div class="li-actions">' +
      '<button class="icon-btn" data-edit="' +
      kind +
      ":" +
      id +
      '" title="Edit" aria-label="Edit">' +
      icon("edit", 14) +
      "</button>" +
      '<button class="icon-btn" data-duplicate="' +
      kind +
      ":" +
      id +
      '" title="Duplikat" aria-label="Duplikat">' +
      icon("copy", 14) +
      "</button>" +
      '<button class="icon-btn danger" data-delete="' +
      kind +
      ":" +
      id +
      '" title="Hapus" aria-label="Hapus">' +
      icon("trash", 14) +
      "</button></div>"
    );
  }

  function renderLessons() {
    const wrap = document.getElementById("lessonList");
    if (!wrap) return;
    const lessons = (data.lessons || []).slice().sort(function (a, b) {
      return a.cycle - b.cycle;
    });

    if (!lessons.length) {
      wrap.innerHTML =
        '<div class="list-empty"><strong>Belum ada modul ajar</strong><p>Klik “Tambah Modul” untuk mulai.</p></div>';
      return;
    }

    wrap.innerHTML = lessons
      .map(function (l) {
        const cover = l.cover
          ? '<img data-media="' + esc(l.cover) + '" alt="" />'
          : "";
        return (
          '<div class="list-item">' +
          '<div class="li-thumb t' +
          l.cycle +
          '">' +
          cover +
          (l.cover ? "" : "0" + l.cycle) +
          "</div>" +
          '<div class="li-main">' +
          '<div class="li-top"><span class="li-tag">Siklus ' +
          l.cycle +
          "</span>" +
          (l.featured ? '<span class="li-tag li-featured">' + icon("star", 10) + " Terbaik</span>" : "") +
          '<span class="li-meta">' +
          esc(l.grade) +
          " · " +
          esc(l.allocation) +
          "</span></div>" +
          "<h3>" +
          esc(l.title) +
          "</h3><p>" +
          esc(l.summary) +
          "</p></div>" +
          actionButtons("lesson", l.id) +
          "</div>"
        );
      })
      .join("");

    Media.hydrate(wrap);
    injectIcons(wrap);
  }

  function renderVideos() {
    const wrap = document.getElementById("videoList");
    if (!wrap) return;
    const videos = (data.videos || []).slice().sort(function (a, b) {
      return a.cycle - b.cycle;
    });

    if (!videos.length) {
      wrap.innerHTML =
        '<div class="list-empty"><strong>Belum ada video</strong><p>Tambahkan tautan YouTube atau Google Drive.</p></div>';
      return;
    }

    wrap.innerHTML = videos
      .map(function (v) {
        const poster = v.poster
          ? '<img data-media="' + esc(v.poster) + '" alt="" />'
          : icon("play", 18);
        return (
          '<div class="list-item">' +
          '<div class="li-thumb neutral">' +
          poster +
          "</div>" +
          '<div class="li-main">' +
          '<div class="li-top"><span class="li-tag">Siklus ' +
          v.cycle +
          "</span>" +
          linkedBadge(Boolean(v.url), "Tertaut", "Belum tertaut") +
          "</div>" +
          "<h3>" +
          esc(v.title) +
          "</h3><p>" +
          esc(v.description) +
          "</p></div>" +
          actionButtons("video", v.id) +
          "</div>"
        );
      })
      .join("");

    Media.hydrate(wrap);
    injectIcons(wrap);
  }

  function renderReflections() {
    const wrap = document.getElementById("reflectionList");
    if (!wrap) return;
    const reflections = (data.reflections || []).slice().sort(function (a, b) {
      return a.cycle - b.cycle;
    });

    if (!reflections.length) {
      wrap.innerHTML =
        '<div class="list-empty"><strong>Belum ada refleksi</strong><p>Tambahkan refleksi per siklus.</p></div>';
      return;
    }

    wrap.innerHTML = reflections
      .map(function (r) {
        return (
          '<div class="list-item">' +
          '<div class="li-thumb t' +
          r.cycle +
          '">' +
          r.cycle +
          "</div>" +
          '<div class="li-main">' +
          '<div class="li-top"><span class="li-tag">Siklus ' +
          r.cycle +
          "</span></div><h3>" +
          esc(r.title) +
          "</h3><p>" +
          esc(String(r.body || "").slice(0, 130)) +
          "…</p></div>" +
          actionButtons("reflection", r.id) +
          "</div>"
        );
      })
      .join("");

    injectIcons(wrap);
  }

  function renderArchives() {
    const wrap = document.getElementById("archiveList");
    if (!wrap) return;
    const archives = data.archives || [];

    if (!archives.length) {
      wrap.innerHTML =
        '<div class="list-empty"><strong>Belum ada arsip</strong><p>Tambahkan tautan berkas Google Drive.</p></div>';
      return;
    }

    wrap.innerHTML = archives
      .map(function (a) {
        return (
          '<div class="list-item">' +
          '<div class="li-thumb neutral">' +
          icon("folder", 18) +
          "</div>" +
          '<div class="li-main">' +
          '<div class="li-top"><span class="li-tag">' +
          esc(a.category || "Arsip") +
          "</span>" +
          linkedBadge(Boolean(a.driveUrl), "Tertaut", "Belum tertaut") +
          "</div><h3>" +
          esc(a.title) +
          "</h3><p>" +
          esc(a.description) +
          "</p></div>" +
          actionButtons("archive", a.id) +
          "</div>"
        );
      })
      .join("");

    injectIcons(wrap);
  }

  /* ----------------------------- schemas ----------------------------- */

  const SCHEMAS = {
    lesson: {
      label: "Modul Rancangan",
      fields: [
        { key: "cycle", label: "Siklus", type: "select", options: cycleOptions(), half: true },
        { key: "subject", label: "Mata Pelajaran", type: "text", half: true },
        { key: "title", label: "Judul Modul", type: "text", full: true, placeholder: "Contoh: Berpikir Komputasional: Algoritma di Sekitar Kita" },
        { key: "grade", label: "Kelas / Fase", type: "text", half: true, placeholder: "Kelas X · Fase E" },
        { key: "allocation", label: "Alokasi Waktu", type: "text", half: true, placeholder: "2 × 45 menit" },
        { key: "summary", label: "Ringkasan", type: "textarea", rows: 3, full: true },
        { key: "cp", label: "Capaian Pembelajaran", type: "textarea", rows: 3, full: true },
        { key: "tp", label: "Tujuan Pembelajaran", type: "textarea", rows: 5, full: true, hint: "Satu tujuan per baris." },
        { key: "steps", label: "Sintaks / Alur Pembelajaran", type: "textarea", rows: 7, full: true, hint: "Satu langkah per baris, boleh diawali durasi." },
        { key: "analysis", label: "Analisis Mendalam", type: "textarea", rows: 12, full: true, hint: "Pisahkan paragraf dengan satu baris kosong." },
        { key: "tags", label: "Tag / Kata Kunci", type: "tags", full: true, hint: "Pisahkan dengan koma. Maksimal 4 tampil di kartu." },
        { key: "driveUrl", label: "Tautan Modul di Google Drive", type: "drive", full: true },
        { key: "featured", label: "Tandai sebagai modul terbaik", type: "checkbox", full: true },
        { key: "cover", label: "Foto Sampul (opsional)", type: "media", full: true }
      ]
    },
    video: {
      label: "Video Praktik",
      fields: [
        { key: "cycle", label: "Siklus", type: "select", options: cycleOptions(), half: true },
        { key: "duration", label: "Durasi (opsional)", type: "text", half: true, placeholder: "12:40" },
        { key: "title", label: "Judul Video", type: "text", full: true },
        { key: "url", label: "Tautan Video (YouTube / Google Drive)", type: "text", full: true, placeholder: "https://youtu.be/... atau https://drive.google.com/file/d/..." },
        { key: "description", label: "Deskripsi Singkat", type: "textarea", rows: 3, full: true },
        { key: "analysis", label: "Analisis Video", type: "textarea", rows: 9, full: true, hint: "Momen penting, kekuatan, dan area perbaikan. Pisahkan paragraf dengan baris kosong." },
        { key: "poster", label: "Poster Video (opsional)", type: "media", full: true }
      ]
    },
    archive: {
      label: "Arsip Drive",
      fields: [
        { key: "title", label: "Nama Arsip", type: "text", full: true },
        { key: "category", label: "Kategori", type: "text", half: true, placeholder: "Modul Ajar / Video / Asesmen / Dokumentasi / Sertifikat" },
        { key: "type", label: "Jenis Berkas", type: "select", half: true, options: typeOptions() },
        { key: "driveUrl", label: "Tautan Google Drive", type: "drive", full: true },
        { key: "description", label: "Deskripsi", type: "textarea", rows: 3, full: true },
        { key: "date", label: "Tanggal (opsional)", type: "date", half: true }
      ]
    },
    reflection: {
      label: "Refleksi Siklus",
      fields: [
        { key: "cycle", label: "Siklus", type: "select", options: cycleOptions(), half: true },
        { key: "title", label: "Judul Refleksi", type: "text", full: true },
        { key: "body", label: "Narasi Refleksi", type: "textarea", rows: 7, full: true },
        { key: "strengths", label: "Kekuatan", type: "textarea", rows: 4, full: true, hint: "Satu poin per baris." },
        { key: "challenges", label: "Tantangan", type: "textarea", rows: 4, full: true, hint: "Satu poin per baris." },
        { key: "followUp", label: "Rencana Perbaikan", type: "textarea", rows: 3, full: true }
      ]
    }
  };

  function cycleOptions() {
    return [
      { value: 1, label: "Siklus 1" },
      { value: 2, label: "Siklus 2" },
      { value: 3, label: "Siklus 3" },
      { value: 4, label: "Siklus 4" }
    ];
  }

  function typeOptions() {
    return [
      { value: "pdf", label: "Dokumen PDF" },
      { value: "doc", label: "Dokumen Word" },
      { value: "slide", label: "Presentasi" },
      { value: "sheet", label: "Spreadsheet" },
      { value: "video", label: "Video" },
      { value: "image", label: "Gambar" },
      { value: "folder", label: "Folder Drive" },
      { value: "link", label: "Tautan lain" }
    ];
  }

  /* ----------------------------- editor ----------------------------- */

  function emptyItem(kind) {
    if (kind === "lesson") {
      const used = (data.lessons || []).map(function (l) {
        return Number(l.cycle);
      });
      let cycle = 1;
      for (let i = 1; i <= 4; i++) {
        if (used.indexOf(i) === -1) {
          cycle = i;
          break;
        }
        cycle = 4;
      }
      return {
        id: Store.uid("les"),
        cycle: cycle,
        title: "",
        subject: "Informatika",
        grade: "Kelas X · Fase E",
        allocation: "2 × 45 menit",
        summary: "",
        cp: "",
        tp: "",
        steps: "",
        analysis: "",
        tags: [],
        cover: null,
        driveUrl: "",
        featured: false,
        updatedAt: null
      };
    }
    if (kind === "video") {
      const used = (data.videos || []).map(function (v) {
        return Number(v.cycle);
      });
      let cycle = 1;
      for (let i = 1; i <= 4; i++) {
        if (used.indexOf(i) === -1) {
          cycle = i;
          break;
        }
        cycle = 4;
      }
      return {
        id: Store.uid("vid"),
        cycle: cycle,
        title: "",
        url: "",
        duration: "",
        description: "",
        analysis: "",
        poster: null
      };
    }
    if (kind === "archive") {
      return {
        id: Store.uid("ars"),
        title: "",
        category: "Modul Ajar",
        type: "pdf",
        driveUrl: "",
        description: "",
        date: new Date().toISOString().slice(0, 10)
      };
    }
    return {
      id: Store.uid("ref"),
      cycle: 1,
      title: "",
      body: "",
      strengths: "",
      challenges: "",
      followUp: ""
    };
  }

  function findItem(kind, id) {
    const key = COLLECTIONS[kind];
    return (data[key] || []).find(function (item) {
      return item.id === id;
    });
  }

  function openEditor(kind, id) {
    const schema = SCHEMAS[kind];
    if (!schema) return;
    const existing = id ? findItem(kind, id) : null;
    const item = existing ? Store.clone(existing) : emptyItem(kind);
    editing = { kind: kind, id: existing ? existing.id : null };

    setText("editorKicker", schema.label);
    setText("editorTitle", (existing ? "Edit " : "Tambah ") + schema.label);
    setText("editorHint", "Perubahan diterapkan setelah tombol Simpan ditekan.");

    const form = document.getElementById("editorForm");
    form.innerHTML = schema.fields
      .map(function (f) {
        return renderField(f, item[f.key]);
      })
      .join("");

    const modal = document.getElementById("editorModal");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    injectIcons(form);
    fillBindings(form);
    wireMediaFields(form, item);
    wireDriveFields(form);
    const first = form.querySelector("input, textarea, select");
    if (first) setTimeout(function () { first.focus(); }, 60);
  }

  function attr(value) {
    return esc(value == null ? "" : String(value));
  }

  function renderField(f, value) {
    const full = f.full ? " field-full" : "";
    let val = value == null ? "" : value;
    if (f.type === "date" && val) val = String(val).slice(0, 10);

    if (f.type === "textarea") {
      return (
        '<label class="field' +
        full +
        '"><span>' +
        esc(f.label) +
        '</span><textarea rows="' +
        (f.rows || 4) +
        '" data-field="' +
        f.key +
        '" placeholder="' +
        attr(f.placeholder || "") +
        '">' +
        esc(val) +
        "</textarea>" +
        (f.hint ? '<small class="hint">' + esc(f.hint) + "</small>" : "") +
        "</label>"
      );
    }

    if (f.type === "select") {
      const options = f.options
        .map(function (o) {
          return (
            '<option value="' +
            attr(o.value) +
            '"' +
            (String(o.value) === String(val) ? " selected" : "") +
            ">" +
            esc(o.label) +
            "</option>"
          );
        })
        .join("");
      return (
        '<label class="field' +
        full +
        '"><span>' +
        esc(f.label) +
        '</span><select data-field="' +
        f.key +
        '">' +
        options +
        "</select></label>"
      );
    }

    if (f.type === "tags") {
      const tags = Array.isArray(val) ? val.join(", ") : val;
      return (
        '<label class="field' +
        full +
        '"><span>' +
        esc(f.label) +
        '</span><input type="text" data-field="' +
        f.key +
        '" value="' +
        attr(tags) +
        '" placeholder="PBL, Kolaborasi, Literasi Digital" />' +
        (f.hint ? '<small class="hint">' + esc(f.hint) + "</small>" : "") +
        "</label>"
      );
    }

    if (f.type === "checkbox") {
      return (
        '<label class="check-field' +
        full +
        '"><input type="checkbox" data-field="' +
        f.key +
        '"' +
        (val ? " checked" : "") +
        " /><span>" +
        esc(f.label) +
        "</span></label>"
      );
    }

    if (f.type === "media") {
      return (
        '<div class="field' +
        full +
        '"><span>' +
        esc(f.label) +
        '</span><div class="media-field" data-media-field>' +
        '<div class="media-preview" data-media-preview>' +
        (val ? "" : icon("image", 22)) +
        "</div>" +
        '<div class="media-controls">' +
        '<input type="hidden" data-field="' +
        f.key +
        '" value="' +
        attr(val) +
        '" />' +
        '<div class="btn-row">' +
        '<label class="btn btn-ghost btn-sm">' +
        icon("upload", 14) +
        " Pilih Gambar" +
        '<input type="file" accept="image/*" data-media-input hidden />' +
        "</label>" +
        '<button type="button" class="btn btn-ghost btn-sm" data-media-clear>Hapus</button>' +
        "</div>" +
        '<span class="hint">Opsional. Jika kosong, sampul gradien akan digunakan.</span>' +
        "</div></div></div>"
      );
    }

    if (f.type === "drive") {
      return (
        '<div class="field' +
        full +
        '"><span>' +
        esc(f.label) +
        '</span><div class="drive-field">' +
        '<div class="drive-field-row">' +
        '<input type="text" data-field="' +
        f.key +
        '" value="' +
        attr(val) +
        '" placeholder="https://drive.google.com/file/d/..." spellcheck="false" />' +
        '<button type="button" class="btn btn-ghost btn-sm" data-drive-upload>' +
        icon("upload", 14) +
        " Unggah" +
        "</button>" +
        '<a class="btn btn-ghost btn-sm" data-drive-open href="' +
        attr(val) +
        '" target="_blank" rel="noopener"' +
        (val ? "" : " hidden") +
        ">" +
        icon("external", 14) +
        " Buka</a>" +
        "</div>" +
        '<input type="file" data-drive-file hidden />' +
        '<span class="hint">' +
        icon("drive", 13) +
        " Tempel tautan Drive yang sudah dibagikan, atau unggah langsung (perlu koneksi Google)." +
        "</span>" +
        "</div></div>"
      );
    }

    return (
      '<label class="field' +
      full +
      '"><span>' +
      esc(f.label) +
      '</span><input type="' +
      (f.type || "text") +
      '" data-field="' +
      f.key +
      '" value="' +
      attr(val) +
      '" placeholder="' +
      attr(f.placeholder || "") +
      '" />' +
      (f.hint ? '<small class="hint">' + esc(f.hint) + "</small>" : "") +
      "</label>"
    );
  }

  function wireMediaFields(root) {
    $$("[data-media-field]", root).forEach(function (wrap) {
      const hidden = wrap.querySelector("[data-field]");
      const input = wrap.querySelector("[data-media-input]");
      const clear = wrap.querySelector("[data-media-clear]");
      const preview = wrap.querySelector("[data-media-preview]");

      async function paint(id) {
        preview.innerHTML = "";
        if (!id) {
          preview.innerHTML = icon("image", 22);
          return;
        }
        const url = await Media.url(id);
        if (url) {
          const img = document.createElement("img");
          img.src = url;
          img.alt = "Pratinjau";
          preview.appendChild(img);
        } else {
          preview.innerHTML = icon("alert", 22);
        }
      }

      paint(hidden.value);

      input.addEventListener("change", async function () {
        const file = input.files && input.files[0];
        if (!file) return;
        try {
          const res = await Media.put(file, { name: file.name });
          hidden.value = res.id;
          await paint(res.id);
          toast("Gambar siap disimpan.");
        } catch (err) {
          toast(err.message);
        }
        input.value = "";
      });

      clear.addEventListener("click", function () {
        hidden.value = "";
        paint("");
      });
    });
  }

  function wireDriveFields(root) {
    $$(".drive-field", root).forEach(function (wrap) {
      const textInput = wrap.querySelector("input[data-field]");
      const openLink = wrap.querySelector("[data-drive-open]");
      const uploadBtn = wrap.querySelector("[data-drive-upload]");
      const fileInput = wrap.querySelector("[data-drive-file]");

      if (textInput && openLink) {
        textInput.addEventListener("input", function () {
          const val = textInput.value.trim();
          openLink.href = val || "#";
          openLink.hidden = !val;
        });
      }

      if (uploadBtn && fileInput) {
        uploadBtn.addEventListener("click", function () {
          if (!Drive.isConfigured()) {
            toast("Atur Client ID Google Drive terlebih dahulu di menu Google Drive.");
            return;
          }
          fileInput.click();
        });

        fileInput.addEventListener("change", async function () {
          const file = fileInput.files && fileInput.files[0];
          if (!file) return;
          const original = uploadBtn.innerHTML;
          uploadBtn.disabled = true;
          uploadBtn.innerHTML = icon("refresh", 14) + " Mengunggah…";
          try {
            const res = await uploadToDrive(file);
            textInput.value = res.webViewLink || "";
            openLink.href = res.webViewLink || "#";
            openLink.hidden = !res.webViewLink;
            driveLog("Unggah berhasil: " + res.name + " → " + (res.webViewLink || ""), "ok");
            toast("Berkas berhasil diunggah ke Google Drive.");
          } catch (err) {
            driveLog("Gagal mengunggah: " + err.message, "err");
            toast(err.message);
          }
          uploadBtn.disabled = false;
          uploadBtn.innerHTML = original;
          injectIcons(uploadBtn);
          fileInput.value = "";
        });
      }
    });
  }

  function closeEditor() {
    const modal = document.getElementById("editorModal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    editing = null;
  }

  function collectEditorValues() {
    const values = {};
    $$("#editorForm [data-field]").forEach(function (el) {
      const key = el.getAttribute("data-field");
      if (el.type === "checkbox") values[key] = el.checked;
      else values[key] = el.value;
    });

    if ("cycle" in values) values.cycle = Number(values.cycle) || 1;
    if ("tags" in values) {
      values.tags = String(values.tags || "")
        .split(",")
        .map(function (t) {
          return t.trim();
        })
        .filter(Boolean);
    }
    values.updatedAt = new Date().toISOString();
    return values;
  }

  function saveEditor() {
    if (!editing) return;
    const { kind, id } = editing;
    const key = COLLECTIONS[kind];
    const values = collectEditorValues();

    if (!values.title || !String(values.title).trim()) {
      toast("Judul tidak boleh kosong.");
      const titleInput = $('#editorForm [data-field="title"]');
      if (titleInput) titleInput.focus();
      return;
    }

    if (id) {
      const item = findItem(kind, id);
      if (item) Object.assign(item, values);
    } else {
      values.id = Store.uid(kind === "lesson" ? "les" : kind === "video" ? "vid" : kind === "archive" ? "ars" : "ref");
      if (!data[key]) data[key] = [];
      data[key].push(values);
    }

    saveNow(false);
    renderLists();
    updateCounts();
    closeEditor();
    toast("Data berhasil disimpan.");
  }

  function bindEditor() {
    const modal = document.getElementById("editorModal");
    if (!modal) return;

    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closeEditor();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeEditor();
    });

    const save = document.getElementById("editorSave");
    if (save) save.addEventListener("click", saveEditor);
  }

  /* ----------------------------- delegates ----------------------------- */

  function bindDelegates() {
    document.addEventListener("click", function (e) {
      const addBtn = e.target.closest("[data-add]");
      if (addBtn) {
        openEditor(addBtn.getAttribute("data-add"));
        return;
      }

      const editBtn = e.target.closest("[data-edit]");
      if (editBtn) {
        const parts = editBtn.getAttribute("data-edit").split(":");
        openEditor(parts[0], parts[1]);
        return;
      }

      const dupBtn = e.target.closest("[data-duplicate]");
      if (dupBtn) {
        const parts = dupBtn.getAttribute("data-duplicate").split(":");
        duplicateItem(parts[0], parts[1]);
        return;
      }

      const delBtn = e.target.closest("[data-delete]");
      if (delBtn) {
        const parts = delBtn.getAttribute("data-delete").split(":");
        deleteItem(parts[0], parts[1]);
        return;
      }

      setViewFromEvent(e);
    });
  }

  function duplicateItem(kind, id) {
    const item = findItem(kind, id);
    if (!item) return;
    const copy = Store.clone(item);
    copy.id = Store.uid(kind === "lesson" ? "les" : kind === "video" ? "vid" : kind === "archive" ? "ars" : "ref");
    copy.title = (copy.title || "Tanpa judul") + " (salinan)";
    const key = COLLECTIONS[kind];
    data[key].push(copy);
    saveNow(false);
    renderLists();
    toast("Item diduplikasi. Jangan lupa ubah judulnya.");
  }

  function deleteItem(kind, id) {
    const item = findItem(kind, id);
    if (!item) return;
    const label = kind === "lesson" ? "modul" : kind === "video" ? "video" : kind === "archive" ? "arsip" : "refleksi";
    if (!window.confirm('Hapus ' + label + ' "' + (item.title || "") + '"?')) return;
    const key = COLLECTIONS[kind];
    data[key] = data[key].filter(function (x) {
      return x.id !== id;
    });
    saveNow(false);
    renderLists();
    toast("Item dihapus.");
  }

  /* ----------------------------- settings ----------------------------- */

  function bindSettings() {
    const passForm = document.getElementById("passForm");
    if (passForm) {
      passForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const current = document.getElementById("passCurrent").value;
        const next = document.getElementById("passNew").value;
        const confirm = document.getElementById("passConfirm").value;
        const error = document.getElementById("passError");
        const success = document.getElementById("passSuccess");
        error.hidden = true;
        success.hidden = true;

        if (!(await verifyPass(current))) {
          error.textContent = "Passcode saat ini tidak sesuai.";
          error.hidden = false;
          return;
        }
        if (next.length < 6) {
          error.textContent = "Passcode baru minimal 6 karakter.";
          error.hidden = false;
          return;
        }
        if (next !== confirm) {
          error.textContent = "Konfirmasi passcode tidak sama.";
          error.hidden = false;
          return;
        }

        data.settings.passHash = await hashPass(next);
        saveNow(false);
        passForm.reset();
        success.hidden = false;
        updatePassHint();
        renderDashboard();
        toast("Passcode diperbarui.");
      });
    }

    const exportBtn = document.getElementById("exportBtn");
    if (exportBtn) {
      exportBtn.addEventListener("click", function () {
        const blob = new Blob([Store.exportJSON(data)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "eportfolio-arfido-" + new Date().toISOString().slice(0, 10) + ".json";
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () {
          URL.revokeObjectURL(url);
        }, 1500);
        toast("Data berhasil diekspor.");
      });
    }

    const importInput = document.getElementById("importInput");
    if (importInput) {
      importInput.addEventListener("change", function () {
        const file = importInput.files && importInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function () {
          try {
            data = Store.importJSON(String(reader.result));
            Drive.configure(data.settings.drive);
            renderAll();
            toast("Data berhasil diimpor.");
          } catch (err) {
            toast("Import gagal: " + err.message);
          }
        };
        reader.readAsText(file);
        importInput.value = "";
      });
    }

    const resetBtn = document.getElementById("resetBtn");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        if (
          !window.confirm(
            "Reset seluruh konten ke data bawaan? Tindakan ini tidak dapat dibatalkan."
          )
        )
          return;
        data = Store.reset();
        Drive.configure(data.settings.drive);
        renderAll();
        toast("Data direset ke contoh bawaan.");
      });
    }

    const backupBtn = document.getElementById("backupDriveBtn");
    if (backupBtn) {
      backupBtn.addEventListener("click", async function () {
        if (!Drive.isConfigured()) {
          toast("Atur Client ID Google Drive terlebih dahulu.");
          return;
        }
        backupBtn.disabled = true;
        try {
          const json = Store.exportJSON(data);
          const blob = new Blob([json], { type: "application/json" });
          const file = new File(
            [blob],
            "eportfolio-backup-" + new Date().toISOString().slice(0, 10) + ".json",
            { type: "application/json" }
          );
          const res = await Drive.upload(file, { share: false });
          driveLog("Backup JSON diunggah: " + (res.webViewLink || res.name), "ok");
          toast("Backup terunggah ke Google Drive.");
        } catch (err) {
          driveLog("Backup gagal: " + err.message, "err");
          toast(err.message);
        }
        backupBtn.disabled = false;
      });
    }
  }

  function updateAbout() {
    setText("aboutOwner", data.meta.owner || data.profile.name || "—");
    setText("aboutVersion", (data.meta && data.meta.version) || 1);
    setText(
      "aboutUpdated",
      data.meta && data.meta.updatedAt ? Store.formatDate(data.meta.updatedAt) : "Belum ada perubahan"
    );
  }

  async function updateStorage() {
    try {
      const usage = await Media.usage();
      const jsonBytes = new Blob([JSON.stringify(data)]).size;
      const total = usage.bytes + jsonBytes;
      setText("storageText", Media.formatBytes(usage.bytes));
      const bar = document.getElementById("storageBar");
      if (bar) bar.style.width = Math.min(100, (usage.bytes / (20 * 1024 * 1024)) * 100) + "%";
      const detail = document.getElementById("storageDetail");
      if (detail) {
        detail.innerHTML =
          "<div><span>Media lokal (" +
          usage.count +
          " berkas)</span><b>" +
          Media.formatBytes(usage.bytes) +
          "</b></div>" +
          "<div><span>Data teks (JSON)</span><b>" +
          Media.formatBytes(jsonBytes) +
          "</b></div>" +
          "<div><span>Total perkiraan</span><b>" +
          Media.formatBytes(total) +
          "</b></div>";
      }
    } catch (e) {
      /* noop */
    }
  }

  /* ----------------------------- drive ----------------------------- */

  function bindDrivePanel() {
    const connect = document.getElementById("driveConnect");
    const folder = document.getElementById("driveFolder");
    const test = document.getElementById("driveTest");
    const file = document.getElementById("driveFile");
    const drop = document.getElementById("driveDrop");

    if (connect) {
      connect.addEventListener("click", async function () {
        const original = connect.innerHTML;
        connect.disabled = true;
        connect.innerHTML = icon("refresh", 15) + " Menghubungkan…";
        try {
          await Drive.connect(true);
          driveLog("Terhubung ke Google Drive.", "ok");
          toast("Google Drive terhubung.");
          updateDriveUI();
        } catch (err) {
          driveLog("Gagal terhubung: " + err.message, "err");
          toast(err.message);
        }
        connect.disabled = false;
        connect.innerHTML = original;
        injectIcons(connect);
      });
    }

    if (folder) {
      folder.addEventListener("click", async function () {
        folder.disabled = true;
        try {
          const id = await Drive.ensureFolder(data.settings.drive.folderName);
          data.settings.drive.folderId = id;
          saveNow(false);
          fillBindings(document.querySelector('[data-panel="drive"]'));
          Drive.configure(data.settings.drive);
          driveLog(
            "Folder siap: " +
              (data.settings.drive.folderName || "E-Portfolio") +
              " → https://drive.google.com/drive/folders/" +
              id,
            "ok"
          );
          toast("Folder Google Drive siap digunakan.");
          updateDriveUI();
          renderDashboard();
        } catch (err) {
          driveLog("Gagal menyiapkan folder: " + err.message, "err");
          toast(err.message);
        }
        folder.disabled = false;
      });
    }

    if (test) {
      test.addEventListener("click", async function () {
        test.disabled = true;
        try {
          const info = await Drive.testConnection();
          const name = info && info.user ? info.user.displayName || info.user.emailAddress : "akun Google";
          driveLog("Koneksi aktif untuk " + name + ".", "ok");
          toast("Koneksi Google Drive aktif.");
          updateDriveUI();
        } catch (err) {
          driveLog("Uji koneksi gagal: " + err.message, "err");
          toast(err.message);
        }
        test.disabled = false;
      });
    }

    if (drop && file) {
      drop.addEventListener("click", function () {
        if (!Drive.isConfigured()) {
          toast("Isi Client ID terlebih dahulu.");
          return;
        }
        file.click();
      });
      file.addEventListener("change", async function () {
        const f = file.files && file.files[0];
        if (!f) return;
        const result = document.getElementById("driveUploadResult");
        result.innerHTML = '<p class="hint">Mengunggah ' + esc(f.name) + "…</p>";
        try {
          const res = await uploadToDrive(f);
          result.innerHTML =
            '<div class="upload-result">Berhasil diunggah: <strong>' +
            esc(res.name) +
            "</strong><br />" +
            (res.webViewLink
              ? '<a href="' + esc(res.webViewLink) + '" target="_blank" rel="noopener">Buka berkas di Google Drive ↗</a>'
              : "Tautan tidak tersedia.") +
            (res.share && res.share.shared === false
              ? "<br /><small>Catatan: izin publik tidak dapat diatur otomatis (" + esc(res.share.warning || "") + ").</small>"
              : "") +
            "</div>";
          toast("Berkas terunggah.");
          renderDashboard();
        } catch (err) {
          result.innerHTML = '<p class="form-error">' + esc(err.message) + "</p>";
        }
        file.value = "";
      });
    }
  }

  async function uploadToDrive(file) {
    if (!Drive.isConfigured()) {
      throw new Error("Client ID Google Drive belum diatur.");
    }
    const res = await Drive.upload(file, { share: data.settings.drive.autoShare !== false });
    if (res.folderId && res.folderId !== data.settings.drive.folderId) {
      data.settings.drive.folderId = res.folderId;
      saveNow(false);
      fillBindings(document.querySelector('[data-panel="drive"]'));
      Drive.configure(data.settings.drive);
      renderDashboard();
    }
    return res;
  }

  function driveLog(message, type) {
    const log = document.getElementById("driveLog");
    if (!log) return;
    const line = document.createElement("div");
    line.className = "log-line " + (type || "");
    const time = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    line.textContent = "[" + time + "] " + message;
    log.prepend(line);
    while (log.children.length > 14) log.removeChild(log.lastChild);
  }

  function updateDriveUI() {
    const config = data.settings.drive || {};
    const status = document.getElementById("driveStatus");
    const dot = document.getElementById("driveDot");
    const notice = document.getElementById("driveSetupNotice");
    const connected = Drive.isConnected();
    const configured = Drive.isConfigured();

    if (status) {
      status.classList.toggle("is-on", connected);
      status.innerHTML =
        '<span class="status-dot ' +
        (connected ? "is-on" : "") +
        '"></span> ' +
        (connected
          ? "Terhubung (sesi aktif)"
          : configured
          ? "Siap dihubungkan"
          : "Belum dikonfigurasi");
    }
    if (dot) dot.classList.toggle("is-on", connected || Boolean(config.folderId));
    if (notice) notice.hidden = configured;

    const folderPreview = document.getElementById("folderPreview");
    if (folderPreview) folderPreview.textContent = config.folderId || "Belum ada";
  }

  /* ----------------------------- start ----------------------------- */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
