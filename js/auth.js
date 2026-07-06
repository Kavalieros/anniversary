(function () {
  const STORAGE_KEY = "anniversary_auth";
  const cfg = window.ANNIVERSARY_CONFIG;

  if (!cfg) {
    document.getElementById("gate-error").hidden = false;
    document.getElementById("gate-error").textContent =
      "Missing config.js — copy config.example.js to config.js and customize it.";
    return;
  }

  const gate = document.getElementById("gate");
  const app = document.getElementById("app");
  const form = document.getElementById("gate-form");
  const errorEl = document.getElementById("gate-error");
  const logoutBtn = document.getElementById("logout-btn");

  function isAllowedEmail(email) {
    const normalized = email.trim().toLowerCase();
    return cfg.allowedEmails.some((e) => e.trim().toLowerCase() === normalized);
  }

  function unlock(email) {
    sessionStorage.setItem(STORAGE_KEY, email.trim().toLowerCase());
    gate.hidden = true;
    app.hidden = false;
    window.dispatchEvent(new CustomEvent("anniversary:unlocked"));
  }

  function lock() {
    sessionStorage.removeItem(STORAGE_KEY);
    gate.hidden = false;
    app.hidden = true;
    form.reset();
    errorEl.hidden = true;
  }

  function tryRestoreSession() {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved && isAllowedEmail(saved)) {
      unlock(saved);
      return true;
    }
    return false;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    const email = document.getElementById("gate-email").value;
    const pass = document.getElementById("gate-pass").value;

    if (!isAllowedEmail(email)) {
      errorEl.textContent = "This email isn't on the guest list.";
      errorEl.hidden = false;
      return;
    }

    if (pass !== cfg.passphrase) {
      errorEl.textContent = "Wrong secret — try again.";
      errorEl.hidden = false;
      return;
    }

    unlock(email);
  });

  logoutBtn.addEventListener("click", lock);

  tryRestoreSession();
})();
