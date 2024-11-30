import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import Navbar from './components/shared/Navbar'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import AddMoney from './components/AddMoney'
import WithdrawMoney from './components/WithdrawMoney'
import TransactionHistory from './components/TransactionHistory'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/addMoney',
    element: <AddMoney />
  },
  {
    path: '/withdraw',
    element: <WithdrawMoney />
  },
  {
    path: '/transaction',
    element: <TransactionHistory />
  },
  
])
function App() {

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}
export default App