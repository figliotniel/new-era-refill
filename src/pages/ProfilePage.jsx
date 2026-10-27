import { motion } from 'framer-motion'
import { Droplets, Leaf, DollarSign, History, LogOut, ChevronRight, Award } from 'lucide-react'
import { useStore } from '../store/useStore'

const badges = [
  { icon: '🌊', label: 'Pahlawan Sungai', desc: 'Sudah 10 Liter direfill', unlocked: true },
  { icon: '♻️', label: 'Bebas Plastik', desc: '20+ botol plastik dihindari', unlocked: true },
  { icon: '🌿', label: 'Pejuang Bumi', desc: 'Refill 3 bulan berturut-turut', unlocked: false },
  { icon: '⭐', label: 'Pelanggan Setia', desc: '10x pemesanan', unlocked: false },
]

const history = [
  { date: '24 Okt 2026', items: 'Deterjen Bio-Enzim (1L) · Sabun Mandi (500ml)', total: 19500, status: 'Selesai' },
  { date: '12 Okt 2026', items: 'Shampoo Kemiri (500ml)', total: 9000, status: 'Selesai' },
  { date: '3 Okt 2026', items: 'Sabun Cuci Piring (1L) · Pembersih Lantai (1L)', total: 18000, status: 'Selesai' },
]

export default function ProfilePage() {
  const { totalLiters, bottlesSaved, moneySaved } = useStore()

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-500 px-5 pt-12 pb-8 relative overflow-hidden">
        <div className="absolute -top-4 -right-4 w-28 h-28 rounded-full bg-white/10" />
        <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl border border-white/30">
            👤
          </div>
          <div>
            <h1 className="text-white font-extrabold text-lg">Siti Nuraeni</h1>
            <p className="text-emerald-100 text-xs">siti.nuraeni@email.com</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="bg-white/20 rounded-full px-2 py-0.5">
                <span className="text-white text-[10px] font-bold">🌿 Pelanggan New Era</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Eco Impact Stats */}
      <div className="px-4 -mt-5 relative z-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-1.5 mb-4">
            <Leaf size={14} className="text-emerald-600" />
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Dampak Lingkunganmu</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <Droplets size={18} className="text-blue-500" />
              </div>
              <p className="text-xl font-extrabold text-gray-800">{totalLiters}L</p>
              <p className="text-[10px] text-gray-500 leading-tight">Total Cairan Direfill</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <span className="text-lg">🧴</span>
              </div>
              <p className="text-xl font-extrabold text-gray-800">{bottlesSaved}</p>
              <p className="text-[10px] text-gray-500 leading-tight">Botol Plastik Dihindari</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mx-auto mb-1.5">
                <DollarSign size={18} className="text-emerald-500" />
              </div>
              <p className="text-xl font-extrabold text-gray-800">
                {(moneySaved / 1000).toFixed(0)}rb
              </p>
              <p className="text-[10px] text-gray-500 leading-tight">Total Uang Dihemat</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="px-5 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <Award size={16} className="text-amber-500" />
          <h2 className="font-extrabold text-gray-800 text-base">Lencana Lingkungan</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => (
            <motion.div
              key={badge.label}
              whileTap={{ scale: 0.97 }}
              className={`rounded-2xl p-4 border text-center transition-all ${
                badge.unlocked
                  ? 'bg-white border-emerald-100 shadow-sm'
                  : 'bg-gray-50 border-gray-100 opacity-50'
              }`}
            >
              <div className={`text-3xl mb-2 ${!badge.unlocked ? 'grayscale' : ''}`}>
                {badge.unlocked ? badge.icon : '🔒'}
              </div>
              <p className={`text-xs font-bold ${badge.unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                {badge.label}
              </p>
              <p className="text-[10px] text-gray-500 mt-0.5">{badge.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Share Button */}
        <button className="w-full mt-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20">
          🌿 Bagikan Dampakku ke Instagram
        </button>
      </div>

      {/* Order History */}
      <div className="px-5 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <History size={16} className="text-gray-600" />
          <h2 className="font-extrabold text-gray-800 text-base">Riwayat Pesanan</h2>
        </div>
        <div className="space-y-2">
          {history.map((h, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-gray-800">{h.date}</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full">
                  {h.status}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{h.items}</p>
              <p className="text-sm font-extrabold text-emerald-600 mt-1.5">Rp {h.total.toLocaleString('id-ID')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-5 mt-6">
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {[
            { label: 'Alamat Tersimpan', icon: '📍' },
            { label: 'Metode Pembayaran', icon: '💳' },
            { label: 'Notifikasi', icon: '🔔' },
            { label: 'Bantuan & FAQ', icon: '❓' },
            { label: 'Tentang New Era', icon: '🌿' },
          ].map(item => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span className="text-sm font-semibold text-gray-700">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="px-5 mt-4">
        <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-red-100 text-red-500 font-bold text-sm">
          <LogOut size={16} />
          Keluar dari Akun
        </button>
      </div>
    </div>
  )
}
