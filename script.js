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
});

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

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active state from all buttons
        tabButtons.forEach((b) => b.classList.remove("active"));
        // Add active state to clicked button
        btn.classList.add("active");

        // Hide all panels
        panels.forEach((p) => p.classList.remove("active"));

        // Show corresponding panel
        const appName = btn.getAttribute("data-app");
        const activePanel = document.getElementById(`panel-${appName}`);
        if (activePanel) {
          activePanel.classList.add("active");
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
      // Move slides
      slides.forEach((slide) => {
        slide.style.transform = `translateX(-${currentIndex * 100}%)`;
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

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const cpu = parseInt(document.getElementById("cpu-cores").value);
      const ram = parseInt(document.getElementById("ram-size").value);
      const storage = document.getElementById("storage-type").value;

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
