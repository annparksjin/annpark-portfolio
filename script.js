const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Reveal sections as they enter the viewport.
const revealTargets = document.querySelectorAll(".reveal");
if (!prefersReducedMotion && revealTargets.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("in-view"));
}

const menuBtn = document.querySelector(".menu-btn");
const mobileNav = document.getElementById("mobile-nav");

if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

const typingTarget = document.getElementById("typing-target");
const roleChips = Array.from(document.querySelectorAll(".role-chip"));

roleChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    roleChips.forEach((item) => item.classList.remove("is-active"));
    chip.classList.add("is-active");

    if (typingTarget) {
      typingTarget.textContent = chip.dataset.word || chip.textContent.trim();
    }
  });
});

const manualTabs = Array.from(document.querySelectorAll(".manual-tab"));
const manualPanels = Array.from(document.querySelectorAll(".manual-panel"));

manualTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const targetId = tab.dataset.manualCard;
    manualTabs.forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");

    manualPanels.forEach((panel) => {
      const active = panel.id === targetId;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  });
});

const videoTrack = document.getElementById("video-track");
const videoPrev = document.getElementById("video-prev");
const videoNext = document.getElementById("video-next");
const videoSlides = videoTrack ? Array.from(videoTrack.children) : [];
let videoIndex = 0;

function renderVideoSlide(index) {
  if (!videoTrack || !videoSlides.length) return;
  videoIndex = (index + videoSlides.length) % videoSlides.length;
  videoTrack.style.transform = `translateX(-${videoIndex * 100}%)`;
}

if (videoPrev && videoNext && videoSlides.length) {
  videoPrev.addEventListener("click", () => renderVideoSlide(videoIndex - 1));
  videoNext.addEventListener("click", () => renderVideoSlide(videoIndex + 1));
}

renderVideoSlide(0);

const toTopBtn = document.querySelector(".to-top");

if (toTopBtn) {
  const syncToTop = () => {
    toTopBtn.classList.toggle("visible", window.scrollY > window.innerHeight * 0.7);
  };

  window.addEventListener("scroll", syncToTop, { passive: true });
  syncToTop();

  toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
}
