// search-result.js
document.addEventListener("DOMContentLoaded", () => {
  let currentView = "grid";
  let displayedProperties = [];
  let currentPage = 1;
  let totalPages = 1;
  let hasNext = false;
  let hasPrevious = false;
  let totalCount = 0;
  let isLoading = false;

  // API configuration
  const API_BASE_URL = "https://onereachservices.com/api";

  // Initialize app
  function init() {
    loadPropertiesFromURL();
    setupEventListeners();
  }

  // CATEGORIES
  const architectural = document.querySelectorAll("#architectural");
  const structural = document.querySelectorAll("#structural");
  const electrical = document.querySelectorAll("#electrical");
  const mechanical = document.querySelectorAll("#mechanical");
  const plumbing = document.querySelectorAll("#plumbing");
  const interior = document.querySelectorAll("#interior");
  const landscape = document.querySelectorAll("#landscape");
  const construction = document.querySelectorAll("#construction");
  const projectManagement = document.querySelectorAll("#project-management");
  const maintenance = document.querySelectorAll("#maintenance");
  const realState = document.querySelectorAll("#real-state");

  architectural.forEach((item) => {
  });
  // Get URL parameters
  function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams) {
      params[key] = value;
    }
    return params;
  }

  // Load properties based on URL parameters
  function loadPropertiesFromURL() {
    const params = getUrlParams();

    if (Object.keys(params).length === 0) {
      // No search parameters, show empty state or default properties
      showEmptyState();
      return;
    }

    fetchProperties(params, 1);
  }

  // Fetch properties from API
  async function fetchProperties(searchParams, page = 1) {
    if (isLoading) return;

    isLoading = true;
    showLoadingState();

    try {
      // Build API URL with search parameters
      const apiParams = new URLSearchParams(searchParams);
      apiParams.set("page", page);

      const apiUrl = `${API_BASE_URL}/properties?${apiParams.toString()}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add any authentication headers if needed
          // 'Authorization': 'Bearer your-token'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Update pagination info
      currentPage = data.current_page || page;
      totalPages = data.num_pages || 1;
      hasNext = data.has_next || false;
      hasPrevious = data.has_previous || false;
      totalCount = data.count || 0;

      // Update displayed properties
      if (page === 1) {
        // New search - replace all properties
        displayedProperties = data.results || [];
      } else {
        // Load more - append to existing properties
        displayedProperties = [...displayedProperties, ...(data.results || [])];
      }

      hideLoadingState();
      renderProperties();
      updateResultsInfo();
      updateLoadMoreButton();
    } catch (error) {
      console.error("Error fetching properties:", error);
      hideLoadingState();
      showErrorState(error.message);
    } finally {
      isLoading = false;
    }
  }

  // Show loading state
  function showLoadingState() {
    const loadingState = document.getElementById("loadingState");
    const propertyGrid = document.getElementById("propertyGrid");

    if (loadingState) {
      loadingState.classList.remove("hidden");
    }
    if (propertyGrid) {
      propertyGrid.style.display = "none";
    }
  }

  // Hide loading state
  function hideLoadingState() {
    const loadingState = document.getElementById("loadingState");
    const propertyGrid = document.getElementById("propertyGrid");

    if (loadingState) {
      loadingState.classList.add("hidden");
    }
    if (propertyGrid) {
      propertyGrid.style.display = currentView === "grid" ? "grid" : "block";
    }
  }

  // Show empty state
  function showEmptyState() {
    const propertyGrid = document.getElementById("propertyGrid");
    if (propertyGrid) {
      propertyGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <div class="text-gray-400 mb-4">
            <i class="fas fa-search text-6xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-600 mb-2">No search criteria provided</h3>
          <p class="text-gray-500">Please use the search form to find properties.</p>
          <a href="index.html" class="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-lg hover:bg-darkPrimary transition-colors">
            Back to Search
          </a>
        </div>
      `;
    }
  }

  // Show error state
  function showErrorState(message) {
    const propertyGrid = document.getElementById("propertyGrid");
    if (propertyGrid) {
      propertyGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <div class="text-red-400 mb-4">
            <i class="fas fa-exclamation-triangle text-6xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-600 mb-2">Error Loading Properties</h3>
          <p class="text-gray-500 mb-4">${message}</p>
          <button onclick="location.reload()" class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-darkPrimary transition-colors">
            Try Again
          </button>
        </div>
      `;
    }
  }

  // Update results info
  function updateResultsInfo() {
    const resultsInfo = document.getElementById("resultsInfo");
    if (resultsInfo) {
      const startItem =
        displayedProperties.length === 0 ? 0 : (currentPage - 1) * 10 + 1;
      const endItem = Math.min(displayedProperties.length, totalCount);
      resultsInfo.textContent = `Showing ${startItem}-${endItem} of ${totalCount} properties`;
    }
  }

  // Update load more button
  function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById("loadMore");
    if (loadMoreBtn) {
      if (hasNext && !isLoading) {
        loadMoreBtn.style.display = "block";
        loadMoreBtn.innerHTML = "Load More Properties";
        loadMoreBtn.disabled = false;
      } else {
        loadMoreBtn.style.display = "none";
      }
    }
  }

  // Setup event listeners
  function setupEventListeners() {
    // Search button - reload with new search
    const searchBtn = document.getElementById("searchBtn");
    if (searchBtn) {
      searchBtn.addEventListener("click", performSearch);
    }

    // View toggle
    const gridViewBtn = document.getElementById("gridView");
    const listViewBtn = document.getElementById("listView");

    if (gridViewBtn) {
      gridViewBtn.addEventListener("click", () => toggleView("grid"));
    }
    if (listViewBtn) {
      listViewBtn.addEventListener("click", () => toggleView("list"));
    }

    // Filters toggle
    const filtersToggle = document.getElementById("filtersToggle");
    if (filtersToggle) {
      filtersToggle.addEventListener("click", toggleFilters);
    }

    // Sort
    const sortBy = document.getElementById("sortBy");
    if (sortBy) {
      sortBy.addEventListener("change", sortProperties);
    }

    // Load more
    const loadMoreBtn = document.getElementById("loadMore");
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", loadMoreProperties);
    }

    // Modal close
    const modal = document.getElementById("propertyModal");
    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) {
          closeModal();
        }
      });
    }
  }

  // Perform new search
  function performSearch() {
    // This would typically get new search parameters from form
    // For now, just reload the current search
    const params = getUrlParams();
    currentPage = 1;
    fetchProperties(params, 1);
  }

  // Toggle view
  function toggleView(view) {
    currentView = view;
    const gridBtn = document.getElementById("gridView");
    const listBtn = document.getElementById("listView");
    const grid = document.getElementById("propertyGrid");

    if (!gridBtn || !listBtn || !grid) return;

    if (view === "grid") {
      gridBtn.classList.add("bg-primary", "text-white");
      gridBtn.classList.remove("text-gray-600");
      listBtn.classList.remove("bg-primary", "text-white");
      listBtn.classList.add("text-gray-600");
      grid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
    } else {
      listBtn.classList.add("bg-primary", "text-white");
      listBtn.classList.remove("text-gray-600");
      gridBtn.classList.remove("bg-primary", "text-white");
      gridBtn.classList.add("text-gray-600");
      grid.className = "space-y-6";
    }
    renderProperties();
  }

  // Toggle filters
  function toggleFilters() {
    const panel = document.getElementById("filtersPanel");
    if (panel) {
      panel.classList.toggle("hidden");
    }
  }

  // Sort properties
  function sortProperties() {
    const sortBy = document.getElementById("sortBy");
    if (!sortBy) return;

    const sortValue = sortBy.value;

    switch (sortValue) {
      case "price-low":
        displayedProperties.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        displayedProperties.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        displayedProperties.sort((a, b) => b.id - a.id);
        break;
      case "area":
        displayedProperties.sort((a, b) => b.area - a.area);
        break;
      default:
        // Keep original order
        break;
    }
    renderProperties();
  }

  // Create property card
  function createPropertyCard(property) {
    const isListView = currentView === "list";
    const card = document.createElement("div");

    if (isListView) {
      card.className =
        "property-card bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300";
      card.innerHTML = `
                    <div class="md:flex">
                        <div class="md:w-1/3 relative">
                            <img src="${
                              property.image || property.images?.[0] || ""
                            }" alt="${
        property.title
      }" class="w-full h-64 md:h-full object-cover">
                            <div class="absolute top-4 left-4">
                                <span class="bg-primary/90 text-white px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm">
                                    ${property.type}
                                </span>
                            </div>
                            <button class="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300">
                                <i class="far fa-heart text-gray-600 hover:text-red-500"></i>
                            </button>
                        </div>
                        <div class="md:w-2/3 p-6 flex flex-col justify-between">
                            <div>
                                <h3 class="text-xl font-bold text-gray-800 mb-2">${
                                  property.title
                                }</h3>
                                <p class="text-gray-600 mb-4 flex items-center">
                                    <i class="fas fa-map-marker-alt text-primary mr-2"></i>
                                    ${property.location}
                                </p>
                                <div class="flex items-center justify-between mb-4">
                                    <span class="text-3xl font-bold text-primary">৳${property.price.toLocaleString()}</span>
                                    <div class="flex items-center space-x-4 text-gray-600">
                                        <span class="flex items-center"><i class="fas fa-bed mr-1"></i>${
                                          property.bedrooms
                                        }</span>
                                        <span class="flex items-center"><i class="fas fa-bath mr-1"></i>${
                                          property.bathrooms
                                        }</span>
                                        <span class="flex items-center"><i class="fas fa-expand mr-1"></i>${
                                          property.area
                                        } sqft</span>
                                    </div>
                                </div>
                                <p class="text-gray-600 mb-4 line-clamp-2">${
                                  property.description
                                }</p>
                                <div class="flex flex-wrap gap-2 mb-4">
                                    ${(property.features || [])
                                      .slice(0, 4)
                                      .map(
                                        (feature) =>
                                          `<span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">${feature}</span>`
                                      )
                                      .join("")}
                                    ${
                                      (property.features || []).length > 4
                                        ? `<span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">+${
                                            property.features.length - 4
                                          } more</span>`
                                        : ""
                                    }
                                </div>
                            </div>
                            <div class="flex space-x-3">
                                <button class="flex-1 bg-primary hover:bg-darkPrimary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                                    <i class="fas fa-phone mr-2"></i>Contact
                                </button>
                                <button class="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                                    <i class="fas fa-calendar mr-2"></i>Visit
                                </button>
                            </div>
                        </div>
                    </div>
                `;
    } else {
      card.className =
        "property-card bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group";
      card.innerHTML = `
                    <div class="relative overflow-hidden">
                        <img src="${
                          property.image || property.images?.[0] || ""
                        }" alt="${
        property.title
      }" class="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500">
                        <div class="absolute top-4 left-4">
                            <span class="bg-primary/90 text-white px-3 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm">
                                ${property.type}
                            </span>
                        </div>
                        <button class="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300">
                            <i class="far fa-heart text-gray-600 hover:text-red-500"></i>
                        </button>
                        <div class="absolute bottom-4 right-4">
                            <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                ৳${property.price.toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">${
                          property.title
                        }</h3>
                        <p class="text-gray-600 mb-4 flex items-center">
                            <i class="fas fa-map-marker-alt text-primary mr-2"></i>
                            ${property.location}
                        </p>
                        <div class="flex items-center justify-between mb-4 text-gray-600">
                            <span class="flex items-center"><i class="fas fa-bed mr-2 text-primary"></i>${
                              property.bedrooms
                            } Bed</span>
                            <span class="flex items-center"><i class="fas fa-bath mr-2 text-primary"></i>${
                              property.bathrooms
                            } Bath</span>
                            <span class="flex items-center"><i class="fas fa-expand mr-2 text-primary"></i>${
                              property.area
                            } sqft</span>
                        </div>
                        <div class="flex flex-wrap gap-2 mb-6">
                            ${(property.features || [])
                              .slice(0, 3)
                              .map(
                                (feature) =>
                                  `<span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs">${feature}</span>`
                              )
                              .join("")}
                            ${
                              (property.features || []).length > 3
                                ? `<span class="bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs">+${
                                    property.features.length - 3
                                  } more</span>`
                                : ""
                            }
                        </div>
                        <div class="flex space-x-3">
                            <button class="flex-1 bg-primary hover:bg-darkPrimary text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105">
                                <i class="fas fa-phone mr-2"></i>Contact
                            </button>
                            <button class="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300">
                                <i class="fas fa-eye mr-2"></i>View
                            </button>
                        </div>
                    </div>
                `;
    }

    card.addEventListener("click", () => openPropertyModal(property));
    return card;
  }

  // Render properties
  function renderProperties() {
    const grid = document.getElementById("propertyGrid");
    if (!grid) return;

    if (displayedProperties.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full text-center py-12">
          <div class="text-gray-400 mb-4">
            <i class="fas fa-home text-6xl"></i>
          </div>
          <h3 class="text-xl font-semibold text-gray-600 mb-2">No properties found</h3>
          <p class="text-gray-500">Try adjusting your search criteria.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = "";

    displayedProperties.forEach((property, index) => {
      const card = createPropertyCard(property);
      card.style.animationDelay = `${index * 0.1}s`;
      card.classList.add("animate-fade-in");
      grid.appendChild(card);
    });
  }

  // Open property modal
  function openPropertyModal(property) {
    const modal = document.getElementById("propertyModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalContent = document.getElementById("modalContent");

    if (!modal || !modalTitle || !modalContent) return;

    modalTitle.textContent = property.title;
    modalContent.innerHTML = `
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <!-- Image Gallery -->
                        <div class="swiper propertySwiper mb-6 rounded-xl overflow-hidden">
                            <div class="swiper-wrapper">
                                ${(property.images || [property.image])
                                  .filter((img) => img)
                                  .map(
                                    (image, index) => `
                                    <div class="swiper-slide">
                                        <img src="${image}" alt="${
                                      property.title
                                    } - Image ${
                                      index + 1
                                    }" class="w-full h-80 object-cover">
                                    </div>
                                `
                                  )
                                  .join("")}
                            </div>
                            <div class="swiper-pagination"></div>
                            <div class="swiper-button-next"></div>
                            <div class="swiper-button-prev"></div>
                        </div>
                        
                        <!-- Quick Stats -->
                        <div class="grid grid-cols-3 gap-4">
                            <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center">
                                <i class="fas fa-bed text-2xl text-primary mb-2"></i>
                                <p class="text-gray-600 text-sm">Bedrooms</p>
                                <p class="font-bold text-lg">${
                                  property.bedrooms
                                }</p>
                            </div>
                            <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center">
                                <i class="fas fa-bath text-2xl text-green-600 mb-2"></i>
                                <p class="text-gray-600 text-sm">Bathrooms</p>
                                <p class="font-bold text-lg">${
                                  property.bathrooms
                                }</p>
                            </div>
                            <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center">
                                <i class="fas fa-expand text-2xl text-purple-600 mb-2"></i>
                                <p class="text-gray-600 text-sm">Area</p>
                                <p class="font-bold text-lg">${
                                  property.area
                                } sqft</p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <!-- Price & Location -->
                        <div class="mb-6">
                            <div class="flex items-center justify-between mb-4">
                                <span class="text-4xl font-bold text-primary">৳${property.price.toLocaleString()}</span>
                                <span class="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
                                    ${property.type}
                                </span>
                            </div>
                            <p class="text-gray-600 flex items-center text-lg">
                                <i class="fas fa-map-marker-alt text-primary mr-2"></i>
                                ${property.location}
                            </p>
                        </div>
                        
                        <!-- Description -->
                        <div class="mb-6">
                            <h4 class="text-lg font-semibold text-gray-800 mb-3">Description</h4>
                            <p class="text-gray-600 leading-relaxed">${
                              property.description
                            }</p>
                        </div>
                        
                        <!-- Features -->
                        <div class="mb-8">
                            <h4 class="text-lg font-semibold text-gray-800 mb-4">Features & Amenities</h4>
                            <div class="grid grid-cols-2 gap-3">
                                ${(property.features || [])
                                  .map(
                                    (feature) =>
                                      `<div class="flex items-center p-3 bg-gray-50 rounded-lg">
                                        <i class="fas fa-check-circle text-green-500 mr-3"></i>
                                        <span class="text-gray-700">${feature}</span>
                                    </div>`
                                  )
                                  .join("")}
                            </div>
                        </div>
                        
                        <!-- Action Buttons -->
                        <div class="flex space-x-4">
                            <button class="flex-1 bg-gradient-to-r from-primary to-darkPrimary text-white font-bold py-4 px-6 rounded-xl hover:from-darkPrimary hover:to-primary transition-all duration-300 transform hover:scale-105">
                                <i class="fas fa-phone mr-2"></i>Contact Agent
                            </button>
                            <button class="flex-1 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold py-4 px-6 rounded-xl transition-all duration-300">
                                <i class="fas fa-calendar-alt mr-2"></i>Schedule Tour
                            </button>
                        </div>
                        
                        <!-- Contact Info -->
                        <div class="mt-6 p-4 bg-gray-50 rounded-xl">
                            <div class="flex items-center">
                                <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                                    <i class="fas fa-user text-white"></i>
                                </div>
                                <div>
                                    <p class="font-semibold text-gray-800">Property Agent</p>
                                    <p class="text-gray-600">+8801712757397</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    // Initialize Swiper
    setTimeout(() => {
      if (typeof Swiper !== "undefined") {
        new Swiper(".propertySwiper", {
          loop: true,
          autoplay: {
            delay: 4000,
            disableOnInteraction: false,
          },
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          effect: "fade",
          fadeEffect: {
            crossFade: true,
          },
        });
      }
    }, 100);
  }

  // Close modal
  function closeModal() {
    const modal = document.getElementById("propertyModal");
    if (modal) {
      modal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  }

  // Load more properties
  function loadMoreProperties() {
    if (!hasNext || isLoading) return;

    const loadMoreBtn = document.getElementById("loadMore");
    if (loadMoreBtn) {
      loadMoreBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';
      loadMoreBtn.disabled = true;
    }

    const params = getUrlParams();
    fetchProperties(params, currentPage + 1);
  }

  // Initialize the app
  init();
});
