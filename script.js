document.addEventListener("DOMContentLoaded", () => {
  // ── Utility (defined first — used by async functions below) ──
  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  // ── Reduced motion preference ──
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // ── Staggered page load ──
  requestAnimationFrame(() => document.body.classList.add("loaded"));

  const html = document.documentElement;

  // ── Theme toggle ──
  const toggle = document.getElementById("themeToggle");
  const saved = localStorage.getItem("theme") || "light";
  html.setAttribute("data-theme", saved);
  if (saved === "dark" && toggle) toggle.checked = true;

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    // Keep meta theme-color in sync for mobile browsers
    document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
      const media = meta.getAttribute("media") || "";
      if (theme === "dark" && media.includes("dark"))
        meta.setAttribute("content", "#070c16");
      else if (theme === "light" && media.includes("light"))
        meta.setAttribute("content", "#f2f0eb");
    });
  }

  if (toggle) {
    toggle.addEventListener("change", () => {
      applyTheme(toggle.checked ? "dark" : "light");
    });
  }
  // ════════════════════════════════════════════
  // ── SIDE NAVIGATION ──
  // ════════════════════════════════════════════
  const sideNavItems = document.querySelectorAll(".side-nav-item");
  const sections = document.querySelectorAll("section[id]");

  // Smooth scroll to section on click
  sideNavItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = item.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    });
  });

  // Update active item using IntersectionObserver
  function updateSideNav() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            sideNavItems.forEach((item) => {
              item.classList.toggle(
                "active",
                item.getAttribute("data-section") === id,
              );
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
  }
  updateSideNav();

  // Set initial active state on load
  (function setInitialActive() {
    let found = "";
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - window.innerHeight / 3) {
        found = section.getAttribute("id");
      }
    });
    sideNavItems.forEach((item) => {
      item.classList.toggle("active", item.getAttribute("data-section") === found);
    });
  })();
  // ════════════════════════════════════════════
  // ── TYPING ENGINE ──
  // ════════════════════════════════════════════

  // Core: type text into an element char by char
  // Returns a promise that resolves when done
  function typeText(el, text, speed = 55) {
    return new Promise((resolve) => {
      if (prefersReducedMotion) {
        el.textContent = text;
        resolve();
        return;
      }
      let i = 0;
      function tick() {
        if (i <= text.length) {
          el.textContent = text.slice(0, i);
          i++;
          setTimeout(tick, speed + Math.random() * 30); // slight jitter = human feel
        } else {
          resolve();
        }
      }
      tick();
    });
  }

  // Type then delete, loop through roles
  function typeRotatingRoles(el, roles) {
    if (prefersReducedMotion) {
      el.textContent = roles[0];
      return;
    }
    let idx = 0;
    async function cycle() {
      const word = roles[idx % roles.length];
      // Type forward
      for (let i = 0; i <= word.length; i++) {
        el.textContent = word.slice(0, i);
        await sleep(60 + Math.random() * 25);
      }
      await sleep(1800); // pause at full word
      // Delete backward
      for (let i = word.length; i >= 0; i--) {
        el.textContent = word.slice(0, i);
        await sleep(35 + Math.random() * 15);
      }
      await sleep(300);
      idx++;
      cycle();
    }
    cycle();
  }

  // ── Hero name typing ──
  const heroNameEl = document.getElementById("heroName");
  if (heroNameEl) {
    heroNameEl.innerHTML = "Just<br><em>code </em><br>& arts.";
  }

  // ── Eyebrow rotating role ──
  const typedRoleEl = document.getElementById("typedRole");
  if (typedRoleEl) {
    const roles = [
      "artist & developer",
      "programmer",
      "ui/ux designer",
      "digital artist",
      "animator",
      "linux enthusiast",
    ];
    setTimeout(
      () => typeRotatingRoles(typedRoleEl, roles),
      prefersReducedMotion ? 0 : 200,
    );
  }

  // ── Terminal line-by-line typing ──
  const termBody = document.getElementById("terminalBody");
  if (termBody) {
    // Each entry: { html: string, delay: number (ms after prev line finishes) }
    const termLines = [
      {
        cls: "t-line",
        html: `<span class="t-kw">const</span> <span class="t-var">aayu</span> <span class="t-op">=</span> <span class="t-bracket">{</span>`,
      },
      {
        cls: "t-line t-indent",
        html: `<span class="t-key">role</span><span class="t-op">:</span> <span class="t-str">"artist &amp; dev"</span><span class="t-op">,</span>`,
      },
      {
        cls: "t-line t-indent",
        html: `<span class="t-key">stack</span><span class="t-op">:</span> <span class="t-bracket">[</span><span class="t-str">"JS"</span><span class="t-op">,</span> <span class="t-str">"C++"</span><span class="t-op">,</span> <span class="t-str">"Lua"</span><span class="t-bracket">]</span><span class="t-op">,</span>`,
      },
      {
        cls: "t-line t-indent",
        html: `<span class="t-key">loves</span><span class="t-op">:</span> <span class="t-bracket">[</span><span class="t-str">"art"</span><span class="t-op">,</span> <span class="t-str">"linux"</span><span class="t-op">,</span> <span class="t-str">"ui"</span><span class="t-bracket">]</span><span class="t-op">,</span>`,
      },
      {
        cls: "t-line t-indent",
        html: `<span class="t-key">available</span><span class="t-op">:</span> <span class="t-bool">true</span>`,
      },
      {
        cls: "t-line",
        html: `<span class="t-bracket">}</span><span class="t-op">;</span>`,
      },
      {
        cls: "t-line t-gap",
        html: `<span class="t-comment">// currently running on</span>`,
      },
      {
        cls: "t-line",
        html: `<span class="t-fn">console</span><span class="t-op">.</span><span class="t-fn">log</span><span class="t-bracket">(</span><span class="t-str">"Linux 🐧"</span><span class="t-bracket">)</span><span class="t-op">;</span>`,
      },
    ];

    // Status bar cycling messages
    const statusMessages = [
      { label: "running", val: "dev server ✦" },
      { label: "watching", val: "src/**/*.js" },
      { label: "compiled", val: "in 84ms ⚡" },
      { label: "listening", val: "localhost:3000" },
      { label: "linting", val: "0 errors ✔" },
      { label: "git", val: "main ↑1 commit" },
    ];

    async function runTerminal() {
      if (prefersReducedMotion) {
        // Show all instantly
        termLines.forEach(({ cls, html }) => {
          const div = document.createElement("div");
          div.className = cls + " typed";
          div.innerHTML = html;
          termBody.appendChild(div);
        });
        appendStatusBar(statusMessages[0]);
        return;
      }

      await sleep(800); // wait for hero to start animating first

      for (let i = 0; i < termLines.length; i++) {
        const { cls, html: lineHtml } = termLines[i];
        const div = document.createElement("div");
        div.className = cls + " typing";
        div.innerHTML = lineHtml;
        termBody.appendChild(div);

        // Small scroll-into-view if needed
        await sleep(20);
        div.classList.add("typed");
        await sleep(i === 0 ? 180 : 120 + Math.random() * 80);
        div.classList.remove("typing");
      }

      await sleep(200);
      appendStatusBar(statusMessages[0]);
      cycleStatus(statusMessages);
    }

    function appendStatusBar(msg) {
      const bar = document.createElement("div");
      bar.className = "t-status-bar";
      bar.id = "termStatusBar";
      bar.innerHTML = `
        <span class="t-status-dot"></span>
        <span class="t-status-label" id="statusLabel">${msg.label}</span>
        <span class="t-status-val" id="statusVal">${msg.val}</span>
      `;
      termBody.appendChild(bar);
    }

    function cycleStatus(messages) {
      let idx = 1;
      setInterval(() => {
        const labelEl = document.getElementById("statusLabel");
        const valEl = document.getElementById("statusVal");
        if (!labelEl || !valEl) return;
        const msg = messages[idx % messages.length];
        // Fade out
        labelEl.style.opacity = "0";
        valEl.style.opacity = "0";
        setTimeout(() => {
          labelEl.textContent = msg.label;
          valEl.textContent = msg.val;
          labelEl.style.opacity = "1";
          valEl.style.opacity = "1";
        }, 250);
        idx++;
      }, 2200);
    }

    runTerminal();
  }

  // ════════════════════════════════════════════
  // ── SCROLL & NAV ──
  // ════════════════════════════════════════════

  // Scroll progress bar (rAF-throttled)
  const progressBar = document.getElementById("scrollProgress");
  let scrollTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (scrollTicking) return;
      scrollTicking = true;
      requestAnimationFrame(() => {
        const max = document.body.scrollHeight - window.innerHeight;
        if (max > 0 && progressBar)
          progressBar.style.width = (window.scrollY / max) * 100 + "%";
        scrollTicking = false;
      });
    },
    { passive: true },
  );

  // Nav glass effect on scroll
  const mainNav = document.getElementById("mainNav");
  window.addEventListener(
    "scroll",
    () => {
      if (mainNav) mainNav.classList.toggle("scrolled", window.scrollY > 60);
    },
    { passive: true },
  );

  // Active nav link highlighting
  const pageSections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");

  const activeLinkObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navAnchors.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`,
            );
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" },
  );
  pageSections.forEach((s) => activeLinkObserver.observe(s));

  // ════════════════════════════════════════════
  // ── CURSOR & EFFECTS ──
  // ════════════════════════════════════════════

  if (window.matchMedia("(pointer: fine)").matches) {
    const cursor = document.getElementById("cursor");
    const ring = document.getElementById("cursorRing");
    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (cursor) {
        cursor.style.left = mx + "px";
        cursor.style.top = my + "px";
        cursor.classList.add("active");
      }
      if (ring) ring.classList.add("active");
    });

    if (!prefersReducedMotion) {
      (function animateRing() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        if (ring) {
          ring.style.left = rx + "px";
          ring.style.top = ry + "px";
        }
        requestAnimationFrame(animateRing);
      })();
    } else {
      document.addEventListener("mousemove", (e) => {
        if (ring) {
          ring.style.left = e.clientX + "px";
          ring.style.top = e.clientY + "px";
        }
      });
    }

    // Cursor hover expand
    document
      .querySelectorAll("a, button, .skill-item, .theme-toggle")
      .forEach((el) => {
        el.addEventListener("mouseenter", () => {
          if (cursor) cursor.classList.add("expanded");
          if (ring) ring.classList.add("expanded");
        });
        el.addEventListener("mouseleave", () => {
          if (cursor) cursor.classList.remove("expanded");
          if (ring) ring.classList.remove("expanded");
        });
      });

    // Ink trail
    if (!prefersReducedMotion) {
      const inkCanvas = document.getElementById("inkCanvas");
      if (inkCanvas) {
        const inkCtx = inkCanvas.getContext("2d");
        let drops = [];

        function resizeInk() {
          inkCanvas.width = window.innerWidth;
          inkCanvas.height = window.innerHeight;
        }
        resizeInk();
        window.addEventListener("resize", resizeInk);

        document.addEventListener("mousemove", (e) => {
          const dark = html.getAttribute("data-theme") === "dark";
          drops.push({
            x: e.clientX,
            y: e.clientY,
            r: Math.random() * 2.8 + 0.8,
            alpha: 0.5,
            color: dark ? "77,143,232" : "24,72,184",
          });
          if (drops.length > 100) drops.shift();
        });

        (function drawInk() {
          inkCtx.clearRect(0, 0, inkCanvas.width, inkCanvas.height);
          drops = drops.filter((d) => d.alpha > 0);
          drops.forEach((d) => {
            d.alpha -= 0.013;
            d.r *= 0.97;
            if (d.alpha <= 0) return;
            inkCtx.beginPath();
            inkCtx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            inkCtx.fillStyle = `rgba(${d.color},${d.alpha})`;
            inkCtx.fill();
          });
          requestAnimationFrame(drawInk);
        })();
      }
    }

    // Tilt cards
    if (!prefersReducedMotion) {
      document.querySelectorAll(".skill-item, .project-card").forEach((el) => {
        const isProject = el.classList.contains("project-card");
        el.addEventListener("mousemove", (e) => {
          const rect = el.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          // Project cards: keep the CSS lift (-6px) + add tilt
          const liftY = isProject ? -6 : 0;
          el.style.transform = `perspective(600px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(${liftY}px) scale(${isProject ? 1.01 : 1.03})`;
        });
        el.addEventListener("mouseleave", () => {
          el.style.transform = isProject
            ? "perspective(600px) rotateY(0) rotateX(0) translateY(0) scale(1)"
            : "perspective(600px) rotateY(0) rotateX(0) scale(1)";
          el.style.transition = "transform 0.6s cubic-bezier(0.23,1,0.32,1)";
        });
        el.addEventListener("mouseenter", () => {
          el.style.transition = "transform 0.1s linear";
        });
      });
    }

    // Magnetic buttons
    document.querySelectorAll(".contact-link, .nav-links a").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "translate(0,0)";
        el.style.transition =
          "transform 0.5s cubic-bezier(0.23,1,0.32,1), color 0.3s, border-color 0.3s";
      });
      el.addEventListener("mouseenter", () => {
        el.style.transition =
          "transform 0.1s linear, color 0.3s, border-color 0.3s";
      });
    });
  }

  // ── Scroll reveal ──
  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            revealObserver.unobserve(e.target);

            // Count-up for stat numbers
            e.target.querySelectorAll(".stat-num[data-count]").forEach((el) => {
              const target = parseInt(el.dataset.count, 10);
              const duration = 900;
              const start = performance.now();
              // Wrap text in a span to preserve gradient background-clip
              el.innerHTML = `<span class="stat-count-val">0</span>`;
              const span = el.querySelector(".stat-count-val");
              function tick(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                span.textContent = Math.round(eased * target);
                if (progress < 1) requestAnimationFrame(tick);
              }
              requestAnimationFrame(tick);
            });
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    document
      .querySelectorAll(".reveal")
      .forEach((el) => revealObserver.observe(el));

    // Staggered skill item reveals
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
            skillObserver.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );
    document.querySelectorAll(".skill-item").forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition = `opacity 0.6s ease ${i * 0.07}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.07}s, color 0.4s ease, background 0.5s cubic-bezier(0.16,1,0.3,1)`;
      skillObserver.observe(el);
    });
  } else {
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("visible"));
  }

  // ── Mobile hamburger menu ──
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");

  if (hamburger && mobileNav) {
    function closeMobileNav() {
      hamburger.classList.remove("open");
      mobileNav.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      mobileNav.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.classList.toggle("open");
      mobileNav.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen);
      mobileNav.setAttribute("aria-hidden", !isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
      // Move focus into menu when opened
      if (isOpen) {
        const firstLink = mobileNav.querySelector("a");
        if (firstLink) firstLink.focus();
      }
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileNav);
    });

    // Focus trap inside mobile nav
    mobileNav.addEventListener("keydown", (e) => {
      if (!mobileNav.classList.contains("open")) return;
      const focusable = [...mobileNav.querySelectorAll("a")];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && hamburger.classList.contains("open")) {
        closeMobileNav();
        hamburger.focus();
      }
    });
  }

});
