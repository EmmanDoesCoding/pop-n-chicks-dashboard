<script setup>
import { ref } from 'vue'
import { useExpensesStore } from '../stores/expenses'

const emit = defineEmits(['expense-added'])

const expensesStore = useExpensesStore()

const description = ref('')
const amount = ref(null)

const descriptionError = ref('')
const amountError = ref('')

async function handleSubmit() {
  descriptionError.value = ''
  amountError.value = ''

  let hasError = false

  if (!description.value) {
    descriptionError.value = "This can't be empty"
    hasError = true
  }

  if (amount.value === null || amount.value === '') {
    amountError.value = "This can't be empty"
    hasError = true
  }

  if (hasError) return

  await expensesStore.addExpense({
    description: description.value,
    amount: amount.value,
  })

  emit('expense-added')

  description.value = ''
  amount.value = null
}
</script>

<template>
  <form class="expense-form" @submit.prevent="handleSubmit">
    <h2>Add Expense</h2>

    <label>What's this for?</label>
    <input type="text" v-model="description" placeholder="e.g. Rent, Ingredients, Gas" />
    <p v-if="descriptionError" class="field-error">{{ descriptionError }}</p>

    <label>Amount</label>
    <input type="number" v-model.number="amount" placeholder="0" />
    <p v-if="amountError" class="field-error">{{ amountError }}</p>

    <button type="submit">Add Expense</button>
  </form>
</template>

<style scoped>
.expense-form {
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
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

label {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 0.35rem;
  margin-top: 0.75rem;
}

input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  font-size: 1rem;
  transition: border-color var(--transition);
}

input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.field-error {
  color: var(--color-primary);
  font-size: 0.8rem;
  margin-top: 0.35rem;
}

button {
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.7rem;
  background: var(--color-primary);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background var(--transition),
    transform 0.1s ease;
}

button:hover {
  background: var(--color-primary-hover);
}

button:active {
  transform: scale(0.97);
}
</style>