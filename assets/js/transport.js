"use strict";

const DIAMOND_TRANSPORT_KEY = "diamondTransport";
const DIAMOND_WISP_SUFFIX = "/wisp/";

function diamondWispUrl() {
  return (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + DIAMOND_WISP_SUFFIX;
}

function getDiamondTransportPref() {
  try {
    const s = typeof getDiamondSettings === "function" ? getDiamondSettings() : null;
    if (s && s.transport) return s.transport;
    return localStorage.getItem(DIAMOND_TRANSPORT_KEY) || "auto";
  } catch {
    return "auto";
  }
}

function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error((label || "transport") + " timed out after " + ms + "ms")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function diamondTryTransport(connection, path, wispUrl) {
  await withTimeout(connection.setTransport(path, [{ wisp: wispUrl }]), 8000, path);
  if (typeof connection.getTransport === "function") {
    try { await withTimeout(connection.getTransport(), 3000, path + " verify"); } catch {}
  }
}

function diamondTransportOrder(pref) {
  if (pref === "epoxy") return ["/epoxy/index.mjs", "/libcurl/index.mjs"];
  if (pref === "libcurl") return ["/libcurl/index.mjs", "/epoxy/index.mjs"];
  try {
    const last = localStorage.getItem(DIAMOND_TRANSPORT_KEY);
    if (last === "/libcurl/index.mjs") return ["/libcurl/index.mjs", "/epoxy/index.mjs"];
  } catch {}
  return ["/epoxy/index.mjs", "/libcurl/index.mjs"];
}

async function diamondSetTransport(connection, wispUrl) {
  const pref = getDiamondTransportPref();
  const order = diamondTransportOrder(pref);
  const errors = [];
  for (const path of order) {
    try {
      await diamondTryTransport(connection, path, wispUrl || diamondWispUrl());
      try { localStorage.setItem(DIAMOND_TRANSPORT_KEY, path); } catch {}
      try { document.documentElement.dataset.transport = path.includes("libcurl") ? "libcurl" : "epoxy"; } catch {}
      return path;
    } catch (err) {
      console.warn("Diamond transport failed, trying fallback:", path, err);
      errors.push(path + ": " + (err && err.message ? err.message : err));
    }
  }
  throw new Error("All transports failed. " + errors.join(" | "));
}