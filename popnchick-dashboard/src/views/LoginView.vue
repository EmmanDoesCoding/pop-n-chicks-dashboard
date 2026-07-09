<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

const router = useRouter()

async function handleLogin() {
  errorMessage.value = ''
  loading.value = true

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  loading.value = false

  if (error) {
    errorMessage.value = 'Wrong email or password. Please try again.'
    return
  }

  router.push({ name: 'dashboard' })
}

</script>

<template>
  <div class="login-page">
    <div class="login-card">
      <h1>Order Dashboard</h1>
      <p class="subtitle">Log in to continue</p>

      <form @submit.prevent="handleLogin">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="you@example.com" />

        <label>Password</label>
        <input type="password" v-model="password" placeholder="••••••••" />

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

        <button type="submit">Log In</button>
      </form>
    </div>
  </div>
</template>

<style scoped>

.error {
  background: var(--color-surface-2);
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  font-size: 0.8rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  animation: shake 0.3s ease;
}

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.login-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 2rem;
  width: 100%;
  max-width: 360px;
  position: relative;
  animation: fadeSlideUp 0.5s ease;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h1 {
  color: var(--color-primary);
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}



@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

label {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  margin-bottom: 0.35rem;
}

input {
  width: 100%;
  padding: 0.6rem 0.75rem;
  margin-bottom: 1rem;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  font-size: 1rem;
  transition:
    border-color var(--transition),
    transform var(--transition);
}

input:focus {
  outline: none;
  border-color: var(--color-primary);
  transform: scale(1.03);
}

button {
  width: 100%;
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