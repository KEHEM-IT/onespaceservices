// search.js
document.addEventListener("DOMContentLoaded", () => {
  const searchProperty = document.getElementById("searchBtn");

  // Function to get URL parameters
  function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams) {
      params[key] = value;
    }
    return params;
  }

  // Function to populate form fields based on URL parameters
  function populateFromUrl() {
    const params = getUrlParams();

    // If no parameters, return early
    if (Object.keys(params).length === 0) return;

    // Get the tab type from URL params
    const tabType = params.type;

    if (tabType) {
      // Switch to the correct tab
      switchTab(tabType);

      // Small delay to ensure tab content is visible before populating
      setTimeout(() => {
        // Get the active tab content
        const activeTab = document.getElementById(`${tabType}-tab`);

        if (activeTab) {
          // Find all select elements in the active tab
          const selects = activeTab.querySelectorAll("select");

          // Define fallback parameter names for each tab type
          const fallbackNames = {
            buy: ["location", "property_type", "price_range"],
            rent: ["location", "property_type", "monthly_rent"],
            roommate: [
              "location",
              "accommodation_type",
              "gender_preference",
              "occupation",
            ],
            services: ["service_category", "location", "service_type"],
          };

          selects.forEach((select, index) => {
            // Try to get parameter name from label first
            const label = select.closest(".relative").querySelector("label");
            let paramName = "";

            if (label) {
              paramName = label.textContent
                .trim()
                .toLowerCase()
                .replace(/\s+/g, "_")
                .replace(/[^a-z0-9_]/g, "");
            }

            // Use fallback name if label-based name doesn't exist in params
            if (
              !params[paramName] &&
              fallbackNames[tabType] &&
              fallbackNames[tabType][index]
            ) {
              paramName = fallbackNames[tabType][index];
            }

            // Set the select value if parameter exists
            if (params[paramName]) {
              select.value = params[paramName];
            }
          });
        }
      }, 100);
    }
  }

  // Switch tabs
  function switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll(".tab-btn").forEach((btn) => {
      if (btn.dataset.tab === tab) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update content
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.add("hidden");
    });
    document.getElementById(`${tab}-tab`).classList.remove("hidden");
  }

  // Tab navigation
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  // Populate form fields from URL on page load
  populateFromUrl();

  searchProperty.addEventListener("click", () => {
    // Find the active tab content
    const activeTab = document.querySelector(".tab-content:not(.hidden)");

    if (!activeTab) return;

    // Get the active tab type
    const activeTabId = activeTab.id;
    let tabType = activeTabId.replace("-tab", "");

    // Collect all <select> inputs inside the active tab
    const selects = activeTab.querySelectorAll("select");

    // Build query params
    const params = new URLSearchParams();

    // Add tab type to identify which search type is being used
    params.append("type", tabType);

    selects.forEach((select, index) => {
      if (
        select.value &&
        select.value !== "Select Your Location" &&
        select.value !== "Property Type" &&
        select.value !== "Budget Range" &&
        select.value !== "Rent Budget" &&
        select.value !== "Accommodation Type" &&
        select.value !== "Gender Preference" &&
        select.value !== "Select Occupation" &&
        select.value !== "Select Service" &&
        select.value !== "Service Type"
      ) {
        // Get the label text and create a proper parameter name
        const label = select.closest(".relative").querySelector("label");
        let paramName = "";

        if (label) {
          paramName = label.textContent
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, ""); // Remove special characters
        } else {
          // Fallback parameter names based on tab type and position
          const fallbackNames = {
            buy: ["location", "property_type", "price_range"],
            rent: ["location", "property_type", "monthly_rent"],
            roommate: [
              "location",
              "accommodation_type",
              "gender_preference",
              "occupation",
            ],
            services: ["service_category", "location", "service_type"],
          };
          paramName = fallbackNames[tabType]?.[index] || `param_${index}`;
        }

        params.append(paramName, select.value);
      }
    });

    // Only redirect if we have parameters other than just the type
    if (params.toString().split("&").length > 1) {
      // Redirect with query string
      window.location.href = `search.html?${params.toString()}`;
    } else {
      // Show an alert or message that user needs to select at least one option
      alert("Please select at least one search criteria before searching.");
    }
  });
});
