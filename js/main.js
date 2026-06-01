// Sticky header shadow on scroll
window.addEventListener("scroll", function () {
  var h = document.querySelector(".site-header");
  if (h) h.classList.toggle("scrolled", window.scrollY > 10);
}, { passive: true });

// Scroll reveal — fade + slide up as elements enter viewport (Wix animation-slide/fade)
(function () {
  var items = document.querySelectorAll("[data-reveal]");
  if (!items.length || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  items.forEach(function (el) { io.observe(el); });
})();

// Mobile nav toggle
document.addEventListener("click", function (e) {
  if (e.target.closest(".nav__toggle")) {
    document.getElementById("nav").classList.toggle("is-open");
  }
});

// Close nav when a link is clicked on mobile
document.querySelectorAll(".nav__link, .nav__cta").forEach(function (link) {
  link.addEventListener("click", function () {
    var nav = document.getElementById("nav");
    if (nav) nav.classList.remove("is-open");
  });
});

// Portfolio gallery — 2-up full-bleed slider
document.querySelectorAll(".pgallery").forEach(function (gl) {
  var track  = gl.querySelector(".pgallery__track");
  var slides = gl.querySelectorAll(".pgallery__slide");
  var total  = slides.length;
  var cur    = 0;
  var mobile = window.innerWidth <= 760;

  function slideW() {
    return mobile ? window.innerWidth : Math.round(window.innerWidth / 2) + 3;
  }

  function go(n) {
    var maxSlide = mobile ? total - 1 : total - 2;
    cur = Math.max(0, Math.min(n, maxSlide));
    track.style.setProperty("--pg-offset", (-cur * slideW()) + "px");
    gl.querySelector(".pgallery__btn--prev").style.opacity = cur === 0 ? ".4" : "1";
    gl.querySelector(".pgallery__btn--next").style.opacity = cur >= maxSlide ? ".4" : "1";
  }

  window.addEventListener("resize", function () {
    mobile = window.innerWidth <= 760;
    go(cur);
  });

  gl.querySelector(".pgallery__btn--prev").addEventListener("click", function () { go(cur - 1); });
  gl.querySelector(".pgallery__btn--next").addEventListener("click", function () { go(cur + 1); });
  go(0);
});

// Contact forms — no backend on static hosting.
// Compose mailto on submit so messages still reach the inbox.
var CONTACT_EMAIL = "Joekara726@gmail.com";

document.querySelectorAll("form[data-mailto]").forEach(function (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    var lines = [];
    data.forEach(function (value, key) {
      if (String(value).trim()) lines.push(key + ": " + value);
    });
    var subject = encodeURIComponent("Website Enquiry — Blumenfeld Services");
    var body = encodeURIComponent(lines.join("\n"));
    var status = form.querySelector(".form-status");
    if (status) {
      status.style.display = "block";
      status.textContent = "Opening your email client… if nothing happens, email us directly at " + CONTACT_EMAIL + ".";
    }
    window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
  });
});
