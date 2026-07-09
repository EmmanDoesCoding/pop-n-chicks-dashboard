import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useExpensesStore = defineStore('expenses', () => {
  const expenses = ref([])

  async function fetchExpenses() {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching expenses:', error.message)
      return
    }

    expenses.value = data
  }

  async function addExpense(expense) {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        description: expense.description,
        amount: expense.amount,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding expense:', error.message)
      return
    }

    expenses.value.unshift(data)
  }

  const dailyExpenses = computed(() => {
    const today = new Date()

    return expenses.value
      .filter((exp) => {
        const expDate = new Date(exp.created_at)
        return (
          expDate.getFullYear() === today.getFullYear() &&
          expDate.getMonth() === today.getMonth() &&
          expDate.getDate() === today.getDate()
        )
      })
      .reduce((sum, exp) => sum + exp.amount, 0)
  })

  const monthlyExpenses = computed(() => {
    const today = new Date()

    return expenses.value
      .filter((exp) => {
        const expDate = new Date(exp.created_at)
        return (
          expDate.getFullYear() === today.getFullYear() &&
          expDate.getMonth() === today.getMonth()
        )
      })
      .reduce((sum, exp) => sum + exp.amount, 0)
  })

  return {
    expenses,
    fetchExpenses,
    addExpense,
    dailyExpenses,
    monthlyExpenses,
  }
})