const cartItemsDiv = document.getElementById("cart-items");
const totalCostSpan = document.getElementById("total-cost");
const cartCount = document.getElementById("cart-count");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function renderCart() {
  cartItemsDiv.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    totalCostSpan.textContent = "0";
    cartCount.textContent = "0";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-details">
        <h4>${item.name}</h4>
        <p>₹${item.price}</p>
        <div class="quantity-controls">
          <button onclick="updateQuantity(${index}, -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${index}, 1)">+</button>
        </div>
      </div>
    `;
    cartItemsDiv.appendChild(itemDiv);
  });

  totalCostSpan.textContent = total;
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

renderCart();
