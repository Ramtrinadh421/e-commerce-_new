document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const logoutBtn = document.getElementById("logout-btn");
  const cartCount = document.getElementById("cart-count");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const productList = document.getElementById("product-list");
  const searchInput = document.getElementById("search");

  const products = [
    { id: 1, name: "Golden Retriever", price: 300, image: "https://placedog.net/400/300?id=1" },
    { id: 2, name: "Persian Cat", price: 250, image: "https://placekitten.com/400/300" },
    { id: 3, name: "Parrot", price: 150, image: "https://loremflickr.com/400/300/parrot" },
    { id: 4, name: "Siberian Husky", price: 400, image: "https://placedog.net/400/300?id=4" },
    { id: 5, name: "Rabbit", price: 100, image: "https://loremflickr.com/400/300/rabbit" },
  ];

  if (
    (window.location.pathname.includes("index") || window.location.pathname.includes("cart")) &&
    isLoggedIn !== "true"
  ) {
    window.location.href = "login.html";
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("cart");
      window.location.href = "login.html";
    });
  }

  if (productList) renderProducts(products);
  if (cartItemsContainer) renderCart();

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = products.filter((p) => p.name.toLowerCase().includes(query));
      renderProducts(filtered);
    });
  }

  function renderProducts(items) {
    productList.innerHTML = "";
    items.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product";
      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productList.appendChild(card);
    });
  }

  window.addToCart = function (id) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = products.find((p) => p.id === id);
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${item.name} added to cart`);
  };

  function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const grouped = {};

    cart.forEach((item) => {
      if (grouped[item.id]) {
        grouped[item.id].quantity += 1;
      } else {
        grouped[item.id] = { ...item, quantity: 1 };
      }
    });

    cartItemsContainer.innerHTML = "";
    let total = 0;

    Object.values(grouped).forEach((item) => {
      const div = document.createElement("div");
      div.className = "product";
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <h3>${item.name}</h3>
        <p>$${item.price}</p>
        <div class="quantity-controls">
          <button onclick="decreaseQuantity(${item.id})">−</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity(${item.id})">+</button>
        </div>
        <p>Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
      `;
      cartItemsContainer.appendChild(div);
      total += item.price * item.quantity;
    });

    cartTotal.innerText = total.toFixed(2);
    updateCartCount();
  }

  window.increaseQuantity = function (id) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = products.find((p) => p.id === id);
    cart.push(item);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  };

  window.decreaseQuantity = function (id) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex((item) => item.id === id);
    if (index !== -1) {
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    }
  };

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartCount) cartCount.innerText = cart.length;
  }

  updateCartCount();
});
