<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'
import AddOrderForm from '../components/AddOrderForm.vue'
import OrderList from '../components/OrderList.vue'
import EarningsSummary from '../components/EarningsSummary.vue'

const router = useRouter()
const showAddOrder = ref(false)

async function handleLogout() {
  await supabase.auth.signOut()
  router.push({ name: 'login' })
}

function handleOrderAdded() {
  showAddOrder.value = false
}
</script>

<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Dashboard</h1>
      <div class="header-actions">
        <button class="primary-btn" @click="showAddOrder = true">+ Add Order</button>
        <button @click="handleLogout">Log Out</button>
      </div>
    </header>

    <EarningsSummary />
    <OrderList />

    <Transition name="fade">
      <div v-if="showAddOrder" class="modal-overlay" @click.self="showAddOrder = false">
        <div class="modal-content">
          <button class="close-btn" @click="showAddOrder = false">✕</button>
          <AddOrderForm @order-added="handleOrderAdded" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
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
</style>