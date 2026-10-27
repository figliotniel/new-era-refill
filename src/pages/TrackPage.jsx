import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, CheckCircle2, Navigation } from 'lucide-react'
import { useStore } from '../store/useStore'
import { orderSteps } from '../data/products'

// Minimal Leaflet map with simulated courier movement
function CourierMap({ progress }) {
  const mapRef = useRef(null)
  const leafletRef = useRef(null)
  const courierMarkerRef = useRef(null)

  // Destination coordinates (static: South Jakarta area as example)
  const destination = [-6.2615, 106.8106]
  // Start far, move closer as progress increases
  const startPoint = [-6.2350, 106.7900]

  const interpolate = (a, b, t) => a + (b - a) * t
  const fraction = Math.min(progress / 2, 1) // steps 0-2 = courier in motion

  const courierPos = [
    interpolate(startPoint[0], destination[0], fraction),
    interpolate(startPoint[1], destination[1], fraction),
  ]

  useEffect(() => {
    if (mapRef.current && !leafletRef.current) {
      import('leaflet').then(L => {
        // Fix leaflet marker icons
        delete L.Icon.Default.prototype._getIconUrl
        L.Icon.Default.mergeOptions({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        })

        const map = L.map(mapRef.current, {
          center: [-6.248, 106.800],
          zoom: 14,
          zoomControl: false,
          attributionControl: false,
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map)

        // Destination marker (home icon)
        const homeIcon = L.divIcon({
          html: `<div style="
            background:#10b981;
            width:32px;height:32px;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:3px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
            display:flex;align-items:center;justify-content:center;
          ">
            <span style="transform:rotate(45deg);font-size:14px;">🏠</span>
          </div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          className: '',
        })

        L.marker(destination, { icon: homeIcon }).addTo(map)
          .bindPopup('<b>Alamatmu</b>', { closeButton: false })
          .openPopup()

        // Courier marker
        const courierIcon = L.divIcon({
          html: `<div style="
            background:#f59e0b;
            width:36px;height:36px;
            border-radius:50%;
            border:3px solid white;
            box-shadow:0 2px 12px rgba(0,0,0,0.3);
            display:flex;align-items:center;justify-content:center;
            font-size:18px;
          ">🛵</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
          className: '',
        })

        const courierMarker = L.marker(courierPos, { icon: courierIcon }).addTo(map)
        courierMarkerRef.current = courierMarker

        // Dashed polyline
        L.polyline([courierPos, destination], {
          color: '#10b981',
          weight: 3,
          dashArray: '8, 8',
          opacity: 0.7
        }).addTo(map)

        leafletRef.current = map
      })
    }
  }, [])

  // Update courier marker position when progress changes
  useEffect(() => {
    if (courierMarkerRef.current) {
      courierMarkerRef.current.setLatLng(courierPos)
    }
  }, [progress])

  return (
    <div
      ref={mapRef}
      className="w-full h-full"
      style={{ minHeight: '220px' }}
    />
  )
}

const COURIER = {
  name: 'Mas Gilang',
  phone: '0812-3456-7890',
  avatar: '👨‍🔧',
  rating: '4.9',
}

export default function TrackPage() {
  const { currentOrderId, orderStatus, advanceOrderStatus, cart, address } = useStore()

  // Auto-advance simulation (demo only)
  useEffect(() => {
    if (!currentOrderId || orderStatus >= 4) return
    if (orderStatus >= 2 && orderStatus < 4) return // pause at "on the way"
    const timer = setTimeout(() => {
      advanceOrderStatus()
    }, 3000)
    return () => clearTimeout(timer)
  }, [orderStatus, currentOrderId])

  if (!currentOrderId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen pb-24 px-8 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h2 className="text-xl font-extrabold text-gray-800 mb-2">Belum Ada Pesanan</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          Kamu belum melakukan pemesanan refill. Yuk, mulai dari tab <strong>Pesan</strong>.
        </p>
      </div>
    )
  }

  const step = orderSteps[orderStatus]
  const isOnTheWay = orderStatus === 2 || orderStatus === 3
  const isDone = orderStatus === 4

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-gray-800">Lacak Pesanan</h1>
            <p className="text-gray-500 text-xs font-mono mt-0.5">#{currentOrderId}</p>
          </div>
          {isDone && (
            <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full">
              <CheckCircle2 size={14} className="text-emerald-500" />
              <span className="text-xs font-bold text-emerald-600">Selesai</span>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      {!isDone && (
        <div className="px-4 pt-4">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100" style={{ height: '220px' }}>
            <CourierMap progress={orderStatus} />
          </div>
          {isOnTheWay && (
            <div className="flex items-center gap-2 mt-2.5 bg-amber-50 rounded-xl px-3 py-2.5 border border-amber-100">
              <span className="text-base">🛵</span>
              <div>
                <p className="text-xs font-bold text-amber-800">Petugas sedang menuju lokasimu</p>
                <p className="text-[10px] text-amber-600">Estimasi tiba: ~12 menit</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Done Illustration */}
      {isDone && (
        <div className="flex flex-col items-center py-8 px-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-5xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="text-xl font-extrabold text-emerald-700">Refill Selesai!</h2>
          <p className="text-gray-500 text-sm text-center mt-1">
            Botolmu sudah terisi. Terima kasih telah menjaga bumi bersama New Era! 🌿
          </p>
        </div>
      )}

      {/* Stepper */}
      <div className="px-5 mt-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-0">
          {orderSteps.map((s, i) => {
            const isCurrent = i === orderStatus
            const isDoneStep = i < orderStatus
            return (
              <div key={i} className="flex gap-4">
                {/* Dot + Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 flex-shrink-0 z-10 transition-all duration-500 ${
                    isDoneStep
                      ? 'bg-emerald-500 border-emerald-500'
                      : isCurrent
                        ? 'bg-white border-emerald-500 shadow-sm shadow-emerald-200'
                        : 'bg-gray-100 border-gray-200'
                  }`}>
                    {isDoneStep ? (
                      <CheckCircle2 size={14} className="text-white" />
                    ) : isCurrent ? (
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-3 h-3 bg-emerald-500 rounded-full"
                      />
                    ) : (
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                    )}
                  </div>
                  {i < orderSteps.length - 1 && (
                    <div className={`w-0.5 h-8 transition-all duration-500 ${isDoneStep ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                  )}
                </div>
                {/* Text */}
                <div className="pb-6">
                  <p className={`text-sm font-bold leading-tight ${isCurrent ? 'text-emerald-700' : isDoneStep ? 'text-gray-700' : 'text-gray-400'}`}>
                    {s.label}
                  </p>
                  {(isCurrent || isDoneStep) && (
                    <p className={`text-xs mt-0.5 ${isCurrent ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {s.desc}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Courier Card (visible from step 1+) */}
      {orderStatus >= 1 && !isDone && (
        <div className="px-5 mt-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Petugasmu</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl">
                {COURIER.avatar}
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-gray-800">{COURIER.name}</p>
                <div className="flex items-center gap-1">
                  <span className="text-amber-400 text-xs">★</span>
                  <span className="text-xs text-gray-500 font-semibold">{COURIER.rating} · Petugas New Era</span>
                </div>
              </div>
              <a
                href={`tel:${COURIER.phone.replace(/-/g, '')}`}
                className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-sm"
              >
                <Phone size={16} className="text-white" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Siaga reminder (on the way) */}
      {orderStatus === 2 && (
        <div className="px-5 mt-4">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
            <span className="text-xl">🧴</span>
            <div>
              <p className="text-sm font-bold text-blue-800">Siapkan botolmu sekarang!</p>
              <p className="text-xs text-blue-600 mt-0.5">
                Letakkan botol kosong yang sudah bersih & kering di depan pintu atau teras agar petugas bisa langsung bekerja.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Simulate button (for demo) */}
      {!isDone && orderStatus >= 1 && (
        <div className="px-5 mt-4">
          <button
            onClick={advanceOrderStatus}
            className="w-full border-2 border-dashed border-gray-200 text-gray-400 text-xs font-semibold py-3 rounded-2xl"
          >
            [Demo] Simulasi status selanjutnya →
          </button>
        </div>
      )}
    </div>
  )
}
