/* ============================================================
   Nikhil Mittal, portfolio
   Vanilla JS. Everything degrades gracefully without it.
   ============================================================ */

(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const stored = localStorage.getItem("theme");
  const systemLight = window.matchMedia("(prefers-color-scheme: light)").matches;

  root.dataset.theme = stored || (systemLight ? "light" : "dark");

  toggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
  });

  /* ---------- mobile menu ---------- */
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");

  const setMenu = (open) => {
    if (!menu || !menuBtn) return;

    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);

    if (open) {
      menu.hidden = false;
      // two frames: the first commits display, the second gives the
      // opacity transition a starting value to animate from
      requestAnimationFrame(() =>
        requestAnimationFrame(() => menu.classList.add("is-open"))
      );
    } else {
      menu.classList.remove("is-open");
      if (prefersReduced) {
        menu.hidden = true;
      } else {
        const done = (e) => {
          if (e.target !== menu) return; // ignore transitions bubbling from children
          menu.hidden = true;
          menu.removeEventListener("transitionend", done);
        };
        menu.addEventListener("transitionend", done);
      }
    }
  };

  menuBtn?.addEventListener("click", () => {
    setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
  });

  // close on link tap, and let the browser handle the anchor jump
  menu?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuBtn?.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      menuBtn.focus();
    }
  });

  // rotating to landscape can widen past the breakpoint while the menu is open
  window.addEventListener("resize", () => {
    if (window.innerWidth > 780) setMenu(false);
  });

  /* ---------- hero diagram carousel ---------- */
  const viz = document.getElementById("viz");

  if (viz) {
    const slides = [...viz.querySelectorAll(".viz__slide")];
    const tabs = [...viz.querySelectorAll(".viz__tab")];
    const caption = document.getElementById("vizCaption");
    // keep in step with --dwell in styles.css
    const DWELL = 7000;
    let idx = 0;
    let timer = null;

    const show = (n) => {
      idx = (n + slides.length) % slides.length;

      slides.forEach((s, i) => {
        const on = i === idx;
        // unhide first so the entrance animation has something to run on
        if (on) s.hidden = false;
        s.classList.toggle("is-active", on);
        if (!on) s.hidden = true;
      });

      tabs.forEach((t, i) => {
        t.classList.toggle("is-active", i === idx);
        t.setAttribute("aria-selected", String(i === idx));
        t.tabIndex = i === idx ? 0 : -1;
      });

      if (caption) caption.textContent = slides[idx].dataset.caption || "";
    };

    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => {
      stop();
      if (!prefersReduced) timer = setInterval(() => show(idx + 1), DWELL);
    };

    const goto = (n) => { show(n); start(); };

    tabs.forEach((t, i) => t.addEventListener("click", () => goto(i)));

    // pause while someone is actually looking at or tabbing through it
    const pause = () => { viz.classList.add("is-paused"); stop(); };
    const resume = () => { viz.classList.remove("is-paused"); start(); };
    // hover-pause only with a real pointer: on touch, pointerenter fires on tap
    // and never leaves, which would strand the carousel
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      viz.addEventListener("pointerenter", pause);
      viz.addEventListener("pointerleave", resume);
    }
    viz.addEventListener("focusin", pause);
    viz.addEventListener("focusout", resume);

    viz.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { goto(idx + 1); tabs[idx].focus(); }
      if (e.key === "ArrowLeft")  { goto(idx - 1); tabs[idx].focus(); }
    });

    // don't burn frames animating a tab nobody is on
    document.addEventListener("visibilitychange", () =>
      document.hidden ? stop() : start()
    );

    show(0);
    start();
  }

  /* ---------- stack icons: fall back to text if one fails ---------- */
  document.querySelectorAll(".core__item img").forEach((img) => {
    img.addEventListener("error", () => { img.dataset.failed = "true"; });
  });

  /* ---------- scroll reveal ---------- */
  const revealed = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && !prefersReduced) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.style.setProperty("--d", `${el.dataset.delay || 0}ms`);
          el.classList.add("is-visible");
          obs.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealed.forEach((el) => io.observe(el));
  } else {
    revealed.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- nav state + scroll progress ---------- */
  const nav = document.getElementById("nav");
  const wordmark = document.querySelector(".nav__mark");
  const links = [...document.querySelectorAll(".nav__links a")];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;

    nav?.classList.toggle("is-stuck", y > 24);

    // the wordmark's underline is the read-progress indicator
    if (wordmark) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      wordmark.style.setProperty("--p", p.toFixed(4));
    }

    // active link: the section whose top most recently passed 35% of the viewport
    const mark = y + window.innerHeight * 0.35;
    let current = -1;
    sections.forEach((sec, i) => {
      if (sec.offsetTop <= mark) current = i;
    });
    links.forEach((a, i) => a.classList.toggle("is-active", i === current));

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(onScroll);
    },
    { passive: true }
  );
  onScroll();

  /* ---------- ambient glow follows the pointer ---------- */
  if (!prefersReduced && window.matchMedia("(pointer: fine)").matches) {
    const glow = document.querySelector(".glow");
    let raf = null;

    window.addEventListener(
      "pointermove",
      (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          glow.style.setProperty("--mx", `${(e.clientX / window.innerWidth) * 100}%`);
          glow.style.setProperty("--my", `${(e.clientY / window.innerHeight) * 100}%`);
          raf = null;
        });
      },
      { passive: true }
    );
  }

  /* ---------- footer year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
