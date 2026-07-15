// Respect the user's motion preference across every enhancement module below
const PREFERS_REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const IS_COARSE_POINTER = window.matchMedia("(pointer: coarse)").matches;

// Initialize Lucide Icons
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  initMobileNav();
  initScrollSpy();
  initAppTabs();
  initSlider();
  initCompatibilityChecker();
  initDownloadProgress();
  initLightbox();
  initSmoothScroll();

  // v2.0 premium motion & interaction layer
  initNavbarScrollEffects();
  initScrollReveal();
  initButtonRipples();
  initMagneticButtons();
  initTiltElements();
  initHeroParallax();
  initHeroParticles();
});

// Smooth Scroll & Clean URL Hashes
function initSmoothScroll() {
  // Clear hash on page load if present
  if (window.location.hash) {
    const targetHash = window.location.hash;
    // Remove hash from URL without triggering reload
    history.replaceState("", document.title, window.location.pathname + window.location.search);
    
    // Smooth scroll to the target section on load
    const targetEl = document.querySelector(targetHash);
    if (targetEl) {
      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }

  // Intercept all anchor link clicks pointing to page sections
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    const href = anchor.getAttribute("href");
    
    // Smooth scroll for id targets (length > 1)
    if (href && href.startsWith("#") && href.length > 1) {
      const targetEl = document.querySelector(href);
      if (targetEl) {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: "smooth" });
        });
      }
    }
    // Smooth scroll for home / top
    else if (href === "#") {
      anchor.addEventListener("click", function (e) {
        if (
          this.classList.contains("nav-link") ||
          this.classList.contains("navbar-brand") ||
          this.classList.contains("footer-brand")
        ) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      });
    }

  });
}


// Mobile Responsive Navigation Toggle
function initMobileNav() {
  const toggleBtn = document.getElementById("js-nav-toggle");
  const navMenu = document.getElementById("js-nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navMenu.classList.toggle("active");
      toggleBtn.classList.toggle("active");
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        navMenu.classList.remove("active");
        toggleBtn.classList.remove("active");
      }
    });

    // Close menu when clicking a link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        toggleBtn.classList.remove("active");
      });
    });
  }
}

// Interactive Tabs for Multimedia App Showcase
function initAppTabs() {
  const tabsContainer = document.getElementById("js-apps-tabs");
  const panels = document.querySelectorAll("#js-apps-panels .tab-panel");

  if (tabsContainer) {
    const tabButtons = tabsContainer.querySelectorAll(".tab-btn");
    const EXIT_MS = 280; // must match .panel-exit animation-duration in style.css
    const ENTER_MS = 550; // must match .panel-enter animation-duration in style.css
    let isSwitching = false;

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.classList.contains("active") || isSwitching) return;

        const appName = btn.getAttribute("data-app");
        const nextPanel = document.getElementById(`panel-${appName}`);
        const currentPanel = document.querySelector("#js-apps-panels .tab-panel.active");
        if (!nextPanel) return;

        // Update button active state immediately for responsive feedback
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const showNextPanel = () => {
          panels.forEach((p) => {
            p.classList.remove("active", "panel-exit", "panel-anim");
          });
          nextPanel.classList.add("active");
          if (!PREFERS_REDUCED_MOTION) {
            nextPanel.classList.add("panel-anim");
            window.setTimeout(() => nextPanel.classList.remove("panel-anim"), ENTER_MS);
          }
          isSwitching = false;
        };

        if (currentPanel && currentPanel !== nextPanel && !PREFERS_REDUCED_MOTION) {
          isSwitching = true;
          currentPanel.classList.add("panel-exit");
          window.setTimeout(showNextPanel, EXIT_MS);
        } else {
          panels.forEach((p) => p.classList.remove("active", "panel-exit", "panel-anim"));
          nextPanel.classList.add("active");
        }
      });
    });
  }
}

// Interactive Gallery Tour Slider (Carousel)
function initSlider() {
  const wrapper = document.getElementById("js-slider-wrapper");
  const prevBtn = document.getElementById("js-slider-prev");
  const nextBtn = document.getElementById("js-slider-next");
  const dotsContainer = document.getElementById("js-slider-dots");

  if (wrapper && prevBtn && nextBtn && dotsContainer) {
    const slides = wrapper.querySelectorAll(".slide");
    const totalSlides = slides.length;
    let currentIndex = 0;

    // Dynamically create navigation dots
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll(".dot");

    function updateSlider() {
      // Move slides (the shared translateX shifts the whole filmstrip),
      // while a per-slide scale/rotation layers in a subtle coverflow depth cue.
      slides.forEach((slide, idx) => {
        const isCurrent = idx === currentIndex;
        const scale = isCurrent ? 1 : 0.94;
        const rotate = isCurrent ? 0 : (idx < currentIndex ? 3 : -3);
        slide.style.transform = `translateX(-${currentIndex * 100}%) scale(${scale}) rotateY(${rotate}deg)`;
        slide.classList.toggle("slide-current", isCurrent);
      });

      // Update dots
      dots.forEach((dot, idx) => {
        if (idx === currentIndex) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }

    function goToSlide(index) {
      currentIndex = index;
      updateSlider();
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlider();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlider();
    }

    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    // Auto slide every 8 seconds
    let slideInterval = setInterval(nextSlide, 8000);

    // Reset interval when user interacts
    const resetInterval = () => {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 8000);
    };

    nextBtn.addEventListener("click", resetInterval);
    prevBtn.addEventListener("click", resetInterval);
    dots.forEach((dot) => dot.addEventListener("click", resetInterval));
  }
}

// PC Compatibility Checker Logic
function initCompatibilityChecker() {
  const form = document.getElementById("js-checker-form");
  const resultDiv = document.getElementById("js-checker-result");
  const badge = document.getElementById("js-result-badge");
  const title = document.getElementById("js-result-title");
  const desc = document.getElementById("js-result-desc");
  const submitBtn = document.getElementById("js-checker-submit");

  if (form && submitBtn) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      // Hide previous result if visible
      resultDiv.classList.add("hidden");

      // Save original button content and disable it
      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Memproses...';
      lucide.createIcons();

      const cpu = parseInt(document.getElementById("cpu-cores").value);
      const ram = parseInt(document.getElementById("ram-size").value);
      const storage = document.getElementById("storage-type").value;

      // Simulate a loading delay of 1.2 seconds for realistic feedback
      setTimeout(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        lucide.createIcons();

        // Show result panel
        resultDiv.classList.remove("hidden");

        // Reset badge classes
        badge.className = "result-icon-badge";

        // Compatibility Algorithm
        if (ram < 4 || cpu < 2) {
          // Under minimum spec
          badge.classList.add("danger");
          badge.innerHTML = '<i data-lucide="x-circle"></i>';
          title.textContent = "Tidak Memenuhi Syarat";
          title.className = "result-title text-red";
          desc.textContent =
            "Komputer Anda di bawah spesifikasi minimum. IMAA-OS membutuhkan minimal CPU Dual Core dan 4 GB RAM agar dapat berjalan.";
        } else if (cpu >= 4 && ram >= 8 && storage === "ssd") {
          // Recommended spec (Excellent)
          badge.classList.add("success");
          badge.innerHTML = '<i data-lucide="check-circle-2"></i>';
          title.textContent = "Sangat Cocok!";
          title.className = "result-title text-emerald";
          desc.textContent =
            "Spesifikasi PC Anda sangat baik! IMAA-OS akan berjalan dengan performa maksimal untuk produksi audio multi-track dan rendering video.";
        } else if (storage === "hdd") {
          // HDD Warning
          badge.classList.add("warning");
          badge.innerHTML = '<i data-lucide="alert-triangle"></i>';
          title.textContent = "Kompatibilitas Terbatas";
          title.className = "result-title text-purple";
          desc.textContent =
            "PC Anda memenuhi syarat dasar, tetapi penggunaan HDD (Penyimpanan Magnetik) akan memperlambat loading aplikasi dan render video. Disarankan upgrade ke SSD.";
        } else {
          // Meets minimum spec
          badge.classList.add("success");
          badge.innerHTML = '<i data-lucide="check"></i>';
          title.textContent = "Kompatibel Dasar";
          title.className = "result-title text-purple";
          desc.textContent =
            "Perangkat Anda siap menjalankan IMAA-OS untuk kebutuhan kreatif standar. Multitasking berat mungkin sedikit membatasi performa.";
        }

        lucide.createIcons();
      }, 1200);
    });
  }
}

// Download Button Simulation Progress Bar (Sleek UX)
function initDownloadProgress() {
  const downloadBtn = document.getElementById("js-download-btn");
  const progressBox = document.getElementById("js-download-progress-box");
  const progressBar = document.getElementById("js-progress-bar");
  const progressPercent = document.getElementById("js-progress-percent");

  if (downloadBtn && progressBox) {
    downloadBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Disable button during download trigger
      downloadBtn.style.pointerEvents = "none";
      downloadBtn.style.opacity = "0.5";
      progressBox.classList.remove("hidden");

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 8) + 4; // increment random step
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          progressPercent.textContent = "Selesai!";
          progressBar.style.width = "100%";

          setTimeout(() => {
            // Trigger actual download
            window.location.href =
              "https://drive.usercontent.google.com/download?id=1XLzd2jpzL7HsIiezYXHDETn9lB7zADFA&export=download&authuser=0&confirm=t&uuid=43d7eb77-f954-4b6f-ba90-07173498cef0&at=ABswASbR3oi53kvjYBr56ug5xPzK:1784075409828";

            // Reset UI
            downloadBtn.style.pointerEvents = "auto";
            downloadBtn.style.opacity = "1";
            progressBox.classList.add("hidden");
            progressBar.style.width = "0%";
            progressPercent.textContent = "0%";
          }, 800);
        } else {
          progressPercent.textContent = `${progress}%`;
          progressBar.style.width = `${progress}%`;
        }
      }, 100);
    });
  }
}

// Lightbox Modal for Screenshots
function initLightbox() {
  const lightbox = document.getElementById("js-lightbox");
  const lightboxImg = document.getElementById("js-lightbox-img");
  const lightboxCap = document.getElementById("js-lightbox-caption");
  const closeBtn = document.getElementById("js-lightbox-close");

  window.openLightbox = function (src, caption) {
    if (lightbox && lightboxImg && lightboxCap) {
      lightboxImg.src = src;
      lightboxCap.textContent = caption;
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden"; // Lock background scroll
    }
  };

  function closeLightbox() {
    if (lightbox) {
      lightbox.classList.remove("active");
      document.body.style.overflow = ""; // Unlock scroll
    }
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard close support
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeLightbox();
    }
  });
}

// Scroll Spy & Navigation Active State
function initScrollSpy() {
  const navLinks = document.querySelectorAll(
    ".navbar-nav .nav-link:not(.nav-cta)",
  );
  const sections = document.querySelectorAll("section[id]");
  const heroSection = document.querySelector(".hero-section");

  function updateActiveLink() {
    let scrollPosition = window.scrollY + 120; // Header offset

    // Check if we are near the bottom of the page
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 80
    ) {
      navLinks.forEach((link) => link.classList.remove("active"));
      // Highlight the last non-cta nav link (requirements / Spesifikasi)
      if (navLinks.length > 0) {
        navLinks[navLinks.length - 1].classList.add("active");
      }
      return;
    }

    // Check Hero section (Beranda)
    if (heroSection) {
      const heroTop = heroSection.offsetTop;
      const heroHeight = heroSection.offsetHeight;
      if (scrollPosition >= heroTop && scrollPosition < heroTop + heroHeight) {
        navLinks.forEach((link) => link.classList.remove("active"));
        const homeLink = Array.from(navLinks).find(
          (link) => link.getAttribute("href") === "#",
        );
        if (homeLink) homeLink.classList.add("active");
        return;
      }
    }

    // Check other sections
    let currentSection = null;
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSection = section;
      }
    });

    if (currentSection) {
      const sectionId = currentSection.getAttribute("id");
      const activeLink = Array.from(navLinks).find(
        (link) => link.getAttribute("href") === `#${sectionId}`,
      );
      if (activeLink) {
        navLinks.forEach((link) => link.classList.remove("active"));
        activeLink.classList.add("active");
      }
    }
  }

  // Scroll event listener
  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink(); // Run on load

  // Click event listener
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Temporarily remove active class from all links and set it on the clicked link
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });
}


// ==========================================================================
// v2.0 Premium Motion & Interaction Layer
// Scroll reveals, navbar progress, magnetic buttons, ripples, 3D tilt,
// hero parallax and ambient particles — layered on top of the original
// v1.0 behavior without touching it. Every module below no-ops gracefully
// when the user prefers reduced motion or is on a touch/coarse pointer.
// ==========================================================================

// Navbar: background/blur intensity change on scroll + top scroll-progress bar
function initNavbarScrollEffects() {
  const navbar = document.getElementById("js-navbar");
  const progressFill = document.getElementById("js-scroll-progress");
  if (!navbar) return;

  let ticking = false;

  function update() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;

    navbar.classList.toggle("is-scrolled", scrollTop > 40);
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );

  update();
}

// Scroll-triggered reveal animation for content blocks marked with .reveal
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  if (PREFERS_REDUCED_MOTION || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
  );

  revealEls.forEach((el) => observer.observe(el));
}

// Ripple feedback on button press, expanding from the click point
function initButtonRipples() {
  if (PREFERS_REDUCED_MOTION) return;

  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.4;
      const ripple = document.createElement("span");
      const originX = (e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
      const originY = (e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;

      ripple.className = "btn-ripple";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${originX}px`;
      ripple.style.top = `${originY}px`;

      btn.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
}

// Magnetic hover: primary/secondary buttons subtly drift toward the cursor
function initMagneticButtons() {
  if (PREFERS_REDUCED_MOTION || IS_COARSE_POINTER) return;

  const MAX_PULL = 8; // px

  document.querySelectorAll(".btn-primary, .btn-secondary").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      btn.classList.add("is-magnetic-active");
      btn.style.setProperty("--mx", `${relX * MAX_PULL * 2}px`);
      btn.style.setProperty("--my", `${relY * MAX_PULL * 2}px`);
    });

    btn.addEventListener("mouseleave", () => {
      btn.classList.remove("is-magnetic-active");
      btn.style.setProperty("--mx", "0px");
      btn.style.setProperty("--my", "0px");
    });
  });
}

// 3D pointer tilt for glass cards, screenshots, and the hero desktop mockup
function initTiltElements() {
  if (PREFERS_REDUCED_MOTION || IS_COARSE_POINTER) return;

  const targets = document.querySelectorAll(".tilt-card, .tilt-media, #js-tilt-preview");
  const MAX_TILT = 6; // degrees

  targets.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      el.classList.add("is-tilting");
      el.style.transform = `perspective(1000px) rotateX(${(-relY * MAX_TILT).toFixed(2)}deg) rotateY(${(relX * MAX_TILT).toFixed(2)}deg) translateZ(0)`;
    });

    el.addEventListener("mouseleave", () => {
      el.classList.remove("is-tilting");
      el.style.transform = "";
    });
  });
}

// Cinematic hero parallax: background glows and the desktop mockup drift
// gently with the mouse for a sense of depth.
function initHeroParallax() {
  if (PREFERS_REDUCED_MOTION || IS_COARSE_POINTER) return;

  const hero = document.getElementById("js-hero");
  const glow1 = document.querySelector(".glow-bg-1");
  const glow2 = document.querySelector(".glow-bg-2");
  if (!hero) return;

  let rafId = null;

  hero.addEventListener("mousemove", (e) => {
    if (rafId) return;
    rafId = window.requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      if (glow1) glow1.style.transform = `translate(${relX * -30}px, ${relY * -30}px)`;
      if (glow2) glow2.style.transform = `translate(${relX * 25}px, ${relY * 25}px)`;

      rafId = null;
    });
  });

  hero.addEventListener("mouseleave", () => {
    if (glow1) glow1.style.transform = "";
    if (glow2) glow2.style.transform = "";
  });
}

// Ambient floating particles behind the hero content — lightweight canvas,
// paused automatically once the hero scrolls out of view.
function initHeroParticles() {
  if (PREFERS_REDUCED_MOTION) return;

  const canvas = document.getElementById("js-hero-particles");
  const heroSection = document.getElementById("js-hero");
  if (!canvas || !heroSection || !("IntersectionObserver" in window)) return;

  const ctx = canvas.getContext("2d");
  let width, height, dpr;
  let particles = [];
  let animationFrame = null;
  let isVisible = true;

  const PARTICLE_COLORS = ["rgba(139, 92, 246, 0.5)", "rgba(59, 130, 246, 0.5)", "rgba(236, 72, 153, 0.4)"];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = heroSection.offsetWidth;
    height = heroSection.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particleCount = Math.min(46, Math.round((width * height) / 22000));
    particles = Array.from({ length: particleCount }, () => createParticle());
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.6,
      speedY: Math.random() * 0.18 + 0.04,
      swaySpeed: Math.random() * 0.6 + 0.2,
      swayAmount: Math.random() * 18 + 6,
      swayOffset: Math.random() * Math.PI * 2,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    };
  }

  function tick(time) {
    if (!isVisible) {
      animationFrame = null;
      return;
    }
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.y -= p.speedY;
      if (p.y < -10) {
        p.y = height + 10;
        p.x = Math.random() * width;
      }
      const sway = Math.sin(time * 0.0003 * p.swaySpeed + p.swayOffset) * p.swayAmount;

      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.arc(p.x + sway, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    animationFrame = window.requestAnimationFrame(tick);
  }

  function start() {
    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(tick);
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
        if (isVisible) start();
      });
    },
    { threshold: 0 },
  );

  resize();
  start();
  observer.observe(heroSection);

  let resizeTimeout;
  window.addEventListener("resize", () => {
    window.clearTimeout(resizeTimeout);
    resizeTimeout = window.setTimeout(resize, 200);
  });
}