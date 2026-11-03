import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin, Navigation, Clock, ChevronLeft, ChevronRight,
  Package, CreditCard, Wallet, Loader2, CheckCircle2
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { timeSlots } from '../data/products'

// Generate next 7 days
function getDateOptions() {
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  const dates = []
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    dates.push({
      id: d.toISOString().split('T')[0],
      day: days[d.getDay()],
      date: d.getDate(),
      month: months[d.getMonth()],
    })
  }
  return dates
}

// Section wrapper with label + completion indicator
function Section({ icon, title, done, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className={`flex items-center justify-between px-4 py-3 border-b ${done ? 'border-emerald-100 bg-emerald-50' : 'border-gray-100 bg-gray-50'}`}>
        <div className="flex items-center gap-2">
          <span className={done ? 'text-emerald-500' : 'text-gray-400'}>{icon}</span>
          <span className={`text-sm font-bold ${done ? 'text-emerald-700' : 'text-gray-700'}`}>{title}</span>
        </div>
        {done && <CheckCircle2 size={16} className="text-emerald-500" />}
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}

export default function CheckoutPage({ onBack, onConfirm }) {
  const scrollRef = useRef(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsError, setGpsError] = useState('')

  const {
    address, setAddress,
    addressNote, setAddressNote,
    selectedDate, setSelectedDate,
    selectedSlot, setSelectedSlot,
    paymentMethod, setPaymentMethod,
    cart, getCartTotal
  } = useStore()

  const dateOptions = getDateOptions()
  const total = getCartTotal()
  const ongkir = total >= 20000 ? 0 : 5000
  const isValid = address.trim() && selectedDate && selectedSlot

  // Scroll to top when page mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  // Auto-summarize bottles from cart
  const bottleSummary = (() => {
    const counts = {}
    cart.forEach(item => {
      const label = item.bottleLabel || 'Botol Sendiri'
      counts[label] = (counts[label] || 0) + 1
    })
    return Object.entries(counts).map(([label, count]) =>
      count > 1 ? `${count}× ${label}` : label
    ).join(', ')
  })()

  // GPS with reverse geocoding (Nominatim)
  const handleGPS = () => {
    setGpsLoading(true)
    setGpsError('')
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=id`,
            { headers: { 'Accept-Language': 'id' } }
          )
          const data = await res.json()
          const a = data.address || {}
          // Build human-readable address from components
          const parts = [
            a.road,
            a.neighbourhood || a.suburb,
            a.village || a.town || a.city_district,
            a.city || a.regency || a.county,
            a.state,
          ].filter(Boolean)
          setAddress(parts.join(', ') || data.display_name)
        } catch {
          setGpsError('Tidak bisa mendapatkan nama jalan. Silakan ketik manual.')
        } finally {
          setGpsLoading(false)
        }
      },
      () => {
        setGpsError('Izin lokasi ditolak. Silakan ketik alamat secara manual.')
        setGpsLoading(false)
      },
      { timeout: 10000 }
    )
  }

  return (
    <div ref={scrollRef} className="pb-32">
      {/* ── Header ── */}
      <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-gray-800">Atur Pengantaran</h1>
            <p className="text-gray-400 text-xs">Lengkapi 3 bagian di bawah untuk melanjutkan</p>
          </div>
        </div>
      </div>

      {/* ── Progress indicator ── */}
      <div className="flex gap-2 px-5 py-3 bg-white border-b border-gray-50">
        {[
          { label: 'Alamat', done: !!address.trim() },
          { label: 'Jadwal', done: !!(selectedDate && selectedSlot) },
          { label: 'Pembayaran', done: !!paymentMethod },
        ].map((step, i) => (
          <div key={i} className="flex items-center gap-1.5 flex-1">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-extrabold ${step.done ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {step.done ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] font-semibold ${step.done ? 'text-emerald-600' : 'text-gray-400'}`}>{step.label}</span>
            {i < 2 && <div className={`flex-1 h-0.5 rounded-full ${step.done ? 'bg-emerald-200' : 'bg-gray-100'}`} />}
          </div>
        ))}
      </div>

      <div className="px-4 pt-4 space-y-3">

        {/* ── 1. Alamat ── */}
        <Section
          icon={<MapPin size={16} />}
          title="Alamat Pengantaran"
          done={!!address.trim()}
        >
          <div className="space-y-2.5">
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Tulis alamat lengkap kamu..."
              rows={3}
              autoFocus
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-400 focus:bg-white transition-colors resize-none"
            />

            <button
              onClick={handleGPS}
              disabled={gpsLoading}
              className="flex items-center gap-2 w-full bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-60"
            >
              {gpsLoading
                ? <Loader2 size={16} className="animate-spin" />
                : <Navigation size={16} />}
              {gpsLoading ? 'Mencari alamatmu...' : 'Gunakan Lokasi GPS Saya'}
            </button>

            {gpsError && (
              <p className="text-xs text-red-500 font-medium px-1">{gpsError}</p>
            )}

            <input
              value={addressNote}
              onChange={e => setAddressNote(e.target.value)}
              placeholder='Patokan lokasi (cth: "Pagar biru depan masjid")'
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-400 focus:bg-white transition-colors"
            />
          </div>
        </Section>

        {/* ── 2. Jadwal ── */}
        <Section
          icon={<Clock size={16} />}
          title="Jadwal Kunjungan"
          done={!!(selectedDate && selectedSlot)}
        >
          <div className="space-y-3">
            {/* Date picker */}
            <div>
              <p className="text-xs text-gray-400 font-semibold mb-2">Pilih Tanggal</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {dateOptions.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDate(d.id)}
                    className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-2xl border-2 transition-all min-w-[60px] ${
                      selectedDate === d.id
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : 'border-gray-100 bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span className="text-[10px] font-semibold opacity-80">{d.day}</span>
                    <span className="text-lg font-extrabold">{d.date}</span>
                    <span className="text-[10px] font-medium opacity-80">{d.month}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time slot */}
            <div>
              <p className="text-xs text-gray-400 font-semibold mb-2">Pilih Sesi</p>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                      selectedSlot === slot.id
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-100 bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{slot.icon}</span>
                    <p className="font-bold text-gray-800 text-sm mt-1.5">{slot.label}</p>
                    <p className="text-gray-500 text-xs">{slot.time}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* ── 3. Pembayaran ── */}
        <Section
          icon={<CreditCard size={16} />}
          title="Metode Pembayaran"
          done={!!paymentMethod}
        >
          <div className="space-y-2">
            {[
              { id: 'qris', label: 'QRIS / Transfer Digital', desc: 'GoPay, OVO, DANA, BCA', icon: <CreditCard size={18} className="text-purple-500" /> },
              { id: 'cod', label: 'Bayar Tunai di Tempat (COD)', desc: 'Bayar langsung ke petugas New Era', icon: <Wallet size={18} className="text-emerald-500" /> },
            ].map(method => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                  paymentMethod === method.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                  {method.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-sm">{method.label}</p>
                  <p className="text-gray-500 text-xs">{method.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  paymentMethod === method.id ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                }`}>
                  {paymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
              </button>
            ))}
          </div>
        </Section>

        {/* ── Ringkasan Pesanan ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-bold text-gray-800 text-sm mb-3">Ringkasan Pesanan</h2>

          {/* Bottle summary — auto from cart */}
          <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 mb-3">
            <span className="text-base">📦</span>
            <div>
              <p className="text-xs font-bold text-blue-700">Wadah yang Disiapkan</p>
              <p className="text-xs text-blue-600 mt-0.5">{bottleSummary}</p>
            </div>
          </div>

          <div className="space-y-2 mb-3">
            {cart.map(item => (
              <div key={item.cartId} className="flex items-center justify-between">
                <span className="text-xs text-gray-600 flex items-center gap-1.5">
                  <span>{item.emoji}</span>
                  {item.name} ({item.volume >= 1000 ? `${item.volume / 1000}L` : `${item.volume}ml`})
                </span>
                <span className="text-xs font-semibold text-gray-800">
                  Rp {(item.pricePerMl * item.volume + item.bottlePrice).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Subtotal</span>
              <span className="text-xs font-semibold">Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500">Biaya Layanan</span>
              <span className={`text-xs font-semibold ${ongkir === 0 ? 'text-emerald-600' : ''}`}>
                {ongkir === 0 ? 'Gratis 🎉' : `Rp ${ongkir.toLocaleString('id-ID')}`}
              </span>
            </div>
            {ongkir > 0 && (
              <p className="text-[10px] text-gray-400">Gratis biaya layanan untuk pesanan ≥ Rp 20.000</p>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-800">Total</span>
              <span className="text-sm font-extrabold text-emerald-600">Rp {(total + ongkir).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Confirm Button ── */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pb-6 pt-3 bg-white border-t border-gray-100 z-40">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={isValid ? onConfirm : undefined}
          className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
            isValid
              ? 'bg-emerald-500 text-white shadow-emerald-500/30'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Package size={18} />
          {isValid ? 'Konfirmasi Pesanan' : 'Lengkapi alamat & jadwal terlebih dahulu'}
        </motion.button>
      </div>
    </div>
  )
}
