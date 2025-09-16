

// Initialize Feather Icons
feather.replace();

// Tab functionality
document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      // Remove active class from all buttons
      tabButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.classList.remove("text-white");
        btn.classList.add("text-white");
        btn.style.background = "";
        btn.style.boxShadow = "";
      });

      // Add active class to clicked button
      button.classList.add("active");
      button.classList.remove("text-white");
      button.classList.add("text-white");

      // Hide all tab contents
      tabContents.forEach((content) => {
        content.classList.add("hidden");
      });

      // Show target tab content
      const targetContent = document.getElementById(`${targetTab}-tab`);
      if (targetContent) {
        targetContent.classList.remove("hidden");
      }

      // Add animation to tab content
      anime({
        targets: targetContent,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 500,
        easing: "easeOutCubic",
      });
    });
  });

  // Search button functionality
  const searchButtons = document.querySelectorAll(
    'button[class*="search-btn-hover"]'
  );
  searchButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Add click animation
      anime({
        targets: this,
        scale: [1, 0.95, 1],
        duration: 200,
        easing: "easeInOutQuad",
      });

      // Get current active tab
      const activeTab = document.querySelector(".tab-btn.active");
      const tabType = activeTab.getAttribute("data-tab");

      // Simulate search action
      this.innerHTML =
        '<i class="fas fa-spinner fa-spin mr-2"></i>Searching...';
      this.disabled = true;

      setTimeout(() => {
        // Reset button after search
        if (tabType === "buy") {
          this.innerHTML =
            '<i class="fas fa-search mr-2"></i>Search Properties';
        } else if (tabType === "rent") {
          this.innerHTML = '<i class="fas fa-search mr-2"></i>Search Rentals';
        } else if (tabType === "roommate") {
          this.innerHTML = '<i class="fas fa-search mr-2"></i>Find Roommates';
        } else if (tabType === "services") {
          this.innerHTML = '<i class="fas fa-search mr-2"></i>Find Services';
        }
        this.disabled = false;

        // Redirect based on tab type
        if (tabType === "buy") {
          window.location.href = "search?type=buy";
        } else if (tabType === "rent") {
          window.location.href = "search?type=rent";
        } else if (tabType === "roommate") {
          window.location.href = "search?type=roommate";
        } else if (tabType === "services") {
          window.location.href = "services";
        }
      }, 2000);
    });
  });

  // Add hover effects to stat cards
  const statCards = document.querySelectorAll(".property-card");
  statCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      anime({
        targets: this,
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        duration: 300,
        easing: "easeOutCubic",
      });
    });

    card.addEventListener("mouseleave", function () {
      anime({
        targets: this,
        scale: 1,
        boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
        duration: 300,
        easing: "easeOutCubic",
      });
    });
  });

  // Add floating animation to background elements
  anime({
    targets: ".floating-animation",
    translateY: [-20, 20],
    duration: 4000,
    direction: "alternate",
    loop: true,
    easing: "easeInOutSine",
  });

  // Counter animation for stats
  const animateCounter = (element, target) => {
    anime({
      targets: element,
      innerHTML: [0, target],
      duration: 2000,
      round: 1,
      easing: "easeOutCubic",
      complete: function () {
        if (target >= 1000) {
          element.innerHTML = (target / 1000).toFixed(1) + "K+";
        } else {
          element.innerHTML = target + "+";
        }
      },
    });
  };

  // Intersection Observer for counter animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counterElement = entry.target.querySelector("h3");
        const text = counterElement.textContent;
        const number = parseInt(text.replace(/[^0-9]/g, ""));

        if (text.includes("4.8")) {
          anime({
            targets: counterElement,
            innerHTML: [0, 4.8],
            duration: 2000,
            round: 10,
            easing: "easeOutCubic",
            complete: function () {
              counterElement.innerHTML = "4.8/5";
            },
          });
        } else {
          animateCounter(counterElement, number);
        }

        observer.unobserve(entry.target);
      }
    });
  });

  // Observe stat cards
  document.querySelectorAll(".property-card").forEach((card) => {
    observer.observe(card);
  });

  // Add smooth scrolling for any anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add keyboard navigation for tabs
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const activeTab = document.querySelector(".tab-btn.active");
      const tabs = Array.from(document.querySelectorAll(".tab-btn"));
      const currentIndex = tabs.indexOf(activeTab);

      let nextIndex;
      if (e.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % tabs.length;
      } else {
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      }

      tabs[nextIndex].click();
      tabs[nextIndex].focus();
    }
  });

  // Add form validation
  const forms = document.querySelectorAll(".tab-content");
  forms.forEach((form) => {
    const selects = form.querySelectorAll("select");
    selects.forEach((select) => {
      select.addEventListener("change", function () {
        if (this.value) {
          this.classList.add("border-green-300");
          this.classList.remove("border-gray-200");
        } else {
          this.classList.remove("border-green-300");
          this.classList.add("border-gray-200");
        }
      });
    });
  });

  // Add loading states for search buttons
  const addLoadingState = (button) => {
    const originalText = button.innerHTML;
    button.innerHTML =
      '<i class="fas fa-spinner fa-spin mr-2"></i>Searching...';
    button.disabled = true;

    return () => {
      button.innerHTML = originalText;
      button.disabled = false;
    };
  };

  // Enhanced search button click handlers
  document
    .getElementById("search-property")
    ?.addEventListener("click", function (e) {
      e.preventDefault();
      const resetLoading = addLoadingState(this);

      // Collect form data
      const tabContent = document.getElementById("buy-tab");
      const formData = {
        location: tabContent.querySelector("select").value,
        propertyType: tabContent.querySelectorAll("select")[1].value,
        priceRange: tabContent.querySelectorAll("select")[2].value,
        type: "buy",
      };

      // Simulate API call
      setTimeout(() => {
        resetLoading();
        // Redirect with parameters
        const params = new URLSearchParams(formData);
        window.location.href = `search?${params.toString()}`;
      }, 2000);
    });
});

// Add resize handler for responsive design
window.addEventListener("resize", function () {
  // Recalculate animations on resize
  if (window.innerWidth < 768) {
    // Mobile-specific adjustments
    document.querySelectorAll(".floating-animation").forEach((el) => {
      el.style.display = "none";
    });
  } else {
    document.querySelectorAll(".floating-animation").forEach((el) => {
      el.style.display = "block";
    });
  }
});

// Performance optimization: Lazy load background images
const lazyLoadImages = () => {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.style.backgroundImage = `url(${img.dataset.bg})`;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll("[data-bg]").forEach((img) => {
    imageObserver.observe(img);
  });
};

// Initialize lazy loading
lazyLoadImages();

