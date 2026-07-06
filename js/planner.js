(function () {
  const STORAGE_KEY = "anniversary_planner";
  const cfg = window.ANNIVERSARY_CONFIG;

  const form = document.getElementById("planner-form");
  const statusEl = document.getElementById("planner-status");
  const selections = { dinner: null, location: null, month: null };

  if (!form) return;

  function showStatus(message, isError) {
    statusEl.textContent = message;
    statusEl.classList.toggle("is-error", !!isError);
    statusEl.hidden = false;
  }

  function getUserEmail() {
    return sessionStorage.getItem("anniversary_auth") || "άγνωστο";
  }

  function saveLocally(data) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...data, savedAt: new Date().toISOString() })
    );
  }

  function loadSaved() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      ["dinner", "location", "month"].forEach((field) => {
        if (!saved[field]) return;
        selections[field] = saved[field];
        const group = form.querySelector(`[data-field="${field}"]`);
        group.querySelectorAll(".planner-btn").forEach((btn) => {
          btn.classList.toggle("is-selected", btn.dataset.value === saved[field]);
        });
      });
      if (saved.savedAt) {
        showStatus("Οι απαντήσεις σου είναι αποθηκευμένες ✓", false);
      }
    } catch (_) {
      /* ignore */
    }
  }

  form.querySelectorAll(".planner-options").forEach((group) => {
    const field = group.dataset.field;
    group.querySelectorAll(".planner-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        selections[field] = btn.dataset.value;
        group.querySelectorAll(".planner-btn").forEach((b) => {
          b.classList.remove("is-selected");
        });
        btn.classList.add("is-selected");
        statusEl.hidden = true;
      });
    });
  });

  async function sendEmail(data) {
    const notifyEmail = cfg.plannerNotifyEmail || "kavalieros.v@gmail.com";
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(notifyEmail)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: "Απάντηση Planner Επετείου 💕",
        _template: "table",
        _captcha: "false",
        Από: data.email,
        "Δείπνο για την επέτειο": data.dinner,
        Τοποθεσία: "Ρόδος — " + data.location,
        Μήνας: "Σεπτέμβριος — " + data.month,
        Ημερομηνία: new Date().toLocaleString("el-GR"),
      }),
    });

    if (!response.ok) {
      throw new Error("email failed");
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    statusEl.hidden = true;

    const missing = Object.entries(selections)
      .filter(([, v]) => !v)
      .map(([k]) => k);

    if (missing.length > 0) {
      showStatus("Διάλεξε Ναι ή Ναι για όλες τις ερωτήσεις!", true);
      return;
    }

    const data = {
      email: getUserEmail(),
      dinner: selections.dinner,
      location: selections.location,
      month: selections.month,
    };

    const submitBtn = form.querySelector(".planner-submit");
    submitBtn.disabled = true;
    submitBtn.textContent = "Αποστολή...";

    try {
      saveLocally(data);
      await sendEmail(data);
      showStatus("Αποθηκεύτηκε και στάλθηκε email! Τέλεια επιλογές — και τα δύο Ναι 💕", false);
    } catch (_) {
      saveLocally(data);
      showStatus(
        "Αποθηκεύτηκε τοπικά! Το email μπορεί να καθυστερήσει — έλεγξε spam.",
        false
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Αποθήκευση & Αποστολή";
    }
  });

  window.addEventListener("anniversary:unlocked", loadSaved);

  if (!document.getElementById("app").hidden) {
    loadSaved();
  }
})();
