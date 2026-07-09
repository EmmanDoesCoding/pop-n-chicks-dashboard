import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])
  const loading = ref(false)

  async function fetchOrders() {
    loading.value = true

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    loading.value = false

    if (error) {
      console.error('Error fetching orders:', error.message)
      return
    }

    orders.value = data
  }

  async function addOrder(order) {
    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: order.customerName,
        items: order.items,
        total: order.total,
        amount_paid: order.amountPaid,
        change: order.change,
        completed: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding order:', error.message)
      return
    }

    orders.value.unshift(data)
  }

  async function toggleComplete(id) {
    const order = orders.value.find((o) => o.id === id)
    if (!order) return

    const newValue = !order.completed

    const { error } = await supabase.from('orders').update({ completed: newValue }).eq('id', id)

    if (error) {
      console.error('Error updating order:', error.message)
      return
    }

    order.completed = newValue
  }

  const totalOrders = computed(() => orders.value.length)

  const dailyEarnings = computed(() => {
    const today = new Date()

    return orders.value
      .filter((order) => {
        const orderDate = new Date(order.created_at)
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
        const orderDate = new Date(order.created_at)
        return (
          orderDate.getFullYear() === today.getFullYear() &&
          orderDate.getMonth() === today.getMonth()
        )
      })
      .reduce((sum, order) => sum + order.total, 0)
  })

const bestSellingItems = computed(() => {
    const counts = {}

    orders.value.forEach((order) => {
      order.items.forEach((item) => {
        if (!counts[item.name]) {
          counts[item.name] = 0
        }
        counts[item.name] += item.quantity
      })
    })

    return Object.entries(counts)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
  })

  const last7DaysEarnings = computed(() => {
    const days = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      const dayTotal = orders.value
        .filter((order) => {
          const orderDate = new Date(order.created_at)
          return (
            orderDate.getFullYear() === date.getFullYear() &&
            orderDate.getMonth() === date.getMonth() &&
            orderDate.getDate() === date.getDate()
          )
        })
        .reduce((sum, order) => sum + order.total, 0)

      days.push({
        label: date.toLocaleDateString([], { weekday: 'short' }),
        total: dayTotal,
      })
    }

    return days
  })


  return {
    orders,
    loading,
    fetchOrders,
    addOrder,
    toggleComplete,
    totalOrders,
    dailyEarnings,
    monthlyEarnings,
    bestSellingItems,
    last7DaysEarnings,
  }
})