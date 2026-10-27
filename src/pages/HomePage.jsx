import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Droplets, Leaf, DollarSign, ArrowRight, Star, Package } from 'lucide-react'
import { useStore } from '../store/useStore'

const steps = [
  { num: '01', title: 'Pilih Cairan', desc: 'Deterjen, sabun, shampoo, & lebih.' },
  { num: '02', title: 'Atur Jadwal', desc: 'Pilih hari & slot waktu kunjungan.' },
  { num: '03', title: 'Kami Datang', desc: 'Petugas menuang langsung ke botolmu.' },
]

const reviews = [
  { name: 'Putri A.', star: 5, text: 'Praktis banget! Deterjennya wangi dan hemat 60% dibanding beli botolan.', avatar: '👩' },
  { name: 'Budi S.', star: 5, text: 'Kurir tepat waktu dan ramah. Botol lamaku jadi berguna lagi!', avatar: '👨' },
  { name: 'Sari W.', star: 5, text: 'Sudah 3 bulan langganan. Nol sampah plastik!', avatar: '🧑‍💻' },
]

export default function HomePage({ onNavigate }) {
  const [bottles, setBottles] = useState(3)
  const { totalLiters, bottlesSaved, moneySaved } = useStore()

  const estimated = Math.round(bottles * 13000 * 0.45)

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 px-5 pt-12 pb-10 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute top-16 -right-2 w-16 h-16 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 left-10 w-24 h-24 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
              <Droplets size={16} className="text-emerald-600" />
            </div>
            <span className="text-white font-bold text-base tracking-tight">New Era Refill</span>
          </div>
          <h1 className="text-white text-2xl font-extrabold leading-tight mb-2">
            Isi Ulang ke<br />
            <span className="text-emerald-100">Rumahmu.</span>
          </h1>
          <p className="text-emerald-100 text-sm font-medium mb-5 leading-relaxed">
            Bawa botolmu sendiri. Petugas kami datang<br />
            menuang. Hemat uang & kurangi plastik.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('order')}
            className="flex items-center gap-2 bg-white text-emerald-700 font-bold px-5 py-3 rounded-2xl text-sm shadow-lg shadow-emerald-900/20"
          >
            Mulai Refill Sekarang
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="px-4 -mt-4 relative z-10">
        <div className="bg-amber-400 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎉</span>
            <div>
              <p className="text-amber-900 font-bold text-xs">Gratis Ongkir Perdana!</p>
              <p className="text-amber-800 text-xs">Untuk order pertamamu dalam radius 3 km.</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('order')}
            className="bg-amber-900 text-amber-100 text-[10px] font-bold px-3 py-1.5 rounded-xl"
          >
            Pesan
          </button>
        </div>
      </div>

      {/* How It Works */}
      <div className="px-5 mt-7">
        <h2 className="text-gray-800 font-extrabold text-base mb-4">Cara Kerjanya Mudah</h2>
        <div className="space-y-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-600 font-extrabold text-sm">{step.num}</span>
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{step.title}</p>
                <p className="text-gray-500 text-xs mt-0.5">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Calculator Widget */}
      <div className="px-5 mt-7">
        <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={16} className="text-emerald-600" />
            <h2 className="text-gray-800 font-extrabold text-sm">Kalkulator Hematmu</h2>
          </div>
          <p className="text-gray-500 text-xs mb-4">Geser sesuai botol plastik bulananmu</p>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-500 font-medium">Botol / bulan</span>
            <span className="text-emerald-600 font-extrabold text-lg">{bottles} botol</span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            value={bottles}
            onChange={(e) => setBottles(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-emerald-100 accent-emerald-500 cursor-pointer"
          />
          <div className="mt-4 bg-emerald-50 rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Estimasi hemat / bulan</p>
              <p className="text-emerald-600 font-extrabold text-xl">Rp {estimated.toLocaleString('id-ID')}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Plastik dihindari</p>
              <p className="text-gray-700 font-bold text-base">{bottles} botol</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Categories */}
      <div className="px-5 mt-7">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-800 font-extrabold text-base">Produk Tersedia</h2>
          <button onClick={() => onNavigate('order')} className="text-emerald-600 text-xs font-bold flex items-center gap-0.5">
            Lihat Semua <ChevronRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Deterjen Bio-Enzim', emoji: '👕', price: 'Rp 12/ml', bg: 'bg-blue-50', text: 'text-blue-700' },
            { name: 'Sabun Cuci Piring', emoji: '🍋', price: 'Rp 10/ml', bg: 'bg-orange-50', text: 'text-orange-700' },
            { name: 'Sabun Mandi', emoji: '🧴', price: 'Rp 15/ml', bg: 'bg-pink-50', text: 'text-pink-700' },
            { name: 'Shampoo Kemiri', emoji: '💆', price: 'Rp 18/ml', bg: 'bg-amber-50', text: 'text-amber-700' },
          ].map((p) => (
            <motion.button
              key={p.name}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('order')}
              className={`${p.bg} rounded-2xl p-4 text-left border border-white shadow-sm`}
            >
              <span className="text-2xl">{p.emoji}</span>
              <p className={`font-bold text-xs mt-2 ${p.text}`}>{p.name}</p>
              <p className="text-gray-500 text-xs mt-0.5">{p.price}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="px-5 mt-7">
        <h2 className="text-gray-800 font-extrabold text-base mb-4">Kata Pelanggan Kami</h2>
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.name} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-sm">
                  {r.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-xs">{r.name}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.star }).map((_, i) => (
                      <Star key={i} size={10} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed">"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Bottom */}
      <div className="px-5 mt-7">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('order')}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
        >
          <Package size={18} />
          Pesan Refill Sekarang
        </motion.button>
      </div>
    </div>
  )
}
