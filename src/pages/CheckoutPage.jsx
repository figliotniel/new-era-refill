import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Clock, ChevronLeft, ChevronRight, Package, CreditCard, Wallet } from 'lucide-react'
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

export default function CheckoutPage({ onBack, onConfirm }) {
  const {
    address, setAddress,
    addressNote, setAddressNote,
    selectedDate, setSelectedDate,
    selectedSlot, setSelectedSlot,
    bottleCount, setBottleCount,
    paymentMethod, setPaymentMethod,
    cart, getCartTotal
  } = useStore()

  const dateOptions = getDateOptions()
  const total = getCartTotal()
  const ongkir = total >= 20000 ? 0 : 5000

  const isValid = address.trim() && selectedDate && selectedSlot

  const handleGPS = () => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setAddress(`Lat: ${pos.coords.latitude.toFixed(5)}, Lng: ${pos.coords.longitude.toFixed(5)}`)
      },
      () => {
        setAddress('Gunakan GPS tidak berhasil. Ketik alamatmu.')
      }
    )
  }

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-gray-800">Atur Pengantaran</h1>
            <p className="text-gray-500 text-xs">Isi alamat & jadwal kunjungan petugas</p>
          </div>
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5">
        {/* Address Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} className="text-emerald-600" />
            <h2 className="font-bold text-gray-800 text-sm">Alamat Pengantaran</h2>
          </div>
          <div className="space-y-2.5">
            <div className="relative">
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Tulis alamat lengkap kamu..."
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-400 focus:bg-white transition-colors resize-none"
              />
            </div>
            <button
              onClick={handleGPS}
              className="flex items-center gap-2 w-full bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <Navigation size={16} />
              Gunakan Lokasi Saya Sekarang (GPS)
            </button>
            <input
              value={addressNote}
              onChange={e => setAddressNote(e.target.value)}
              placeholder='Patokan lokasi (cth: "Pagar biru depan masjid")'
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-400 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Date Selector */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-emerald-600" />
            <h2 className="font-bold text-gray-800 text-sm">Pilih Tanggal Kunjungan</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {dateOptions.map(d => (
              <button
                key={d.id}
                onClick={() => setSelectedDate(d.id)}
                className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-2xl border-2 transition-all min-w-[60px] ${
                  selectedDate === d.id
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : 'border-gray-100 bg-white text-gray-600'
                }`}
              >
                <span className="text-[10px] font-semibold opacity-80">{d.day}</span>
                <span className="text-lg font-extrabold">{d.date}</span>
                <span className="text-[10px] font-medium opacity-80">{d.month}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Time Slot */}
        <div>
          <h2 className="font-bold text-gray-800 text-sm mb-3">Pilih Sesi Kunjungan</h2>
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map(slot => (
              <button
                key={slot.id}
                onClick={() => setSelectedSlot(slot.id)}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedSlot === slot.id
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-100 bg-white'
                }`}
              >
                <span className="text-xl">{slot.icon}</span>
                <p className="font-bold text-gray-800 text-sm mt-2">{slot.label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{slot.time}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Bottle Count */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="font-bold text-gray-800 text-sm mb-1">Jumlah Botol yang Disiapkan</h2>
          <p className="text-gray-500 text-xs mb-3">Bantu kurir mempersiapkan corong yang sesuai.</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setBottleCount(Math.max(1, bottleCount - 1))}
              className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-lg"
            >−</button>
            <div className="flex-1 text-center">
              <span className="text-2xl font-extrabold text-gray-800">{bottleCount}</span>
              <span className="text-gray-500 text-sm ml-1">botol</span>
            </div>
            <button
              onClick={() => setBottleCount(bottleCount + 1)}
              className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg"
            >+</button>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h2 className="font-bold text-gray-800 text-sm mb-3">Metode Pembayaran</h2>
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
                    : 'border-gray-100 bg-white'
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
                  {method.icon}
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{method.label}</p>
                  <p className="text-gray-500 text-xs">{method.desc}</p>
                </div>
                <div className="ml-auto">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === method.id ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <h2 className="font-bold text-gray-800 text-sm mb-3">Ringkasan Pesanan</h2>
          <div className="space-y-2">
            {cart.map(item => (
              <div key={item.cartId} className="flex items-center justify-between">
                <span className="text-xs text-gray-600 flex items-center gap-1.5">
                  <span>{item.emoji}</span>
                  {item.name} ({item.volume} ml)
                </span>
                <span className="text-xs font-semibold text-gray-800">
                  Rp {(item.pricePerMl * item.volume + item.bottlePrice).toLocaleString('id-ID')}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mt-3 pt-3 space-y-1.5">
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
            <div className="flex justify-between pt-1 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-800">Total</span>
              <span className="text-sm font-extrabold text-emerald-600">Rp {(total + ongkir).toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-40">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={isValid ? onConfirm : undefined}
          className={`w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
            isValid
              ? 'bg-emerald-500 text-white shadow-emerald-500/30'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Package size={18} />
          {isValid ? 'Konfirmasi Pesanan' : 'Lengkapi alamat & jadwal'}
        </motion.button>
      </div>
    </div>
  )
}
