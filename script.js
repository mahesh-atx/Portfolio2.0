// --- Smooth Scroll Initialization for Locomotive v3.5.4 ---
function initSmoothScroll() {
  gsap.registerPlugin(ScrollTrigger);

  const scrollContainer = document.querySelector("#main");

  // Destroy existing instance if any
  if (window.locoScroll) {
    window.locoScroll.destroy();
  }

  const locoScroll = new LocomotiveScroll({
    el: scrollContainer,
    smooth: true,
    getDirection: true,
  });

  // Update ScrollTrigger on scroll
  locoScroll.on("scroll", ScrollTrigger.update);

  // Set up scrollerProxy for GSAP
  ScrollTrigger.scrollerProxy(scrollContainer, {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.delta.y; // ✅ Correct for v3.5.4
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: scrollContainer.style.transform ? "transform" : "fixed",
  });

  // Refresh ScrollTrigger after Locomotive updates
  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();

  window.locoScroll = locoScroll;
}

// --- Initialize After Full Page Load ---
window.addEventListener("load", () => {
  initSmoothScroll();

  const mainElement = document.getElementById("main");

  // --- DARK MODE TOGGLE ---
  const toggleButtons = document.querySelectorAll(
    ".theme-toggle, .theme-toggle-mobile"
  );
  const toggleIcons = document.querySelectorAll(
    ".theme-toggle i, .theme-toggle-mobile i"
  );

  function setTheme(theme) {
    if (theme === "dark") {
      mainElement.classList.add("dark-mode");
      toggleIcons.forEach((icon) => {
        icon.classList.replace("fa-moon", "fa-sun");
      });
      localStorage.setItem("theme", "dark");
    } else {
      mainElement.classList.remove("dark-mode");
      toggleIcons.forEach((icon) => {
        icon.classList.replace("fa-sun", "fa-moon");
      });
      localStorage.setItem("theme", "light");
    }
    window.locoScroll.update();
  }

  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);

  toggleButtons.forEach((btn) =>
    btn.addEventListener("click", () => {
      const isDark = mainElement.classList.contains("dark-mode");
      setTheme(isDark ? "light" : "dark");
    })
  );

  // --- PROJECTS TOGGLE ---
  document.querySelectorAll(".view-projects-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const experienceItem = btn.closest(".experience-item");
      const projectsContainer = experienceItem.querySelector(".projects-container");

      btn.classList.toggle("active");
      projectsContainer.classList.toggle("show");

      btn.firstChild.nodeValue = btn.classList.contains("active")
        ? "Hide Associated Projects "
        : "View Associated Projects ";

      window.locoScroll.update();
    });
  });
});
