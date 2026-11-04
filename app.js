// Mobile nav, smooth anchor offset, reveal-on-scroll, contact form submit.
(function () {
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("siteNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Reveal on scroll (progressive enhancement; content visible without JS via no-js fallback below)
  var els = document.querySelectorAll(".card, .result, .why, .quote, .price, .steps li");
  els.forEach(function (el) { el.classList.add("reveal"); });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("visible"); });
  }

  // Contact form -> Netlify Function (DB-backed), thank-you inline.
  var form = document.getElementById("contactForm");
  if (!form) return;
  var err = document.getElementById("formError");
  var ok = document.getElementById("formSuccess");
  var btn = document.getElementById("submitBtn");
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (err) { err.hidden = true; err.textContent = ""; }
    var data = {
      name: form.name.value.trim(),
      business: form.business.value.trim(),
      email: form.email.value.trim(),
      budget: form.budget.value,
      message: form.message.value.trim()
    };
    if (!data.name || !data.business || !data.email || !data.budget || !data.message) {
      showError("Please fill in every field so we can reply properly.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showError("That email doesn't look right — please double-check it.");
      return;
    }
    btn.disabled = true;
    btn.textContent = "Sending…";
    fetch("/.netlify/functions/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(function (res) {
      if (!res.ok) throw new Error("submit failed");
      return res.json();
    }).then(function () {
      form.querySelectorAll("input, select, textarea, button[type=submit]").forEach(function (el) {
        if (el !== btn) el.style.display = "none";
      });
      document.querySelector(".form-note").style.display = "none";
      btn.style.display = "none";
      ok.hidden = false;
      ok.scrollIntoView({ behavior: "smooth", block: "center" });
    }).catch(function () {
      showError("Something went wrong sending your message. Please email hello@proseads.agency directly.");
      btn.disabled = false;
      btn.textContent = "Book My Free Consultation";
    });
  });
  function showError(msg) {
    err.textContent = msg;
    err.hidden = false;
    err.scrollIntoView({ behavior: "smooth", block: "center" });
  }
})();
