gsap.registerPlugin(ScrollTrigger);

// --- 1. THEME INITIALIZATION (Runs First!) ---
const mainElement = document.getElementById("main");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark-mode");
  mainElement.classList.add("dark-mode");
}

// --- 2. HERO ANIMATION CONTROLLER ---
// Defined separate function so we can call it from the preloader timeline
function playHeroAnimations() {
  const heroLines = document.querySelectorAll(".hero h1 .line-mask > span");
  // Updated selector to match new glass card structure
  const heroImage =
    document.querySelector(".glass-card-container") ||
    document.querySelector(".hero-img-container");
  // Hero inline doodle blocks
  const doodleBlocks = document.querySelectorAll(".hero-inline-images .inline-block");

  // Ensure elements are visible for animation
  // (Mask parents already hide overflow, but opacity helps smooth entry)

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

  // Doodle blocks entrance animation - dramatic staggered pop effect
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
        rotation: (index) => [-6, 0, 6][index] || 0, // Match their base rotations
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
        stagger: {
          each: 0.12,
          from: "start",
        },
      },
      "-=0.6" // Start slightly before text finishes
    );
  }

  if (heroImage) {
    tl.from(
      heroImage,
      {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
      },
      "<0.2"
    );
  }
}

// --- 3. PRELOADER LOGIC ---
function initPreloader() {
  const container = document.querySelector("#preloader");
  const ball = document.querySelector("#loader-ball");
  const letters = document.querySelectorAll("#preloader-text span");
  const face = document.querySelector(".face");

  // If preloader HTML is missing/commented out, just show content and return
  if (!container) {
    document.body.classList.remove("loading");
    playHeroAnimations();
    return;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.set(container, { display: "none" });
      document.body.classList.remove("loading");
      ScrollTrigger.refresh();
    },
  });

  if (ball) gsap.set(ball, { scale: 0, autoAlpha: 1 });

  // Only add animations if elements exist
  if (letters.length > 0) {
    tl.to(letters, {
      y: 0,
      duration: 1,
      stagger: 0.05,
      ease: "power4.out",
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
      letters.length > 0 ? "-=0.5" : "0" // Adjust timing based on letters existence
    )
      // Ball Drop
      .call(() => {
        if (!ball) return;
        const ballRect = ball.getBoundingClientRect();
        const dropDist = window.innerHeight - ballRect.bottom - 40;

        gsap.to(ball, {
          y: dropDist,
          duration: 1.5,
          ease: "bounce.out",
        });
      })
      .to({}, { duration: 1.5 })

      // Squash
      .to(ball, {
        scaleX: 1.6,
        scaleY: 0.4,
        duration: 0.1,
        ease: "power2.out",
      })
      // Recover
      .to(ball, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.3,
        ease: "elastic.out(1, 0.3)",
      });
  }

  if (letters.length > 0 || face) {
    const fadeTargets = [];
    if (letters.length > 0) fadeTargets.push(letters);
    if (face) fadeTargets.push(face);

    tl.to(
      fadeTargets,
      {
        y: -20,
        opacity: 0,
        duration: 0.2,
        stagger: 0.02,
        ease: "power2.in",
      },
      "+=0.1"
    );
  }

  if (ball) {
    // Massive Expand (Cover screen)
    tl.to(
      ball,
      {
        scale: 250,
        duration: 1.2,
        ease: "power4.inOut",
      },
      "<"
    );
  }

  // === CONCURRENT HERO REVEAL ===
  tl.add(() => {
    // Start Hero Animation AS the container fades
    playHeroAnimations();
  }, "-=0.6") // Sync point: Start slightly before expansion finishes

    // Container Fade Out (Reveals the animating hero underneath)
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

// --- 4. LOCOMOTIVE SCROLL ---
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

// --- 5. MASKED TEXT ANIMATIONS ---
function initMaskedAnimations() {
  const headings = document.querySelectorAll(
    ".about-content h1, .bento-header h1, .services-intro h2, .experience-title h1, .projects-header h1, .footer-heading h1"
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
          toggleActions: "play none none reverse",
        },
      });
    }
  });
}

initMaskedAnimations();

// --- 5.5 BENTO GRID ANIMATIONS ---
// --- 5.5 PROJECT HOVER REVEAL ANIMATIONS ---
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

  // Initial State - position off-screen to prevent flash at origin
  gsap.set(revealWrapper, {
    xPercent: -50,
    yPercent: -50,
    x: -9999,
    y: -9999,
    autoAlpha: 0,
    scale: 0.9,
  });
  
  // Hide next image initially
  gsap.set(nextImg, { y: "100%" });

  // Mouse Move Handler (Follow Cursor)
  const xTo = gsap.quickTo(revealWrapper, "x", {
    duration: 0.4,
    ease: "power3",
  });
  const yTo = gsap.quickTo(revealWrapper, "y", {
    duration: 0.4,
    ease: "power3",
  });

  window.addEventListener("mousemove", (e) => {
    // Check if hovering over the list area
    if (e.target.closest(".project-list")) {
      xTo(e.clientX);
      yTo(e.clientY);

      // Tilt Effect Calculation
      // Calculate velocity or position relative to screen center/movement
      // Simple tilt based on movement direction is tricky with QuickTo, let's use velocity proxy or just position relative to center of screen?
      // Let's us position relative to cursor movement direction approx

      const xVelocity = (e.movementX || 0) * 2; // exaggerated velocity
      const yVelocity = (e.movementY || 0) * 2;

      // Clamp rotation
      const rotationX = gsap.utils.clamp(-20, 20, -yVelocity); // Moving up -> tilt back (negative rotateX? check css perspective)
      const rotationY = gsap.utils.clamp(-20, 20, xVelocity); // Moving right -> tilt right

      gsap.to(revealWrapper, {
        rotationX: rotationX,
        rotationY: rotationY,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  });

  // Image slideshow state
  let slideshowInterval = null;
  let slideshowTimeout = null;
  let currentImageIndex = 0;
  let lastHoveredRow = null;
  let currentImages = []; // Track current project's images

  // Row Hover Handlers
  projectRows.forEach((row) => {
    row.addEventListener("mouseenter", () => {
      const imgUrl = row.getAttribute("data-image");
      const imagesAttr = row.getAttribute("data-images");
      const isNewRow = lastHoveredRow !== row;
      lastHoveredRow = row;

      // Clear any existing slideshow AND pending timeout
      if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
      }
      if (slideshowTimeout) {
        clearTimeout(slideshowTimeout);
        slideshowTimeout = null;
      }

      // Update current images for this row
      if (imagesAttr) {
        currentImages = imagesAttr.split(",").map((img) => img.trim());
      } else {
        currentImages = imgUrl ? [imgUrl] : [];
      }

      // Slide down animation when switching to a new row
      if (isNewRow && currentImages.length > 0) {
        currentImageIndex = 0;
        
        // Animate current image out (slide down)
        gsap.to(currentImg, {
          y: "100%",
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            // Set new image and animate in from top
            currentImg.src = currentImages[0];
            
            gsap.set(currentImg, { y: "-100%" });
            gsap.to(currentImg, {
              y: 0,
              duration: 0.4,
              ease: "power2.out"
            });
          }
        });
        
        // Start slideshow after initial animation (only for multi-image projects)
        if (currentImages.length > 1) {
          slideshowTimeout = setTimeout(() => {
            slideshowInterval = setInterval(() => {
              // Use the stored currentImages array (not stale closure)
              if (currentImages.length <= 1) return;
              
              const nextIndex = (currentImageIndex + 1) % currentImages.length;
              
              // Preload and set next image
              nextImg.src = currentImages[nextIndex];
              gsap.set(nextImg, { y: "100%" });
              
              // Animate both images simultaneously - seamless overlap
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
                  // Swap: next becomes current
                  currentImageIndex = nextIndex;
                  currentImg.src = currentImages[currentImageIndex];
                  gsap.set(currentImg, { y: 0 });
                  gsap.set(nextImg, { y: "100%" });
                },
              });
            }, 2000);
          }, 800); // Wait for initial slide-down animation
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

      // Enable View Cursor
      document.body.classList.add("cursor-view");
    });

    row.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-view");

      // Stop slideshow AND any pending timeout when leaving row
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

  // Hide when leaving the list container
  if (projectList) {
    projectList.addEventListener("mouseleave", () => {
      // Clear slideshow
      if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
      }
      if (slideshowTimeout) {
        clearTimeout(slideshowTimeout);
        slideshowTimeout = null;
      }
      
      // Reset lastHoveredRow
      lastHoveredRow = null;

      gsap.to(revealWrapper, {
        autoAlpha: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.in",
      });
    });
  }
  
  // Also hide on scroll (using Locomotive Scroll)
  if (typeof locoScroll !== "undefined") {
    locoScroll.on("scroll", () => {
      // Check if project list is in view
      const listRect = projectList?.getBoundingClientRect();
      if (listRect && (listRect.bottom < 0 || listRect.top > window.innerHeight)) {
        // List is out of view, hide the reveal wrapper
        gsap.set(revealWrapper, { autoAlpha: 0 });
        lastHoveredRow = null;
      }
    });
  }
  
  // Fallback: Also hide on regular scroll for non-Locomotive environments
  window.addEventListener("scroll", () => {
    const listRect = projectList?.getBoundingClientRect();
    if (listRect && (listRect.bottom < 0 || listRect.top > window.innerHeight)) {
      gsap.set(revealWrapper, { autoAlpha: 0 });
      lastHoveredRow = null;
    }
  }, { passive: true });
}

initProjectHoverAnimations();

// --- 6. MAGNETIC BUTTONS ---
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

// --- 7. CUSTOM CURSOR ---
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

  // Optimize visibility check to avoid getComputedStyle on every frame
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

  // Updated for new elements
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

// --- 8. ANIMATED EYES FOLLOW CURSOR ---
function initEyeTracking() {
  const eyes = document.querySelectorAll(".hero-eye");
  if (eyes.length === 0) return;

  // Cache eye positions
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

  // Initial calculation
  updateEyePositions();
  window.addEventListener("resize", updateEyePositions);
  // Update on scroll since eyes move with page
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
        Math.hypot(e.clientX - eyeData.centerX, e.clientY - eyeData.centerY) /
          10,
        8 // Max movement radius
      );

      const pupilX = Math.cos(angle) * distance;
      const pupilY = Math.sin(angle) * distance;

      eyeData.pupil.style.transform = `translate(${pupilX}px, ${pupilY}px)`;
    });
  });
}

initEyeTracking();

// --- 8.5 MOBILE TAP INTERACTIONS FOR DOODLES ---
function initDoodleTapInteractions() {
  // Include both hero and footer doodles
  const doodleBlocks = document.querySelectorAll(".hero-inline-images .inline-block, .footer-inline-images .inline-block");
  const containers = document.querySelectorAll(".hero-inline-images, .footer-inline-images");
  
  if (doodleBlocks.length === 0 || containers.length === 0) return;
  
  // Only enable on touch devices
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) return;
  
  let activeBlock = null;
  
  // Handle tap on individual doodle blocks
  doodleBlocks.forEach((block, index) => {
    block.addEventListener("click", (e) => {
      e.stopPropagation();
      
      // If this block is already active, deactivate it
      if (activeBlock === block) {
        deactivateBlock(block);
        activeBlock = null;
        return;
      }
      
      // Deactivate previous active block
      if (activeBlock) {
        deactivateBlock(activeBlock);
      }
      
      // Activate this block
      activateBlock(block);
      activeBlock = block;
    });
  });
  
  // Close on tap outside
  document.addEventListener("click", (e) => {
    if (activeBlock && !e.target.closest(".hero-inline-images") && !e.target.closest(".footer-inline-images")) {
      deactivateBlock(activeBlock);
      activeBlock = null;
    }
  });
  
  function activateBlock(block) {
    // Add active class
    block.classList.add("tap-active");
    
    // Dim siblings
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
    
    // Pop the active block
    gsap.to(block, {
      scale: 1.8,
      rotation: 0,
      y: -15,
      zIndex: 100,
      boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.3)",
      duration: 0.4,
      ease: "elastic.out(1, 0.5)",
    });
    
    // Pause the floating animation
    block.style.animationPlayState = "paused";
  }
  
  function deactivateBlock(block) {
    // Remove active class
    block.classList.remove("tap-active");
    
    // Get the original rotation based on block number
    const blockClasses = block.classList;
    let baseRotation = 0;
    if (blockClasses.contains("block-1")) baseRotation = -6;
    else if (blockClasses.contains("block-2")) baseRotation = 0;
    else if (blockClasses.contains("block-3")) baseRotation = 6;
    
    // Reset all blocks
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
      
      // Resume floating animation
      sibling.style.animationPlayState = "running";
    });
  }
}

initDoodleTapInteractions();

// --- 9. THEME TOGGLE & UTILS ---
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

// Copy email functionality for both header and hero buttons
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

// --- 10. EXPERIENCE SECTION ANIMATIONS ---
function initExperienceAnimations() {
  const container = document.querySelector(".experience-container");
  const items = document.querySelectorAll(".experience-item");
  const line = document.querySelector(".experience-timeline-line");

  if (!container || items.length === 0) return;

  // 0. Spotlight Logic
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

  // 1. Animate the vertical timeline line
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
          start: "top 80%",
          end: "bottom 30%",
          scrub: true,
        },
      }
    );
  }

  // 2. Animate items as they enter
  items.forEach((item, index) => {
    const dot = item.querySelector(".experience-dot");
    const date = item.querySelector(".experience-date");
    const card = item.querySelector(".experience-card");

    // Create a unique timeline for each item
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        scroller: "#main",
        start: "top bottom-=100", // Start animation when item is near bottom
        toggleActions: "play none none reverse",
      },
    });

    // Ensure elements exist before animating
    if (dot) {
      tl.fromTo(
        dot,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }
      );
    }
    if (date) {
      tl.fromTo(
        date,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );
    }
    if (card) {
      tl.fromTo(
        card,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      );
    }
  });
}

// Initialize only after page load and Locomotive Scroll is ready
window.addEventListener("load", () => {
  setTimeout(() => {
    initExperienceAnimations();
    initProjectHoverAnimations();
    ScrollTrigger.refresh();
  }, 500);
});


// --- 12. SCROLL-REACTIVE TYPOGRAPHY MARQUEE ---
function initScrollMarquee() {
  const marqueeScroll = document.querySelector(".marquee-scroll");
  if (!marqueeScroll) return;

  // State variables
  let isAnimating = true;
  let currentX = 0;
  let baseSpeed = 0.5; // Slower base pixels per frame
  let scrollVelocity = 0;
  let lastScrollY = 0;
  let isReversed = false;
  let scrollWidth = marqueeScroll.scrollWidth / 2;

  // Recalculate on resize to handle responsive layout changes
  window.addEventListener("resize", () => {
    scrollWidth = marqueeScroll.scrollWidth / 2;
  });

  // Animation loop - optimized
  function animate() {
    if (!isAnimating) return;

    // Calculate speed based on scroll velocity
    const speed = baseSpeed + Math.min(Math.abs(scrollVelocity) * 0.03, 2);

    // Update position
    currentX += isReversed ? speed : -speed;

    // Seamless loop
    if (currentX <= -scrollWidth) {
      currentX += scrollWidth;
    } else if (currentX >= 0) {
      currentX -= scrollWidth;
    }

    // Apply transform with GPU acceleration
    marqueeScroll.style.transform = `translate3d(${currentX}px, 0, 0)`;

    // Decay scroll velocity
    scrollVelocity *= 0.9;

    requestAnimationFrame(animate);
  }

  // Start animation
  requestAnimationFrame(animate);

  // Listen to Locomotive Scroll
  locoScroll.on("scroll", (args) => {
    const currentScrollY = args.scroll.y;
    const delta = currentScrollY - lastScrollY;

    // Update velocity based on scroll delta
    scrollVelocity = delta;

    // Reverse direction when scrolling up
    isReversed = delta < 0;

    lastScrollY = currentScrollY;
  });

  // Fallback for native scroll (if locomotive fails)
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

  // Pause on hover
  const marqueeWrapper = document.querySelector(".marquee-wrapper");
  if (marqueeWrapper) {
    marqueeWrapper.addEventListener("mouseenter", () => {
      baseSpeed = 0.15; // Slow down on hover
    });
    marqueeWrapper.addEventListener("mouseleave", () => {
      baseSpeed = 0.5; // Resume normal (slower) speed
    });
  }

  // Intersection Observer for performance
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
  ); // Start slightly before it enters

  if (marqueeScroll.parentElement) {
    observer.observe(marqueeScroll.parentElement);
  }
}

// Initialize Scroll Marquee after page load
window.addEventListener("load", () => {
  setTimeout(() => {
    initScrollMarquee();
  }, 600);
});
