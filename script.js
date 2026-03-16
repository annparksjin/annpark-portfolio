const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobileLayoutQuery = window.matchMedia("(max-width: 900px)");

// Scroll reveal
const revealTargets = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.18 }
);
revealTargets.forEach((el) => revealObserver.observe(el));

// Cursor glow
const cursorGlow = document.querySelector(".cursor-glow");
if (cursorGlow && !prefersReducedMotion) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
  window.addEventListener("pointerdown", () => (cursorGlow.style.opacity = "0.5"));
  window.addEventListener("pointerup", () => (cursorGlow.style.opacity = "0.32"));
}

// Mobile menu
const menuBtn = document.querySelector(".menu-btn");
const mobileNav = document.getElementById("mobile-nav");
if (menuBtn && mobileNav) {
  const toggleMenu = () => {
    const open = mobileNav.classList.toggle("open");
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  };
  menuBtn.addEventListener("click", toggleMenu);
  mobileNav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      document.body.classList.remove("menu-open");
      menuBtn.setAttribute("aria-expanded", "false");
    })
  );
}

// Typing effect + tag interaction
const typingTarget = document.getElementById("typing-target");
const tagChips = Array.from(document.querySelectorAll(".tag-chip"));
let typeTimer;

function typeWord(word) {
  if (!typingTarget) return;
  clearInterval(typeTimer);
  typingTarget.textContent = "";
  let i = 0;
  typeTimer = setInterval(() => {
    typingTarget.textContent = word.slice(0, i + 1);
    i += 1;
    if (i >= word.length) {
      clearInterval(typeTimer);
    }
  }, 55);
}

if (typingTarget) {
  typeWord("Global Marketer");
}

tagChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    tagChips.forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    typeWord(chip.dataset.word || chip.textContent.trim());
  });
});

// About fun pills
const funPills = Array.from(document.querySelectorAll(".pill"));
funPills.forEach((pill) => {
  pill.addEventListener("click", () => {
    funPills.forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
  });
});

// User Manual category cards
const bubbles = Array.from(document.querySelectorAll(".bubble"));
const manualCards = Array.from(document.querySelectorAll(".manual-pop-card"));
bubbles.forEach((bubble) => {
  bubble.addEventListener("click", () => {
    bubbles.forEach((b) => b.classList.remove("active"));
    bubble.classList.add("active");
    const targetId = bubble.dataset.manualCard;
    manualCards.forEach((card) => {
      const isActive = card.id === targetId;
      card.classList.toggle("active", isActive);
      card.hidden = !isActive;
    });
  });
});

// Subtle floating motion for bubbles
if (!prefersReducedMotion && !mobileLayoutQuery.matches) {
  let start = 0;
  const animateBubbles = (t) => {
    if (!start) start = t;
    const elapsed = (t - start) / 1000;
    bubbles.forEach((bubble, index) => {
      const x =
        Math.sin(elapsed * (0.7 + index * 0.03) + index * 0.95) * 9 +
        Math.cos(elapsed * 0.38 + index * 0.6) * 4;
      const y =
        Math.cos(elapsed * (0.58 + index * 0.025) + index * 0.75) * 11 +
        Math.sin(elapsed * 0.42 + index * 0.5) * 3;
      const activeBoost = bubble.classList.contains("active") ? 1.06 : 1;
      bubble.style.transform = `translate(${x}px, ${y}px) scale(${activeBoost})`;
    });
    requestAnimationFrame(animateBubbles);
  };
  requestAnimationFrame(animateBubbles);
} else {
  bubbles.forEach((bubble) => {
    bubble.style.transform = bubble.classList.contains("active") ? "scale(1.03)" : "";
  });
}

// STEBA row / detail interaction
const stebaRows = Array.from(document.querySelectorAll("[data-steba-row]"));
const stebaLivePane = document.getElementById("steba-live-pane");
const stebaLiveTitle = document.getElementById("steba-live-title");
const stebaLiveDescription = document.getElementById("steba-live-description");
const stebaMedia = document.getElementById("steba-media");
const stebaCopy = document.getElementById("steba-copy");
const stebaSliderTrack = document.getElementById("steba-slider-track");
const stebaSliderDots = document.getElementById("steba-slider-dots");
let stebaSlideIndex = 0;
let stebaSlideTimer;
let stebaSlides = [];

const stebaMediaLibrary = {
  steba: stebaSliderTrack
    ? Array.from(stebaSliderTrack.querySelectorAll(".steba-slide")).map((img, index) => ({
        src: img.getAttribute("src") || "",
        alt: img.getAttribute("alt") || `STEBA event photo ${index + 1}`,
      }))
    : [],
  "producer-ad": [
    { src: "./assets/producer-ad/goutman.jpg", alt: "Producer AD project photo 1" },
    { src: "./assets/producer-ad/img-4957.jpg", alt: "Producer AD project photo 2" },
    { src: "./assets/producer-ad/img-4179.jpeg", alt: "Producer AD project photo 3" },
    { src: "./assets/producer-ad/img-4213.jpeg", alt: "Producer AD project photo 4" },
    { src: "./assets/producer-ad/img-4214.jpeg", alt: "Producer AD project photo 5" },
  ],
  graphics: [
    { src: "./assets/graphics/among-neighbors-review.png", alt: "Among Neighbors review graphic" },
    { src: "./assets/graphics/among-neighbors-social.png", alt: "Among Neighbors social campaign graphic" },
    { src: "./assets/graphics/tvs-nuclear-nightmare.png", alt: "TV's Nuclear Nightmare promotional graphic" },
  ],
};

function setStebaSlides(mediaKey) {
  if (!stebaSliderTrack || !stebaSliderDots) return;
  const key = (mediaKey || "").trim();
  const mediaItems = stebaMediaLibrary[key] || [];

  stebaSliderTrack.innerHTML = "";
  stebaSliderDots.innerHTML = "";
  stebaSlideIndex = 0;

  mediaItems.forEach((item, index) => {
    const image = document.createElement("img");
    image.src = item.src;
    image.alt = item.alt || `Slide ${index + 1}`;
    image.className = "steba-slide";
    image.loading = "lazy";
    stebaSliderTrack.appendChild(image);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `${key || "Media"} slide ${index + 1}`);
    dot.addEventListener("click", () => {
      renderStebaSlide(index);
      startStebaSlider();
    });
    stebaSliderDots.appendChild(dot);
  });

  stebaSlides = Array.from(stebaSliderTrack.querySelectorAll(".steba-slide"));
  renderStebaSlide(0);
}

function applyStebaState(row) {
  if (!row) return;
  stebaRows.forEach((r) => {
    const isActive = r === row;
    r.classList.toggle("active", isActive);
    r.setAttribute("aria-selected", String(isActive));
  });

  if (stebaLiveTitle) stebaLiveTitle.textContent = row.dataset.title || "";
  if (stebaLiveDescription) stebaLiveDescription.textContent = row.dataset.description || "";

  const mediaKey = row.dataset.mediaKey || "";
  const hasMedia = Boolean(stebaMediaLibrary[mediaKey]?.length);

  if (stebaMedia && stebaCopy) {
    stebaMedia.classList.toggle("is-visible", hasMedia);
    stebaCopy.classList.remove("is-hidden");
  }

  if (stebaLivePane) {
    stebaLivePane.classList.toggle("has-media", hasMedia);
    stebaLivePane.classList.remove("active");
    void stebaLivePane.offsetWidth;
    stebaLivePane.classList.add("active");
  }

  if (hasMedia) {
    setStebaSlides(mediaKey);
    renderStebaSlide(0);
    startStebaSlider();
  } else {
    stopStebaSlider();
  }
}

function renderStebaSlide(index) {
  if (!stebaSliderTrack || !stebaSlides.length) return;
  stebaSlideIndex = index;
  stebaSliderTrack.style.transform = `translateX(-${index * 100}%)`;
  if (stebaSliderDots) {
    Array.from(stebaSliderDots.querySelectorAll("button")).forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });
  }
}

function stopStebaSlider() {
  window.clearInterval(stebaSlideTimer);
}

function startStebaSlider() {
  if (!stebaSlides.length) return;
  stopStebaSlider();
  stebaSlideTimer = window.setInterval(() => {
    renderStebaSlide((stebaSlideIndex + 1) % stebaSlides.length);
  }, 2200);
}

stebaRows.forEach((row) => {
  row.addEventListener("click", () => applyStebaState(row));
});

applyStebaState(document.querySelector("[data-steba-row].active") || stebaRows[0]);

// Video slider
const videoTrack = document.getElementById("video-track");
const videoPrev = document.getElementById("video-prev");
const videoNext = document.getElementById("video-next");
const videoSlides = videoTrack ? Array.from(videoTrack.querySelectorAll(".video-slide")) : [];
const videoEls = videoTrack ? Array.from(videoTrack.querySelectorAll("video")) : [];
let videoIndex = 0;

function renderVideoSlide(index) {
  if (!videoTrack || !videoSlides.length) return;
  videoIndex = (index + videoSlides.length) % videoSlides.length;
  videoTrack.style.transform = `translateX(-${videoIndex * 100}%)`;
  videoEls.forEach((video, idx) => {
    if (idx !== videoIndex) {
      video.pause();
    }
  });
}

if (videoPrev && videoNext && videoSlides.length) {
  videoPrev.addEventListener("click", () => renderVideoSlide(videoIndex - 1));
  videoNext.addEventListener("click", () => renderVideoSlide(videoIndex + 1));
  renderVideoSlide(0);
}

// Back-to-top visibility
const toTopBtn = document.querySelector(".to-top");
if (toTopBtn) {
  const onScroll = () => {
    toTopBtn.classList.toggle("visible", window.scrollY > window.innerHeight * 0.7);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
}

// Tilt interaction for premium card feel
if (!prefersReducedMotion) {
  const tiltCards = document.querySelectorAll(".tilt-card");

  const resetTilt = (el) => {
    el.style.transform = "";
  };

  tiltCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * 8;
      const rotateX = (0.5 - py) * 8;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });
    card.addEventListener("pointerleave", () => resetTilt(card));
    card.addEventListener("blur", () => resetTilt(card), true);
  });
}

// Placeholder preview buttons (demo feedback only)
document.querySelectorAll("[data-coming-soon]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const original = btn.textContent;
    btn.textContent = "Coming Soon";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 1200);
  });
});
