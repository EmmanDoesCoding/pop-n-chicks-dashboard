<script setup>
import { computed } from 'vue'
import { useOrdersStore } from '../stores/orders'
import { useExpensesStore } from '../stores/expenses'

const ordersStore = useOrdersStore()
const expensesStore = useExpensesStore()

const netDaily = computed(() => ordersStore.dailyEarnings - expensesStore.dailyExpenses)
const netMonthly = computed(() => ordersStore.monthlyEarnings - expensesStore.monthlyExpenses)
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

    <div class="earnings-card expense-card">
      <span class="label">Today's Expenses</span>
      <span class="amount">− ₱{{ expensesStore.dailyExpenses }}</span>
    </div>

    <div class="earnings-card expense-card">
      <span class="label">This Month's Expenses</span>
      <span class="amount">− ₱{{ expensesStore.monthlyExpenses }}</span>
    </div>

    <div class="earnings-card net-card">
      <span class="label">Today's Net</span>
      <span class="amount">₱{{ netDaily }}</span>
    </div>

    <div class="earnings-card net-card">
      <span class="label">This Month's Net</span>
      <span class="amount">₱{{ netMonthly }}</span>
    </div>

    <div class="earnings-card">
      <span class="label">Total Orders</span>
      <span class="amount">{{ ordersStore.totalOrders }}</span>
    </div>
  </div>
</template>

<style scoped>

.expense-card {
  border-left-color: var(--color-text-muted);
}

.net-card {
  border-left-color: #4ade80;
}

.net-card .amount {
  color: #4ade80;
}

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