/* ============================================================
   E-Portfolio Arfido — Media Storage (IndexedDB)
   Menyimpan foto & file unggahan lokal, dengan fallback
   ke localStorage (data URL) bila IndexedDB tidak tersedia.
   ============================================================ */
(function () {
  "use strict";

  const DB_NAME = "eportfolio-media";
  const STORE = "files";
  const DB_VERSION = 1;
  const FALLBACK_PREFIX = "eportfolio:media:";
  const MAX_IMAGE = 1600;
  const MAX_BYTES = 6 * 1024 * 1024; // 6 MB per file

  let dbPromise = null;
  const urlCache = new Map();

  function hasIndexedDB() {
    try {
      return typeof indexedDB !== "undefined" && indexedDB !== null;
    } catch (e) {
      return false;
    }
  }

  function openDB() {
    if (!hasIndexedDB()) return Promise.reject(new Error("IndexedDB tidak tersedia"));
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function () {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE, { keyPath: "id" });
        }
      };
      req.onsuccess = function () {
        resolve(req.result);
      };
      req.onerror = function () {
        reject(req.error || new Error("Gagal membuka penyimpanan media"));
      };
    });
    return dbPromise;
  }

  function readAsDataURL(blob) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
      reader.readAsDataURL(blob);
    });
  }

  function dataURLtoBlob(dataUrl) {
    const parts = String(dataUrl).split(",");
    const mime = (parts[0].match(/:(.*?);/) || [])[1] || "application/octet-stream";
    const binary = atob(parts[1]);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  }

  /* Kompres foto agar hemat ruang penyimpanan browser. */
  function compressImage(file, maxSize, quality) {
    return new Promise(function (resolve) {
      if (!file.type || file.type.indexOf("image/") !== 0) return resolve(file);
      if (file.type === "image/svg+xml" || file.type === "image/gif") return resolve(file);

      const max = maxSize || MAX_IMAGE;
      const q = quality || 0.84;
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = function () {
        let width = img.naturalWidth;
        let height = img.naturalHeight;
        if (width > max || height > max) {
          const ratio = Math.min(max / width, max / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          function (blob) {
            URL.revokeObjectURL(objectUrl);
            resolve(blob || file);
          },
          "image/jpeg",
          q
        );
      };

      img.onerror = function () {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    });
  }

  async function put(file, meta) {
    if (!file) throw new Error("Tidak ada berkas");
    if (file.size > MAX_BYTES) {
      throw new Error("Ukuran berkas melebihi 6 MB. Kompres atau gunakan tautan Google Drive.");
    }

    const isImage = file.type && file.type.indexOf("image/") === 0;
    const blob = isImage ? await compressImage(file) : file;
    const id = "media-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const record = {
      id: id,
      name: (meta && meta.name) || file.name || "Berkas",
      type: blob.type || file.type || "application/octet-stream",
      size: blob.size,
      createdAt: new Date().toISOString(),
      blob: blob
    };

    try {
      const db = await openDB();
      await new Promise(function (resolve, reject) {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(record);
        tx.oncomplete = resolve;
        tx.onerror = function () {
          reject(tx.error);
        };
      });
    } catch (e) {
      const dataUrl = await readAsDataURL(blob);
      try {
        localStorage.setItem(
          FALLBACK_PREFIX + id,
          JSON.stringify({ id: id, name: record.name, type: record.type, size: record.size, dataUrl: dataUrl })
        );
      } catch (err) {
        throw new Error("Penyimpanan browser penuh. Hapus media lama atau gunakan Google Drive.");
      }
    }

    urlCache.set(id, URL.createObjectURL(blob));
    return { id: id, name: record.name, type: record.type, size: record.size };
  }

  async function get(id) {
    if (!id) return null;
    try {
      const db = await openDB();
      return await new Promise(function (resolve, reject) {
        const tx = db.transaction(STORE, "readonly");
        const req = tx.objectStore(STORE).get(id);
        req.onsuccess = function () {
          resolve(req.result || null);
        };
        req.onerror = function () {
          reject(req.error);
        };
      });
    } catch (e) {
      const raw = localStorage.getItem(FALLBACK_PREFIX + id);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return {
        id: parsed.id,
        name: parsed.name,
        type: parsed.type,
        size: parsed.size,
        blob: dataURLtoBlob(parsed.dataUrl)
      };
    }
  }

  async function url(id) {
    if (!id) return "";
    if (urlCache.has(id)) return urlCache.get(id);
    const record = await get(id);
    if (!record || !record.blob) return "";
    const objectUrl = URL.createObjectURL(record.blob);
    urlCache.set(id, objectUrl);
    return objectUrl;
  }

  async function remove(id) {
    if (!id) return;
    if (urlCache.has(id)) {
      try {
        URL.revokeObjectURL(urlCache.get(id));
      } catch (e) {
        /* noop */
      }
      urlCache.delete(id);
    }
    try {
      const db = await openDB();
      await new Promise(function (resolve, reject) {
        const tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).delete(id);
        tx.oncomplete = resolve;
        tx.onerror = function () {
          reject(tx.error);
        };
      });
    } catch (e) {
      localStorage.removeItem(FALLBACK_PREFIX + id);
    }
  }

  async function usage() {
    let count = 0;
    let bytes = 0;
    try {
      const db = await openDB();
      await new Promise(function (resolve, reject) {
        const tx = db.transaction(STORE, "readonly");
        const req = tx.objectStore(STORE).openCursor();
        req.onsuccess = function () {
          const cursor = req.result;
          if (cursor) {
            count += 1;
            bytes += (cursor.value && cursor.value.size) || 0;
            cursor.continue();
          } else {
            resolve();
          }
        };
        req.onerror = function () {
          reject(req.error);
        };
      });
    } catch (e) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.indexOf(FALLBACK_PREFIX) === 0) {
          count += 1;
          bytes += (localStorage.getItem(key) || "").length;
        }
      }
    }
    return { count: count, bytes: bytes };
  }

  function formatBytes(bytes) {
    if (!bytes) return "0 KB";
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1) + " " + units[i];
  }

  async function hydrate(root) {
    const nodes = (root || document).querySelectorAll("[data-media]");
    const tasks = [];
    nodes.forEach(function (node) {
      const id = node.getAttribute("data-media");
      if (!id) return;
      tasks.push(
        url(id).then(function (src) {
          if (!src) return;
          if (node.tagName === "IMG") {
            node.src = src;
            node.hidden = false;
            node.classList.add("is-loaded");
            const wrap = node.closest("[data-media-wrap]");
            if (wrap) wrap.classList.add("has-media");
          } else {
            node.style.backgroundImage = 'url("' + src + '")';
            node.classList.add("is-loaded");
          }
        })
      );
    });
    await Promise.all(tasks);
  }

  window.PortfolioMedia = {
    put: put,
    get: get,
    url: url,
    remove: remove,
    usage: usage,
    formatBytes: formatBytes,
    hydrate: hydrate,
    compressImage: compressImage
  };
})();
