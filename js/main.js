const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const siteHeader = document.getElementById("siteHeader");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
    menuToggle.classList.toggle("open");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => mainNav.classList.remove("open"));
  });
}

window.addEventListener("scroll", () => {
  if (siteHeader) {
    siteHeader.classList.toggle("scrolled", window.scrollY > 24);
  }
});

const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

revealElements.forEach((element) => revealObserver.observe(element));

const counters = document.querySelectorAll(".counter");
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const counter = entry.target;
    const target = Number(counter.dataset.target || 0);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 80));

    const tick = () => {
      current += step;
      if (current >= target) {
        counter.textContent = `${target}+`;
      } else {
        counter.textContent = `${current}+`;
        requestAnimationFrame(tick);
      }
    };

    tick();
    counterObserver.unobserve(counter);
  });
}, { threshold: 0.4 });

counters.forEach((counter) => counterObserver.observe(counter));

const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    galleryItems.forEach((item) => {
      const category = item.dataset.category;
      const match = filter === "all" || filter === category;
      item.classList.toggle("hidden", !match);
    });
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

if (lightbox && lightboxImage && lightboxCaption) {
  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const image = item.querySelector("img");
      const caption = item.querySelector("figcaption");
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = caption ? caption.textContent : image.alt;
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  };

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
}

const forms = document.querySelectorAll(".quote-form");
const businessNumber = "919503873563";

forms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const service = String(formData.get("service") || "").trim();
    const location = String(formData.get("location") || "").trim();

    if (!name || !/^\d{10}$/.test(phone) || !message) {
      if (status) {
        status.textContent = "कृपया नाव, १० अंकी मोबाइल नंबर आणि संदेश योग्यरित्या भरा.";
      }
      return;
    }

    const pageType = form.dataset.formType === "inquiry" ? "चौकशी" : "संपर्क";
    const parts = [
      `नमस्कार, मला ${pageType} करायची आहे.`,
      `नाव: ${name}`,
      `मोबाइल: ${phone}`
    ];

    if (service) {
      parts.push(`सेवा: ${service}`);
    }

    if (location) {
      parts.push(`ठिकाण: ${location}`);
    }

    parts.push(`तपशील: ${message}`);

    const whatsappUrl = `https://wa.me/${businessNumber}?text=${encodeURIComponent(parts.join("\n"))}`;

    if (status) {
      status.textContent = "तुमची माहिती तयार झाली आहे. WhatsApp उघडत आहे...";
    }

    window.open(whatsappUrl, "_blank", "noopener");
    form.reset();
  });
});
