try {
  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true
  });
} catch (e) {
  console.warn("Locomotive Scroll not initialized.", e);
}

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
      navigator.clipboard.writeText(email).then(() => {
        copyEmailBtn.textContent = "Copied!";
        setTimeout(() => { copyEmailBtn.textContent = "Copy"; }, 2000);
      }).catch(() => {
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
    setTimeout(() => { buttonEl.textContent = "Copy"; }, 2000);
  } catch (err) {
    console.error("Failed to copy email: ", err);
    buttonEl.textContent = "Failed";
  }
  document.body.removeChild(textArea);
}

const projectToggleButtons = document.querySelectorAll(".view-projects-btn");
projectToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const projectsContainer = button.closest(".experience-item")?.querySelector(".projects-container");
    if (projectsContainer) {
      button.classList.toggle("active");
      if (button.classList.contains("active")) {
        projectsContainer.classList.add("show");
        const plus = button.querySelector(".icon-plus");
        if (plus) plus.textContent = "-";
      } else {
        projectsContainer.classList.remove("show");
        const plus = button.querySelector(".icon-plus");
        if (plus) plus.textContent = "+";
      }
    }
  });
});
