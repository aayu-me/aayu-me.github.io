document.addEventListener("DOMContentLoaded", () => {
    // ── Staggered page load ──
    requestAnimationFrame(() => document.body.classList.add("loaded"));

    const html = document.documentElement;

    // ── Theme toggle ──
    const toggle = document.getElementById("themeToggle");
    const saved = localStorage.getItem("theme") || "light";
    html.setAttribute("data-theme", saved);
    if (saved === "dark" && toggle) toggle.checked = true;
    
    if (toggle) {
        toggle.addEventListener("change", () => {
            const next = toggle.checked ? "dark" : "light";
            html.setAttribute("data-theme", next);
            localStorage.setItem("theme", next);
        });
    }

    // ── Scroll progress bar ──
    const progressBar = document.getElementById("scrollProgress");
    window.addEventListener("scroll", () => {
        const max = document.body.scrollHeight - window.innerHeight;
        if (max > 0 && progressBar) progressBar.style.width = (window.scrollY / max) * 100 + "%";
    }, { passive: true });

    // ── Nav glass effect on scroll ──
    const mainNav = document.getElementById("mainNav");
    window.addEventListener("scroll", () => {
        if (mainNav) mainNav.classList.toggle("scrolled", window.scrollY > 60);
    }, { passive: true });

    // ── Custom cursor (pointer devices only) ──
    if (window.matchMedia("(pointer: fine)").matches) {
        const cursor = document.getElementById("cursor");
        const ring = document.getElementById("cursorRing");
        let mx = 0, my = 0, rx = 0, ry = 0;

        document.addEventListener("mousemove", (e) => {
            mx = e.clientX; my = e.clientY;
            if (cursor) {
                cursor.style.left = mx + "px";
                cursor.style.top = my + "px";
                cursor.classList.add("active");
            }
            if (ring) ring.classList.add("active");
        }, { once: false });

        function animateRing() {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            if (ring) {
                ring.style.left = rx + "px";
                ring.style.top = ry + "px";
            }
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // ── Ink trail ──
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
                    x: e.clientX, y: e.clientY,
                    r: Math.random() * 2.5 + 1,
                    alpha: 0.55,
                    color: dark ? "160,200,245" : "30,70,140",
                });
                if (drops.length > 100) drops.shift();
            });

            function drawInk() {
                inkCtx.clearRect(0, 0, inkCanvas.width, inkCanvas.height);
                drops = drops.filter(d => d.alpha > 0);
                drops.forEach(d => {
                    d.alpha -= 0.013;
                    d.r *= 0.97;
                    if (d.alpha <= 0) return;
                    inkCtx.beginPath();
                    inkCtx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                    inkCtx.fillStyle = `rgba(${d.color},${d.alpha})`;
                    inkCtx.fill();
                });
                requestAnimationFrame(drawInk);
            }
            drawInk();
        }

        // ── Cursor hover effects ──
        document.querySelectorAll("a, button, .skill-item, .theme-toggle").forEach(el => {
            el.addEventListener("mouseenter", () => {
                if (cursor) cursor.classList.add("expanded");
                if (ring) ring.classList.add("expanded");
            });
            el.addEventListener("mouseleave", () => {
                if (cursor) cursor.classList.remove("expanded");
                if (ring) ring.classList.remove("expanded");
            });
        });
    }

    // ── Magnetic buttons ──
    document.querySelectorAll(".contact-link, .nav-links a").forEach(el => {
        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.35;
            const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.35;
            el.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        el.addEventListener("mouseleave", () => {
            el.style.transform = "translate(0,0)";
            el.style.transition = "transform 0.5s cubic-bezier(0.23,1,0.32,1), color 0.3s, border-color 0.3s";
        });
        el.addEventListener("mouseenter", () => {
            el.style.transition = "transform 0.1s linear, color 0.3s, border-color 0.3s";
        });
    });

    // ── Tilt cards ──
    document.querySelectorAll(".skill-item").forEach(el => {
        el.addEventListener("mousemove", (e) => {
            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            el.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.03)`;
        });
        el.addEventListener("mouseleave", () => {
            el.style.transform = "perspective(600px) rotateY(0) rotateX(0) scale(1)";
            el.style.transition = "transform 0.6s cubic-bezier(0.23,1,0.32,1)";
        });
        el.addEventListener("mouseenter", () => {
            el.style.transition = "transform 0.1s linear";
        });
    });

    // ── Scroll reveal ──
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

    // ── Terminal output cycler ──
    const outputs = ["Linux 🐧", "NeoVim ✦", "arch btw 👾", "C++ mode 🔧", "git commit ✔"];
    let outIdx = 0;
    const termEl = document.getElementById("termOutput");
    if (termEl) {
        setInterval(() => {
            outIdx = (outIdx + 1) % outputs.length;
            termEl.style.opacity = "0";
            termEl.style.transition = "opacity 0.3s ease";
            setTimeout(() => {
                termEl.textContent = outputs[outIdx];
                termEl.style.opacity = "1";
            }, 320);
        }, 2400);
    }

    // ── Mobile hamburger menu ──
    const hamburger = document.getElementById("hamburger");
    const mobileNav = document.getElementById("mobileNav");

    if (hamburger && mobileNav) {
        hamburger.addEventListener("click", () => {
            const isOpen = hamburger.classList.toggle("open");
            mobileNav.classList.toggle("open", isOpen);
            hamburger.setAttribute("aria-expanded", isOpen);
            mobileNav.setAttribute("aria-hidden", !isOpen);
            document.body.style.overflow = isOpen ? "hidden" : "";
        });

        mobileNav.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("open");
                mobileNav.classList.remove("open");
                hamburger.setAttribute("aria-expanded", "false");
                mobileNav.setAttribute("aria-hidden", "true");
                document.body.style.overflow = "";
            });
        });
    }
});
