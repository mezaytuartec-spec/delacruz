(function () {
  "use strict";

  var PHONE = "5492392494697";

  function safe(fn, name) {
    try { fn(); } catch (err) { console.warn("[dlc] " + name + " failed:", err); }
  }

  // Reveal on scroll + safety net
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    els.forEach(function (el) {
      var parent = el.parentElement;
      if (parent && parent.children.length > 1) {
        var idx = Array.prototype.indexOf.call(parent.children, el);
        el.style.transitionDelay = Math.min(idx, 5) * 90 + "ms";
      }
      io.observe(el);
    });

    setTimeout(function () {
      els.forEach(function (el) { el.classList.add("is-visible"); });
    }, 6000);
  }

  // Mobile menu
  function initMenu() {
    var nav = document.querySelector(".nav");
    var burger = document.getElementById("burger");
    if (!nav || !burger) return;
    function close() {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    burger.addEventListener("click", function () {
      var open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll(".nav__links a").forEach(function (a) { a.addEventListener("click", close); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  // WhatsApp links with a pre-written message per service
  function initWhatsApp() {
    document.querySelectorAll("[data-wa]").forEach(function (a) {
      var topic = a.getAttribute("data-wa");
      var msg = topic
        ? "Hola! Quiero consultar por " + topic + "."
        : "Hola! Quiero hacer la consulta sin cargo.";
      a.href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(msg);
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  // Floating WhatsApp hidden while the hero (which has its own CTA) is on screen
  function initFloat() {
    var btn = document.querySelector(".wa-float");
    var hero = document.querySelector(".hero");
    if (!btn || !hero || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (entries) {
      btn.classList.toggle("is-hidden", entries[0].isIntersecting);
    }, { threshold: 0.35 }).observe(hero);
  }

  // Nav becomes a fixed bar once the hero is scrolled past (sentinel, no scroll listener)
  function initStickyNav() {
    var nav = document.querySelector(".nav");
    var hero = document.querySelector(".hero");
    if (!nav || !hero || !("IntersectionObserver" in window)) return;
    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;left:0;bottom:80px;width:1px;height:1px";
    hero.appendChild(sentinel);
    new IntersectionObserver(function (entries) {
      if (nav.classList.contains("is-open")) return;
      var e = entries[0];
      nav.classList.toggle("is-fixed", !e.isIntersecting && e.boundingClientRect.top < 0);
    }).observe(sentinel);
  }

  function initYear() {
    var y = document.getElementById("year");
    if (y) y.textContent = String(new Date().getFullYear());
  }

  function boot() {
    safe(initReveal, "reveal");
    safe(initMenu, "menu");
    safe(initWhatsApp, "whatsapp");
    safe(initFloat, "float");
    safe(initStickyNav, "stickyNav");
    safe(initYear, "year");
  }

  document.documentElement.classList.remove("no-js");
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
