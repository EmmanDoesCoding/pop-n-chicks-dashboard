<script setup>
import { ref, computed } from 'vue'
import { useOrdersStore } from '../stores/orders'
import { useExpensesStore } from '../stores/expenses'

const ordersStore = useOrdersStore()
const expensesStore = useExpensesStore()

function todayString() {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

const selectedDate = ref(todayString())

const ordersForDate = computed(() => ordersStore.getOrdersForDate(selectedDate.value))
const expensesForDate = computed(() => expensesStore.getExpensesForDate(selectedDate.value))
const earningsForDate = computed(() => ordersStore.getEarningsForDate(selectedDate.value))
const expensesTotalForDate = computed(() =>
  expensesStore.getTotalExpensesForDate(selectedDate.value),
)
const netForDate = computed(() => earningsForDate.value - expensesTotalForDate.value)

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="history-view">
    <label>Select a date</label>
    <input type="date" v-model="selectedDate" class="date-picker" />

    <div class="day-summary">
      <div class="summary-item">
        <span class="label">Earnings</span>
        <span class="amount">₱{{ earningsForDate }}</span>
      </div>
      <div class="summary-item">
        <span class="label">Expenses</span>
        <span class="amount expense">− ₱{{ expensesTotalForDate }}</span>
      </div>
      <div class="summary-item">
        <span class="label">Net</span>
        <span class="amount net">₱{{ netForDate }}</span>
      </div>
    </div>

    <h3>Orders</h3>
    <p v-if="ordersForDate.length === 0" class="empty-state">No orders on this date.</p>
    <ul v-else class="history-list">
      <li v-for="order in ordersForDate" :key="order.id">
        <div class="history-top">
          <span class="name">{{ order.customer_name }}</span>
          <span class="time">{{ formatTime(order.created_at) }}</span>
        </div>
        <ul class="items">
          <li v-for="(item, index) in order.items" :key="index">
            {{ item.quantity }}x {{ item.name }}
          </li>
        </ul>
        <span class="total">₱{{ order.total }}</span>
      </li>
    </ul>

    <h3>Expenses</h3>
    <p v-if="expensesForDate.length === 0" class="empty-state">No expenses on this date.</p>
    <ul v-else class="history-list">
      <li v-for="expense in expensesForDate" :key="expense.id">
        <div class="history-top">
          <span class="name">{{ expense.description }}</span>
          <span class="time">{{ formatTime(expense.created_at) }}</span>
        </div>
        <span class="total expense">− ₱{{ expense.amount }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.history-view {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.date-picker {
  padding: 0.6rem 0.75rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.day-summary {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.summary-item {
  flex: 1;
  min-width: 100px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.summary-item .label {
  font-size: 0.75rem;
}

.summary-item .amount {
  font-size: 1.1rem;
  font-weight: 700;
}

.amount.expense {
  color: var(--color-text-muted);
}

.amount.net {
  color: #4ade80;
}

h3 {
  color: var(--color-primary);
  font-size: 1rem;
  margin-top: 0.5rem;
}

.empty-state {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.history-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-list > li {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.75rem;
}

.history-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3rem;
}

.name {
  font-weight: 600;
  font-size: 0.9rem;
}

.time {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.items {
  list-style: none;
  color: var(--color-text-muted);
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
}

.total {
  font-weight: 600;
  font-size: 0.9rem;
}

.total.expense {
  color: var(--color-text-muted);
}
</style>