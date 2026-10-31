/* ============================================================
   E-Portfolio Arfido — Public Site Renderer
   ============================================================ */
(function () {
  "use strict";

  const Store = window.PortfolioStore;
  const Media = window.PortfolioMedia;
  const icon = Store.icon;
  const esc = Store.escapeHTML;

  let data = Store.load();
  let currentFilter = "all";
  let archiveQuery = "";
  let archiveCategory = "Semua";
  let lastFocused = null;

  const $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };
  const $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  function init() {
    injectIcons();
    renderAll();
    Media.hydrate(document).then(function () {
      document.body.classList.add("media-ready");
    });
    bindNavigation();
    bindModal();
    bindFilters();
    bindParallax();
    observeReveals();
    animateCounters();
    setYear();
    onScroll();
    document.body.classList.add("is-ready");
  }

  /* ---------------------------- helpers ---------------------------- */

  function injectIcons(root) {
    $$("[data-icon]", root).forEach(function (el) {
      const size = el.getAttribute("data-size") || 18;
      el.innerHTML = icon(el.getAttribute("data-icon"), Number(size));
    });
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value == null ? "" : value;
  }

  function setHTML(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = value == null ? "" : value;
  }

  function paragraphsHTML(text, className) {
    return Store.paragraphs(text)
      .map(function (p, i) {
        return '<p class="' + (className || "") + (i === 0 ? " lead-p" : "") + '">' + esc(p) + "</p>";
      })
      .join("");
  }

  function linesHTML(text) {
    return Store.lines(text)
      .map(function (line) {
        return "<li>" + esc(line) + "</li>";
      })
      .join("");
  }

  function youtubeThumb(url) {
    const id = Store.youtubeId(url);
    return id ? "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg" : "";
  }

  function openLink(url, label, extraClass) {
    return (
      '<a class="btn ' +
      (extraClass || "btn-primary") +
      '" href="' +
      esc(url) +
      '" target="_blank" rel="noopener noreferrer">' +
      icon("drive", 16) +
      "<span>" +
      esc(label) +
      "</span>" +
      icon("arrowUpRight", 15) +
      "</a>"
    );
  }

  /* ---------------------------- render ---------------------------- */

  function renderAll() {
    renderHero();
    renderProfile();
    renderLessons();
    renderVideos();
    renderReflections();
    renderArchives();
    renderFooter();
  }

  function renderHero() {
    const p = data.profile;
    const story = p.story || {};

    setText("heroBadge", p.badge);
    setText("heroLine1", p.heroLine1 || p.shortName || "Arfido");
    setText("heroLine2", p.heroLine2 || "Ramadhani");
    setText("heroKicker", p.heroKicker);
    setText("heroTagline", p.tagline);
    setText("heroInitials", p.initials || "AR");

    const meta = [
      { icon: "graduation", text: p.campus },
      { icon: "mapPin", text: p.origin },
      { icon: "shield", text: "PPG Informatika" }
    ];
    setHTML(
      "heroMeta",
      meta
        .map(function (m) {
          return (
            '<span class="meta-item">' + icon(m.icon, 16) + "<span>" + esc(m.text) + "</span></span>"
          );
        })
        .join("")
    );

    setHTML(
      "heroStats",
      (p.stats || [])
        .map(function (s, i) {
          return (
            '<div class="stat reveal" style="--delay:' +
            i * 70 +
            'ms">' +
            '<strong class="stat-value" data-count="' +
            esc(s.value) +
            '">' +
            esc(s.value) +
            "</strong>" +
            '<span class="stat-label">' +
            esc(s.label) +
            "</span>" +
            "</div>"
          );
        })
        .join("")
    );

    const photo = document.getElementById("heroPhoto");
    if (photo && p.photo) {
      photo.setAttribute("data-media", p.photo);
      photo.alt = "Foto " + p.name;
    }

    const mini = document.getElementById("profileQuoteMini");
    if (mini) mini.textContent = "“" + (p.heroKicker || story.quote || "") + "”";
  }

  function renderProfile() {
    const p = data.profile;
    const story = p.story || {};

    setText("profileName", p.name);
    setText("profileRole", p.role);
    setText("profileInitials", p.initials || "AR");
    setText("storyTitle", story.title || "Tentang saya");
    setHTML("originStory", paragraphsHTML(story.origin));
    setHTML("inspirationText", paragraphsHTML(story.inspiration));
    setHTML("purposeText", paragraphsHTML(story.purpose));
    setText("visionTitle", story.visionTitle || "Visi saya");
    setText("visionText", story.vision);
    setHTML(
      "pillarRow",
      (p.pillars || [])
        .map(function (pillar) {
          return '<span class="pillar">' + esc(pillar) + "</span>";
        })
        .join("")
    );
    setText("quoteText", "“" + (story.quote || "") + "”");
    setText("quoteAuthor", story.quoteAuthor || p.name);

    const facts = [
      { icon: "users", label: "Nama Lengkap", value: p.name },
      { icon: "mapPin", label: "Asal Daerah", value: p.origin },
      { icon: "graduation", label: "Kampus", value: p.campus },
      { icon: "book", label: "Program Studi", value: p.program },
      { icon: "home", label: "Alamat", value: p.address }
    ];
    setHTML(
      "profileFacts",
      facts
        .filter(function (f) {
          return f.value;
        })
        .map(function (f) {
          return (
            '<li><span class="fact-icon">' +
            icon(f.icon, 16) +
            '</span><span class="fact-copy"><small>' +
            esc(f.label) +
            "</small><strong>" +
            esc(f.value) +
            "</strong></span></li>"
          );
        })
        .join("")
    );

    setHTML(
      "uniqueGrid",
      (story.uniqueness || [])
        .map(function (u, i) {
          return (
            '<article class="unique-card glass reveal" style="--delay:' +
            i * 80 +
            'ms">' +
            '<span class="unique-icon">' +
            icon(u.icon || "sparkles", 20) +
            "</span>" +
            "<h3>" +
            esc(u.title) +
            "</h3><p>" +
            esc(u.text) +
            "</p></article>"
          );
        })
        .join("")
    );

    const photo = document.getElementById("profilePhoto");
    if (photo && p.photo) {
      photo.setAttribute("data-media", p.photo);
      photo.alt = "Foto " + p.name;
    }

    const mailHref = p.email ? "mailto:" + p.email : "#arsip";
    const profileMail = document.getElementById("profileMail");
    if (profileMail) profileMail.href = mailHref;
    const footerMail = document.getElementById("footerMail");
    if (footerMail) footerMail.href = mailHref;
  }

  function visibleLessons() {
    const lessons = (data.lessons || []).slice().sort(function (a, b) {
      return a.cycle - b.cycle;
    });
    if (currentFilter === "all") return lessons;
    if (currentFilter === "1") return lessons.filter((l) => l.cycle === 1);
    return lessons.filter((l) => l.cycle >= 2 && l.cycle <= 4);
  }

  function renderLessons() {
    const lessons = visibleLessons();
    const grid = document.getElementById("lessonGrid");
    if (!grid) return;

    setText("lessonCount", lessons.length + " modul ajar");

    if (!lessons.length) {
      grid.innerHTML =
        '<div class="empty-state"><span class="empty-icon">' +
        icon("book", 30) +
        "</span><h3>Belum ada modul pada filter ini</h3><p>Tambahkan rancangan pembelajaran melalui Mode Admin.</p></div>";
      return;
    }

    grid.innerHTML = lessons
      .map(function (l) {
        const coverImg = l.cover
          ? '<img data-media="' + esc(l.cover) + '" alt="Sampul ' + esc(l.title) + '" loading="lazy" />'
          : "";
        const drive = l.driveUrl
          ? '<a class="btn btn-primary btn-sm" href="' +
            esc(l.driveUrl) +
            '" target="_blank" rel="noopener noreferrer">' +
            icon("drive", 15) +
            "<span>Buka Modul</span>" +
            icon("arrowUpRight", 14) +
            "</a>"
          : '<span class="link-muted">' + icon("link", 14) + " Modul segera ditautkan</span>";

        return (
          '<article class="lesson-card glass' +
          (l.featured ? " is-featured" : "") +
          '" data-cycle="' +
          l.cycle +
          '">' +
          '<div class="lesson-cover cover-' +
          l.cycle +
          '">' +
          coverImg +
          '<div class="cover-overlay"></div>' +
          '<span class="cover-num">0' +
          l.cycle +
          "</span>" +
          '<span class="cover-chip">Siklus ' +
          l.cycle +
          "</span>" +
          (l.featured ? '<span class="cover-featured">' + icon("star", 12) + " Modul Terbaik</span>" : "") +
          '<span class="cover-icon">' +
          icon("book", 34) +
          "</span>" +
          "</div>" +
          '<div class="lesson-body">' +
          '<div class="meta-row">' +
          '<span class="chip">' +
          esc(l.grade) +
          "</span>" +
          '<span class="chip chip-muted">' +
          icon("clock", 13) +
          esc(l.allocation) +
          "</span>" +
          "</div>" +
          "<h3>" +
          esc(l.title) +
          "</h3>" +
          "<p>" +
          esc(l.summary) +
          "</p>" +
          '<div class="tag-row">' +
          (l.tags || [])
            .slice(0, 3)
            .map(function (t) {
              return '<span class="tag">' + esc(t) + "</span>";
            })
            .join("") +
          "</div>" +
          '<div class="card-actions">' +
          '<button class="btn btn-ghost btn-sm" data-lesson="' +
          esc(l.id) +
          '">' +
          icon("layers", 15) +
          "<span>Analisis Mendalam</span>" +
          "</button>" +
          drive +
          "</div></div></article>"
        );
      })
      .join("");
  }

  function renderVideos() {
    const grid = document.getElementById("videoGrid");
    if (!grid) return;
    const videos = data.videos || [];

    if (!videos.length) {
      grid.innerHTML =
        '<div class="empty-state"><span class="empty-icon">' +
        icon("video", 30) +
        "</span><h3>Video praktik belum tersedia</h3><p>Tambahkan tautan video melalui Mode Admin.</p></div>";
      return;
    }

    grid.innerHTML = videos
      .map(function (v, i) {
        const yt = Store.youtubeId(v.url);
        const thumb = v.poster
          ? '<img data-media="' + esc(v.poster) + '" alt="Poster ' + esc(v.title) + '" loading="lazy" />'
          : yt
          ? '<img src="' + youtubeThumb(v.url) + '" alt="Thumbnail ' + esc(v.title) + '" loading="lazy" />'
          : "";
        const hasVideo = Boolean(v.url);
        return (
          '<article class="video-card glass reveal" style="--delay:' +
          i * 70 +
          'ms" data-video="' +
          esc(v.id) +
          '">' +
          '<div class="video-poster poster-' +
          ((v.cycle - 1) % 4) +
          '">' +
          thumb +
          '<div class="poster-tint"></div>' +
          '<span class="poster-cycle">Siklus ' +
          v.cycle +
          "</span>" +
          (v.duration ? '<span class="poster-duration">' + esc(v.duration) + "</span>" : "") +
          '<button class="play-btn' +
          (hasVideo ? "" : " is-empty") +
          '" data-video="' +
          esc(v.id) +
          '" aria-label="Tonton ' +
          esc(v.title) +
          '">' +
          icon("play", 22) +
          "</button>" +
          (!hasVideo ? '<span class="poster-empty">Video belum ditautkan</span>' : "") +
          "</div>" +
          '<div class="video-body">' +
          '<div class="meta-row"><span class="chip">Video Praktik</span><span class="chip chip-muted">' +
          icon("clock", 13) +
          "Siklus " +
          v.cycle +
          "</span></div>" +
          "<h3>" +
          esc(v.title) +
          "</h3><p>" +
          esc(v.description) +
          "</p>" +
          '<button class="text-link" data-video="' +
          esc(v.id) +
          '"><span>Tonton &amp; baca analisis</span>' +
          icon("arrowRight", 16) +
          "</button>" +
          "</div></article>"
        );
      })
      .join("");
  }

  function renderReflections() {
    const overview = data.reflectionOverview || {};
    setHTML("reflectionIntro", paragraphsHTML(overview.intro));
    setHTML(
      "reflectionFollowUp",
      overview.followUp
        ? '<div class="followup-inner">' +
            '<span class="followup-icon">' + icon("compass", 18) + "</span>" +
            "<div><h4>Rencana Tindak Lanjut</h4><p>" + esc(overview.followUp) + "</p></div>" +
          "</div>"
        : ""
    );

    setHTML(
      "competencyBars",
      (overview.competencies || [])
        .map(function (c) {
          const val = Math.max(0, Math.min(100, Number(c.value) || 0));
          return (
            '<div class="skill">' +
            '<div class="skill-head"><span>' +
            esc(c.name) +
            "</span><b>" +
            val +
            "</b></div>" +
            '<div class="bar"><span style="--val:' +
            val +
            '%"></span></div>' +
            '<p class="skill-note">' +
            esc(c.note) +
            "</p></div>"
          );
        })
        .join("")
    );

    const timeline = document.getElementById("reflectionTimeline");
    if (!timeline) return;

    timeline.innerHTML = (data.reflections || [])
      .map(function (r, i) {
        return (
          '<article class="timeline-item reveal" style="--delay:' +
          i * 60 +
          'ms">' +
          '<div class="timeline-marker"><span>' +
          r.cycle +
          "</span></div>" +
          '<div class="timeline-card glass">' +
          '<div class="timeline-head"><span class="chip">Siklus ' +
          r.cycle +
          "</span><h3>" +
          esc(r.title) +
          "</h3></div>" +
          '<div class="story-text">' +
          paragraphsHTML(r.body) +
          "</div>" +
          '<div class="reflection-grid">' +
          '<div class="ref-box good"><h4>' +
          icon("check", 15) +
          " Kekuatan</h4><ul>" +
          linesHTML(r.strengths) +
          "</ul></div>" +
          '<div class="ref-box warn"><h4>' +
          icon("alert", 15) +
          " Tantangan</h4><ul>" +
          linesHTML(r.challenges) +
          "</ul></div>" +
          '<div class="ref-box next"><h4>' +
          icon("arrowRight", 15) +
          " Perbaikan</h4><p>" +
          esc(r.followUp) +
          "</p></div>" +
          "</div></div></article>"
        );
      })
      .join("");
  }

  function archiveIcon(item) {
    const type = String(item.type || "").toLowerCase();
    const cat = String(item.category || "").toLowerCase();
    if (type.indexOf("pdf") > -1 || cat.indexOf("modul") > -1) return "file";
    if (type.indexOf("video") > -1 || cat.indexOf("video") > -1) return "video";
    if (type.indexOf("image") > -1 || cat.indexOf("dokumentasi") > -1) return "image";
    if (type.indexOf("folder") > -1) return "folder";
    if (type.indexOf("sheet") > -1 || type.indexOf("excel") > -1) return "database";
    if (type.indexOf("slide") > -1 || type.indexOf("ppt") > -1) return "presentation";
    if (cat.indexOf("sertifikat") > -1) return "award";
    return "file";
  }

  function renderArchiveFilters() {
    const wrap = document.getElementById("archiveFilters");
    if (!wrap) return;
    const cats = ["Semua"];
    (data.archives || []).forEach(function (a) {
      if (a.category && cats.indexOf(a.category) === -1) cats.push(a.category);
    });
    wrap.innerHTML = cats
      .map(function (c) {
        return (
          '<button class="chip-btn' +
          (archiveCategory === c ? " is-active" : "") +
          '" data-cat="' +
          esc(c) +
          '">' +
          esc(c) +
          "</button>"
        );
      })
      .join("");
  }

  function renderArchives() {
    renderArchiveFilters();
    const grid = document.getElementById("archiveGrid");
    const empty = document.getElementById("archiveEmpty");
    if (!grid) return;

    const q = archiveQuery.trim().toLowerCase();
    const categories = Array.from(
      new Set(
        (data.archives || [])
          .map(function (a) {
            return a.category;
          })
          .filter(Boolean)
      )
    );
    if (archiveCategory !== "Semua" && categories.indexOf(archiveCategory) === -1) {
      archiveCategory = "Semua";
    }
    const items = (data.archives || []).filter(function (a) {
      const matchCat = archiveCategory === "Semua" || a.category === archiveCategory;
      const haystack = [a.title, a.description, a.category, a.type].join(" ").toLowerCase();
      return matchCat && (!q || haystack.indexOf(q) > -1);
    });

    grid.innerHTML = items
      .map(function (a, i) {
        const linked = Boolean(a.driveUrl);
        return (
          '<article class="archive-card glass' +
          (linked ? " is-linked" : "") +
          '" style="--delay:' +
          i * 50 +
          'ms">' +
          '<div class="archive-icon type-' +
          esc(String(a.type || "file").toLowerCase()) +
          '">' +
          icon(archiveIcon(a), 24) +
          "</div>" +
          '<div class="archive-info">' +
          '<div class="archive-top"><span class="chip chip-sm">' +
          esc(a.category || "Arsip") +
          "</span>" +
          (a.date ? '<span class="archive-date">' + icon("calendar", 13) + esc(Store.formatDate(a.date, a.date)) + "</span>" : "") +
          "</div>" +
          "<h3>" +
          esc(a.title) +
          "</h3><p>" +
          esc(a.description) +
          "</p>" +
          (linked
            ? '<a class="archive-link" href="' +
              esc(a.driveUrl) +
              '" target="_blank" rel="noopener noreferrer">Buka di Google Drive ' +
              icon("arrowUpRight", 15) +
              "</a>"
            : '<span class="archive-pending">' + icon("link", 14) + " Belum ditautkan</span>") +
          "</div></article>"
        );
      })
      .join("");

    if (empty) {
      empty.hidden = items.length > 0;
      const h = empty.querySelector("h3");
      const p = empty.querySelector("p");
      if (h && p && !items.length) {
        if (!(data.archives || []).length) {
          h.textContent = "Arsip sedang disiapkan";
          p.textContent = "Modul ajar dan dokumentasi akan tampil di sini setelah ditautkan ke Google Drive.";
        } else {
          h.textContent = "Tidak ada arsip yang cocok";
          p.textContent = "Coba kata kunci lain atau pilih kategori berbeda.";
        }
      }
    }

    const folderBtn = document.getElementById("driveFolderBtn");
    const hint = document.getElementById("driveHint");
    const folderId = data.settings && data.settings.drive ? data.settings.drive.folderId : "";
    if (folderBtn && hint) {
      if (folderId) {
        folderBtn.href = "https://drive.google.com/drive/folders/" + folderId;
        folderBtn.hidden = false;
        hint.textContent = "Folder: " + (data.settings.drive.folderName || "E-Portfolio Arfido");
      } else {
        folderBtn.hidden = true;
        hint.textContent = "Folder Drive akan tampil setelah ditautkan melalui Mode Admin.";
      }
    }

    const lessonFolderBtn = document.getElementById("lessonFolderBtn");
    if (lessonFolderBtn && folderId) {
      lessonFolderBtn.href = "https://drive.google.com/drive/folders/" + folderId;
      lessonFolderBtn.target = "_blank";
      lessonFolderBtn.rel = "noopener noreferrer";
    }
  }

  function renderFooter() {
    const p = data.profile;
    setText("footerTagline", p.heroKicker || p.tagline);
    setText("footerCampus", p.campus);
    setText("footerProgram", p.program);
    setText("footerOrigin", p.origin);
    setText("footerAddress", p.address);

    const email = document.getElementById("footerEmail");
    if (email) {
      email.textContent = p.email || "Email belum diatur";
      email.href = p.email ? "mailto:" + p.email : "#arsip";
    }

    const updated = data.meta && data.meta.updatedAt;
    setText(
      "footerUpdated",
      updated ? "Diperbarui " + Store.formatDate(updated) : "Edisi " + new Date().getFullYear()
    );
  }

  function setYear() {
    setText("year", new Date().getFullYear());
  }

  /* --------------------------- interactions --------------------------- */

  function bindNavigation() {
    const nav = document.getElementById("siteNav");
    const toggle = document.getElementById("navToggle");
    const links = document.getElementById("navLinks");

    if (toggle) {
      toggle.addEventListener("click", function () {
        const open = document.body.classList.toggle("nav-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Tutup menu navigasi" : "Buka menu navigasi");
      });
    }

    $$(".nav-link, .site-footer a[href^='#'], .brand[href^='#']").forEach(function (a) {
      a.addEventListener("click", function () {
        document.body.classList.remove("nav-open");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    });

    let lastY = window.scrollY;
    window.addEventListener(
      "scroll",
      function () {
        const y = window.scrollY;
        if (nav) nav.classList.toggle("is-scrolled", y > 24);
        if (links) links.classList.toggle("is-scrolled", y > 24);
        lastY = y;
      },
      { passive: true }
    );

    const sections = ["beranda", "profil", "rancangan", "video", "refleksi", "arsip"];
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          $$(".nav-link").forEach(function (link) {
            link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (id) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  function onScroll() {
    const bar = document.getElementById("scrollBar");
    if (!bar) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    bar.style.transform = "scaleX(" + ratio + ")";
  }

  function bindFilters() {
    const tabs = document.getElementById("cycleTabs");
    if (tabs) {
      tabs.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-filter]");
        if (!btn) return;
        currentFilter = btn.getAttribute("data-filter");
        $$(".tab", tabs).forEach(function (t) {
          const active = t === btn;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-selected", active ? "true" : "false");
        });
        renderLessons();
      });
    }

    const search = document.getElementById("archiveSearch");
    if (search) {
      search.addEventListener("input", function () {
        archiveQuery = search.value;
        renderArchives();
      });
    }

    const filters = document.getElementById("archiveFilters");
    if (filters) {
      filters.addEventListener("click", function (e) {
        const btn = e.target.closest("[data-cat]");
        if (!btn) return;
        archiveCategory = btn.getAttribute("data-cat");
        renderArchives();
      });
    }
  }

  function bindModal() {
    const modal = document.getElementById("modal");
    if (!modal) return;

    modal.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) closeModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });

    document.addEventListener("click", function (e) {
      const lessonBtn = e.target.closest("[data-lesson]");
      if (lessonBtn) {
        openLesson(lessonBtn.getAttribute("data-lesson"));
        return;
      }
      const videoBtn = e.target.closest("[data-video]");
      if (videoBtn) {
        openVideo(videoBtn.getAttribute("data-video"));
      }
    });
  }

  function openModal(html) {
    const modal = document.getElementById("modal");
    const body = document.getElementById("modalBody");
    if (!modal || !body) return;
    lastFocused = document.activeElement;
    body.innerHTML = html;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    const closeBtn = modal.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus({ preventScroll: true });
    Media.hydrate(body);
  }

  function closeModal() {
    const modal = document.getElementById("modal");
    const body = document.getElementById("modalBody");
    if (!modal || !body) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    body.innerHTML = "";
    if (lastFocused && lastFocused.focus) lastFocused.focus({ preventScroll: true });
  }

  function openLesson(id) {
    const l = (data.lessons || []).find(function (item) {
      return item.id === id;
    });
    if (!l) return;

    const sections = [];
    if (l.cp) {
      sections.push(
        '<section class="modal-section"><h3>' +
          icon("graduation", 18) +
          " Capaian Pembelajaran</h3><p>" +
          esc(l.cp) +
          "</p></section>"
      );
    }
    if (l.tp) {
      sections.push(
        '<section class="modal-section"><h3>' +
          icon("check", 18) +
          " Tujuan Pembelajaran</h3><ul class=\"check-list\">" +
          linesHTML(l.tp) +
          "</ul></section>"
      );
    }
    if (l.steps) {
      sections.push(
        '<section class="modal-section"><h3>' +
          icon("compass", 18) +
          " Sintaks &amp; Alur Pembelajaran</h3><ol class=\"step-list\">" +
          linesHTML(l.steps) +
          "</ol></section>"
      );
    }

    const analysis = Store.paragraphs(l.analysis)
      .map(function (p, i) {
        return '<p class="' + (i === 0 ? "lead-p" : "") + '">' + esc(p) + "</p>";
      })
      .join("");

    openModal(
      '<div class="modal-head">' +
        '<div class="meta-row"><span class="chip">Siklus ' +
        l.cycle +
        '</span><span class="chip chip-muted">' +
        esc(l.subject) +
        "</span></div>" +
        '<h2 id="modalTitle">' +
        esc(l.title) +
        "</h2>" +
        '<div class="modal-facts">' +
        "<span>" + icon("users", 15) + esc(l.grade) + "</span>" +
        "<span>" + icon("clock", 15) + esc(l.allocation) + "</span>" +
        "<span>" + icon("book", 15) + esc(l.subject) + "</span>" +
        "</div></div>" +
        '<div class="modal-summary">' +
        esc(l.summary) +
        "</div>" +
        '<div class="modal-grid">' +
        sections.join("") +
        "</div>" +
        '<section class="modal-section analysis-section"><h3>' +
        icon("layers", 18) +
        " Analisis Mendalam</h3>" +
        analysis +
        "</section>" +
        '<div class="tag-row">' +
        (l.tags || [])
          .map(function (t) {
            return '<span class="tag">' + esc(t) + "</span>";
          })
          .join("") +
        "</div>" +
        '<div class="modal-actions">' +
        (l.driveUrl
          ? openLink(l.driveUrl, "Buka Modul di Google Drive")
          : '<span class="link-muted">' + icon("link", 15) + " Tautan modul belum ditambahkan.</span>") +
        '<button class="btn btn-ghost" data-close="1">Tutup</button>' +
        "</div>"
    );
  }

  function openVideo(id) {
    const v = (data.videos || []).find(function (item) {
      return item.id === id;
    });
    if (!v) return;

    const yt = Store.youtubeId(v.url);
    const driveId = Store.driveFileId(v.url);
    let player = "";

    if (yt) {
      player =
        '<div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/' +
        yt +
        '?autoplay=1&rel=0" title="' +
        esc(v.title) +
        '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>';
    } else if (driveId) {
      player =
        '<div class="video-frame"><iframe src="https://drive.google.com/file/d/' +
        driveId +
        '/preview" title="' +
        esc(v.title) +
        '" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe></div>';
    } else {
      player =
        '<div class="video-placeholder"><span class="vp-icon">' +
        icon("video", 30) +
        "</span><h3>Video belum ditautkan</h3><p>Rekaman praktik mengajar akan tampil di sini setelah tautan YouTube atau Google Drive ditambahkan.</p></div>";
    }

    openModal(
      '<div class="modal-head">' +
        '<div class="meta-row"><span class="chip">Siklus ' +
        v.cycle +
        '</span><span class="chip chip-muted">' +
        icon("video", 13) +
        " Video Praktik</span></div>" +
        '<h2 id="modalTitle">' +
        esc(v.title) +
        "</h2>" +
        '<p class="modal-sub">' +
        esc(v.description) +
        "</p></div>" +
        player +
        '<section class="modal-section analysis-section"><h3>' +
        icon("layers", 18) +
        " Analisis Video</h3>" +
        Store.paragraphs(v.analysis)
          .map(function (p, i) {
            return '<p class="' + (i === 0 ? "lead-p" : "") + '">' + esc(p) + "</p>";
          })
          .join("") +
        "</section>" +
        '<div class="modal-actions">' +
        (v.url
          ? '<a class="btn btn-ghost" href="' + esc(v.url) + '" target="_blank" rel="noopener noreferrer">' +
            icon("external", 16) +
            " Buka di tab baru</a>"
          : "") +
        '<button class="btn btn-ghost" data-close="1">Tutup</button></div>'
    );
  }

  function bindParallax() {
    const hero = document.querySelector(".hero");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = null;
    hero.addEventListener("pointermove", function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        hero.style.setProperty("--mx", x.toFixed(3));
        hero.style.setProperty("--my", y.toFixed(3));
        raf = null;
      });
    });
    hero.addEventListener("pointerleave", function () {
      hero.style.setProperty("--mx", 0);
      hero.style.setProperty("--my", 0);
    });
  }

  function observeReveals() {
    const els = $$(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }

  function animateCounters() {
    const nodes = $$("[data-count]");
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const raw = el.getAttribute("data-count");
          const target = Number(raw);
          if (!isFinite(target) || target <= 0) return;
          const duration = 1000;
          const start = performance.now();
          function tick(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = String(Math.round(target * eased));
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = raw;
          }
          requestAnimationFrame(tick);
          io.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );
    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
