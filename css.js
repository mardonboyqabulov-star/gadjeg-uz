
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    category: "phone",
    price: 13499000,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=85",
    description: "Premium smartfon, sifatli kamera va kuchli protsessor."
  },
  {
    id: 2,
    name: "Samsung Galaxy",
    category: "phone",
    price: 6200000,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=85",
    description: "Zamonaviy ekran va kundalik foydalanish uchun qulay telefon."
  },
  {
    id: 3,
    name: "MacBook Air",
    category: "computer",
    price: 11999000,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=85",
    description: "Yengil noutbuk, o‘qish, ish va dasturlash uchun."
  },
  {
    id: 4,
    name: "Gaming Laptop",
    category: "computer",
    price: 12500000,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=85",
    description: "O‘yinlar, grafik dasturlar va kuchli vazifalar uchun."
  },
  {
    id: 5,
    name: "AirPods Pro",
    category: "audio",
    price: 2799000,
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=85",
    description: "Simsiz quloqchinlar va sifatli ovoz."
  },
  {
    id: 6,
    name: "Sony Headphones",
    category: "audio",
    price: 1750000,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=85",
    description: "Musiqa tinglash uchun qulay naushnik."
  },
  {
    id: 7,
    name: "Samsung Watch",
    category: "watch",
    price: 1699000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=85",
    description: "Zamonaviy ko‘rinishdagi aqlli soat."
  },
  {
    id: 8,
    name: "Bluetooth Speaker",
    category: "accessory",
    price: 550000,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=600&q=85",
    description: "Uy va sayohat uchun ixcham karnay."
  },
  {
    id: 9,
    name: "Game Controller",
    category: "accessory",
    price: 650000,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=600&q=85",
    description: "O‘yinlar uchun qulay boshqaruv qurilmasi."
  },
  {
    id: 10,
    name: "iPad",
    category: "computer",
    price: 5200000,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=85",
    description: "Video ko‘rish, o‘qish va ishlash uchun planshet."
  }
];

const $ = selector => document.querySelector(selector);

const categoryNames = {
  phone: "Smartfon",
  computer: "Kompyuter",
  audio: "Audio",
  watch: "Smart soat",
  accessory: "Aksessuar"
};

const money = amount =>
  new Intl.NumberFormat("uz-UZ").format(amount) + " so‘m";

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function loadCart() {
  try {
    const data = JSON.parse(
      localStorage.getItem("gadgetZoneCart") || "[]"
    );

    if (!Array.isArray(data)) return [];

    return data.filter(item =>
      products.some(p => p.id === item.id) &&
      Number.isInteger(item.qty) &&
      item.qty > 0
    );
  } catch {
    return [];
  }
}

let cart = loadCart();
let activeCategory = "all";
let toastTimer;

function saveCart() {
  try {
    localStorage.setItem("gadgetZoneCart", JSON.stringify(cart));
    return true;
  } catch {
    showToast("Savatni saqlashda xatolik yuz berdi.");
    return false;
  }
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

function openOverlay(overlay) {
  overlay.classList.add("show");
  document.body.classList.add("no-scroll");
}

function closeOverlay(overlay) {
  overlay.classList.remove("show");

  if (!document.querySelector(".overlay.show")) {
    document.body.classList.remove("no-scroll");
  }
}

// MAHSULOTLARNI CHIQARISH
function renderProducts() {
  const searchText = $("#search").value
    .trim()
    .toLocaleLowerCase("uz");

  let filtered = products.filter(product => {
    const text = (
      product.name + " " +
      product.description + " " +
      categoryNames[product.category]
    ).toLocaleLowerCase("uz");

    return text.includes(searchText) &&
      (activeCategory === "all" ||
       product.category === activeCategory);
  });

  if ($("#sort").value === "cheap") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if ($("#sort").value === "expensive") {
    filtered.sort((a, b) => b.price - a.price);
  }

  $("#resultCount").textContent =
    `${filtered.length} ta mahsulot topildi`;

  if (filtered.length === 0) {
    $("#productsGrid").innerHTML = `
      <div class="empty-state">
        <h3>🔎 Mahsulot topilmadi</h3>
        <p>Boshqa nom yozib qidirib ko‘ring.</p>
      </div>`;
    return;
  }

  $("#productsGrid").innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image" data-detail="${product.id}"
        role="button" tabindex="0"
        aria-label="${escapeHTML(product.name)} tafsilotlari">
        <img src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}" loading="lazy">
      </div>

      <div class="product-info">
        <span class="product-category">
          ${escapeHTML(categoryNames[product.category])}
        </span>

        <h3 data-detail="${product.id}" tabindex="0">
          ${escapeHTML(product.name)}
        </h3>

        <p class="product-description">
          ${escapeHTML(product.description)}
        </p>

        <div class="product-rating">★★★★★ <small>5.0</small></div>

        <div class="product-bottom">
          <div class="price">${money(product.price)}</div>
          <button class="add-button" data-add="${product.id}">
            🛒 Savatga qo‘shish
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

// SAVATGA QO‘SHISH
function addToCart(id) {
  const product = products.find(p => p.id === Number(id));
  if (!product) return;

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, qty: 1 });
  }

  if (!saveCart()) {
    cart = loadCart();
    renderCart();
    return;
  }

  renderCart();
  showToast(product.name + " savatga qo‘shildi!");
}

// HISOB-KITOB
function getSubtotal() {
  return cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
}

function getShipping() {
  const subtotal = getSubtotal();
  return subtotal === 0 || subtotal >= 500000 ? 0 : 25000;
}

// SAVATNI CHIQARISH
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = getSubtotal();
  const shipping = getShipping();

  $("#cartCount").textContent = count;
  $("#subtotal").textContent = money(subtotal);
  $("#shipping").textContent =
    subtotal > 0 && shipping === 0 ? "Bepul" : money(shipping);
  $("#total").textContent = money(subtotal + shipping);
  $("#orderTotal").textContent = money(subtotal + shipping);

  $("#checkoutButton").disabled = cart.length === 0;
  $("#checkoutButton").style.opacity =
    cart.length === 0 ? ".5" : "1";

  if (cart.length === 0) {
    $("#cartItems").innerHTML = `
      <div class="empty-state">
        <h3>🛒 Savat bo‘sh</h3>
        <p>Mahsulotlarni tanlab savatga qo‘shing.</p>
      </div>`;
    return;
  }

  $("#cartItems").innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return "";

    return `
      <div class="cart-row">
        <img src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}">

        <div>
          <h4>${escapeHTML(product.name)}</h4>
          <p>${money(product.price * item.qty)}</p>

          <div class="quantity">
            <button data-qty="${product.id}" data-change="-1">−</button>
            <span>${item.qty}</span>
            <button data-qty="${product.id}" data-change="1">+</button>
          </div>
        </div>

        <button class="remove" data-remove="${product.id}"
          aria-label="Savatdan o‘chirish">🗑</button>
      </div>
    `;
  }).join("");
}

function changeQuantity(id, change) {
  const item = cart.find(p => p.id === Number(id));
  if (!item) return;

  item.qty += change;

  if (item.qty <= 0) {
    cart = cart.filter(p => p.id !== Number(id));
  }

  if (!saveCart()) cart = loadCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(p => p.id !== Number(id));

  if (!saveCart()) cart = loadCart();

  renderCart();
  showToast("Mahsulot savatdan olib tashlandi.");
}

// MAHSULOT HAQIDA
function showDetails(id) {
  const product = products.find(p => p.id === Number(id));
  if (!product) return;

  $("#detailContent").innerHTML = `
    <div class="detail-layout">
      <img src="${escapeHTML(product.image)}"
        alt="${escapeHTML(product.name)}">

      <div>
        <span class="product-category">
          ${escapeHTML(categoryNames[product.category])}
        </span>
        <h2>${escapeHTML(product.name)}</h2>
        <p>${escapeHTML(product.description)}</p>
        <div class="price">${money(product.price)}</div>
        <button class="primary-btn wide" data-add="${product.id}">
          🛒 Savatga qo‘shish
        </button>
      </div>
    </div>
  `;

  openOverlay($("#detailOverlay"));
}

// QIDIRUV
$("#search").addEventListener("input", renderProducts);

$("#searchButton").addEventListener("click", () => {
  renderProducts();
  $("#products").scrollIntoView({ behavior: "smooth" });
});

$("#sort").addEventListener("change", renderProducts);

// KATEGORIYA TANLASH
$("#categories").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".category-card").forEach(card => {
    card.classList.toggle("active", card === button);
  });

  renderProducts();
});

// BARCHA TUGMALAR
document.addEventListener("click", event => {
  const addButton = event.target.closest("[data-add]");

  if (addButton) {
    addToCart(addButton.dataset.add);
    closeOverlay($("#detailOverlay"));
    return;
  }

  const detail = event.target.closest("[data-detail]");

  if (detail) {
    showDetails(detail.dataset.detail);
    return;
  }

  const quantity = event.target.closest("[data-qty]");

  if (quantity) {
    changeQuantity(
      quantity.dataset.qty,
      Number(quantity.dataset.change)
    );
    return;
  }

  const remove = event.target.closest("[data-remove]");

  if (remove) {
    removeFromCart(remove.dataset.remove);
  }
});

// KLA VIATURA ORQALI MAHSULOTNI OCHISH
document.addEventListener("keydown", event => {
  const detail = event.target.closest("[data-detail]");

  if (
    detail &&
    (event.key === "Enter" || event.key === " ")
  ) {
    event.preventDefault();
    showDetails(detail.dataset.detail);
  }

  if (event.key === "Escape") {
    document.querySelectorAll(".overlay.show").forEach(closeOverlay);
  }
});

// SAVAT OYNASI
$("#openCart").addEventListener("click", () => {
  renderCart();
  openOverlay($("#cartOverlay"));
});

$("#closeCart").addEventListener("click", () => {
  closeOverlay($("#cartOverlay"));
});

$("#cartOverlay").addEventListener("click", event => {
  if (event.target === $("#cartOverlay")) {
    closeOverlay($("#cartOverlay"));
  }
});

// MAHSULOT OYNASI
$("#closeDetail").addEventListener("click", () => {
  closeOverlay($("#detailOverlay"));
});

$("#detailOverlay").addEventListener("click", event => {
  if (event.target === $("#detailOverlay")) {
    closeOverlay($("#detailOverlay"));
  }
});

// BUYURTMA FORMASINI OCHISH
function openCheckout() {
  if (cart.length === 0) {
    showToast("Avval savatga mahsulot qo‘shing.");
    return;
  }

  closeOverlay($("#cartOverlay"));
  renderCart();
  openOverlay($("#orderOverlay"));
}

$("#checkoutButton").addEventListener("click", openCheckout);
$("#deliveryOrder").addEventListener("click", openCheckout);

$("#closeOrder").addEventListener("click", () => {
  closeOverlay($("#orderOverlay"));
});

$("#orderOverlay").addEventListener("click", event => {
  if (event.target === $("#orderOverlay")) {
    closeOverlay($("#orderOverlay"));
  }
});

// BUYURTMANI DEMO TARZIDA RASMIYLASHTIRISH
$("#orderForm").addEventListener("submit", event => {
  event.preventDefault();

  if (cart.length === 0) {
    showToast("Savat bo‘sh!");
    closeOverlay($("#orderOverlay"));
    return;
  }

  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const formData = new FormData(form);

  const order = {
    number: Date.now().toString().slice(-8),
    customer: formData.get("customer"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    payment: formData.get("payment"),
    items: cart.map(item => {
      const product = products.find(p => p.id === item.id);

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.qty
      };
    }),
    total: getSubtotal() + getShipping(),
    date: new Date().toISOString()
  };

  try {
    const orders = JSON.parse(
      localStorage.getItem("gadgetZoneOrders") || "[]"
    );

    if (!Array.isArray(orders)) {
      throw new Error("Buyurtmalar formati noto‘g‘ri");
    }

    orders.push(order);
    localStorage.setItem("gadgetZoneOrders", JSON.stringify(orders));
  } catch {
    showToast("Buyurtmani saqlashda xatolik yuz berdi.");
    return;
  }

  cart = [];
  saveCart();
  renderCart();
  form.reset();
  closeOverlay($("#orderOverlay"));

  showToast("Demo buyurtma qabul qilindi! №" + order.number);
});

// SAYTNI ISHGA TUSHIRISH
renderProducts();
renderCart();
