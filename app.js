import { fetchProducts } from "./api.js";

// Product store elements
const productContainer = document.getElementById("product-list");
const searchInput = document.getElementById("search");
const categoryTabs = document.getElementById("category-tabs");
const sortSelect = document.getElementById("sort");
const loading = document.getElementById("loading");
const errorBanner = document.getElementById("error-banner");
const cartCount = document.getElementById("cart-count");

// Contact form elements
const form = document.getElementById("contactForm");
const statusMessage = document.getElementById("form-status");

// Modal elements
const dialog = document.getElementById("infoDialog");
const openButton = document.getElementById("openDialog");
const closeButton = document.getElementById("closeDialog");

// Application state
let products = [];
let selectedCategory = "all";
let searchText = "";
let sortOrder = "default";

// Load cart safely from localStorage
function loadCart() {
  try {
    const savedCart = JSON.parse(
      localStorage.getItem("product-cart") || "[]"
    );

    return Array.isArray(savedCart) ? savedCart : [];
  } catch (error) {
    console.error("Could not read saved cart:", error);
    return [];
  }
}

let cart = loadCart();

// Save cart and update count
function saveCart() {
  try {
    localStorage.setItem("product-cart", JSON.stringify(cart));
    updateCartCount();
  } catch (error) {
    console.error("Could not save cart:", error);
    errorBanner.textContent =
      "Your cart could not be saved in this browser.";
    errorBanner.hidden = false;
  }
}

function updateCartCount() {
  const total = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  cartCount.textContent = String(total);
}

// Render products after search, category, and sorting
function renderProducts() {
  let filteredProducts = [...products];

  if (searchText) {
    filteredProducts = filteredProducts.filter(product =>
      product.title.toLowerCase().includes(searchText.toLowerCase())
    );
  }

  if (selectedCategory !== "all") {
    filteredProducts = filteredProducts.filter(
      product => product.category === selectedCategory
    );
  }

  if (sortOrder === "low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOrder === "name") {
    filteredProducts.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }

  productContainer.replaceChildren();

  if (filteredProducts.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No products found.";
    productContainer.appendChild(message);
    return;
  }

  filteredProducts.forEach(product => {
    const article = document.createElement("article");
    article.className = "product-card";

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.title;
    image.loading = "lazy";

    const title = document.createElement("h3");
    title.textContent = product.title;

    const price = document.createElement("p");
    price.textContent = `$${product.price.toFixed(2)}`;

    const category = document.createElement("p");
    category.textContent = product.category;

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.textContent = "Add to Cart";
    addButton.addEventListener("click", () => addToCart(product));

    article.append(image, title, price, category, addButton);
    productContainer.appendChild(article);
  });
}

// Add product to cart
function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1
    });
  }

  saveCart();
}

// Create category filter buttons
function renderCategoryTabs() {
  const categories = [
    "all",
    ...new Set(products.map(product => product.category))
  ];

  categoryTabs.replaceChildren();

  categories.forEach(category => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent =
      category === "all" ? "All Products" : category;

    button.setAttribute(
      "aria-pressed",
      String(category === selectedCategory)
    );

    button.addEventListener("click", () => {
      selectedCategory = category;
      renderCategoryTabs();
      renderProducts();
    });

    categoryTabs.appendChild(button);
  });
}

// Fetch API data and handle loading/errors
async function loadProducts() {
  loading.hidden = false;
  errorBanner.hidden = true;
  productContainer.replaceChildren();

  try {
    products = await fetchProducts();
    renderCategoryTabs();
    renderProducts();
  } catch (error) {
    console.error("Product loading failed:", error);
    errorBanner.textContent =
      "Sorry, products could not be loaded. Check your internet connection and try again.";
    errorBanner.hidden = false;
  } finally {
    loading.hidden = true;
  }
}

// Search as the user types
searchInput.addEventListener("input", event => {
  searchText = event.target.value.trim();
  renderProducts();
});

// Sorting
sortSelect.addEventListener("change", event => {
  sortOrder = event.target.value;
  renderProducts();
});

// Contact form demo
form.addEventListener("submit", event => {
  event.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  statusMessage.textContent = "Form submitted successfully.";
  form.reset();
});

// Modal dialog
openButton.addEventListener("click", () => {
  dialog.showModal();
});

closeButton.addEventListener("click", () => {
  dialog.close();
});

// Initialize app
updateCartCount();
loadProducts();