const products = [
  {
    id: 1,
    name: "Everyday Wireless Headphones",
    category: "Tech",
    price: 89,
    rating: 4.7,
    stock: 18,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Minimal Desk Lamp",
    category: "Home",
    price: 64,
    rating: 4.5,
    stock: 12,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Canvas Weekender Tote",
    category: "Style",
    price: 72,
    rating: 4.8,
    stock: 9,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "Ceramic Pour Over Set",
    category: "Kitchen",
    price: 48,
    rating: 4.4,
    stock: 21,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 5,
    name: "Compact Smart Speaker",
    category: "Tech",
    price: 119,
    rating: 4.6,
    stock: 14,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 6,
    name: "Textured Cotton Throw",
    category: "Home",
    price: 54,
    rating: 4.3,
    stock: 16,
    image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 7,
    name: "Stainless Steel Water Bottle",
    category: "Outdoor",
    price: 34,
    rating: 4.9,
    stock: 32,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 8,
    name: "Leather Card Wallet",
    category: "Style",
    price: 42,
    rating: 4.2,
    stock: 25,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80"
  }
];

const state = {
  cart: [],
  search: "",
  category: "all",
  sort: "featured"
};

const productGrid = document.querySelector("#productGrid");
const categoryFilter = document.querySelector("#categoryFilter");
const sortFilter = document.querySelector("#sortFilter");
const searchInput = document.querySelector("#searchInput");
const cartButton = document.querySelector("#cartButton");
const closeCart = document.querySelector("#closeCart");
const cartDrawer = document.querySelector("#cartDrawer");
const cartItems = document.querySelector("#cartItems");
const cartCount = document.querySelector("#cartCount");
const cartSubtotal = document.querySelector("#cartSubtotal");
const checkoutLink = document.querySelector("#checkoutLink");
const checkoutForm = document.querySelector("#checkoutForm");
const formMessage = document.querySelector("#formMessage");

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

function populateCategories() {
  const categories = [...new Set(products.map((product) => product.category))].sort();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.append(option);
  });
}

function getVisibleProducts() {
  const searchText = state.search.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchText) || product.category.toLowerCase().includes(searchText);
    const matchesCategory = state.category === "all" || product.category === state.category;
    return matchesSearch && matchesCategory;
  });

  return filtered.sort((a, b) => {
    if (state.sort === "price-low") return a.price - b.price;
    if (state.sort === "price-high") return b.price - a.price;
    if (state.sort === "rating") return b.rating - a.rating;
    return a.id - b.id;
  });
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  productGrid.innerHTML = "";

  if (!visibleProducts.length) {
    productGrid.innerHTML = '<p class="empty-state">No products match your filters.</p>';
    return;
  }

  visibleProducts.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <div class="product-body">
        <div class="product-meta">
          <span class="category">${product.category}</span>
          <span class="rating">${product.rating.toFixed(1)}</span>
        </div>
        <h3>${product.name}</h3>
        <div class="price-row">
          <span class="price">${currency.format(product.price)}</span>
          <span class="stock">${product.stock} in stock</span>
        </div>
        <button type="button" data-add="${product.id}">Add to cart</button>
      </div>
    `;
    productGrid.append(card);
  });
}

function findProduct(productId) {
  return products.find((product) => product.id === Number(productId));
}

function addToCart(productId) {
  const product = findProduct(productId);
  const item = state.cart.find((cartItem) => cartItem.id === product.id);

  if (item) {
    item.quantity += 1;
  } else {
    state.cart.push({ id: product.id, quantity: 1 });
  }

  renderCart();
  openCart();
}

function updateQuantity(productId, delta) {
  const item = state.cart.find((cartItem) => cartItem.id === Number(productId));
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter((cartItem) => cartItem.id !== Number(productId));
  }

  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((cartItem) => cartItem.id !== Number(productId));
  renderCart();
}

function getCartTotals() {
  return state.cart.reduce(
    (totals, item) => {
      const product = findProduct(item.id);
      totals.quantity += item.quantity;
      totals.subtotal += product.price * item.quantity;
      return totals;
    },
    { quantity: 0, subtotal: 0 }
  );
}

function renderCart() {
  const totals = getCartTotals();
  cartCount.textContent = totals.quantity;
  cartSubtotal.textContent = currency.format(totals.subtotal);
  cartItems.innerHTML = "";

  if (!state.cart.length) {
    cartItems.innerHTML = '<p class="empty-state">Your cart is empty.</p>';
    return;
  }

  state.cart.forEach((item) => {
    const product = findProduct(item.id);
    const row = document.createElement("article");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div>
        <h3>${product.name}</h3>
        <p>${currency.format(product.price)} each</p>
        <div class="quantity-row">
          <div class="quantity-controls" aria-label="Quantity controls for ${product.name}">
            <button class="quantity-button" type="button" data-qty="${product.id}" data-delta="-1">-</button>
            <strong>${item.quantity}</strong>
            <button class="quantity-button" type="button" data-qty="${product.id}" data-delta="1">+</button>
          </div>
          <button class="remove-button" type="button" data-remove="${product.id}">Remove</button>
        </div>
      </div>
    `;
    cartItems.append(row);
  });
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function hideCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) addToCart(addButton.dataset.add);
});

cartItems.addEventListener("click", (event) => {
  const quantityButton = event.target.closest("[data-qty]");
  const removeButton = event.target.closest("[data-remove]");

  if (quantityButton) {
    updateQuantity(quantityButton.dataset.qty, Number(quantityButton.dataset.delta));
  }

  if (removeButton) {
    removeFromCart(removeButton.dataset.remove);
  }
});

searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderProducts();
});

categoryFilter.addEventListener("change", (event) => {
  state.category = event.target.value;
  renderProducts();
});

sortFilter.addEventListener("change", (event) => {
  state.sort = event.target.value;
  renderProducts();
});

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", hideCart);
checkoutLink.addEventListener("click", hideCart);

cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) hideCart();
});

checkoutForm.addEventListener("submit", (event) => {
  if (!state.cart.length) {
    event.preventDefault();
    formMessage.textContent = "Add at least one product to the cart before submitting.";
    return;
  }

  formMessage.textContent = "Order request ready to submit.";
});

populateCategories();
renderProducts();
renderCart();
