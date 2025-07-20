<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My E-Commerce Store</title>
  <link rel="stylesheet" href="styles.css" />
  <script defer src="script.js"></script>
</head>
<body>
  <nav class="navbar">
    <h1>E-Commerce</h1>
    <ul>
      <li><a href="index.html">Home</a></li>
      <li><a href="cart.html">Cart (<span id="cart-count">0</span>)</a></li>
      <li><input type="text" id="search" placeholder="Search products..."></li>
      <li><button id="logout-btn">Logout</button></li>
    </ul>
  </nav>

  <section class="products">
    <h2>Featured Products</h2>
    <div class="product-list" id="product-list"></div>
  </section>
</body>
</html>


/* === script.js === */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.length;
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.innerText = count;
}

function displayCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const totalElement = document.getElementById("cart-total");
  let total = 0;
  cartItemsContainer.innerHTML = "";
  cart.forEach((item, index) => {
    const itemElement = document.createElement("div");
    itemElement.innerHTML = `${item.name} - $${item.price} <button onclick="removeFromCart(${index})">Remove</button>`;
    cartItemsContainer.appendChild(itemElement);
    total += item.price;
  });
  totalElement.innerText = total.toFixed(2);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
  updateCartCount();
}

function checkLogin() {
  if (localStorage.getItem("isLoggedIn") !== "true") {
    window.location.href = "login.html";
  }
}

function setupLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      window.location.href = "login.html";
    });
  }
}

function loadProducts() {
  const productList = document.getElementById("product-list");
  if (!productList) return;
  const products = [
    { name: "Product 1", price: 10, img: "https://via.placeholder.com/150", category: "electronics" },
    { name: "Product 2", price: 15, img: "https://via.placeholder.com/150", category: "clothing" },
    { name: "Product 3", price: 20, img: "https://via.placeholder.com/150", category: "books" },
    { name: "Product 4", price: 25, img: "https://via.placeholder.com/150", category: "electronics" }
  ];

  products.forEach(p => {
    const div = document.createElement("div");
    div.className = "product";
    div.dataset.category = p.category;
    div.innerHTML = `
      <img src="${p.img}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <p>$${p.price.toFixed(2)}</p>
      <button onclick="addToCart('${p.name}', ${p.price})">Add to Cart</button>
    `;
    productList.appendChild(div);
  });

  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const searchValue = searchInput.value.toLowerCase();
      const productElements = productList.querySelectorAll(".product");
      productElements.forEach(prod => {
        const name = prod.querySelector("h3").textContent.toLowerCase();
        prod.style.display = name.includes(searchValue) ? "block" : "none";
      });
    });
  }
}

if (window.location.pathname.includes("index.html")) {
  checkLogin();
  updateCartCount();
  loadProducts();
  setupLogout();
}

if (window.location.pathname.includes("cart.html")) {
  checkLogin();
  displayCart();
  setupLogout();
}
