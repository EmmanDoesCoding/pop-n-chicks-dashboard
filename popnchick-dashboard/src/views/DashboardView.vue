<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import { useOrdersStore } from '../stores/orders'
import { useExpensesStore } from '../stores/expenses'
import AddOrderForm from '../components/AddOrderForm.vue'
import AddExpenseForm from '../components/AddExpenseForm.vue'
import OrderList from '../components/OrderList.vue'
import EarningsSummary from '../components/EarningsSummary.vue'
import StatisticsBoard from '../components/StatisticsBoard.vue'
import HistoryView from '../components/HistoryView.vue'

const router = useRouter()
const ordersStore = useOrdersStore()
const expensesStore = useExpensesStore()
const showAddOrder = ref(false)
const showAddExpense = ref(false)
const showStats = ref(false)
const showHistory = ref(false)

onMounted(() => {
  ordersStore.fetchOrders()
  expensesStore.fetchExpenses()
})

async function handleLogout() {
  await supabase.auth.signOut()
  router.push({ name: 'login' })
}

function handleOrderAdded() {
  showAddOrder.value = false
}

function handleExpenseAdded() {
  showAddExpense.value = false
}
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Dashboard</h1>
      <div class="header-actions">
        <button class="primary-btn" @click="showAddOrder = true">+ Add Order</button>
        <button @click="showAddExpense = true">+ Add Expense</button>
        <button @click="showHistory = true">🕐 History</button>
        <button @click="showStats = true">📊 Statistics</button>
        <button @click="handleLogout">Log Out</button>
      </div>
    </header>

    <OrderList />

    <Transition name="fade">
      <div v-if="showAddOrder" class="modal-overlay" @click.self="showAddOrder = false">
        <div class="modal-content">
          <button class="close-btn" @click="showAddOrder = false">✕</button>
          <AddOrderForm @order-added="handleOrderAdded" />
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showAddExpense" class="modal-overlay" @click.self="showAddExpense = false">
        <div class="modal-content">
          <button class="close-btn" @click="showAddExpense = false">✕</button>
          <AddExpenseForm @expense-added="handleExpenseAdded" />
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showStats" class="modal-overlay" @click.self="showStats = false">
        <div class="modal-content stats-modal">
          <button class="close-btn" @click="showStats = false">✕</button>
          <EarningsSummary />
          <StatisticsBoard />
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showHistory" class="modal-overlay" @click.self="showHistory = false">
        <div class="modal-content stats-modal">
          <button class="close-btn" @click="showHistory = false">✕</button>
          <HistoryView />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.stats-modal {
  max-width: 700px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
}

.dashboard {
  padding: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

h1 {
  color: var(--color-primary);
  font-size: 1.5rem;
}

button {
  background: var(--color-surface-2);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background var(--transition),
    transform 0.1s ease;
}

button:hover {
  background: var(--color-border);
}

button:active {
  transform: scale(0.95);
}

.primary-btn {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
  font-weight: 600;
}

.primary-btn:hover {
  background: var(--color-primary-hover);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 100;
}

.modal-content {
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
  width: 32px;
  height: 32px;
  padding: 0;
  border-radius: 50%;
  background: var(--color-surface-2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .dashboard {
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .header-actions button {
    padding: 0.6rem 0.5rem;
    font-size: 0.8rem;
    white-space: nowrap;
  }

  .header-actions .primary-btn {
    grid-column: span 3;
  }

  .modal-overlay {
    align-items: flex-end;
    padding: 0;
  }

  .modal-content {
    max-width: 100%;
    max-height: 85vh;
    border-radius: var(--radius) var(--radius) 0 0;
    animation: slideUp 0.25s ease;
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .close-btn {
    top: 0.75rem;
    right: 0.75rem;
  }
}
</style>