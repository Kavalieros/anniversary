(function () {
  const PETALS = ["🌹", "🌻"];
  const COUNT = 32;

  function startRain() {
    const container = document.querySelector(".florals-bg");
    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < COUNT; i++) {
      const petal = document.createElement("span");
      petal.className = "rain-petal " + (PETALS[i % 2] === "🌹" ? "rain-rose" : "rain-sunflower");
      petal.textContent = PETALS[i % 2];
      petal.style.left = Math.random() * 100 + "%";
      petal.style.animationDuration = 5 + Math.random() * 7 + "s";
      petal.style.animationDelay = Math.random() * 12 + "s";
      petal.style.fontSize = 1.1 + Math.random() * 1.4 + "rem";
      container.appendChild(petal);
    }
  }

  window.addEventListener("anniversary:unlocked", startRain);

  const app = document.getElementById("app");
  if (app && !app.hidden) {
    startRain();
  }
})();
