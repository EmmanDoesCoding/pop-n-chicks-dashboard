<script setup>
import { useOrdersStore } from '../stores/orders'

const ordersStore = useOrdersStore()

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="order-list">
    <h2>Orders</h2>

    <p v-if="ordersStore.orders.length === 0" class="empty-state">No orders yet today.</p>

    <TransitionGroup v-else name="list" tag="ul">
      <li v-for="order in ordersStore.orders" :key="order.id" :class="{ completed: order.completed }">
        <div class="order-top">
          <span class="customer">{{ order.customerName }}</span>
          <span class="time">{{ formatTime(order.createdAt) }}</span>
        </div>

        <ul class="items">
          <li v-for="(item, index) in order.items" :key="index">
            <span>{{ item.quantity }}x {{ item.name }}</span>
            <span>₱{{ item.price * item.quantity }}</span>
          </li>
        </ul>

        <div class="order-footer">
          <div class="money-summary">
            <span><strong>₱{{ order.total }}</strong> total</span>
            <span>₱{{ order.amountPaid }} paid</span>
            <span>₱{{ order.change }} change</span>
          </div>

          <button class="complete-btn" @click="ordersStore.toggleComplete(order.id)">
            {{ order.completed ? '✓ Completed' : 'Mark Complete' }}
          </button>
        </div>
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.order-list {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
}

h2 {
  color: var(--color-primary);
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.empty-state {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

ul {
  list-style: none;
}

.order-list > ul {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.order-list > ul > li {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-primary);
  border-radius: 8px;
  padding: 1rem;
  transition:
    opacity var(--transition),
    border-color var(--transition);
}

.order-list > ul > li.completed {
  opacity: 0.5;
  border-left-color: var(--color-text-muted);
}

.order-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.6rem;
}

.customer {
  font-weight: 600;
  font-size: 1.05rem;
}

.time {
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

.items {
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed var(--color-border);
}

.items li {
  display: flex;
  justify-content: space-between;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  padding: 0.15rem 0;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.money-summary {
  display: flex;
  gap: 0.9rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  flex-wrap: wrap;
}

.money-summary strong {
  color: var(--color-text);
  font-size: 0.95rem;
}

.complete-btn {
  flex-shrink: 0;
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: 0.5rem 0.9rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition:
    background var(--transition),
    transform 0.1s ease;
}

.complete-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.complete-btn:active {
  transform: scale(0.95);
}

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>