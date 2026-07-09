<script setup>
import { ref, computed } from 'vue'
import { useOrdersStore } from '../stores/orders'
import { menu } from '../data/menu'

const emit = defineEmits(['order-added'])

const ordersStore = useOrdersStore()

const customerName = ref('')
const activeCategory = ref(menu[0].category)
const selectedItem = ref(null)
const quantity = ref(1)
const amountPaid = ref(null)
const orderDate = ref(todayDateTimeString())

const cart = ref([])

const nameError = ref('')
const itemError = ref('')
const cartError = ref('')
const amountError = ref('')

const activeItems = computed(() => {
  const category = menu.find((c) => c.category === activeCategory.value)
  return category ? category.items : []
})

function selectItem(item) {
  selectedItem.value = item
  quantity.value = 1
  itemError.value = ''
}

function todayDateTimeString() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
}

function addToCart() {
  if (!selectedItem.value) {
    itemError.value = "Select an item first"
    return
  }

  cartError.value = ''

  cart.value.push({
    name: selectedItem.value.name,
    price: selectedItem.value.price,
    quantity: quantity.value,
  })

  selectedItem.value = null
  quantity.value = 1
}

function removeFromCart(index) {
  cart.value.splice(index, 1)
}

const total = computed(() => {
  return cart.value.reduce((sum, line) => sum + line.price * line.quantity, 0)
})

const change = computed(() => {
  if (amountPaid.value === null || amountPaid.value === '') return null
  return amountPaid.value - total.value
})

function handleSubmit() {
  nameError.value = ''
  cartError.value = ''
  amountError.value = ''

  let hasError = false

  if (!customerName.value) {
    nameError.value = "This can't be empty"
    hasError = true
  }

  if (cart.value.length === 0) {
    cartError.value = "Add at least one item"
    hasError = true
  }

  if (amountPaid.value === null || amountPaid.value === '') {
    amountError.value = "This can't be empty"
    hasError = true
  }

  if (hasError) return

  ordersStore.addOrder({
    customerName: customerName.value,
    items: cart.value,
    total: total.value,
    amountPaid: amountPaid.value,
    change: change.value,
    orderDate: orderDate.value,
  })

  emit('order-added')

  customerName.value = ''
  cart.value = []
  amountPaid.value = null
  orderDate.value = todayDateTimeString()
}
</script>

<template>
  <form class="order-form" @submit.prevent="handleSubmit">
    <h2>Add Order</h2>

<label>Customer Name</label>
<input type="text" v-model="customerName" placeholder="e.g. Juan" />
<p v-if="nameError" class="field-error">{{ nameError }}</p>

<label>Order Date & Time</label>
<input type="datetime-local" v-model="orderDate" />

<label>Menu</label>

<div class="category-tabs-wrapper">
  <div class="category-tabs">
    <button
      v-for="category in menu"
      :key="category.category"
      type="button"
      class="tab-btn"
      :class="{ active: activeCategory === category.category }"
      @click="activeCategory = category.category"
    >
      {{ category.category }}
    </button>
  </div>
</div>

<div class="item-grid">
  <button
    v-for="item in activeItems"
    :key="item.name"
    type="button"
    class="item-card"
    :class="{ selected: selectedItem?.name === item.name }"
    @click="selectItem(item)"
  >
    <span class="item-name">{{ item.name }}</span>
    <span class="item-price">₱{{ item.price }}</span>
  </button>
</div>
<p v-if="itemError" class="field-error">{{ itemError }}</p>

<div v-if="selectedItem" class="qty-row">
  <span>{{ selectedItem.name }}</span>
  <div class="qty-controls">
    <button type="button" @click="quantity = Math.max(1, quantity - 1)">−</button>
    <span class="qty-value">{{ quantity }}</span>
    <button type="button" @click="quantity++">+</button>
  </div>
  <button type="button" class="add-btn" @click="addToCart">Add</button>
</div>

<ul v-if="cart.length" class="cart-list">
  <li v-for="(line, index) in cart" :key="index">
    <span>{{ line.quantity }}x {{ line.name }}</span>
    <span>₱{{ line.price * line.quantity }}</span>
    <button type="button" class="remove-btn" @click="removeFromCart(index)">✕</button>
  </li>
</ul>
<p v-if="cartError" class="field-error">{{ cartError }}</p>

    <label>Total</label>
    <input type="text" :value="`₱${total}`" disabled />

    <label>Amount Paid</label>
    <input type="number" v-model.number="amountPaid" placeholder="0" />
    <p v-if="amountError" class="field-error">{{ amountError }}</p>

    <label>Change</label>
    <input type="text" :value="change !== null ? `₱${change}` : '—'" disabled />

    <button type="submit">Add Order</button>
  </form>
</template>

<style scoped>
.order-form {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  animation: fadeSlideUp 0.4s ease;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h2 {
  color: var(--color-primary);
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

label {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 0.35rem;
  margin-top: 0.75rem;
}

input,
select {
  width: 100%;
  padding: 0.6rem 0.75rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  font-size: 1rem;
  transition: border-color var(--transition);
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--color-primary);
}

input:disabled {
  color: var(--color-text-muted);
  cursor: not-allowed;
}



.item-row select {
  flex: 1;
}

.category-tabs {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  margin-bottom: 0.75rem;
}

.tab-btn {
  flex-shrink: 0;
  background: var(--color-surface-2);
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
}

.tab-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
  font-weight: 600;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.5rem;
}

.item-card {
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  text-align: left;
  cursor: pointer;
  transition:
    background var(--transition),
    color var(--transition),
    transform 0.1s ease;
}

.item-card:hover {
  background: var(--color-primary-hover);
}

.item-card:active {
  transform: scale(0.97);
}

.item-card.selected {
  background: #fff;
  border-color: #fff;
}

.item-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: #fff;
}

.item-price {
  font-size: 0.8rem;
  color: #fff;
  font-weight: 600;
}

.item-card.selected .item-name,
.item-card.selected .item-price {
  color: #000;
}

.qty-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  margin-top: 0.5rem;
  animation: fadeSlideUp 0.25s ease;
}

.qty-row > span:first-child {
  flex: 1;
  font-size: 0.85rem;
}

.qty-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.qty-controls button {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  cursor: pointer;
  font-size: 1rem;
}

.qty-controls button:hover {
  border-color: var(--color-primary);
}

.qty-value {
  min-width: 20px;
  text-align: center;
  font-size: 0.9rem;
}

.add-btn {
  flex-shrink: 0;
  background: var(--color-primary);
  color: #fff;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background var(--transition);
}

.add-btn:hover {
  background: var(--color-primary-hover);
}

.add-btn:hover {
  background: var(--color-primary-hover);
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.cart-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0.75rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.9rem;
  gap: 0.5rem;
  animation: fadeSlideUp 0.25s ease;
}

.cart-list li span:first-child {
  flex: 1;
}

.cart-list li span:last-child {
  flex-shrink: 0;
  font-weight: 600;
}

.field-error {
  color: var(--color-primary);
  font-size: 0.8rem;
  margin-top: 0.35rem;
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

.remove-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0 0.25rem;
}

.remove-btn:hover {
  color: var(--color-primary);
}

button[type='submit'] {
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.7rem;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background var(--transition),
    transform 0.1s ease;
}

button[type='submit']:hover {
  background: var(--color-primary-hover);
}

button[type='submit']:active {
  transform: scale(0.97);
}

.category-tabs-wrapper {
  position: relative;
  margin-bottom: 0.75rem;
}

.category-tabs-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 24px;
  background: linear-gradient(to right, transparent, var(--color-surface));
  pointer-events: none;
}

.category-tabs {
  display: flex;
  gap: 0.4rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
  margin-bottom: 0;
}

@media (max-width: 480px) {
  .category-tabs {
    flex-wrap: wrap;
    overflow-x: visible;
  }

  .category-tabs-wrapper::after {
    display: none;
  }

  .tab-btn {
    flex: 1 1 calc(50% - 0.2rem);
    text-align: center;
  }

  .item-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  input[type='datetime-local'] {
    font-size: 0.9rem;
  }
}
</style>