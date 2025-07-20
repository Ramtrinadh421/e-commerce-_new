document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const logoutBtn = document.getElementById("logout-btn");
  const cartCount = document.getElementById("cart-count");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const productList = document.getElementById("product-list");
  const searchInput = document.getElementById("search");

  const products = [
    { id: 1, name: "Brown Dog", price: 10000, image: "dog.jpeg" },
    { id: 2, name: "Golden Retriever", price: 12000, image: "dog1.jpeg" },
    { id: 3, name: "Pomeranian", price: 8000, image: "dog2.jpeg" },
    { id: 4, name: "Adorable Kitten", price: 6000, image: "kitten.jpeg" },
    { id: 5, name: "Persian Cat", price: 9000, image: "cat.jpeg" },
  ];

  if ((window.location.pathname.includes("index") || window.location.pathname.includes("cart")) &&
      isLoggedIn !== "true") {
    window.location.href = "login.html";
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("cart");
      window.location.href = "logout.html";
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
        <img src="images/${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>₹${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      `;
      productList.appendChild(card);
    });
  }

  window.addToCart = function (id) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const product = products.find((p) => p.id === id);

    const index = cart.findIndex((item) => item.id === id);
    if (index !== -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`${product.name} added to cart`);
  };

  function renderCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      const subtotal = item.quantity * item.price;
      total += subtotal;

      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img src="images/${item.image}" alt="${item.name}" />
        <div class="item-details">
          <h4>${item.name}</h4>
          <p>Price: ₹${item.price}</p>
          <div class="cart-buttons">
            <button onclick="decreaseQuantity(${index})">−</button>
            <span>${item.quantity}</span>
            <button onclick="increaseQuantity(${index})">+</button>
          </div>
          <p>Subtotal: ₹${subtotal}</p>
        </div>
      `;
      cartItemsContainer.appendChild(div);
    });

    cartTotal.innerText = total.toFixed(2);
    updateCartCount();
  }

  window.increaseQuantity = function (index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity++;
    saveCart(cart);
  };

  window.decreaseQuantity = function (index) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
    saveCart(cart);
  };

  function saveCart(updatedCart) {
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    renderCart();
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.innerText = count;
  }

  updateCartCount();
});
