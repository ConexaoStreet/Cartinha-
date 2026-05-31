/*
  Configurações fáceis de alterar:
  - personName / authorName: nomes exibidos na carta.
  - counterStartDate: data inicial do contador romântico.
  - timelinePhrases: frases da linha do tempo.
  - particleIntensity: intensidade das partículas (reduzida automaticamente no celular).
  - animationSpeed: multiplica velocidades gerais de animações em JS.
*/
const CONFIG = {
  personName: "Lupyta",
  authorName: "Vitor",
  counterStartDate: "2024-01-01T00:00:00",
  typingPhrases: [
    "Eu queria que você sentisse meu abraço daqui.",
    "Então transformei saudade em uma cartinha."
  ],
  timelinePhrases: [
    "O dia que eu percebi que você era diferente",
    "As conversas que me acalmam",
    "A saudade que aperta, mas também mostra o quanto você importa",
    "O dia que a gente ainda vai rir disso tudo juntos"
  ],
  particleIntensity: 1,
  animationSpeed: 1
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isSmallScreen = window.matchMedia("(max-width: 640px)").matches;
const particleScale = prefersReducedMotion ? 0 : (isSmallScreen ? 0.48 : 1) * CONFIG.particleIntensity;

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function applyNames() {
  $$('[data-person-name]').forEach((node) => { node.textContent = CONFIG.personName; });
  $$('[data-author-name]').forEach((node) => { node.textContent = CONFIG.authorName; });
  document.title = `Uma carta para ${CONFIG.personName}`;
}

function hideLoadingScreen() {
  document.body.classList.add("is-loading");
  window.addEventListener("load", () => {
    const delay = prefersReducedMotion ? 100 : 1500 / CONFIG.animationSpeed;
    setTimeout(() => {
      $("#loadingScreen")?.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
    }, delay);
  });
}

function setupRevealAnimations() {
  const revealItems = $$(".section-reveal, .reveal-left, .reveal-right, .reveal-zoom, .qr-card");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        if (entry.target.id === "timeline") drawTimelineLine();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });

  revealItems.forEach((item) => observer.observe(item));
}

function setupEnvelope() {
  const button = $("#openLetterBtn");
  const envelope = $(".envelope");
  const letter = $("#letter");

  button?.addEventListener("click", (event) => {
    createRipple(event);
    envelope?.classList.add("is-open");
    burstHearts(window.innerWidth / 2, window.innerHeight * 0.48, 28);

    setTimeout(() => {
      letter?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      startTypingAnimation();
    }, prefersReducedMotion ? 100 : 1150 / CONFIG.animationSpeed);
  });
}

function startTypingAnimation() {
  const line = $("#typingLine");
  if (!line || line.dataset.started) return;
  line.dataset.started = "true";

  const fullText = CONFIG.typingPhrases.join(" ");
  if (prefersReducedMotion) {
    line.textContent = fullText;
    return;
  }

  let index = 0;
  const tick = () => {
    line.textContent = fullText.slice(0, index);
    index += 1;
    if (index <= fullText.length) {
      setTimeout(tick, 34 / CONFIG.animationSpeed);
    }
  };
  tick();
}

function buildTimeline() {
  const track = $("#timelineTrack");
  if (!track) return;
  const icons = ["❤", "✦", "♡", "★"];

  track.innerHTML = CONFIG.timelinePhrases.map((phrase, index) => `
    <article class="timeline-item section-reveal" data-icon="${icons[index % icons.length]}">
      <h3>${phrase}</h3>
    </article>
  `).join("");
}

function drawTimelineLine() {
  const track = $("#timelineTrack");
  if (!track) return;
  requestAnimationFrame(() => track.style.setProperty("--line-progress", "100%"));
}

function setupCounter() {
  const start = new Date(CONFIG.counterStartDate).getTime();
  const units = {
    days: $('[data-unit="days"]'),
    hours: $('[data-unit="hours"]'),
    minutes: $('[data-unit="minutes"]'),
    seconds: $('[data-unit="seconds"]')
  };

  const setUnit = (unit, value) => {
    const node = units[unit];
    if (!node) return;
    const text = String(value).padStart(2, "0");
    if (node.textContent !== text) {
      node.textContent = text;
      node.classList.add("is-changing");
      setTimeout(() => node.classList.remove("is-changing"), 230);
    }
  };

  const update = () => {
    const diff = Math.max(0, Date.now() - start);
    const totalSeconds = Math.floor(diff / 1000);
    setUnit("days", Math.floor(totalSeconds / 86400));
    setUnit("hours", Math.floor((totalSeconds % 86400) / 3600));
    setUnit("minutes", Math.floor((totalSeconds % 3600) / 60));
    setUnit("seconds", totalSeconds % 60);
  };

  update();
  setInterval(update, 1000);
}

function setupQRCode() {
  const qrContainer = $("#qrcode");
  if (qrContainer && window.QRCode) {
    new QRCode(qrContainer, {
      text: window.location.href,
      width: 190,
      height: 190,
      colorDark: "#32111d",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
  } else if (qrContainer) {
    qrContainer.textContent = "QR Code indisponível. Copie o link abaixo.";
  }

  $("#copyLinkBtn")?.addEventListener("click", async (event) => {
    createRipple(event);
    const feedback = $("#copyFeedback");
    try {
      await navigator.clipboard.writeText(window.location.href);
      if (feedback) feedback.textContent = "Link copiado com carinho.";
    } catch {
      if (feedback) feedback.textContent = "Não consegui copiar automaticamente. Use o link da barra do navegador.";
    }
  });

  $("#downloadQrBtn")?.addEventListener("click", (event) => {
    createRipple(event);
    const canvas = $("#qrcode canvas");
    const image = $("#qrcode img");
    const href = canvas ? canvas.toDataURL("image/png") : image?.src;
    if (!href) return;

    const link = document.createElement("a");
    link.href = href;
    link.download = `cartinha-${CONFIG.personName.toLowerCase()}.png`;
    link.click();
  });
}

function setupBackToTop() {
  $("#backToTop")?.addEventListener("click", (event) => {
    createRipple(event);
    $("#top")?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
}

function createRipple(event) {
  const button = event.currentTarget;
  if (!(button instanceof HTMLElement) || prefersReducedMotion) return;
  const rect = button.getBoundingClientRect();
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.left = `${event.clientX - rect.left}px`;
  ripple.style.top = `${event.clientY - rect.top}px`;
  button.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
}

function setupClickSparks() {
  if (prefersReducedMotion) return;
  window.addEventListener("pointerdown", (event) => {
    burstHearts(event.clientX, event.clientY, isSmallScreen ? 5 : 8);
  }, { passive: true });
}

function burstHearts(x, y, amount = 10) {
  if (prefersReducedMotion) return;
  const symbols = ["❤", "♡", "✦", "•"];
  for (let i = 0; i < amount; i += 1) {
    const spark = document.createElement("span");
    spark.className = "click-spark";
    spark.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    spark.style.left = `${x}px`;
    spark.style.top = `${y}px`;
    spark.style.setProperty("--spark-x", `${(Math.random() - 0.5) * 180}px`);
    spark.style.setProperty("--spark-y", `${-30 - Math.random() * 140}px`);
    document.body.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove());
  }
}

function setupParallax() {
  const photos = $$(".photo-card");
  const aurora = $("#auroraBg");
  if (prefersReducedMotion) return;

  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    aurora?.style.setProperty("transform", `translate3d(0, ${y * -0.025}px, 0)`);
    photos.forEach((photo) => {
      const depth = Number(photo.dataset.depth || 0.06);
      const rect = photo.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        photo.style.setProperty("--parallax", `${(rect.top - window.innerHeight / 2) * depth}px`);
        const img = photo.querySelector("img");
        if (img) img.style.transform = `translate3d(0, var(--parallax), 0) scale(1.08)`;
      }
    });
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
}

function setupAmbientParticles() {
  const canvas = $("#ambientCanvas");
  if (!canvas || particleScale <= 0) return;
  const context = canvas.getContext("2d");
  const particles = [];
  const baseCount = Math.round(80 * particleScale);
  let width = 0;
  let height = 0;
  let lastTime = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const makeParticle = (initial = false) => ({
    x: Math.random() * width,
    y: initial ? Math.random() * height : height + 20,
    size: 1.2 + Math.random() * 4,
    speed: (0.12 + Math.random() * 0.34) * CONFIG.animationSpeed,
    drift: (Math.random() - 0.5) * 0.36,
    alpha: 0.18 + Math.random() * 0.62,
    pulse: Math.random() * Math.PI * 2,
    heart: Math.random() > 0.72
  });

  resize();
  for (let i = 0; i < baseCount; i += 1) particles.push(makeParticle(true));

  const drawHeart = (x, y, size) => {
    context.save();
    context.translate(x, y);
    context.scale(size / 18, size / 18);
    context.beginPath();
    context.moveTo(0, 6);
    context.bezierCurveTo(-12, -3, -8, -14, 0, -8);
    context.bezierCurveTo(8, -14, 12, -3, 0, 6);
    context.fill();
    context.restore();
  };

  const animate = (time) => {
    const delta = Math.min(32, time - lastTime || 16);
    lastTime = time;
    context.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      particle.y -= particle.speed * delta * 0.06;
      particle.x += particle.drift * delta * 0.06;
      particle.pulse += 0.018 * delta;

      if (particle.y < -30 || particle.x < -40 || particle.x > width + 40) {
        particles[index] = makeParticle(false);
        return;
      }

      const glow = particle.alpha * (0.72 + Math.sin(particle.pulse) * 0.28);
      context.globalAlpha = glow;
      context.fillStyle = particle.heart ? "#ff9dbc" : "#ffe6ef";
      context.shadowColor = "#ff7aa8";
      context.shadowBlur = 12;
      if (particle.heart) {
        drawHeart(particle.x, particle.y, particle.size * 4.3);
      } else {
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
      }
    });

    context.globalAlpha = 1;
    requestAnimationFrame(animate);
  };

  window.addEventListener("resize", resize, { passive: true });
  requestAnimationFrame(animate);
}

function init() {
  applyNames();
  hideLoadingScreen();
  buildTimeline();
  setupRevealAnimations();
  setupEnvelope();
  setupCounter();
  setupQRCode();
  setupBackToTop();
  setupClickSparks();
  setupParallax();
  setupAmbientParticles();
}

init();
