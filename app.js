const products = [
  { id: 1, name: 'House blend', category: 'Coffee', price: 4.5, icon: '☕' },
  { id: 2, name: 'Oat milk latte', category: 'Coffee', price: 5.25, icon: '🥛' },
  { id: 3, name: 'Cold brew', category: 'Coffee', price: 4.75, icon: '🧊' },
  { id: 4, name: 'Butter croissant', category: 'Bakery', price: 3.75, icon: '🥐' },
  { id: 5, name: 'Cinnamon roll', category: 'Bakery', price: 4.25, icon: '🍥' },
  { id: 6, name: 'Sourdough loaf', category: 'Bakery', price: 7.5, icon: '🍞' },
  { id: 7, name: 'House granola', category: 'Pantry', price: 8.0, icon: '🥣' },
  { id: 8, name: 'Canvas tote', category: 'Merch', price: 16.0, icon: '👜' }
];
let cart = [];
let activeCategory = 'All';
const money = value => `$${value.toFixed(2)}`;
const grid = document.querySelector('#product-grid');
const search = document.querySelector('#search');

function renderProducts() {
  const query = search.value.toLowerCase();
  const visible = products.filter(product => (activeCategory === 'All' || product.category === activeCategory) && product.name.toLowerCase().includes(query));
  grid.innerHTML = visible.map(product => `<article class="product-card" data-id="${product.id}" tabindex="0" aria-label="Add ${product.name}"><div class="product-image">${product.icon}</div><h3>${product.name}</h3><div class="product-meta"><span>${product.category}</span><strong>${money(product.price)}</strong></div></article>`).join('');
  document.querySelector('#result-count').textContent = `${visible.length} item${visible.length === 1 ? '' : 's'}`;
  grid.querySelectorAll('.product-card').forEach(card => { card.addEventListener('click', () => addToCart(Number(card.dataset.id))); card.addEventListener('keydown', event => { if (event.key === 'Enter') addToCart(Number(card.dataset.id)); }); });
}
function addToCart(id) { const existing = cart.find(item => item.id === id); existing ? existing.quantity++ : cart.push({ ...products.find(product => product.id === id), quantity: 1 }); renderCart(); }
function changeQuantity(id, delta) { const item = cart.find(product => product.id === id); if (!item) return; item.quantity += delta; if (item.quantity <= 0) cart = cart.filter(product => product.id !== id); renderCart(); }
function renderCart() {
  const items = document.querySelector('#cart-items');
  items.innerHTML = cart.length ? cart.map(item => `<div class="cart-line"><div class="line-icon">${item.icon}</div><div class="line-main"><strong>${item.name}</strong><small>${money(item.price)} each</small></div><div class="qty"><button aria-label="Decrease ${item.name}" data-action="decrease" data-id="${item.id}">−</button><span>${item.quantity}</span><button aria-label="Increase ${item.name}" data-action="increase" data-id="${item.id}">+</button></div><strong class="line-price">${money(item.price * item.quantity)}</strong></div>`).join('') : '<div class="empty-cart"><span>＋</span><strong>Your cart is empty</strong><small>Select a product to start an order</small></div>';
  items.querySelectorAll('button').forEach(button => button.addEventListener('click', () => changeQuantity(Number(button.dataset.id), button.dataset.action === 'increase' ? 1 : -1)));
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0); const tax = subtotal * .0825; const total = subtotal + tax;
  document.querySelector('#subtotal').textContent = money(subtotal); document.querySelector('#tax').textContent = money(tax); document.querySelector('#total').textContent = money(total); const checkout = document.querySelector('#checkout'); checkout.textContent = `Charge ${money(total)}`; checkout.insertAdjacentHTML('beforeend', '<span>→</span>'); checkout.disabled = !cart.length;
}
document.querySelectorAll('.category').forEach(button => button.addEventListener('click', () => { activeCategory = button.dataset.category; document.querySelectorAll('.category').forEach(item => item.classList.toggle('active', item === button)); renderProducts(); }));
search.addEventListener('input', renderProducts);
document.querySelector('#clear-cart').addEventListener('click', () => { cart = []; renderCart(); });
document.querySelector('#checkout').addEventListener('click', () => { if (!cart.length) return; const toast = document.querySelector('#toast'); toast.textContent = 'Payment terminal ready'; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2200); });
renderProducts(); renderCart();
