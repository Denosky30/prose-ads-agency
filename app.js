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

  // Pricing currency toggle (₦ / $)
  var currBtns = document.querySelectorAll(".currency-toggle [data-currency]");
  var amounts = document.querySelectorAll(".price-amount .amount");
  function setCurrency(cur) {
    amounts.forEach(function (el) {
      el.textContent = cur === "usd" ? el.getAttribute("data-usd") : el.getAttribute("data-ngn");
    });
    currBtns.forEach(function (b) {
      var active = b.getAttribute("data-currency") === cur;
      b.classList.toggle("active", active);
      b.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }
  currBtns.forEach(function (b) {
    b.addEventListener("click", function () { setCurrency(b.getAttribute("data-currency")); });
  });

  // Reviews slider: auto-advance, arrows, dots, swipe; pauses on hover/focus.
  var slider = document.getElementById("reviewSlider");
  if (slider) {
    var track = document.getElementById("reviewTrack");
    var slides = track.children;
    var dotsWrap = document.getElementById("reviewDots");
    var prevBtn = document.getElementById("reviewPrev");
    var nextBtn = document.getElementById("reviewNext");
    var viewport = slider.querySelector(".slider-viewport");
    var controls = slider.querySelector(".slider-controls");
    var index = 0, timer = null;
    // Keep the viewport exactly as tall as the active slide, so short
    // reviews don't sit in a tall card with empty space at the bottom.
    function setHeight() { if (viewport) viewport.style.height = slides[index].offsetHeight + "px"; }
    window.addEventListener("resize", setHeight);
    window.addEventListener("load", setHeight);
    if (slides.length <= 1) {
      if (controls) controls.style.display = "none";
    } else {
      for (var i = 0; i < slides.length; i++) {
        (function (n) {
          var d = document.createElement("button");
          d.type = "button";
          d.setAttribute("role", "tab");
          d.setAttribute("aria-label", "Go to review " + (n + 1));
          d.addEventListener("click", function () { go(n); restart(); });
          dotsWrap.appendChild(d);
        })(i);
      }
      var dots = dotsWrap.children;
      var touchX = null;
      prevBtn.addEventListener("click", function () { go(index - 1); restart(); });
      nextBtn.addEventListener("click", function () { go(index + 1); restart(); });
      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", restart);
      slider.addEventListener("focusin", stop);
      slider.addEventListener("focusout", restart);
      track.addEventListener("touchstart", function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
      track.addEventListener("touchend", function (e) {
        if (touchX === null) return;
        var dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 40) { go(index + (dx < 0 ? 1 : -1)); restart(); }
        touchX = null;
      }, { passive: true });
      go(0); restart();
    }
    function go(n) {
      index = (n + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      setHeight();
      for (var j = 0; j < dots.length; j++) dots[j].setAttribute("aria-selected", j === index ? "true" : "false");
    }
    function restart() { stop(); timer = setInterval(function () { go(index + 1); }, 8000); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }
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
      showError("Something went wrong sending your message. Please try again in a moment.");
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
