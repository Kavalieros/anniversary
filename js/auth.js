(function () {
  const STORAGE_KEY = "anniversary_auth";
  const cfg = window.ANNIVERSARY_CONFIG;

  const gate = document.getElementById("gate");
  const app = document.getElementById("app");
  const form = document.getElementById("gate-form");
  const errorEl = document.getElementById("gate-error");
  const logoutBtn = document.getElementById("logout-btn");

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  if (!cfg || !cfg.allowedEmails || cfg.allowedEmails.length === 0) {
    showError("Λείπει η ρύθμιση — δοκίμασε ξανά σε λίγο.");
    return;
  }

  function normalizeGreek(str) {
    return str
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ς/g, "σ")
      .toLowerCase();
  }

  function getAcceptedPassphrases() {
    if (cfg.passphrases && cfg.passphrases.length > 0) {
      return cfg.passphrases.map(normalizeGreek);
    }
    if (cfg.passphrase) {
      return [normalizeGreek(cfg.passphrase)];
    }
    return [];
  }

  function isAllowedEmail(email) {
    const normalized = email.trim().toLowerCase();
    return cfg.allowedEmails.some((e) => e.trim().toLowerCase() === normalized);
  }

  function isCorrectPassphrase(input) {
    const normalized = normalizeGreek(input);
    return getAcceptedPassphrases().includes(normalized);
  }

  function showApp() {
    gate.hidden = true;
    gate.classList.add("is-hidden");
    app.hidden = false;
    app.classList.add("is-visible");
    document.body.classList.add("unlocked");
    window.scrollTo(0, 0);
    if (location.hash !== "#home") {
      history.replaceState({ unlocked: true }, "", "#home");
    }
    window.dispatchEvent(new CustomEvent("anniversary:unlocked"));
  }

  function showGate() {
    gate.hidden = false;
    gate.classList.remove("is-hidden");
    app.hidden = true;
    app.classList.remove("is-visible");
    document.body.classList.remove("unlocked");
    history.replaceState(null, "", location.pathname + location.search);
  }

  function unlock(email) {
    sessionStorage.setItem(STORAGE_KEY, email.trim().toLowerCase());
    showApp();
  }

  function lock() {
    sessionStorage.removeItem(STORAGE_KEY);
    showGate();
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

    const email = document.getElementById("gate-email").value.trim();
    const pass = document.getElementById("gate-pass").value;

    if (!email) {
      showError("Βάλε το email σου.");
      return;
    }

    if (!pass) {
      showError("Βάλε τον κωδικό.");
      return;
    }

    if (!isAllowedEmail(email)) {
      showError("Αυτό το email δεν είναι στη λίστα.");
      return;
    }

    if (!isCorrectPassphrase(pass)) {
      showError("Λάθος κωδικός — δοκίμασε ξανά.");
      return;
    }

    unlock(email);
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", lock);
  }

  tryRestoreSession();
})();
