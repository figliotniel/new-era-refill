import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, ShoppingBag, Trash2, ChevronRight, Info } from 'lucide-react'
import { useStore } from '../store/useStore'
import { products, bottleOptions } from '../data/products'
import BottomSheet from '../components/BottomSheet'

const QUICK_VOLUMES = [250, 500, 1000, 2000]
const CATEGORIES = ['Semua', 'Pencuci', 'Perawatan', 'Rumah']

function ProductCard({ product, onAdd }) {
  const [volume, setVolume] = useState(500)
  const [bottleOpt, setBottleOpt] = useState('own')
  const [showBottleSheet, setShowBottleSheet] = useState(false)
  const [added, setAdded] = useState(false)

  const selectedBottle = bottleOptions.find(b => b.id === bottleOpt)
  const subtotal = product.pricePerMl * volume + (selectedBottle?.price || 0)

  const handleAdd = () => {
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
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${product.gradient} rounded-2xl p-4 border ${product.border} shadow-sm`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-2xl">{product.emoji}</span>
            <h3 className="font-extrabold text-gray-800 text-sm mt-1.5 leading-tight">{product.name}</h3>
            <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{product.description}</p>
          </div>
          <div className="flex flex-col items-end gap-1 ml-2">
            <span className={`text-xs font-bold ${product.accent}`}>
              Rp {product.pricePerMl}/ml
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap mb-3">
          {product.tags.map(t => (
            <span key={t} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${product.badge}`}>{t}</span>
          ))}
        </div>

        {/* Volume Selector */}
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-600 mb-2">Pilih Takaran (ml)</p>
          <div className="grid grid-cols-4 gap-1.5 mb-2">
            {QUICK_VOLUMES.map(v => (
              <button
                key={v}
                onClick={() => setVolume(v)}
                className={`py-1.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                  volume === v
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-white/70 text-gray-600 border border-gray-200'
                }`}
              >
                {v >= 1000 ? `${v / 1000}L` : `${v}`}
              </button>
            ))}
          </div>
          {/* Custom input */}
          <div className="flex items-center gap-2 bg-white/70 rounded-xl border border-gray-200 px-3 py-2">
            <button
              onClick={() => setVolume(v => Math.max(50, v - 50))}
              className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center"
            >
              <Minus size={12} className="text-gray-600" />
            </button>
            <div className="flex-1 text-center">
              <input
                type="number"
                value={volume}
                onChange={e => setVolume(Math.max(50, Number(e.target.value)))}
                className="w-full text-center font-bold text-gray-800 text-sm bg-transparent outline-none"
              />
            </div>
            <button
              onClick={() => setVolume(v => v + 50)}
              className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center"
            >
              <Plus size={12} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Bottle Option */}
        <button
          onClick={() => setShowBottleSheet(true)}
          className="w-full flex items-center justify-between bg-white/70 border border-gray-200 rounded-xl px-3 py-2.5 mb-3"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{selectedBottle?.icon}</span>
            <div className="text-left">
              <p className="text-xs font-bold text-gray-800">{selectedBottle?.label}</p>
              <p className="text-[10px] text-gray-500">{bottleOpt === 'own' ? 'Gratis' : `+Rp ${(selectedBottle?.price || 0).toLocaleString('id-ID')}`}</p>
            </div>
          </div>
          <ChevronRight size={14} className="text-gray-400" />
        </button>

        {/* Reminder */}
        {bottleOpt === 'own' && (
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-3">
            <Info size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-amber-700 font-medium">Pastikan botolmu sudah dibilas bersih & kering sebelum petugas tiba.</p>
          </div>
        )}

        {/* Subtotal + Add */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500">Subtotal</p>
            <p className="font-extrabold text-gray-800 text-base">Rp {subtotal.toLocaleString('id-ID')}</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              added
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
            }`}
          >
            {added ? '✓ Ditambah' : (
              <>
                <Plus size={14} />
                Tambahkan
              </>
            )}
          </motion.button>
        </div>
      </motion.div>

      {/* Bottle Options Sheet */}
      <BottomSheet
        isOpen={showBottleSheet}
        onClose={() => setShowBottleSheet(false)}
        title="Pilih Wadah"
      >
        <div className="space-y-2 pb-4">
          {bottleOptions.map(opt => (
            <button
              key={opt.id}
              onClick={() => { setBottleOpt(opt.id); setShowBottleSheet(false) }}
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
              <span className={`text-xs font-bold ${opt.price === 0 ? 'text-emerald-600' : 'text-gray-700'}`}>
                {opt.price === 0 ? 'Gratis' : `+Rp ${opt.price.toLocaleString('id-ID')}`}
              </span>
            </button>
          ))}
        </div>
      </BottomSheet>
    </>
  )
}

// Cart Item
function CartItem({ item, onRemove }) {
  const subtotal = item.pricePerMl * item.volume + (item.bottlePrice || 0)
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl p-3.5 border border-gray-100 shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl">
        {item.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 text-xs truncate">{item.name}</p>
        <p className="text-gray-500 text-[10px] mt-0.5">{item.volume} ml · {item.bottleLabel}</p>
        <p className="text-emerald-600 font-bold text-sm mt-0.5">Rp {subtotal.toLocaleString('id-ID')}</p>
      </div>
      <button
        onClick={() => onRemove(item.cartId)}
        className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center"
      >
        <Trash2 size={14} className="text-red-400" />
      </button>
    </div>
  )
}

export default function OrderPage({ onCheckout }) {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const { cart, addToCart, removeFromCart, getCartTotal, getTotalVolume } = useStore()

  const filtered = activeCategory === 'Semua'
    ? products
    : products.filter(p => p.category === activeCategory)

  const total = getCartTotal()
  const totalVol = getTotalVolume()
  const hasCart = cart.length > 0

  return (
    <div className="pb-36">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100 sticky top-0 z-30">
        <h1 className="text-xl font-extrabold text-gray-800 mb-1">Pilih Produk Refill</h1>
        <p className="text-gray-500 text-xs">Tambahkan produk & takaran yang kamu butuhkan.</p>
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

      <div className="px-4 pt-4 space-y-4">
        {/* Product List */}
        <AnimatePresence>
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} />
          ))}
        </AnimatePresence>

        {/* Cart Summary */}
        {hasCart && (
          <div className="mt-4">
            <h2 className="text-gray-800 font-extrabold text-base mb-3">Daftar Refill Saya</h2>
            <div className="space-y-2">
              {cart.map(item => (
                <CartItem key={item.cartId} item={item} onRemove={removeFromCart} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Bar */}
      {hasCart && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40"
        >
          <div className="bg-gray-900 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
            <div>
              <div className="flex items-center gap-1.5">
                <ShoppingBag size={14} className="text-emerald-400" />
                <span className="text-white text-xs font-semibold">{cart.length} produk · {totalVol} ml</span>
              </div>
              <p className="text-emerald-400 font-extrabold text-lg">Rp {total.toLocaleString('id-ID')}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onCheckout}
              className="bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm flex items-center gap-1.5 shadow-lg"
            >
              Lanjut
              <ChevronRight size={16} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
