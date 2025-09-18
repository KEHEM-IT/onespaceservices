document.addEventListener("DOMContentLoaded", () => {
  const searchProperty = document.getElementById("searchBtn");
  searchProperty.addEventListener("click", () => {
    window.location.href = "search.html";
  });

  // Mobile menu toggle
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  let menuOpen = false;

  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    menuOpen = !menuOpen;
    mobileMenu.classList.toggle("hidden", !menuOpen);
    menuBtn.innerHTML = menuOpen
      ? '<i data-feather="x" class="w-7 h-7"></i>'
      : '<i data-feather="menu" class="w-7 h-7"></i>';
    feather.replace();
  });

  // FAQ Accordion
  document.querySelectorAll(".faq-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector("i");

      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        icon.classList.remove("rotate-180");
      } else {
        // close other open items
        document
          .querySelectorAll(".faq-content")
          .forEach((c) => (c.style.maxHeight = null));
        document
          .querySelectorAll(".faq-toggle i")
          .forEach((i) => i.classList.remove("rotate-180"));

        content.style.maxHeight = content.scrollHeight + "px";
        icon.classList.add("rotate-180");
      }
    });
  });

  // Desktop dropdown functionality
  const desktopDropdowns = document.querySelectorAll(".dropdown-container");
  let activeDropdown = null;

  // Wait for feather icons to be initialized
  setTimeout(() => {
    desktopDropdowns.forEach((dropdown) => {
      const button = dropdown.querySelector("button");
      const menu = dropdown.querySelector(".absolute");

      // Click handler for dropdown button
      button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if this dropdown is currently open
        const isCurrentlyOpen = menu.classList.contains("opacity-100");

        // Close all open dropdowns first
        closeAllDropdowns();

        // If this dropdown wasn't open, open it
        if (!isCurrentlyOpen) {
          openDropdown(dropdown);
        }
      });

      // Prevent dropdown from closing when clicking inside the menu
      menu.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    });
  }, 100);

  function openDropdown(dropdown) {
    const menu = dropdown.querySelector(".absolute");
    const chevron = dropdown.querySelector("button svg");

    menu.classList.remove("opacity-0", "invisible");
    menu.classList.add("opacity-100", "visible");

    // Force chevron rotation using SVG element
    if (chevron) {
      chevron.style.transform = "rotate(180deg)";
      chevron.style.transition = "transform 0.3s ease";
    }

    activeDropdown = dropdown;
  }

  function closeDropdown(dropdown) {
    const menu = dropdown.querySelector(".absolute");
    const chevron = dropdown.querySelector("button svg");

    menu.classList.remove("opacity-100", "visible");
    menu.classList.add("opacity-0", "invisible");

    // Reset chevron rotation using SVG element
    if (chevron) {
      chevron.style.transform = "rotate(0deg)";
      chevron.style.transition = "transform 0.3s ease";
    }

    if (activeDropdown === dropdown) {
      activeDropdown = null;
    }
  }

  function closeAllDropdowns() {
    desktopDropdowns.forEach((dropdown) => {
      const menu = dropdown.querySelector(".absolute");
      const chevron = dropdown.querySelector("button svg");

      menu.classList.remove("opacity-100", "visible");
      menu.classList.add("opacity-0", "invisible");

      if (chevron) {
        chevron.style.transform = "rotate(0deg)";
        chevron.style.transition = "transform 0.3s ease";
      }
    });
    activeDropdown = null;
  }

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    // Close mobile menu if clicking outside
    if (
      menuOpen &&
      !mobileMenu.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      menuOpen = false;
      mobileMenu.classList.add("hidden");
      menuBtn.innerHTML = '<i data-feather="menu" class="w-7 h-7"></i>';
      feather.replace();
    }

    // Close desktop dropdowns if clicking outside
    let clickedInsideDropdown = false;
    desktopDropdowns.forEach((dropdown) => {
      if (dropdown.contains(e.target)) {
        clickedInsideDropdown = true;
      }
    });

    if (!clickedInsideDropdown && activeDropdown) {
      closeAllDropdowns();
    }
  });

  // Mobile submenu toggle with smooth transitions
  setTimeout(() => {
    document
      .querySelectorAll('[data-toggle="mobile-submenu"]')
      .forEach((button) => {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();

          const submenu = button.nextElementSibling;
          const chevron = button.querySelector("svg");
          const isOpen = !submenu.classList.contains("hidden");

          if (isOpen) {
            // Closing animation
            submenu.style.maxHeight = "0px";
            submenu.style.opacity = "0";
            submenu.style.paddingTop = "0";
            submenu.style.paddingBottom = "0";

            setTimeout(() => {
              submenu.classList.add("hidden");
              submenu.style.maxHeight = "";
              submenu.style.opacity = "";
              submenu.style.paddingTop = "";
              submenu.style.paddingBottom = "";
            }, 300);

            // Reset chevron rotation
            if (chevron) {
              chevron.style.transform = "rotate(0deg)";
              chevron.style.transition = "transform 0.3s ease";
            }
          } else {
            // Opening animation
            submenu.classList.remove("hidden");
            submenu.style.maxHeight = "0px";
            submenu.style.opacity = "0";
            submenu.style.paddingTop = "0";
            submenu.style.paddingBottom = "0";

            // Force reflow
            submenu.offsetHeight;

            // Animate to full height
            submenu.style.maxHeight = submenu.scrollHeight + "px";
            submenu.style.opacity = "1";
            submenu.style.paddingTop = "0.5rem";
            submenu.style.paddingBottom = "0.5rem";

            // Rotate chevron
            if (chevron) {
              chevron.style.transform = "rotate(180deg)";
              chevron.style.transition = "transform 0.3s ease";
            }
          }
        });
      });
  }, 100);

  // Close dropdowns on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (activeDropdown) {
        closeAllDropdowns();
      }
      if (menuOpen) {
        menuOpen = false;
        mobileMenu.classList.add("hidden");
        menuBtn.innerHTML = '<i data-feather="menu" class="w-7 h-7"></i>';
        feather.replace();
      }
    }
  });

  // User dropdown functionality (desktop + mobile)
  const userButtons = document.querySelectorAll("#user-btn, #mobile-user-btn");

  userButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent document click from immediately closing
      const dropdown = btn.nextElementSibling;
      const isOpen = dropdown.classList.contains("opacity-100");

      // Close all other user dropdowns first
      document
        .querySelectorAll("#user-btn + div, #mobile-user-btn + div")
        .forEach((d) => {
          d.classList.remove("opacity-100", "visible");
          d.classList.add("opacity-0", "invisible");
        });

      // Toggle current dropdown
      if (!isOpen) {
        dropdown.classList.remove("opacity-0", "invisible");
        dropdown.classList.add("opacity-100", "visible");
      } else {
        dropdown.classList.remove("opacity-100", "visible");
        dropdown.classList.add("opacity-0", "invisible");
      }
    });
  });

  // Close user dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    document
      .querySelectorAll("#user-btn + div, #mobile-user-btn + div")
      .forEach((dropdown) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove("opacity-100", "visible");
          dropdown.classList.add("opacity-0", "invisible");
        }
      });
  });

  function showToast(type, message, duration = 3000) {
    let className;
    switch (type) {
      case "success":
        className = "toast-success";
        break;
      case "warning":
        className = "toast-warning";
        break;
      case "error":
        className = "toast-error";
        break;
      default:
        className = "toast-default";
    }

    Toastify({
      text: message,
      duration: duration,
      close: true,
      gravity: "bottom",
      position: "center",
      stopOnFocus: true,
      className: className,
    }).showToast();
  }

  const savedUser = JSON.parse(localStorage.getItem("userData"));

  const userData = document.querySelectorAll("[data-user]");

  if (savedUser) {
    userData.forEach((item) => {
      const profile = item.querySelector("[data-user-profile]");
      const name = item.querySelector("[data-user-name]");
      const logout = item.querySelector("[data-user-logout]");

      const firstName = savedUser.name.split(" ")[0];

      if (profile) profile.src = savedUser.profile;
      if (name) name.textContent = firstName;

      if (logout) {
        logout.addEventListener("click", () => {
          localStorage.removeItem("userData");
          showToast("warning", "You are successfully logged out.", 2000);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        });
      }
    });
  }
});
