<script setup>
import { useOrdersStore } from '../stores/orders'

const ordersStore = useOrdersStore()
</script>

<template>
  <div class="earnings-summary">
    <div class="earnings-card">
      <span class="label">Today's Earnings</span>
      <span class="amount">₱{{ ordersStore.dailyEarnings }}</span>
    </div>

    <div class="earnings-card">
      <span class="label">This Month's Earnings</span>
      <span class="amount">₱{{ ordersStore.monthlyEarnings }}</span>
    </div>

    <div class="earnings-card">
      <span class="label">Total Orders</span>
      <span class="amount">{{ ordersStore.totalOrders }}</span>
    </div>
  </div>
</template>

<style scoped>
.earnings-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.earnings-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-primary);
  border-radius: var(--radius);
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
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

.label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
}
</style>