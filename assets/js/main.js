/* ============ SWORDS CAFE — main.js ============ */
(function () {
  "use strict";

  /* ---- Preloader: always hide, with hard fallback ---- */
  var preloader = document.getElementById("preloader");
  function hidePreloader() {
    if (!preloader) return;
    preloader.style.opacity = "0";
    setTimeout(function () { if (preloader) preloader.style.display = "none"; }, 500);
  }
  window.addEventListener("load", hidePreloader);
  setTimeout(hidePreloader, 1200); // fallback even if load never fires

  /* ---- Sticky header shrink ---- */
  var header = document.getElementById("site-header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 30) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile full-screen menu ---- */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("mobile-menu");
  var menuClose = document.getElementById("menu-close");

  function openMenu() {
    if (!menu) return;
    menu.classList.add("open");
    document.body.style.overflow = "hidden";
    if (burger) burger.setAttribute("aria-expanded", "true");
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove("open");
    document.body.style.overflow = "";
    if (burger) burger.setAttribute("aria-expanded", "false");
  }
  if (burger) burger.addEventListener("click", openMenu);
  if (menuClose) menuClose.addEventListener("click", closeMenu);
  if (menu) {
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeMenu(); closeLightbox(); }
  });

  /* ---- Scroll reveal (with fallback) ---- */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("visible");
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    reveals.forEach(function (el) { obs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }
  // hard fallback: ensure everything visible after 1.6s no matter what
  setTimeout(function () {
    reveals.forEach(function (el) { el.classList.add("visible"); });
  }, 1600);

  /* ---- Lightbox ---- */
  var lightbox = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbClose = lightbox ? lightbox.querySelector(".lb-close") : null;

  function openLightbox(src, alt) {
    if (!lightbox || !lbImg) return;
    lbImg.src = src;
    lbImg.alt = alt || "صورة من معرض مقهى سُيوف";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    if (!menu || !menu.classList.contains("open")) document.body.style.overflow = "";
  }
  document.querySelectorAll(".g-item").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var src = btn.getAttribute("data-src");
      var img = btn.querySelector("img");
      openLightbox(src, img ? img.alt : "");
    });
  });
  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lightbox) lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  /* ---- Toast ---- */
  var toast = document.getElementById("toast");
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 4000);
  }

  /* ---- Order form -> WhatsApp + localStorage ---- */
  var form = document.getElementById("orderForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (document.getElementById("name").value || "").trim();
      var phone = (document.getElementById("phone").value || "").trim();
      var service = document.getElementById("service").value || "";
      var notes = (document.getElementById("notes").value || "").trim();

      if (!name || !phone || !service) {
        showToast("يرجى تعبئة الاسم والجوال ونوع الطلب");
        return;
      }

      // save demo record
      try {
        var rec = { name: name, phone: phone, service: service, notes: notes, at: new Date().toISOString() };
        var all = JSON.parse(localStorage.getItem("swords_orders") || "[]");
        all.push(rec);
        localStorage.setItem("swords_orders", JSON.stringify(all));
      } catch (err) { /* storage unavailable — ignore */ }

      var text =
        "السلام عليكم، طلب جديد من موقع مقهى سُيوف:%0A" +
        "الاسم: " + encodeURIComponent(name) + "%0A" +
        "الجوال: " + encodeURIComponent(phone) + "%0A" +
        "نوع الطلب: " + encodeURIComponent(service) +
        (notes ? "%0Aملاحظات: " + encodeURIComponent(notes) : "");

      showToast("تم تجهيز طلبك — جارٍ فتح واتساب");
      window.open("https://wa.me/966556462775?text=" + text, "_blank");
      form.reset();
    });
  }

  /* ---- Footer year safety (already 2026 static) ---- */
})();
