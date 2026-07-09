<script setup>
import { computed } from 'vue'
import { useOrdersStore } from '../stores/orders'

const ordersStore = useOrdersStore()

const maxDayTotal = computed(() => {
  return Math.max(...ordersStore.last7DaysEarnings.map((d) => d.total), 1)
})
</script>

<template>
  <div class="stats-board">
    <div class="stats-section">
      <h2>Earnings — Last 7 Days</h2>

      <div v-if="ordersStore.last7DaysEarnings.every((d) => d.total === 0)" class="empty-state">
        No earnings yet this week.
      </div>

      <div v-else class="bar-chart">
        <div v-for="day in ordersStore.last7DaysEarnings" :key="day.label" class="bar-column">
          <span class="bar-value">₱{{ day.total }}</span>
          <div
            class="bar"
            :style="{ height: `${(day.total / maxDayTotal) * 100}%` }"
          ></div>
          <span class="bar-label">{{ day.label }}</span>
        </div>
      </div>
    </div>

    <div class="stats-section">
      <h2>Best-Selling Items</h2>

      <p v-if="ordersStore.bestSellingItems.length === 0" class="empty-state">
        No items sold yet.
      </p>

      <ul v-else class="best-sellers">
        <li v-for="(item, index) in ordersStore.bestSellingItems" :key="item.name">
          <span class="rank">#{{ index + 1 }}</span>
          <span class="item-name">{{ item.name }}</span>
          <span class="item-qty">{{ item.quantity }} sold</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.stats-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stats-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1.5rem;
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
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.empty-state {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
  height: 160px;
}

.bar-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
}

.bar-value {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  margin-bottom: 0.3rem;
}

.bar {
  width: 100%;
  max-width: 32px;
  background: var(--color-primary);
  border-radius: 4px 4px 0 0;
  transition: height 0.4s ease;
  min-height: 2px;
}

.bar-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.4rem;
}

.best-sellers {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.best-sellers li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
}

.rank {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.item-name {
  flex: 1;
  font-size: 0.9rem;
}

.item-qty {
  color: var(--color-text-muted);
  font-size: 0.8rem;
  flex-shrink: 0;
}
</style>