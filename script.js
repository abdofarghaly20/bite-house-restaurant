const products = [
    {
        id: 1,
        name: "Classic Burger",
        category: "Burgers",
        price: 8.99,
        description: "Juicy beef, fresh lettuce and special sauce.",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Double Cheese Burger",
        category: "Burgers",
        price: 10.99,
        description: "Double beef, melted cheese and crispy onions.",
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433a?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Margherita Pizza",
        category: "Pizza",
        price: 9.50,
        description: "Tomato sauce, mozzarella and fresh basil.",
        image: "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Pepperoni Pizza",
        category: "Pizza",
        price: 11.99,
        description: "Classic pepperoni with melted mozzarella.",
        image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Creamy Alfredo",
        category: "Pasta",
        price: 8.50,
        description: "Creamy parmesan sauce with tender pasta.",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Pasta Bolognese",
        category: "Pasta",
        price: 9.25,
        description: "Pasta served with rich tomato meat sauce.",
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Fresh Orange Juice",
        category: "Drinks",
        price: 3.50,
        description: "Freshly squeezed oranges, served chilled.",
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Iced Coffee",
        category: "Drinks",
        price: 4.25,
        description: "Smooth iced coffee with a creamy finish.",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80"
    }
];

const menuGrid = document.getElementById("menuGrid");
const searchInput = document.getElementById("searchInput");
const categories = document.getElementById("categories");
const emptyMessage = document.getElementById("emptyMessage");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

let activeCategory = "All";
let cart = [];
let toastTimer;

function renderProducts() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    const filteredProducts = products.filter(product => {
        const matchesCategory =
            activeCategory === "All" ||
            product.category === activeCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    menuGrid.innerHTML = filteredProducts.map(product => `
        <article class="food-card">
            <img
                class="food-image"
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <div class="food-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>

                <div class="food-bottom">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button
                        class="add-btn"
                        data-add="${product.id}"
                        aria-label="Add ${product.name} to cart"
                        title="Add to cart"
                    >+</button>
                </div>
            </div>
        </article>
    `).join("");

    emptyMessage.hidden = filteredProducts.length !== 0;
}

categories.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");

    if (!button) return;

    activeCategory = button.dataset.category;

    categories.querySelectorAll(".category").forEach(category => {
        category.classList.toggle("active", category === button);
    });

    renderProducts();
});

searchInput.addEventListener("input", renderProducts);

menuGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (!button) return;

    addToCart(Number(button.dataset.add));
});

function addToCart(productId) {
    const product = products.find(item => item.id === productId);

    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
    showToast(`${product.name} added to cart!`);
}

function changeQuantity(productId, change) {
    const item = cart.find(product => product.id === productId);

    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== productId);
    }

    renderCart();
}

function renderCart() {
    const totalItems = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = totalItems;
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div>
                <strong>${item.name}</strong>
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
            </div>

            <div class="quantity-controls">
                <button
                    data-change="-1"
                    data-id="${item.id}"
                    aria-label="Decrease quantity"
                >−</button>

                <span>${item.quantity}</span>

                <button
                    data-change="1"
                    data-id="${item.id}"
                    aria-label="Increase quantity"
                >+</button>
            </div>
        </div>
    `).join("");
}

cartItems.addEventListener("click", event => {
    const button = event.target.closest("[data-change]");

    if (!button) return;

    changeQuantity(
        Number(button.dataset.id),
        Number(button.dataset.change)
    );
});

document.getElementById("cartButton").addEventListener("click", () => {
    cartOverlay.classList.add("open");
});

document.getElementById("closeCart").addEventListener("click", () => {
    cartOverlay.classList.remove("open");
});

cartOverlay.addEventListener("click", event => {
    if (event.target === cartOverlay) {
        cartOverlay.classList.remove("open");
    }
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        cartOverlay.classList.remove("open");
    }
});

document.getElementById("checkoutButton").addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Your cart is empty!");
        return;
    }

    showToast("Demo only — no real order was placed.");
});

function showToast(message) {
    clearTimeout(toastTimer);

    toast.textContent = message;
    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

renderProducts();
renderCart();