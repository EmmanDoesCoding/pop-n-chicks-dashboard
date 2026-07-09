import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])

  function addOrder(order) {
    orders.value.push({
      id: Date.now(),
      customerName: order.customerName,
      items: order.items,
      total: order.total,
      amountPaid: order.amountPaid,
      change: order.change,
      completed: false,
      createdAt: new Date(),
    })
  }

  function toggleComplete(id) {
    const order = orders.value.find((o) => o.id === id)
    if (order) {
      order.completed = !order.completed
    }
  }

  const totalOrders = computed(() => orders.value.length)

  const dailyEarnings = computed(() => {
    const today = new Date()

    return orders.value
      .filter((order) => {
        const orderDate = new Date(order.createdAt)
        return (
          orderDate.getFullYear() === today.getFullYear() &&
          orderDate.getMonth() === today.getMonth() &&
          orderDate.getDate() === today.getDate()
        )
      })
      .reduce((sum, order) => sum + order.total, 0)
  })

  const monthlyEarnings = computed(() => {
    const today = new Date()

    return orders.value
      .filter((order) => {
        const orderDate = new Date(order.createdAt)
        return (
          orderDate.getFullYear() === today.getFullYear() &&
          orderDate.getMonth() === today.getMonth()
        )
      })
      .reduce((sum, order) => sum + order.total, 0)
  })

  return {
    orders,
    addOrder,
    toggleComplete,
    totalOrders,
    dailyEarnings,
    monthlyEarnings,
  }
})