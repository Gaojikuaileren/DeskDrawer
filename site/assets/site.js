/* Progressive enhancement only — every page is complete and readable without this file. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  /* nav gains a background once the page scrolls */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("scrolled", window.scrollY > 12); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* scroll reveal */
  var els = document.querySelectorAll(".reveal");
  var showAll = function () { Array.prototype.forEach.call(els, function (e) { e.classList.add("in"); }); };
  if (reduce || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    try {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
      Array.prototype.forEach.call(els, function (e) { io.observe(e); });
    } catch (err) { showAll(); }
  }

  /* "on this page" — highlight the heading currently in view */
  var toc = document.querySelector(".doc-toc");
  if (toc && "IntersectionObserver" in window) {
    var links = {};
    Array.prototype.forEach.call(toc.querySelectorAll("a[href^='#']"), function (a) {
      links[decodeURIComponent(a.getAttribute("href").slice(1))] = a;
    });
    var visible = [];
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var id = en.target.id, at = visible.indexOf(id);
        if (en.isIntersecting && at < 0) visible.push(id);
        if (!en.isIntersecting && at >= 0) visible.splice(at, 1);
      });
      var order = Object.keys(links);
      var current = order.filter(function (id) { return visible.indexOf(id) >= 0; })[0];
      order.forEach(function (id) { links[id].classList.toggle("is-active", id === current); });
    }, { rootMargin: "-72px 0px -70% 0px" });
    Object.keys(links).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* client-side filter for the FAQ / glossary / docs indexes */
  var finder = document.querySelector("[data-finder]");
  if (finder) {
    var scope = document.querySelector(finder.getAttribute("data-finder"));
    var count = document.querySelector("[data-finder-count]");
    if (scope) {
      var rows = Array.prototype.slice.call(scope.querySelectorAll("[data-k]"));
      var groups = Array.prototype.slice.call(scope.querySelectorAll("[data-group]"));
      var total = rows.length;

      var run = function () {
        var q = finder.value.trim().toLowerCase();
        var terms = q ? q.split(/\s+/) : [];
        var shown = 0;
        rows.forEach(function (r) {
          var hay = r.getAttribute("data-k");
          var ok = terms.every(function (t) { return hay.indexOf(t) >= 0; });
          r.hidden = !ok;
          if (ok) shown++;
        });
        groups.forEach(function (g) {
          g.hidden = !g.querySelector("[data-k]:not([hidden])");
        });
        if (count) {
          count.textContent = q
            ? shown + (shown === 1 ? " match" : " matches") + ' for "' + finder.value.trim() + '"'
            : "Showing all " + total;
        }
      };

      finder.addEventListener("input", run);

      /* honours the SearchAction declared in JSON-LD: /faq/?q=... */
      var q = new URLSearchParams(location.search).get("q");
      if (q) { finder.value = q; }
      run();
    }
  }

  /* close the mobile menu on outside click or Escape */
  var menu = document.querySelector(".menu");
  if (menu) {
    document.addEventListener("click", function (e) {
      if (menu.open && !menu.contains(e.target)) menu.open = false;
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.open) { menu.open = false; menu.querySelector("summary").focus(); }
    });
  }
})();
