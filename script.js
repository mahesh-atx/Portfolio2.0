gsap.registerPlugin(ScrollTrigger);

// 1. Initialize Locomotive Scroll with ScrollTrigger Proxy
// This is required because Locomotive hijacks native scrolling.
const locoScroll = new LocomotiveScroll({
  el: document.querySelector("#main"),
  smooth: true,
});

// Tell ScrollTrigger to use these proxy methods for the "#main" element
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
  // Locomotive Scroll handles things completely differently on mobile devices - it doesn't
  // even transform the container at all! So to get the correct behavior and avoid jitters,
  // we should pin things with position: fixed on mobile. We sense it by checking to see if
  // there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector("#main").style.transform
    ? "transform"
    : "fixed",
});

// Each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// refresh() and update() to ensure everything is recalculated
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
ScrollTrigger.refresh();

// 2. Setup Masked Text Animations
function initMaskedAnimations() {
  // Select all headings that have the "line-mask" structure
  // We look for the h1/h2 tags, then find the inner spans to animate
  const headings = document.querySelectorAll(
    ".hero h1, .about h2, .about-me-content, .experience-title h1, .projects-section-title h1, .footer-text h1"
  );

  headings.forEach((heading) => {
    // Find the inner text spans within the mask
    const lines = heading.querySelectorAll(".line-mask span");

    if (lines.length > 0) {
      gsap.from(lines, {
        y: "100%", // Start from below (hidden by mask)
        opacity: 0, // Fade in slightly for smoother effect
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.1, // Delay between each line
        scrollTrigger: {
          trigger: heading,
          scroller: "#main",
          start: "top 80%", // Start animation when top of heading hits 80% viewport height
          end: "bottom 20%",
          toggleActions: "play none none reverse", // Replay on scroll back up? Change 'reverse' to 'none' if you want it to play only once.
        },
      });
    }
  });
}

initMaskedAnimations();

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
