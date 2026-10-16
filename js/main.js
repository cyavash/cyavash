"use strict";
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector("#primary-nav");
function closeMenu() {
  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
}
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("open", open);
});
nav
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    closeMenu();
    menuButton.focus();
  }
});
const dialog = document.querySelector(".image-dialog");
const previewImage = dialog.querySelector(".dialog-image");
let previousFocus;
if (typeof dialog.showModal === "function") {
  document.querySelectorAll("[data-lightbox]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
        return;
      event.preventDefault();
      previousFocus = link;
      previewImage.src = link.href;
      previewImage.alt = link.querySelector("img").alt;
      document.querySelector("#image-title").textContent = link.dataset.title;
      document.querySelector("#image-caption").textContent =
        link.dataset.caption || "Full project preview. Scroll to explore.";
      dialog.showModal();
      document.body.classList.add("dialog-open");
      dialog.querySelector(".dialog-scroll").scrollTop = 0;
    });
  });
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        dialog.close();
    }
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    if (previousFocus) previousFocus.focus();
  });
}

// Enhance content only when motion and viewport observation are supported.
const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
const motionTargets = [
  ...document.querySelectorAll(
    ".section-heading, .project, .email-project, .expertise-grid article, .approach-grid article, .contact-grid",
  ),
];
const counters = [...document.querySelectorAll("[data-count]")];
let sectionObserver, statsObserver;
const runningCounters = new Set();
function showFinalCounts() {
  counters.forEach((el) => {
    el.textContent =
      Number(el.dataset.count).toLocaleString("en-US") +
      (el.dataset.suffix || "");
  });
}
function countUp(el) {
  const goal = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  const started = performance.now();
  runningCounters.add(el);
  function step(now) {
    if (motionPreference.matches) {
      showFinalCounts();
      runningCounters.delete(el);
      return;
    }
    const progress = Math.min((now - started) / 1250, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(goal * eased).toLocaleString("en-US") + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else runningCounters.delete(el);
  }
  requestAnimationFrame(step);
}
if ("IntersectionObserver" in window && !motionPreference.matches) {
  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: "0px 0px -24px 0px" },
  );
  motionTargets.forEach((el) => {
    // Content already on screen stays visible during initialization.
    if (el.getBoundingClientRect().top >= window.innerHeight) {
      el.classList.add("reveal-pending");
      sectionObserver.observe(el);
    }
  });
  statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        counters.forEach(countUp);
        statsObserver.disconnect();
      }
    },
    { threshold: 0.35 },
  );
  statsObserver.observe(document.querySelector(".proof"));
}
motionPreference.addEventListener("change", (event) => {
  if (event.matches) {
    sectionObserver?.disconnect();
    statsObserver?.disconnect();
    motionTargets.forEach((el) => el.classList.add("is-visible"));
    showFinalCounts();
  }
});
