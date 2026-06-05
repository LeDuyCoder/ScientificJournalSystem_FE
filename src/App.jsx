import AppRoutes from './app/routes/AppRoutes'
import './App.css'

// App.jsx chỉ làm một việc duy nhất: gọi AppRoutes
// Không chứa logic hay component nào khác
const App = () => {
  return <AppRoutes />
}

export default App