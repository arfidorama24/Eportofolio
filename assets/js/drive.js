/* ============================================================
   E-Portfolio Arfido — Google Drive helper
   OAuth (Google Identity Services) + Drive REST v3.
   Scope: drive.file (hanya berkas yang dibuat/dibuka aplikasi).
   ============================================================ */
(function () {
  "use strict";

  const SCOPE = "https://www.googleapis.com/auth/drive.file";
  const GIS_SRC = "https://accounts.google.com/gsi/client";

  let cfg = {
    clientId: "",
    apiKey: "",
    folderId: "",
    folderName: "E-Portfolio Arfido",
    autoShare: true
  };

  let token = null;
  let tokenExpiresAt = 0;
  let tokenClient = null;
  let pendingResolve = null;
  let pendingReject = null;

  function configure(settings) {
    const next = settings || {};
    if (next.clientId !== cfg.clientId) {
      token = null;
      tokenExpiresAt = 0;
      tokenClient = null;
    }
    cfg = {
      clientId: next.clientId || "",
      apiKey: next.apiKey || "",
      folderId: next.folderId || "",
      folderName: next.folderName || "E-Portfolio Arfido",
      autoShare: next.autoShare !== false
    };
  }

  function getConfig() {
    return Object.assign({}, cfg);
  }

  function isConfigured() {
    return Boolean(cfg.clientId && cfg.clientId.indexOf(".apps.googleusercontent.com") > -1);
  }

  function isConnected() {
    return Boolean(token) && Date.now() < tokenExpiresAt - 30000;
  }

  function loadGIS() {
    return new Promise(function (resolve, reject) {
      if (window.google && window.google.accounts && window.google.accounts.oauth2) {
        return resolve();
      }
      const existing = document.querySelector('script[src="' + GIS_SRC + '"]');
      if (existing) {
        existing.addEventListener("load", function () {
          resolve();
        });
        existing.addEventListener("error", function () {
          reject(new Error("Gagal memuat Google Identity Services."));
        });
        if (window.google && window.google.accounts) resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = GIS_SRC;
      script.async = true;
      script.defer = true;
      script.onload = function () {
        resolve();
      };
      script.onerror = function () {
        reject(
          new Error(
            "Gagal memuat Google Identity Services. Periksa koneksi internet dan pastikan situs dibuka melalui http/https."
          )
        );
      };
      document.head.appendChild(script);
    });
  }

  async function connect(forceConsent) {
    if (!isConfigured()) {
      throw new Error(
        "Client ID Google belum diisi atau formatnya belum benar. Buka menu Google Drive di panel admin untuk melihat panduan."
      );
    }
    if (isConnected() && !forceConsent) return token;

    if (!location.protocol.startsWith("http")) {
      throw new Error(
        "Login Google membutuhkan http/https. Jalankan situs melalui server lokal (klik start.bat) atau hosting, bukan dibuka langsung sebagai file."
      );
    }

    await loadGIS();

    return new Promise(function (resolve, reject) {
      pendingResolve = resolve;
      pendingReject = reject;

      if (!tokenClient) {
        tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: cfg.clientId,
          scope: SCOPE,
          callback: function (response) {
            if (!response || response.error) {
              const err = new Error(
                (response && response.error_description) ||
                  "Izin Google Drive tidak diberikan."
              );
              if (pendingReject) pendingReject(err);
              pendingResolve = pendingReject = null;
              return;
            }
            token = response.access_token;
            tokenExpiresAt = Date.now() + (Number(response.expires_in || 3600) - 60) * 1000;
            if (pendingResolve) pendingResolve(token);
            pendingResolve = pendingReject = null;
          },
          error_callback: function (err) {
            const message =
              err && err.type === "popup_closed"
                ? "Jendela izin Google ditutup sebelum selesai."
                : "Gagal terhubung ke Google Drive. Pastikan origin situs terdaftar di Client ID.";
            if (pendingReject) pendingReject(new Error(message));
            pendingResolve = pendingReject = null;
          }
        });
      }

      try {
        tokenClient.requestAccessToken({ prompt: forceConsent ? "consent" : "" });
      } catch (e) {
        pendingResolve = pendingReject = null;
        reject(new Error("Tidak dapat membuka jendela izin Google: " + e.message));
      }
    });
  }

  function disconnect() {
    if (token && window.google && window.google.accounts && window.google.accounts.oauth2) {
      try {
        window.google.accounts.oauth2.revoke(token, function () {});
      } catch (e) {
        /* noop */
      }
    }
    token = null;
    tokenExpiresAt = 0;
  }

  async function api(path, options) {
    if (!isConnected()) {
      await connect(false);
    }
    const opts = Object.assign({}, options || {});
    opts.headers = Object.assign({}, opts.headers || {}, {
      Authorization: "Bearer " + token
    });
    const res = await fetch("https://www.googleapis.com" + path, opts);
    if (res.status === 401) {
      token = null;
      tokenExpiresAt = 0;
      throw new Error("Sesi Google Drive berakhir. Silakan hubungkan ulang.");
    }
    if (!res.ok) {
      let message = "Permintaan ke Google Drive gagal (" + res.status + ")";
      try {
        const body = await res.json();
        if (body && body.error && body.error.message) message += ": " + body.error.message;
      } catch (e) {
        /* noop */
      }
      throw new Error(message);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  async function ensureFolder(name) {
    const folderName = name || cfg.folderName || "E-Portfolio Arfido";
    if (cfg.folderId) return cfg.folderId;

    const q = encodeURIComponent(
      "name = '" +
        folderName.replace(/'/g, "\\'") +
        "' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    );
    const found = await api(
      "/drive/v3/files?q=" +
        q +
        "&fields=files(id,name,webViewLink)&spaces=drive&pageSize=5&orderBy=createdTime desc",
      { method: "GET" }
    );

    if (found && found.files && found.files.length) {
      cfg.folderId = found.files[0].id;
      return cfg.folderId;
    }

    const created = await api("/drive/v3/files?fields=id,name,webViewLink", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: folderName,
        mimeType: "application/vnd.google-apps.folder"
      })
    });
    cfg.folderId = created.id;
    return cfg.folderId;
  }

  async function shareFile(fileId) {
    try {
      await api("/drive/v3/files/" + encodeURIComponent(fileId) + "/permissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "reader", type: "anyone" })
      });
      return { shared: true };
    } catch (e) {
      return { shared: false, warning: e.message };
    }
  }

  async function upload(file, options) {
    if (!file) throw new Error("Tidak ada berkas untuk diunggah.");
    const opts = options || {};
    await connect(false);
    const folderId = opts.folderId || (await ensureFolder());

    const metadata = {
      name: opts.name || file.name,
      parents: [folderId]
    };
    if (opts.description) metadata.description = opts.description;

    const form = new FormData();
    form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
    form.append("file", file);

    const result = await api(
      "/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,webContentLink,iconLink,createdTime",
      { method: "POST", body: form }
    );

    let shareResult = { shared: false };
    const shouldShare = opts.share === undefined ? cfg.autoShare : opts.share;
    if (shouldShare) shareResult = await shareFile(result.id);

    return Object.assign({}, result, { share: shareResult, folderId: folderId });
  }

  async function testConnection() {
    await connect(false);
    return api("/drive/v3/about?fields=user(displayName,emailAddress)", { method: "GET" });
  }

  function folderUrl(folderId) {
    const id = folderId || cfg.folderId;
    return id ? "https://drive.google.com/drive/folders/" + id : "";
  }

  window.PortfolioDrive = {
    configure: configure,
    getConfig: getConfig,
    isConfigured: isConfigured,
    isConnected: isConnected,
    connect: connect,
    disconnect: disconnect,
    ensureFolder: ensureFolder,
    upload: upload,
    testConnection: testConnection,
    folderUrl: folderUrl
  };
})();
