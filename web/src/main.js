import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

// Phase 6: CLI Easter Egg — pesan di Console saat Inspect Element
if (typeof console !== 'undefined') {
  const style = 'color: #22c55e; font-family: monospace; font-size: 12px;'
  console.log('%c🐧 SYSADMIN.LOG', style)
  console.log('%cCurious? Good. That\'s how admins think. — Have a great day.', 'color: #64748b;')
}

const app = createApp(App)
app.use(router)
app.mount('#app')
