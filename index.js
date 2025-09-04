// Property Search Results Functionality
class PropertySearchManager {
  constructor() {
    this.properties = [];
    this.filteredProperties = [];
    this.currentView = "grid";
    this.favorites = JSON.parse(
      localStorage.getItem("favoriteProperties") || "[]"
    );

    this.init();
  }

  init() {
    this.loadProperties();
    this.bindEvents();
    this.updateFavoriteButtons();
  }

  // Load property data from DOM
  loadProperties() {
    const propertyCards = document.querySelectorAll(".property-card");
    this.properties = Array.from(propertyCards).map((card, index) => ({
      id: index + 1,
      element: card,
      price: parseInt(card.dataset.price) || 0,
      bedrooms: parseInt(card.dataset.bedrooms) || 0,
      area: parseInt(card.dataset.area) || 0,
      date: new Date(card.dataset.date || Date.now()),
      type: card.dataset.type || "",
      title: card.querySelector("h3")?.textContent || "",
      location:
        card
          .querySelector(".fa-map-marker-alt")
          ?.parentElement?.textContent?.trim() || "",
    }));

    this.filteredProperties = [...this.properties];
    this.updatePropertyCount();
  }

  // Bind all event listeners
  bindEvents() {
    // Filter toggle
    document
      .getElementById("filterToggle")
      ?.addEventListener("click", this.toggleAdvancedFilters.bind(this));

    // View toggle
    document
      .getElementById("gridView")
      ?.addEventListener("click", () => this.switchView("grid"));
    document
      .getElementById("listView")
      ?.addEventListener("click", () => this.switchView("list"));

    // Sorting
    document
      .getElementById("sortSelect")
      ?.addEventListener("change", this.handleSort.bind(this));

    // Filter actions
    document
      .getElementById("applyFilters")
      ?.addEventListener("click", this.applyFilters.bind(this));
    document
      .getElementById("clearFilters")
      ?.addEventListener("click", this.clearFilters.bind(this));

    // Favorite buttons
    document.addEventListener("click", (e) => {
      if (e.target.closest(".favorite-btn")) {
        this.toggleFavorite(e.target.closest(".favorite-btn"));
      }
    });

    // Save search
    document
      .querySelector(".bg-blue-600.hover\\:bg-blue-700")
      ?.addEventListener("click", this.saveSearch.bind(this));
  }

  // Toggle advanced filters visibility
  toggleAdvancedFilters() {
    const filtersDiv = document.getElementById("advancedFilters");
    const toggleBtn = document.getElementById("filterToggle");

    if (filtersDiv && toggleBtn) {
      const isHidden = filtersDiv.classList.contains("hidden");

      if (isHidden) {
        filtersDiv.classList.remove("hidden");
        toggleBtn.innerHTML = '<i class="fas fa-filter mr-2"></i>Hide Filters';
        filtersDiv.style.opacity = "0";
        filtersDiv.style.transform = "translateY(-10px)";

        setTimeout(() => {
          filtersDiv.style.transition = "all 0.3s ease";
          filtersDiv.style.opacity = "1";
          filtersDiv.style.transform = "translateY(0)";
        }, 10);
      } else {
        filtersDiv.style.transition = "all 0.3s ease";
        filtersDiv.style.opacity = "0";
        filtersDiv.style.transform = "translateY(-10px)";

        setTimeout(() => {
          filtersDiv.classList.add("hidden");
          toggleBtn.innerHTML =
            '<i class="fas fa-filter mr-2"></i>Advanced Filters';
        }, 300);
      }
    }
  }

  // Switch between grid and list view
  switchView(viewType) {
    this.currentView = viewType;
    const container = document.getElementById("propertiesContainer");
    const gridBtn = document.getElementById("gridView");
    const listBtn = document.getElementById("listView");

    if (!container) return;

    if (viewType === "grid") {
      container.className =
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
      gridBtn?.classList.add("bg-blue-50", "text-blue-600");
      gridBtn?.classList.remove("text-gray-700");
      listBtn?.classList.remove("bg-blue-50", "text-blue-600");
      listBtn?.classList.add("text-gray-700");

      // Reset any list-specific styling
      this.filteredProperties.forEach((property) => {
        property.element.classList.remove("flex-row", "items-center");
        const img = property.element.querySelector("img");
        const content = property.element.querySelector(".p-6");
        if (img) img.style.width = "";
        if (content) content.style.flex = "";
      });
    } else {
      container.className = "space-y-4";
      listBtn?.classList.add("bg-blue-50", "text-blue-600");
      listBtn?.classList.remove("text-gray-700");
      gridBtn?.classList.remove("bg-blue-50", "text-blue-600");
      gridBtn?.classList.add("text-gray-700");

      // Apply list styling
      this.filteredProperties.forEach((property) => {
        property.element.classList.add("flex", "flex-row", "items-center");
        const img = property.element.querySelector("img");
        const content = property.element.querySelector(".p-6");
        if (img) {
          img.style.width = "200px";
          img.style.height = "150px";
          img.style.flexShrink = "0";
        }
        if (content) {
          content.style.flex = "1";
        }
      });
    }
  }

  // Handle sorting
  handleSort(e) {
    const sortValue = e.target.value;
    let sorted = [...this.filteredProperties];

    switch (sortValue) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sorted.sort((a, b) => b.date - a.date);
        break;
      case "oldest":
        sorted.sort((a, b) => a.date - b.date);
        break;
      case "area-large":
        sorted.sort((a, b) => b.area - a.area);
        break;
      case "area-small":
        sorted.sort((a, b) => a.area - b.area);
        break;
      case "bedrooms":
        sorted.sort((a, b) => b.bedrooms - a.bedrooms);
        break;
      default:
        // Keep original order for "Most Relevant"
        break;
    }

    this.filteredProperties = sorted;
    this.renderProperties();
  }

  // Apply filters
  applyFilters() {
    const minPrice = parseInt(document.getElementById("minPrice")?.value) || 0;
    const maxPrice =
      parseInt(document.getElementById("maxPrice")?.value) || Infinity;
    const minBedrooms =
      parseInt(document.getElementById("bedroomFilter")?.value) || 0;
    const minArea = parseInt(document.getElementById("areaFilter")?.value) || 0;
    const propertyType = document.getElementById("typeFilter")?.value || "";

    this.filteredProperties = this.properties.filter((property) => {
      return (
        property.price >= minPrice &&
        property.price <= maxPrice &&
        property.bedrooms >= minBedrooms &&
        property.area >= minArea &&
        (propertyType === "" || property.type === propertyType)
      );
    });

    this.renderProperties();
    this.updatePropertyCount();

    // Show filter applied notification
    this.showNotification("Filters applied successfully!", "success");
  }

  // Clear all filters
  clearFilters() {
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    document.getElementById("bedroomFilter").value = "";
    document.getElementById("areaFilter").value = "";
    document.getElementById("typeFilter").value = "";
    document.getElementById("sortSelect").value = "default";

    this.filteredProperties = [...this.properties];
    this.renderProperties();
    this.updatePropertyCount();

    this.showNotification("Filters cleared!", "info");
  }

  // Render filtered properties
  renderProperties() {
    const container = document.getElementById("propertiesContainer");
    if (!container) return;

    // Hide all properties first
    this.properties.forEach((property) => {
      property.element.style.display = "none";
    });

    // Show filtered properties in order
    this.filteredProperties.forEach((property, index) => {
      property.element.style.display = "block";
      property.element.style.order = index;
      container.appendChild(property.element);
    });

    // Reapply current view styling
    this.switchView(this.currentView);
  }

  // Update property count display
  updatePropertyCount() {
    const countElement = document.getElementById("totalProperties");
    if (countElement) {
      const count = this.filteredProperties.length;
      countElement.textContent = `${count} ${
        count === 1 ? "property" : "properties"
      }`;
    }
  }

  // Toggle favorite status
  toggleFavorite(button) {
    const propertyId = button.dataset.propertyId;
    const icon = button.querySelector("i");

    if (!propertyId || !icon) return;

    if (this.favorites.includes(propertyId)) {
      this.favorites = this.favorites.filter((id) => id !== propertyId);
      icon.className = "far fa-heart text-gray-600";
      this.showNotification("Removed from favorites", "info");
    } else {
      this.favorites.push(propertyId);
      icon.className = "fas fa-heart text-red-500";
      this.showNotification("Added to favorites", "success");
    }

    localStorage.setItem("favoriteProperties", JSON.stringify(this.favorites));
  }

  // Update favorite button states on load
  updateFavoriteButtons() {
    document.querySelectorAll(".favorite-btn").forEach((button) => {
      const propertyId = button.dataset.propertyId;
      const icon = button.querySelector("i");

      if (this.favorites.includes(propertyId) && icon) {
        icon.className = "fas fa-heart text-red-500";
      }
    });
  }

  // Save search functionality
  saveSearch() {
    const searchData = {
      timestamp: new Date().toISOString(),
      location: "Dhaka",
      filters: {
        minPrice: document.getElementById("minPrice")?.value || "",
        maxPrice: document.getElementById("maxPrice")?.value || "",
        bedrooms: document.getElementById("bedroomFilter")?.value || "",
        area: document.getElementById("areaFilter")?.value || "",
        type: document.getElementById("typeFilter")?.value || "",
      },
      sortBy: document.getElementById("sortSelect")?.value || "default",
    };

    const savedSearches = JSON.parse(
      localStorage.getItem("savedSearches") || "[]"
    );
    savedSearches.push(searchData);
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

    this.showNotification("Search saved successfully!", "success");
  }

  // Show notification
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-x-full`;

    const bgColor =
      type === "success"
        ? "bg-green-500"
        : type === "error"
        ? "bg-red-500"
        : "bg-blue-500";
    notification.classList.add(bgColor, "text-white");

    notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-${
                  type === "success"
                    ? "check"
                    : type === "error"
                    ? "times"
                    : "info"
                } mr-2"></i>
                <span>${message}</span>
                <button class="ml-4 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 100);

    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Enhanced property card interactions
class PropertyCardEnhancements {
  constructor() {
    this.init();
  }

  init() {
    this.addHoverEffects();
    this.addImageGallery();
    this.addQuickViewModal();
  }

  addHoverEffects() {
    document.querySelectorAll(".property-card").forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-5px)";
        card.style.transition = "all 0.3s ease";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
      });
    });
  }

  addImageGallery() {
    // Add image navigation dots (simulated for demo)
    document.querySelectorAll(".property-card img").forEach((img) => {
      const container = img.parentElement;
      if (!container.querySelector(".image-dots")) {
        const dots = document.createElement("div");
        dots.className =
          "image-dots absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1";

        for (let i = 0; i < 3; i++) {
          const dot = document.createElement("div");
          dot.className = `w-2 h-2 rounded-full ${
            i === 0 ? "bg-white" : "bg-white/50"
          } cursor-pointer transition-all`;
          dots.appendChild(dot);
        }

        container.appendChild(dots);
      }
    });
  }

  addQuickViewModal() {
    document.querySelectorAll(".property-card button").forEach((button) => {
      if (button.textContent.includes("View Details")) {
        button.addEventListener("click", (e) => {
          e.preventDefault();
          this.showQuickViewModal(button.closest(".property-card"));
        });
      }
    });
  }

  showQuickViewModal(card) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4";

    const title = card.querySelector("h3")?.textContent || "Property Details";
    const location =
      card
        .querySelector(".fa-map-marker-alt")
        ?.parentElement?.textContent?.trim() || "";
    const price = card.querySelector(".text-2xl")?.textContent || "";
    const imgSrc = card.querySelector("img")?.src || "";

    modal.innerHTML = `
            <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="relative">
                    <img src="${imgSrc}" alt="Property" class="w-full h-64 object-cover rounded-t-xl">
                    <button class="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100" onclick="this.closest('.fixed').remove()">
                        <i class="fas fa-times text-gray-600"></i>
                    </button>
                </div>
                <div class="p-6">
                    <h2 class="text-2xl font-bold mb-2">${title}</h2>
                    <p class="text-gray-600 mb-4">${location}</p>
                    <div class="text-3xl font-bold text-blue-600 mb-6">${price}</div>
                    
                    <div class="grid grid-cols-2 gap-4 mb-6">
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="font-semibold mb-2">Property Features</h3>
                            <ul class="text-sm text-gray-600 space-y-1">
                                <li>• Air Conditioning</li>
                                <li>• Parking Available</li>
                                <li>• Security System</li>
                                <li>• Modern Kitchen</li>
                            </ul>
                        </div>
                        <div class="bg-gray-50 p-4 rounded-lg">
                            <h3 class="font-semibold mb-2">Nearby Amenities</h3>
                            <ul class="text-sm text-gray-600 space-y-1">
                                <li>• Shopping Mall - 0.5km</li>
                                <li>• School - 0.8km</li>
                                <li>• Hospital - 1.2km</li>
                                <li>• Metro Station - 0.3km</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="flex gap-3">
                        <button class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors">
                            <i class="fas fa-phone mr-2"></i>Contact Owner
                        </button>
                        <button class="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors">
                            <i class="fas fa-calendar mr-2"></i>Schedule Visit
                        </button>
                    </div>
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    // Animate in
    modal.style.opacity = "0";
    setTimeout(() => {
      modal.style.transition = "opacity 0.3s ease";
      modal.style.opacity = "1";
    }, 10);

    // Close on backdrop click
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PropertySearchManager();
  new PropertyCardEnhancements();
});

// Utility function for price formatting
function formatPrice(price) {
  return new Intl.NumberFormat("bn-BD", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 0,
  })
    .format(price)
    .replace("BDT", "৳");
}

// Utility function for area formatting
function formatArea(area) {
  return new Intl.NumberFormat("en-US").format(area) + " sqft";
}

