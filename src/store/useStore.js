import { create } from 'zustand'

export const useStore = create((set, get) => ({
  // Cart items
  cart: [],

  // Order state
  address: '',
  addressNote: '',
  coords: null,
  selectedDate: '',
  selectedSlot: '',
  bottleCount: 1,
  paymentMethod: 'qris',

  // Order tracking
  currentOrderId: null,
  orderStatus: 0, // 0-4 steps

  // Eco stats
  totalLiters: 14.5,
  bottlesSaved: 29,
  moneySaved: 145000,

  // Cart actions
  addToCart: (item) => set((state) => {
    const existing = state.cart.find(c => c.id === item.id && c.bottleOption === item.bottleOption)
    if (existing) {
      return {
        cart: state.cart.map(c =>
          c.id === item.id && c.bottleOption === item.bottleOption
            ? { ...c, volume: c.volume + item.volume }
            : c
        )
      }
    }
    return { cart: [...state.cart, { ...item, cartId: Date.now() }] }
  }),

  removeFromCart: (cartId) => set((state) => ({
    cart: state.cart.filter(c => c.cartId !== cartId)
  })),

  updateVolume: (cartId, volume) => set((state) => ({
    cart: state.cart.map(c => c.cartId === cartId ? { ...c, volume } : c)
  })),

  clearCart: () => set({ cart: [] }),

  // Address actions
  setAddress: (address) => set({ address }),
  setAddressNote: (addressNote) => set({ addressNote }),
  setCoords: (coords) => set({ coords }),
  setSelectedDate: (selectedDate) => set({ selectedDate }),
  setSelectedSlot: (selectedSlot) => set({ selectedSlot }),
  setBottleCount: (bottleCount) => set({ bottleCount }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

  // Order tracking
  placeOrder: () => set({
    currentOrderId: `NE-${Date.now().toString().slice(-6)}`,
    orderStatus: 0,
  }),

  advanceOrderStatus: () => set((state) => ({
    orderStatus: Math.min(state.orderStatus + 1, 4)
  })),

  // Computed
  getCartTotal: () => {
    const { cart } = get()
    return cart.reduce((sum, item) => sum + (item.pricePerMl * item.volume) + (item.bottlePrice || 0), 0)
  },

  getTotalVolume: () => {
    const { cart } = get()
    return cart.reduce((sum, item) => sum + item.volume, 0)
  },
}))
