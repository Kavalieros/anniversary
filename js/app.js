(function () {
  const cfg = window.ANNIVERSARY_CONFIG;
  if (!cfg) return;

  function formatDate(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("el-GR", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function yearsTogether(startDate) {
    const start = new Date(startDate + "T00:00:00");
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    const anniversary = new Date(now.getFullYear(), start.getMonth(), start.getDate());
    if (now < anniversary) years--;
    return Math.max(years, 0);
  }

  function updateCounters() {
    const start = new Date(cfg.startDate + "T00:00:00");
    const now = new Date();
    const ms = now - start;

    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const heartbeats = Math.floor(ms / (1000 * 60) * 72);

    document.getElementById("days-together").textContent = days.toLocaleString("el-GR");
    document.getElementById("hours-together").textContent = hours.toLocaleString("el-GR");
    document.getElementById("heartbeats").textContent = heartbeats.toLocaleString("el-GR");
  }

  function renderGallery() {
    const photos = cfg.photos || [];
    if (photos.length === 0) return;

    const section = document.getElementById("gallery-section");
    const gallery = document.getElementById("gallery");
    section.hidden = false;

    photos.forEach((filename) => {
      const img = document.createElement("img");
      img.src = `assets/photos/${filename}`;
      img.alt = "Μια αναμνηστική στιγμή μαζί";
      img.loading = "lazy";
      gallery.appendChild(img);
    });
  }

  function populate() {
    document.getElementById("your-name").textContent = cfg.yourName;
    document.getElementById("her-name").textContent = cfg.herName;
    document.getElementById("years-count").textContent = yearsTogether(cfg.startDate);
    document.getElementById("start-date-display").textContent = formatDate(cfg.startDate);
    document.getElementById("love-letter").textContent = cfg.loveLetter;
    document.getElementById("letter-sign-name").textContent = cfg.yourName;
    document.getElementById("footer-year").textContent = new Date().getFullYear();

    renderGallery();
    updateCounters();
    setInterval(updateCounters, 60_000);
  }

  window.addEventListener("anniversary:unlocked", populate);

  if (!document.getElementById("app").hidden) {
    populate();
  }
})();
