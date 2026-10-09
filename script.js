const header = document.querySelector("#site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
const mobileLinks = mobileNav ? [...mobileNav.querySelectorAll("a")] : [];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setMenuOpen(isOpen) {
  if (!menuToggle || !mobileNav) return;

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
  mobileNav.setAttribute("aria-hidden", String(!isOpen));
  mobileNav.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
}

menuToggle?.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuOpen(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

document.addEventListener("click", (event) => {
  if (menuToggle?.getAttribute("aria-expanded") === "true" && !event.target.closest(".site-header")) {
    setMenuOpen(false);
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760) setMenuOpen(false);
});

let scrollTicking = false;
function updateHeader() {
  if (!scrollTicking) {
    window.requestAnimationFrame(() => {
      header?.classList.toggle("is-scrolled", window.scrollY > 24);
      scrollTicking = false;
    });
    scrollTicking = true;
  }
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const revealItems = [...document.querySelectorAll("[data-reveal]")];
document.documentElement.classList.add("js-ready");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -36px 0px" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
