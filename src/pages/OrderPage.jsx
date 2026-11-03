import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2, ChevronRight, Info, CheckCircle2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { products, bottleOptions } from '../data/products'
import BottomSheet from '../components/BottomSheet'

const CATEGORIES = ['Semua', 'Pencuci', 'Perawatan', 'Rumah']
const QUICK_VOLUMES = [250, 500, 1000, 2000]

// ─── Product Config Sheet ─────────────────────────────────────────────────────
function ProductConfigSheet({ product, isOpen, onClose, onAdd }) {
  const [volume, setVolume] = useState(500)
  const [bottleOpt, setBottleOpt] = useState('own')
  const [step, setStep] = useState(0) // 0 = volume, 1 = bottle
  const [added, setAdded] = useState(false)

  const selectedBottle = bottleOptions.find(b => b.id === bottleOpt)
  const subtotal = product ? product.pricePerMl * volume + (selectedBottle?.price || 0) : 0

  const handleClose = () => {
    setVolume(500)
    setBottleOpt('own')
    setStep(0)
    setAdded(false)
    onClose()
  }

  const handleAdd = () => {
    if (!product) return
    onAdd({
      id: product.id,
      name: product.name,
      emoji: product.emoji,
      pricePerMl: product.pricePerMl,
      volume,
      bottleOption: bottleOpt,
      bottleLabel: selectedBottle?.label,
      bottlePrice: selectedBottle?.price || 0,
    })
    setAdded(true)
    setTimeout(() => {
      setAdded(false)
      handleClose()
    }, 900)
  }

  if (!product) return null

  // Sticky footer — always visible, never cut off
  const stickyFooter = (
    <div className="bg-gray-900 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-gray-400 text-[10px]">Total item ini</p>
          <p className="text-white font-extrabold text-xl">Rp {subtotal.toLocaleString('id-ID')}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-[10px]">
            {volume >= 1000 ? `${volume / 1000}L` : `${volume}ml`} · {selectedBottle?.label}
          </p>
          <p className="text-emerald-400 text-xs font-medium">{product.name}</p>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleAdd}
        className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
          added
            ? 'bg-emerald-400 text-white'
            : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
        }`}
      >
        {added ? (
          <><CheckCircle2 size={16} /> Ditambahkan ke Keranjang!</>
        ) : (
          <><ShoppingBag size={16} /> Tambahkan ke Keranjang</>
        )}
      </motion.button>
    </div>
  )

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose} title={null} footer={stickyFooter}>
      <div className="pb-4">
        {/* Product Header */}
        <div className={`rounded-2xl p-4 mb-5 bg-gradient-to-br ${product.gradient} border ${product.border}`}>
          <div className="flex items-start gap-3">
            <span className="text-4xl">{product.emoji}</span>
            <div className="flex-1">
              <h2 className="font-extrabold text-gray-800 text-base leading-tight">{product.name}</h2>
              <p className="text-gray-500 text-xs mt-1 leading-relaxed">{product.description}</p>
              <div className="flex gap-1.5 flex-wrap mt-2">
                {product.tags.map(t => (
                  <span key={t} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${product.badge}`}>{t}</span>
                ))}
              </div>
            </div>
            <span className={`text-xs font-bold ${product.accent} mt-1 flex-shrink-0`}>
              Rp {product.pricePerMl}/ml
            </span>
          </div>
        </div>

        {/* Step Tabs */}
        <div className="flex gap-0 mb-5 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setStep(0)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${step === 0 ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}
          >
            1 · Takaran (ml)
          </button>
          <button
            onClick={() => setStep(1)}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${step === 1 ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400'}`}
          >
            2 · Pilih Wadah
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 ? (
            /* ── STEP 1: Volume ── */
            <motion.div
              key="volume"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.18 }}
            >
              <p className="text-xs text-gray-400 font-medium mb-3">Pilih seberapa banyak yang ingin kamu isi:</p>

              {/* Quick presets */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {QUICK_VOLUMES.map(v => (
                  <button
                    key={v}
                    onClick={() => setVolume(v)}
                    className={`py-3 rounded-xl text-xs font-bold transition-all duration-150 ${
                      volume === v
                        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {v >= 1000 ? `${v / 1000}L` : `${v}ml`}
                  </button>
                ))}
              </div>

              {/* Custom stepper */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-3 mb-4">
                <p className="text-[10px] text-gray-400 font-semibold mb-2 text-center tracking-wide">ATAU ATUR MANUAL</p>
                <div className="flex items-center gap-3 justify-center">
                  <button
                    onClick={() => setVolume(v => Math.max(50, v - 50))}
                    className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                  >
                    <Minus size={16} className="text-gray-600" />
                  </button>
                  <div className="flex-1 text-center">
                    <input
                      type="number"
                      value={volume}
                      onChange={e => setVolume(Math.max(50, Number(e.target.value)))}
                      className="w-full text-center font-extrabold text-gray-800 text-2xl bg-transparent outline-none"
                    />
                    <p className="text-[10px] text-gray-400 -mt-1">mililiter</p>
                  </div>
                  <button
                    onClick={() => setVolume(v => v + 50)}
                    className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm"
                  >
                    <Plus size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Estimated cost preview */}
              <div className="flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100 mb-4">
                <p className="text-xs text-emerald-700 font-medium">
                  {volume >= 1000 ? `${volume / 1000}L` : `${volume}ml`} × Rp {product.pricePerMl}/ml
                </p>
                <p className="font-extrabold text-emerald-700">= Rp {(product.pricePerMl * volume).toLocaleString('id-ID')}</p>
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full py-3.5 bg-gray-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
              >
                Selanjutnya: Pilih Wadah
                <ChevronRight size={16} />
              </button>
            </motion.div>
          ) : (
            /* ── STEP 2: Bottle ── */
            <motion.div
              key="bottle"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.18 }}
            >
              <p className="text-xs text-gray-400 font-medium mb-3">Mau pakai wadah apa untuk refill ini?</p>

              <div className="space-y-2 mb-4">
                {bottleOptions.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setBottleOpt(opt.id)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${
                      bottleOpt === opt.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm">{opt.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs font-bold ${opt.price === 0 ? 'text-emerald-600' : 'text-gray-700'}`}>
                        {opt.price === 0 ? 'Gratis' : `+Rp ${opt.price.toLocaleString('id-ID')}`}
                      </span>
                      {bottleOpt === opt.id && <CheckCircle2 size={14} className="text-emerald-500" />}
                    </div>
                  </button>
                ))}
              </div>

              {bottleOpt === 'own' && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 mb-2">
                  <Info size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700 font-medium leading-relaxed">
                    Pastikan botolmu sudah dibilas bersih & kering sebelum petugas tiba ya! 🧼
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BottomSheet>
  )
}

// ─── Cart Sheet ────────────────────────────────────────────────────────────────
function CartSheet({ isOpen, onClose, onCheckout }) {
  const { cart, removeFromCart, getCartTotal, getTotalVolume } = useStore()
  const total = getCartTotal()
  const totalVol = getTotalVolume()

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Keranjang Saya 🛒">
      <div className="pb-4">
        {cart.length === 0 ? (
          <div className="text-center py-10">
            <span className="text-5xl">🛒</span>
            <p className="text-gray-400 text-sm mt-3 font-medium">Keranjangmu masih kosong</p>
            <p className="text-gray-400 text-xs mt-1">Tap produk di atas untuk mulai memesan</p>
          </div>
        ) : (
          <>
            <div className="space-y-2 mb-4">
              {cart.map(item => {
                const sub = item.pricePerMl * item.volume + (item.bottlePrice || 0)
                return (
                  <div key={item.cartId} className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3.5 border border-gray-100">
                    <div className="w-11 h-11 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-xl shadow-sm">
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 text-xs truncate">{item.name}</p>
                      <p className="text-gray-400 text-[10px] mt-0.5">
                        {item.volume >= 1000 ? `${item.volume / 1000}L` : `${item.volume}ml`} · {item.bottleLabel}
                      </p>
                      <p className="text-emerald-600 font-bold text-sm mt-0.5">Rp {sub.toLocaleString('id-ID')}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.cartId)}
                      className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center"
                    >
                      <Trash2 size={13} className="text-red-400" />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Total */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">
                  {cart.length} produk · {totalVol >= 1000 ? `${totalVol / 1000}L` : `${totalVol}ml`} total
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-gray-800">Total Belanja</span>
                <span className="text-lg font-extrabold text-emerald-600">Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { onClose(); onCheckout() }}
              className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
            >
              Lanjut ke Pengiriman
              <ChevronRight size={16} />
            </motion.button>
          </>
        )}
      </div>
    </BottomSheet>
  )
}

// ─── Product Card (compact) ────────────────────────────────────────────────────
function ProductCard({ product, onSelect, cartCount }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(product)}
      className={`w-full text-left bg-gradient-to-br ${product.gradient} rounded-2xl p-4 border ${product.border} shadow-sm relative`}
    >
      {/* Cart badge */}
      {cartCount > 0 && (
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-sm">
          <span className="text-white text-[10px] font-extrabold">{cartCount}</span>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-white/60 flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
          {product.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-gray-800 text-sm leading-tight">{product.name}</h3>
            <span className={`text-xs font-bold ${product.accent} flex-shrink-0`}>
              Rp {product.pricePerMl}/ml
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-0.5 leading-relaxed line-clamp-2">{product.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex gap-1 flex-wrap">
          {product.tags.slice(0, 2).map(t => (
            <span key={t} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${product.badge}`}>{t}</span>
          ))}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${product.accent}`}>
          Tap untuk pilih <ChevronRight size={12} />
        </div>
      </div>
    </motion.button>
  )
}

// ─── Main OrderPage ────────────────────────────────────────────────────────────
export default function OrderPage({ onCheckout, onSheetToggle }) {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showCart, setShowCart] = useState(false)

  const { cart, addToCart, getCartTotal, getTotalVolume } = useStore()

  const filtered = activeCategory === 'Semua'
    ? products
    : products.filter(p => p.category === activeCategory)

  const total = getCartTotal()
  const totalVol = getTotalVolume()
  const hasCart = cart.length > 0

  const getCartCount = (productId) => cart.filter(c => c.id === productId).length

  const openProduct = (product) => {
    setSelectedProduct(product)
    onSheetToggle?.(true)
  }

  const closeProduct = () => {
    setSelectedProduct(null)
    onSheetToggle?.(false)
  }

  const openCart = () => {
    setShowCart(true)
    onSheetToggle?.(true)
  }

  const closeCart = () => {
    setShowCart(false)
    onSheetToggle?.(false)
  }

  return (
    <div className="pb-36">
      {/* ── Header ── */}
      <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-start justify-between mb-1">
          <div>
            <h1 className="text-xl font-extrabold text-gray-800">Pilih Produk Refill</h1>
            <p className="text-gray-400 text-xs mt-0.5">Tap produk untuk mengatur takaran & wadah</p>
          </div>
          {hasCart && (
            <button
              onClick={() => openCart()}
              className="relative flex-shrink-0 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/30"
            >
              <ShoppingBag size={18} className="text-white" />
              <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-800 rounded-full flex items-center justify-center">
                <span className="text-white text-[9px] font-extrabold">{cart.length}</span>
              </div>
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="px-4 pt-4 space-y-3">
        <AnimatePresence>
          {filtered.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={openProduct}
              cartCount={getCartCount(p.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* ── Sticky Cart Bar ── */}
      <AnimatePresence>
        {hasCart && (
          <motion.div
            key="cartbar"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40"
          >
            <button
              onClick={() => openCart()}
              className="w-full bg-gray-900 rounded-2xl p-4 flex items-center justify-between shadow-2xl"
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={18} className="text-emerald-400" />
                <div>
                  <p className="text-white text-xs font-bold">
                    {cart.length} produk · {totalVol >= 1000 ? `${totalVol / 1000}L` : `${totalVol}ml`}
                  </p>
                  <p className="text-emerald-400 font-extrabold text-base leading-tight">
                    Rp {total.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm shadow-emerald-500/30">
                Lihat Keranjang <ChevronRight size={14} />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Product Config Sheet ── */}
      <ProductConfigSheet
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={closeProduct}
        onAdd={addToCart}
      />

      {/* ── Cart Sheet ── */}
      <CartSheet
        isOpen={showCart}
        onClose={closeCart}
        onCheckout={onCheckout}
      />
    </div>
  )
}
