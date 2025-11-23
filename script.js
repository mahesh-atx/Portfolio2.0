gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Locomotive Scroll with ScrollTrigger Proxy
const locoScroll = new LocomotiveScroll({
  el: document.querySelector("#main"),
  smooth: true,
});

ScrollTrigger.scrollerProxy("#main", {
  scrollTop(value) {
    return arguments.length
      ? locoScroll.scrollTo(value, 0, 0)
      : locoScroll.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },
  pinType: document.querySelector("#main").style.transform
    ? "transform"
    : "fixed",
});

locoScroll.on("scroll", ScrollTrigger.update);
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
ScrollTrigger.refresh();

// 2. Setup Masked Text Animations
function initMaskedAnimations() {
  const headings = document.querySelectorAll(
    ".hero h1, .about h2, .experience-title h1, .projects-section-title h1, .footer-text h1"
  );

  headings.forEach((heading) => {
    const lines = heading.querySelectorAll(".line-mask span");

    if (lines.length > 0) {
      gsap.from(lines, {
        y: "100%",
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: heading,
          scroller: "#main",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });
    }
  });
}

initMaskedAnimations();

// 3. Dual Custom Cursor Logic
function initCustomCursor() {
  const cursor = document.querySelector(".custom-cursor");
  const follower = document.querySelector(".custom-cursor-follower");

  if (!cursor || !follower) return;

  // Set initial position centered (using GSAP to avoid CSS conflict)
  gsap.set(cursor, { xPercent: -50, yPercent: -50 });
  gsap.set(follower, { xPercent: -50, yPercent: -50 });

  // Main dot: moves instantly
  const cursorX = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
  const cursorY = gsap.quickTo(cursor, "y", { duration: 0.1, ease: "power3" });

  // Follower ring: moves with delay (duration: 0.6)
  const followerX = gsap.quickTo(follower, "x", {
    duration: 0.6,
    ease: "power3",
  });
  const followerY = gsap.quickTo(follower, "y", {
    duration: 0.6,
    ease: "power3",
  });

  window.addEventListener("mousemove", (e) => {
    // Only animate if element is actually visible (desktop)
    if (window.getComputedStyle(cursor).display !== "none") {
      cursorX(e.clientX);
      cursorY(e.clientY);
      followerX(e.clientX);
      followerY(e.clientY);
    }
  });

  // Hover Effects
  const interactiveElements = document.querySelectorAll(
    "a, button, .experience-item, .project-card, .view-projects-btn"
  );

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      // Shrink the dot slightly
      gsap.to(cursor, { scale: 0.5, duration: 0.3 });

      // Expand the follower and fill it white
      gsap.to(follower, {
        scale: 1.8,
        backgroundColor: "rgba(255, 255, 255, 1)",
        mixBlendMode: "difference",
        duration: 0.3,
      });
    });

    el.addEventListener("mouseleave", () => {
      // Reset dot
      gsap.to(cursor, { scale: 1, duration: 0.3 });

      // Reset follower
      gsap.to(follower, {
        scale: 1,
        backgroundColor: "transparent",
        duration: 0.3,
      });
    });
  });
}

initCustomCursor();

// ==========================================
// EXISTING LOGIC (Themes, Copy Email, etc.)
// ==========================================

const themeToggleButtons = document.querySelectorAll(".theme-toggle");
const mainElement = document.getElementById("main");

if (localStorage.getItem("theme") === "dark") {
  mainElement.classList.add("dark-mode");
  updateIcons(true);
}

themeToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    mainElement.classList.toggle("dark-mode");
    let isDark = mainElement.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    updateIcons(isDark);
  });
});

function updateIcons(isDark) {
  themeToggleButtons.forEach((button) => {
    const icon = button.querySelector("i");
    if (icon) {
      if (isDark) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
      } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
      }
    }
  });
}

const copyEmailBtn = document.getElementById("copy-email-btn");
if (copyEmailBtn) {
  copyEmailBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = "Dongaremahesh10@gmail.com";

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(email)
        .then(() => {
          copyEmailBtn.textContent = "Copied!";
          setTimeout(() => {
            copyEmailBtn.textContent = "Copy";
          }, 2000);
        })
        .catch(() => {
          copyEmailFallback(email, copyEmailBtn);
        });
    } else {
      copyEmailFallback(email, copyEmailBtn);
    }
  });
}

function copyEmailFallback(text, buttonEl) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand("copy");
    buttonEl.textContent = "Copied!";
    setTimeout(() => {
      buttonEl.textContent = "Copy";
    }, 2000);
  } catch (err) {
    console.error("Failed to copy email: ", err);
    buttonEl.textContent = "Failed";
  }
  document.body.removeChild(textArea);
}

const projectToggleButtons = document.querySelectorAll(".view-projects-btn");
projectToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const projectsContainer = button
      .closest(".experience-item")
      ?.querySelector(".projects-container");
    if (projectsContainer) {
      button.classList.toggle("active");
      if (button.classList.contains("active")) {
        projectsContainer.classList.add("show");
        const plus = button.querySelector(".icon-plus");
        if (plus) plus.textContent = "-";
        // Update Locomotive Scroll because height changed
        setTimeout(() => locoScroll.update(), 600);
      } else {
        projectsContainer.classList.remove("show");
        const plus = button.querySelector(".icon-plus");
        if (plus) plus.textContent = "+";
        // Update Locomotive Scroll because height changed
        setTimeout(() => locoScroll.update(), 600);
      }
    }
  });
});
