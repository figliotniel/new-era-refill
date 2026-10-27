import { Home, ShoppingBag, MapPin, User } from 'lucide-react'

const tabs = [
  { id: 'home', label: 'Beranda', icon: Home },
  { id: 'order', label: 'Pesan', icon: ShoppingBag },
  { id: 'track', label: 'Lacak', icon: MapPin },
  { id: 'profile', label: 'Profil', icon: User },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 z-50 safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-emerald-50' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className={`text-[10px] font-semibold tracking-wide ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
