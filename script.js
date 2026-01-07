gsap.registerPlugin(ScrollTrigger);

// THEME INITIALIZATION
const mainElement = document.getElementById("main");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  mainElement.classList.add("dark-mode");
}

// HERO ANIMATIONS
function playHeroAnimations() {
  const heroLines = document.querySelectorAll(".hero h1 .line-mask > span");
  const heroImage =
    document.querySelector(".glass-card-container") ||
    document.querySelector(".hero-img-container");
  const doodleBlocks = document.querySelectorAll(".hero-inline-images .inline-block");

  const tl = gsap.timeline();

  if (heroLines.length > 0) {
    tl.from(heroLines, {
      y: "110%",
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.1,
    });
  }

  // Doodles entrance animation
  if (doodleBlocks.length > 0) {
    tl.fromTo(
      doodleBlocks,
      {
        scale: 0,
        opacity: 0,
        rotation: -45,
        y: 30,
      },
      {
        scale: 1,
        opacity: 1,
        rotation: (index) => [-6, 0, 6][index] || 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
        stagger: {
          each: 0.12,
          from: "start",
        },
      },
      "-=0.6"
    );
  }

  if (heroImage) {
    tl.from(
      heroImage,
      {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      },
      0.5
    );
  }

  initHeroDepthParallax();
}

// HERO DEPTH PARALLAX
function initHeroDepthParallax() {
  const card = document.querySelector(".glass-card-container");
  const doodles = document.querySelectorAll(".hero-inline-images .inline-block");
  const heroText = document.querySelector(".hero-text");

  if (card) {
    gsap.to(card, {
      y: -30,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  if (doodles.length > 0) {
    doodles.forEach((doodle, i) => {
      gsap.to(doodle, {
        y: -(20 + (i * 20)),
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  }

  if (heroText) {
    gsap.to(heroText, {
      y: 15,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }
}

// PRELOADER
function initPreloader() {
  const container = document.querySelector("#preloader");
  const ball = document.querySelector("#loader-ball");
  const letters = document.querySelectorAll("#preloader-text span");
  const face = document.querySelector(".face");

  if (!container) {
    document.body.classList.remove("loading");
    playHeroAnimations();
    return;
  }

  const textElement = document.getElementById("preloader-text");
  const counterElement = document.getElementById("preloader-counter");
  const words = ["Welcome", "Bonjour", "வணக்கம்", "नमस्ते"];
  
  document.body.style.overflow = "hidden";

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.set(container, { display: "none" });
      document.body.classList.remove("loading");
      document.body.style.overflow = "";
      ScrollTrigger.refresh();
    },
  });

  if (ball) gsap.set(ball, { scale: 0, autoAlpha: 1 });

  if (counterElement) {
    let counterObj = { val: 0 };
    tl.to(counterObj, {
      val: 100,
      duration: 3.5,
      ease: "power2.inOut",
      onUpdate: () => {
        counterElement.textContent = Math.floor(counterObj.val) + "%";
      },
    }, "start");
  }

  if (textElement) {
    let textDuration = 3.5 / words.length;
    
    words.forEach((word, index) => {
      const isLast = index === words.length - 1;
      const startTime = index * textDuration; 

      tl.add(() => {
        textElement.textContent = word;
      }, "start+=" + startTime);

      tl.fromTo(textElement, 
        { opacity: 0, y: 10 }, 
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        "start+=" + startTime
      );

      if (!isLast) {
        tl.to(textElement, 
          { opacity: 0, y: -10, duration: 0.3, ease: "power2.in" }, 
          "start+=" + (startTime + textDuration - 0.3)
        );
      }
    });
  }

   if (ball) {
    tl.to(
      ball,
      {
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      },
      "start+=0.2"
    );
  }

  if (ball) {
    tl
      .call(() => {
        if (!ball) return;
        const ballRect = ball.getBoundingClientRect();
        const dropDist = window.innerHeight - ballRect.bottom - 40;

        gsap.to(ball, {
          y: dropDist,
          duration: 1.5,
          ease: "bounce.out",
        });
      }, null, "+=0.2")
      
      .to({}, { duration: 1.5 })

      .to(ball, {
        scaleX: 1.6,
        scaleY: 0.4,
        duration: 0.1,
        ease: "power2.out",
      })
      .to(ball, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.3,
        ease: "elastic.out(1, 0.3)",
      });
  }

  const exitDuration = 1.2;
  
  const exitTargets = [];
  if (textElement) exitTargets.push(textElement);
  if (face) exitTargets.push(face);
  if (counterElement) exitTargets.push(counterElement);

  if (exitTargets.length > 0) {
    tl.to(
      exitTargets,
      {
        y: -20,
        opacity: 0,
        duration: 0.3,
        stagger: 0.1,
        ease: "power2.in",
      },
      "+=0.1"
    );
  }

  if (ball) {
    tl.to(
      ball,
      {
        scale: 250,
        duration: exitDuration,
        ease: "power4.inOut",
      },
      "<"
    );
  }

  tl.add(() => {
    playHeroAnimations();
  }, "-=0.6")

    // Container Fade Out
    .to(
      container,
      {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut",
      },
      "<"
    );
}

initPreloader();

// LOCOMOTIVE SCROLL
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

// MASKED TEXT ANIMATIONS
function initMaskedAnimations() {
  const headings = document.querySelectorAll(
    ".about-content h1, .bento-header h2, .services-intro h2, .experience-title h2, .projects-header h2, .footer-heading h2"
  );

  headings.forEach((heading) => {
    const lines = heading.querySelectorAll(".line-mask > span");

    if (lines.length > 0) {
      gsap.from(lines, {
        y: "110%",
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: heading,
          scroller: "#main",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none none",
        },
      });
    }
  });
}

initMaskedAnimations();

// PROJECT HOVER REVEAL
function initProjectHoverAnimations() {
  const projectRows = document.querySelectorAll(".project-row");
  const revealWrapper = document.querySelector(".project-reveal-wrapper");
  const currentImg = document.querySelector(".project-reveal-img-current");
  const nextImg = document.querySelector(".project-reveal-img-next");
  const projectList = document.querySelector(".project-list");

  if (!projectRows.length || !revealWrapper || !currentImg || !nextImg) {
    console.log("Project hover elements not found");
    return;
  }

  gsap.set(revealWrapper, {
    xPercent: -50,
    yPercent: -50,
    autoAlpha: 0,
    scale: 0.9,
  });
  
  gsap.set(nextImg, { y: "100%" });

  const xTo = gsap.quickTo(revealWrapper, "x", {
    duration: 0.4,
    ease: "power3",
  });
  const yTo = gsap.quickTo(revealWrapper, "y", {
    duration: 0.4,
    ease: "power3",
  });

  window.addEventListener("mousemove", (e) => {
    if (e.target.closest(".project-list")) {
      xTo(e.clientX);
      yTo(e.clientY);

      const xVelocity = (e.movementX || 0) * 2;
      const yVelocity = (e.movementY || 0) * 2;

      const rotationX = gsap.utils.clamp(-20, 20, -yVelocity);
      const rotationY = gsap.utils.clamp(-20, 20, xVelocity);

      gsap.to(revealWrapper, {
        rotationX: rotationX,
        rotationY: rotationY,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  });

  let slideshowInterval = null;
  let slideshowTimeout = null;
  let currentImageIndex = 0;
  let lastHoveredRow = null;
  let currentImages = [];

  projectRows.forEach((row) => {
    row.addEventListener("mouseenter", () => {
      const imgUrl = row.getAttribute("data-image");
      const imagesAttr = row.getAttribute("data-images");
      const isNewRow = lastHoveredRow !== row;
      lastHoveredRow = row;

      if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
      }
      if (slideshowTimeout) {
        clearTimeout(slideshowTimeout);
        slideshowTimeout = null;
      }

      if (imagesAttr) {
        currentImages = imagesAttr.split(",").map((img) => img.trim());
      } else {
        currentImages = imgUrl ? [imgUrl] : [];
      }

      if (isNewRow && currentImages.length > 0) {
        currentImageIndex = 0;
        
        gsap.to(currentImg, {
          y: "100%",
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            currentImg.src = currentImages[0];
            
            gsap.set(currentImg, { y: "-100%" });
            gsap.to(currentImg, {
              y: 0,
              duration: 0.4,
              ease: "power2.out"
            });
          }
        });
        
        if (currentImages.length > 1) {
          slideshowTimeout = setTimeout(() => {
            slideshowInterval = setInterval(() => {
              if (currentImages.length <= 1) return;
              
              const nextIndex = (currentImageIndex + 1) % currentImages.length;
              
              nextImg.src = currentImages[nextIndex];
              gsap.set(nextImg, { y: "100%" });
              
              gsap.to(currentImg, {
                y: "-100%",
                duration: 0.6,
                ease: "power2.inOut",
              });
              
              gsap.to(nextImg, {
                y: "0%",
                duration: 0.6,
                ease: "power2.inOut",
                onComplete: () => {
                  currentImageIndex = nextIndex;
                  currentImg.src = currentImages[currentImageIndex];
                  gsap.set(currentImg, { y: 0 });
                  gsap.set(nextImg, { y: "100%" });
                },
              });
            }, 2000);
          }, 800);
        }
      }

      // Show Wrapper
      gsap.to(revealWrapper, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });

      document.body.classList.add("cursor-view");
    });

    row.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-view");

      if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
      }
      if (slideshowTimeout) {
        clearTimeout(slideshowTimeout);
        slideshowTimeout = null;
      }
    });
  });

  if (projectList) {
    projectList.addEventListener("mouseleave", () => {
      if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
      }

      gsap.to(revealWrapper, {
        autoAlpha: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.in",
      });
    });
  }
}

initProjectHoverAnimations();

// MAGNETIC BUTTONS
function initMagneticButtons() {
  const magnets = document.querySelectorAll(".magnetic-btn");
  magnets.forEach((magnet) => {
    magnet.addEventListener("mousemove", (e) => {
      const bound = magnet.getBoundingClientRect();
      const centerX = bound.left + bound.width / 2;
      const centerY = bound.top + bound.height / 2;
      const x = e.clientX - centerX;
      const y = e.clientY - centerY;

      gsap.to(magnet, {
        x: x * 0.5,
        y: y * 0.5,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    magnet.addEventListener("mouseleave", () => {
      gsap.to(magnet, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.3)",
      });
    });
  });
}

initMagneticButtons();

// CUSTOM CURSOR
function initCustomCursor() {
  const cursor = document.querySelector(".custom-cursor");
  const follower = document.querySelector(".custom-cursor-follower");

  if (!cursor || !follower) return;

  gsap.set(cursor, { xPercent: -50, yPercent: -50 });
  gsap.set(follower, { xPercent: -50, yPercent: -50 });

  const cursorX = gsap.quickTo(cursor, "x", { duration: 0.1, ease: "power3" });
  const cursorY = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });
  const followerX = gsap.quickTo(follower, "x", {
    duration: 0.5,
    ease: "power3",
  });
  const followerY = gsap.quickTo(follower, "y", {
    duration: 1,
    ease: "power3",
  });

  let isCursorVisible = window.innerWidth > 768;
  window.addEventListener("resize", () => {
    isCursorVisible = window.innerWidth > 768;
  });

  window.addEventListener("mousemove", (e) => {
    if (isCursorVisible) {
      cursorX(e.clientX);
      cursorY(e.clientY);
      followerX(e.clientX);
      followerY(e.clientY);
    }
  });

  const interactiveElements = document.querySelectorAll(
    "a, button, .project-card, .view-projects-btn, .work, .collection-category-btn, .gallery-item"
  );

  interactiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      gsap.to(cursor, { opacity: 0, duration: 0.3 });
      gsap.to(follower, {
        scale: 1.8,
        backgroundColor: "rgba(255, 255, 255, 1)",
        mixBlendMode: "difference",
        duration: 0.3,
      });
    });

    el.addEventListener("mouseleave", () => {
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
      gsap.to(follower, {
        scale: 1,
        backgroundColor: "transparent",
        duration: 0.3,
      });
    });
  });
}

initCustomCursor();

// EYE TRACKING
function initEyeTracking() {
  const eyes = document.querySelectorAll(".hero-eye");
  if (eyes.length === 0) return;

  let eyePositions = [];

  function updateEyePositions() {
    eyePositions = Array.from(eyes).map((eye) => {
      const rect = eye.getBoundingClientRect();
      return {
        element: eye,
        centerX: rect.left + rect.width / 2,
        centerY: rect.top + rect.height / 2,
        pupil: eye.querySelector(".hero-pupil"),
      };
    });
  }

  updateEyePositions();
  window.addEventListener("resize", updateEyePositions);
  window.addEventListener("scroll", updateEyePositions, { passive: true });
  if (typeof locoScroll !== "undefined") {
    locoScroll.on("scroll", updateEyePositions);
  }

  document.addEventListener("mousemove", (e) => {
    eyePositions.forEach((eyeData) => {
      if (!eyeData.pupil) return;

      const angle = Math.atan2(
        e.clientY - eyeData.centerY,
        e.clientX - eyeData.centerX
      );
      const distance = Math.min(
        Math.hypot(e.clientX - eyeData.centerX, e.clientY - eyeData.centerY) / 10,
        8
      );

      const pupilX = Math.cos(angle) * distance;
      const pupilY = Math.sin(angle) * distance;

      eyeData.pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    });
  });
}

initEyeTracking();

// MOBILE DOODLE INTERACTIONS
function initDoodleTapInteractions() {
  const doodleBlocks = document.querySelectorAll(".hero-inline-images .inline-block, .footer-inline-images .inline-block");
  const containers = document.querySelectorAll(".hero-inline-images, .footer-inline-images");
  
  if (doodleBlocks.length === 0 || containers.length === 0) return;
  
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) return;
  
  let activeBlock = null;
  
  doodleBlocks.forEach((block, index) => {
    block.addEventListener("click", (e) => {
      e.stopPropagation();
      
      if (activeBlock === block) {
        deactivateBlock(block);
        activeBlock = null;
        return;
      }
      
      if (activeBlock) {
        deactivateBlock(activeBlock);
      }
      
      activateBlock(block);
      activeBlock = block;
    });
  });
  
  document.addEventListener("click", (e) => {
    if (activeBlock && !e.target.closest(".hero-inline-images") && !e.target.closest(".footer-inline-images")) {
      deactivateBlock(activeBlock);
      activeBlock = null;
    }
  });
  
  function activateBlock(block) {
    block.classList.add("tap-active");
    
    doodleBlocks.forEach((sibling) => {
      if (sibling !== block) {
        gsap.to(sibling, {
          scale: 0.85,
          opacity: 0.3,
          filter: "grayscale(0.6) blur(1px)",
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
    
    gsap.to(block, {
      scale: 1.8,
      rotation: 0,
      y: -15,
      zIndex: 100,
      boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.3)",
      duration: 0.4,
      ease: "elastic.out(1, 0.5)",
    });
    
    block.style.animationPlayState = "paused";
  }
  
  function deactivateBlock(block) {
    block.classList.remove("tap-active");
    
    const blockClasses = block.classList;
    let baseRotation = 0;
    if (blockClasses.contains("block-1")) baseRotation = -6;
    else if (blockClasses.contains("block-2")) baseRotation = 0;
    else if (blockClasses.contains("block-3")) baseRotation = 6;
    
    doodleBlocks.forEach((sibling) => {
      let siblingRotation = 0;
      if (sibling.classList.contains("block-1")) siblingRotation = -6;
      else if (sibling.classList.contains("block-2")) siblingRotation = 0;
      else if (sibling.classList.contains("block-3")) siblingRotation = 6;
      
      gsap.to(sibling, {
        scale: 1,
        opacity: 1,
        filter: "none",
        rotation: siblingRotation,
        y: 0,
        zIndex: sibling.classList.contains("block-1") ? 3 : sibling.classList.contains("block-2") ? 2 : 1,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        duration: 0.4,
        ease: "power2.out",
      });
      
      sibling.style.animationPlayState = "running";
    });
  }
}

initDoodleTapInteractions();

// THEME TOGGLE
const themeToggleButtons = document.querySelectorAll(".theme-toggle");
updateIcons(document.body.classList.contains("dark-mode"));

themeToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    mainElement.classList.toggle("dark-mode");

    let isDark = document.body.classList.contains("dark-mode");
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

// COPY EMAIL
function setupCopyEmail(buttonId, originalText) {
  const btn = document.getElementById(buttonId);
  if (btn) {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const email = "Dongaremahesh10@gmail.com";

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(email)
          .then(() => {
            btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            setTimeout(() => {
              btn.innerHTML = originalText;
            }, 2000);
          })
          .catch(() => {
            copyEmailFallback(email, btn, originalText);
          });
      } else {
        copyEmailFallback(email, btn, originalText);
      }
    });
  }
}

setupCopyEmail("copy-email-btn", "Copy");
setupCopyEmail(
  "copy-email-btn-hero",
  '<i class="fa-regular fa-copy"></i> Copy email'
);

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
        setTimeout(() => locoScroll.update(), 600);
      } else {
        projectsContainer.classList.remove("show");
        const plus = button.querySelector(".icon-plus");
        if (plus) plus.textContent = "+";
        setTimeout(() => locoScroll.update(), 600);
      }
    }
  });
});

// EXPERIENCE ANIMATIONS
function initExperienceAnimations() {
  const container = document.querySelector(".experience-container");
  const items = document.querySelectorAll(".experience-item");
  const line = document.querySelector(".experience-timeline-line");

  if (!container || items.length === 0) return;

  items.forEach((item) => {
    const card = item.querySelector(".experience-card");
    if (!card) return;

    item.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  if (line) {
    gsap.fromTo(
      line,
      { scaleY: 0, transformOrigin: "top" },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          scroller: "#main",
          start: "top 85%",
          end: "bottom 50%",
          scrub: 0.5,
        },
      }
    );
  }

  items.forEach((item, index) => {
    const dot = item.querySelector(".experience-dot");
    const date = item.querySelector(".experience-date");
    const card = item.querySelector(".experience-card");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        scroller: "#main",
        start: "top bottom-=50",
        toggleActions: "play none none none",
      },
    });

    if (dot) {
      tl.fromTo(
        dot,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" }
      );
    }
    
    if (date) {
      tl.fromTo(
        date,
        { x: -20, opacity: 0, filter: "blur(4px)" },
        { x: 0, opacity: 1, filter: "blur(0px)", duration: 0.3, ease: "expo.out" },
        "-=0.2"
      );
    }
    
    if (card) {
      tl.fromTo(
        card,
        { 
          y: 30, 
          opacity: 0, 
          scale: 0.95,
          filter: "blur(8px)"
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          filter: "blur(0px)",
          duration: 0.4, 
          ease: "expo.out" 
        },
        "-=0.25"
      );
    }
  });
}

// INIT ON LOAD
window.addEventListener("load", () => {
  setTimeout(() => {
    initExperienceAnimations();
    initProjectHoverAnimations();
    initScrollMarquee();
    ScrollTrigger.refresh();
  }, 500);
});

// SCROLL MARQUEE
function initScrollMarquee() {
  const marqueeScroll = document.querySelector(".marquee-scroll");
  if (!marqueeScroll) return;

  let isAnimating = true;
  let currentX = 0;
  let baseSpeed = 0.5;
  let scrollVelocity = 0;
  let lastScrollY = 0;
  let isReversed = false;
  let scrollWidth = marqueeScroll.scrollWidth / 2;

  window.addEventListener("resize", () => {
    scrollWidth = marqueeScroll.scrollWidth / 2;
  });

  function animate() {
    if (!isAnimating) return;

    const speed = baseSpeed + Math.min(Math.abs(scrollVelocity) * 0.03, 2);

    currentX += isReversed ? speed : -speed;

    if (currentX <= -scrollWidth) {
      currentX += scrollWidth;
    } else if (currentX >= 0) {
      currentX -= scrollWidth;
    }

    marqueeScroll.style.transform = `translate3d(${currentX}px, 0, 0)`;

    scrollVelocity *= 0.9;

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  locoScroll.on("scroll", (args) => {
    const currentScrollY = args.scroll.y;
    const delta = currentScrollY - lastScrollY;

    scrollVelocity = delta;

    isReversed = delta < 0;

    lastScrollY = currentScrollY;
  });

  let fallbackLastY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const currentY = window.scrollY;
      const delta = currentY - fallbackLastY;

      if (Math.abs(delta) > 1) {
        scrollVelocity = delta;
        isReversed = delta < 0;
      }

      fallbackLastY = currentY;
    },
    { passive: true }
  );

  const marqueeWrapper = document.querySelector(".marquee-wrapper");
  if (marqueeWrapper) {
    marqueeWrapper.addEventListener("mouseenter", () => {
      baseSpeed = 0.15;
    });
    marqueeWrapper.addEventListener("mouseleave", () => {
      baseSpeed = 0.5;
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!isAnimating) {
            isAnimating = true;
            animate();
          }
        } else {
          isAnimating = false;
        }
      });
    },
    { rootMargin: "100px" }
  );

  if (marqueeScroll.parentElement) {
    observer.observe(marqueeScroll.parentElement);
  }
}

