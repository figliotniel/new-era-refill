import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import OrderPage from './pages/OrderPage'
import CheckoutPage from './pages/CheckoutPage'
import TrackPage from './pages/TrackPage'
import ProfilePage from './pages/ProfilePage'
import { useStore } from './store/useStore'

// Leaflet CSS
import 'leaflet/dist/leaflet.css'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export default function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [showCheckout, setShowCheckout] = useState(false)
  const { placeOrder, clearCart } = useStore()

  const handleCheckout = () => setShowCheckout(true)
  const handleBackFromCheckout = () => setShowCheckout(false)
  const handleConfirmOrder = () => {
    placeOrder()
    clearCart()
    setShowCheckout(false)
    setActiveTab('track')
  }

  const renderPage = () => {
    if (showCheckout) {
      return (
        <motion.div key="checkout" {...pageVariants} transition={{ duration: 0.2 }}>
          <CheckoutPage onBack={handleBackFromCheckout} onConfirm={handleConfirmOrder} />
        </motion.div>
      )
    }
    switch (activeTab) {
      case 'home':
        return (
          <motion.div key="home" {...pageVariants} transition={{ duration: 0.2 }}>
            <HomePage onNavigate={(tab) => { setShowCheckout(false); setActiveTab(tab) }} />
          </motion.div>
        )
      case 'order':
        return (
          <motion.div key="order" {...pageVariants} transition={{ duration: 0.2 }}>
            <OrderPage onCheckout={handleCheckout} />
          </motion.div>
        )
      case 'track':
        return (
          <motion.div key="track" {...pageVariants} transition={{ duration: 0.2 }}>
            <TrackPage />
          </motion.div>
        )
      case 'profile':
        return (
          <motion.div key="profile" {...pageVariants} transition={{ duration: 0.2 }}>
            <ProfilePage />
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile container */}
      <div className="relative mx-auto w-full max-w-md min-h-screen bg-gray-50 overflow-x-hidden shadow-xl">
        <AnimatePresence mode="wait">
          {renderPage()}
        </AnimatePresence>

        {/* Bottom Nav - hidden during checkout */}
        {!showCheckout && (
          <BottomNav
            active={activeTab}
            onChange={(tab) => { setActiveTab(tab); setShowCheckout(false) }}
          />
        )}
      </div>
    </div>
  )
}
