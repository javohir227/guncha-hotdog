import { useState } from 'react'
import { useApp, T, type Order } from '../context'

const ADMIN_PASS = 'admin123'

const STATUS_COLORS: Record<Order['status'], string> = {
  waiting:   '#6366F1',
  accepted:  '#3B82F6',
  preparing: '#F59E0B',
  cooking:   '#EF4444',
  picked_up: '#8B5CF6',
  on_way:    '#06B6D4',
  delivered: '#10B981',
}

const STATUSES_FLOW: Order['status'][] = [
  'waiting', 'accepted', 'preparing', 'cooking', 'picked_up', 'on_way', 'delivered'
]

const DEMO_ORDERS: Order[] = [
  {
    id: 'GHF-001234', customer: 'Aziz Toshmatov', phone: '+998 90 111 22 33',
    address: 'Navoiy ko\'chasi 15', payment: 'click',
    total: 95000, status: 'cooking', createdAt: '08:45', promoDiscount: 0,
    items: [
      { id: 1, name: 'Hot Dog Ultra', price: 35000, image: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=80&h=80&fit=crop&auto=format', qty: 1 },
      { id: 6, name: 'Kartoshka Fri', price: 20000, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=80&h=80&fit=crop&auto=format', qty: 2 },
    ],
  },
  {
    id: 'GHF-001235', customer: 'Malika Yusupova', phone: '+998 91 222 33 44',
    address: 'Mustaqillik shoh ko\'chasi 8', payment: 'cash',
    total: 70000, status: 'on_way', createdAt: '09:12', promoDiscount: 0,
    items: [
      { id: 5, name: 'Double Chizburger', price: 40000, image: 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=80&h=80&fit=crop&auto=format', qty: 1 },
      { id: 6, name: 'Kartoshka Fri', price: 20000, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=80&h=80&fit=crop&auto=format', qty: 1 },
    ],
  },
  {
    id: 'GHF-001236', customer: 'Bobur Rahimov', phone: '+998 93 444 55 66',
    address: 'Chilonzor 9-mavze 12-uy', payment: 'payme',
    total: 50000, status: 'delivered', createdAt: '07:30', promoDiscount: 0,
    items: [
      { id: 4, name: 'Chizburger', price: 30000, image: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=80&h=80&fit=crop&auto=format', qty: 1 },
      { id: 7, name: 'Ketchup', price: 3000, image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=80&h=80&fit=crop&auto=format', qty: 2 },
    ],
  },
]

type AdminTab = 'dashboard' | 'orders' | 'products' | 'stats'

export default function AdminPage() {
  const { state, dispatch } = useApp()
  const t = T[state.lang]
  const c = state.dark

  const [pass, setPass] = useState('')
  const [passError, setPassError] = useState(false)
  const [tab, setTab] = useState<AdminTab>('dashboard')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const bg = c ? '#0D0D0D' : '#F0F0F0'
  const sidebar = c ? '#111111' : '#1F1F1F'
  const cardBg = c ? '#1A1A1A' : '#ffffff'
  const text = c ? '#F5F5F5' : '#1F1F1F'
  const muted = c ? '#888' : '#6B7280'
  const border = c ? 'rgba(255,255,255,0.08)' : '#E5E7EB'

  const allOrders = [...state.orders, ...DEMO_ORDERS]
  const todayTotal = allOrders.reduce((s, o) => s + o.total, 0)
  const activeOrders = allOrders.filter(o => o.status !== 'delivered').length

  // Login screen
  if (!state.adminAuthed) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: '#1F1F1F' }}
      >
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl font-black mx-auto mb-4"
              style={{ background: '#FFD233', color: '#1F1F1F' }}
            >
              G
            </div>
            <h2 className="font-black text-2xl text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {t.adminPanel}
            </h2>
            <p className="text-gray-400 text-sm mt-1">G'UNCHA HOT FOOD</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              placeholder={t.password}
              value={pass}
              onChange={e => { setPass(e.target.value); setPassError(false) }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (pass === ADMIN_PASS) dispatch({ type: 'SET_ADMIN', payload: true })
                  else setPassError(true)
                }
              }}
              className="w-full px-4 py-4 rounded-2xl border text-sm text-white"
              style={{
                background: '#2A2A2A',
                borderColor: passError ? '#E11D2E' : 'rgba(255,255,255,0.1)',
              }}
            />
            {passError && (
              <p className="text-red-400 text-xs">❌ {state.lang === 'uz' ? 'Noto\'g\'ri parol' : 'Неверный пароль'}</p>
            )}
            <button
              onClick={() => {
                if (pass === ADMIN_PASS) dispatch({ type: 'SET_ADMIN', payload: true })
                else setPassError(true)
              }}
              className="w-full py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.02]"
              style={{ background: '#FFD233', color: '#1F1F1F' }}
            >
              {t.enter}
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
              className="w-full py-3 rounded-2xl text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← {t.home}
            </button>
          </div>

          <p className="text-center text-xs text-gray-600 mt-6">
            Demo: admin123
          </p>
        </div>
      </div>
    )
  }

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'dashboard', label: state.lang === 'uz' ? 'Dashboard' : 'Дэшборд', icon: '📊' },
    { id: 'orders',    label: state.lang === 'uz' ? 'Buyurtmalar' : 'Заказы',  icon: '📋' },
    { id: 'products',  label: state.lang === 'uz' ? 'Mahsulotlar' : 'Продукты', icon: '🌭' },
    { id: 'stats',     label: state.lang === 'uz' ? 'Statistika' : 'Статистика', icon: '📈' },
  ]

  return (
    <div className="min-h-screen flex" style={{ background: bg }}>
      {/* Sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 flex-shrink-0 py-8 px-4"
        style={{ background: sidebar }}
      >
        <div className="flex items-center gap-3 px-4 mb-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-[#1F1F1F]" style={{ background: '#FFD233' }}>G</div>
          <div>
            <div className="font-black text-sm text-white">G'UNCHA</div>
            <div className="text-[10px] font-bold" style={{ color: '#FFD233' }}>ADMIN PANEL</div>
          </div>
        </div>

        <nav className="space-y-1 flex-1">
          {tabs.map(tb => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left"
              style={{
                background: tab === tb.id ? 'rgba(255,210,51,0.15)' : 'transparent',
                color: tab === tb.id ? '#FFD233' : 'rgba(255,255,255,0.6)',
              }}
            >
              <span className="text-base">{tb.icon}</span>
              {tb.label}
            </button>
          ))}
        </nav>

        <div className="space-y-2 px-2">
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
            className="w-full px-4 py-3 rounded-xl text-sm text-left transition-all"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            🏠 {t.home}
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_ADMIN', payload: false })}
            className="w-full px-4 py-3 rounded-xl text-sm text-left transition-all"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            🚪 {t.logout}
          </button>
        </div>
      </aside>

      {/* Mobile tabs */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t" style={{ background: sidebar, borderColor: 'rgba(255,255,255,0.08)' }}>
        {tabs.map(tb => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className="flex-1 py-3 flex flex-col items-center gap-1 text-xs font-medium"
            style={{ color: tab === tb.id ? '#FFD233' : 'rgba(255,255,255,0.4)' }}
          >
            <span className="text-lg">{tb.icon}</span>
            {tb.label}
          </button>
        ))}
      </div>

      {/* Main */}
      <main className="flex-1 p-6 pb-24 md:pb-6 overflow-y-auto">
        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div>
            <h2 className="font-black text-2xl mb-6" style={{ color: text, fontFamily: 'Montserrat, sans-serif' }}>
              📊 Dashboard
            </h2>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: t.todayOrders, value: allOrders.length, icon: '📋', color: '#6366F1' },
                { label: t.todayIncome, value: `${(todayTotal / 1000).toFixed(0)}K UZS`, icon: '💰', color: '#10B981' },
                { label: state.lang === 'uz' ? 'Faol buyurtmalar' : 'Активные заказы', value: activeOrders, icon: '🔥', color: '#E11D2E' },
                { label: t.customers, value: 3, icon: '👥', color: '#FFD233' },
              ].map(stat => (
                <div key={stat.label} className="rounded-[20px] p-5" style={{ background: cardBg }}>
                  <div className="text-2xl mb-3">{stat.icon}</div>
                  <div className="text-2xl font-black mb-1" style={{ color: stat.color, fontFamily: 'Montserrat, sans-serif' }}>
                    {stat.value}
                  </div>
                  <div className="text-xs" style={{ color: muted }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="rounded-[20px] p-6" style={{ background: cardBg }}>
              <h3 className="font-bold text-base mb-5" style={{ color: text }}>
                {state.lang === 'uz' ? 'So\'ngi buyurtmalar' : 'Последние заказы'}
              </h3>
              <div className="space-y-3">
                {allOrders.slice(0, 5).map(order => (
                  <div
                    key={order.id}
                    className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:scale-[1.01]"
                    style={{ background: c ? '#222' : '#F9FAFB' }}
                    onClick={() => { setSelectedOrder(order); setTab('orders') }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold text-white"
                      style={{ background: STATUS_COLORS[order.status] }}
                    >
                      #
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm" style={{ color: text }}>{order.id}</div>
                      <div className="text-xs" style={{ color: muted }}>{order.customer}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-sm" style={{ color: '#E11D2E' }}>
                        {order.total.toLocaleString('uz-UZ')} UZS
                      </div>
                      <div
                        className="text-xs font-semibold"
                        style={{ color: STATUS_COLORS[order.status] }}
                      >
                        {t.status[order.status]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div>
            <h2 className="font-black text-2xl mb-6" style={{ color: text, fontFamily: 'Montserrat, sans-serif' }}>
              📋 {state.lang === 'uz' ? 'Buyurtmalar' : 'Заказы'}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {allOrders.map(order => (
                <div
                  key={order.id}
                  className="rounded-[20px] p-5 cursor-pointer transition-all hover:-translate-y-1"
                  style={{
                    background: cardBg,
                    borderLeft: `4px solid ${STATUS_COLORS[order.status]}`,
                    boxShadow: selectedOrder?.id === order.id ? '0 8px 32px rgba(0,0,0,0.2)' : 'none',
                  }}
                  onClick={() => setSelectedOrder(order.id === selectedOrder?.id ? null : order)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-black text-sm" style={{ color: '#FFD233', fontFamily: 'Montserrat, sans-serif' }}>
                        {order.id}
                      </div>
                      <div className="font-semibold mt-0.5" style={{ color: text }}>{order.customer}</div>
                      <div className="text-xs" style={{ color: muted }}>{order.phone} · {order.createdAt}</div>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: `${STATUS_COLORS[order.status]}20`, color: STATUS_COLORS[order.status] }}
                    >
                      {t.status[order.status]}
                    </div>
                  </div>

                  <div className="text-sm mb-3" style={{ color: muted }}>
                    📍 {order.address}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="font-black" style={{ color: '#E11D2E', fontFamily: 'Montserrat, sans-serif' }}>
                      {order.total.toLocaleString('uz-UZ')} UZS
                    </div>
                    <div className="text-xs" style={{ color: muted }}>
                      {order.items.length} ta mahsulot
                    </div>
                  </div>

                  {/* Status changer */}
                  {selectedOrder?.id === order.id && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: border }}>
                      <div className="text-xs font-semibold mb-3" style={{ color: muted }}>
                        {state.lang === 'uz' ? 'Holatni o\'zgartirish:' : 'Изменить статус:'}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {STATUSES_FLOW.map(s => (
                          <button
                            key={s}
                            onClick={e => {
                              e.stopPropagation()
                              dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { id: order.id, status: s } })
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                            style={{
                              background: order.status === s ? STATUS_COLORS[s] : `${STATUS_COLORS[s]}20`,
                              color: order.status === s ? '#fff' : STATUS_COLORS[s],
                            }}
                          >
                            {t.status[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-2xl" style={{ color: text, fontFamily: 'Montserrat, sans-serif' }}>
                🌭 {state.lang === 'uz' ? 'Mahsulotlar' : 'Продукты'}
              </h2>
              <button
                className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
                style={{ background: '#FFD233', color: '#1F1F1F' }}
              >
                + {state.lang === 'uz' ? 'Qo\'shish' : 'Добавить'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Hot Dog (Melinkiy)', price: 15000, cat: 'Hot Dogs', img: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=200&h=150&fit=crop&auto=format', active: true },
                { name: 'Hot Dog (Sredniy)', price: 25000, cat: 'Hot Dogs', img: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=200&h=150&fit=crop&auto=format', active: true },
                { name: 'Hot Dog (Ultra)', price: 35000, cat: 'Hot Dogs', img: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=200&h=150&fit=crop&auto=format', active: true },
                { name: 'Salad Hot Dog (Small)', price: 12000, cat: 'Hot Dogs', img: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=200&h=150&fit=crop&auto=format', active: true },
                { name: 'Salad Hot Dog (Large)', price: 25000, cat: 'Hot Dogs', img: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=200&h=150&fit=crop&auto=format', active: true },
                { name: 'Hot Dogger', price: 35000, cat: 'Hot Dogs', img: 'https://images.unsplash.com/photo-1678033382919-fa907632fdda?w=200&h=150&fit=crop&auto=format', active: true },
                { name: 'Chizburger', price: 30000, cat: 'Burgers', img: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=200&h=150&fit=crop&auto=format', active: true },
                { name: 'Double Chizburger', price: 40000, cat: 'Burgers', img: 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=200&h=150&fit=crop&auto=format', active: true },
                { name: 'Kartoshka Fri', price: 20000, cat: 'Fries', img: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=200&h=150&fit=crop&auto=format', active: false },
              ].map((prod, i) => (
                <div key={i} className="rounded-[16px] overflow-hidden" style={{ background: cardBg }}>
                  <div className="h-28 overflow-hidden relative">
                    <img src={prod.img} alt={prod.name} className="w-full h-full object-cover" />
                    <div
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: prod.active ? '#10B981' : '#6B7280',
                        color: '#fff',
                      }}
                    >
                      {prod.active
                        ? (state.lang === 'uz' ? 'Faol' : 'Активен')
                        : (state.lang === 'uz' ? 'Nofaol' : 'Неактивен')}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-sm" style={{ color: text }}>{prod.name}</div>
                    <div className="text-xs mb-3" style={{ color: muted }}>{prod.cat}</div>
                    <div className="flex items-center justify-between">
                      <div className="font-black text-sm" style={{ color: '#E11D2E' }}>
                        {prod.price.toLocaleString('uz-UZ')} UZS
                      </div>
                      <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'rgba(99,102,241,0.15)', color: '#6366F1' }}>✏️</button>
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ background: 'rgba(225,29,46,0.1)', color: '#E11D2E' }}>🗑</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        {tab === 'stats' && (
          <div>
            <h2 className="font-black text-2xl mb-6" style={{ color: text, fontFamily: 'Montserrat, sans-serif' }}>
              📈 {state.lang === 'uz' ? 'Statistika' : 'Статистика'}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Revenue chart placeholder */}
              <div className="rounded-[20px] p-6" style={{ background: cardBg }}>
                <h3 className="font-bold mb-4" style={{ color: text }}>
                  {state.lang === 'uz' ? 'Haftalik daromad' : 'Недельный доход'}
                </h3>
                <div className="flex items-end gap-2 h-32">
                  {[65, 80, 45, 90, 70, 85, 100].map((h, i) => {
                    const days = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t-lg transition-all"
                          style={{ height: `${h}%`, background: i === 6 ? '#FFD233' : 'rgba(255,210,51,0.3)' }}
                        />
                        <div className="text-xs" style={{ color: muted }}>{days[i]}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Popular items */}
              <div className="rounded-[20px] p-6" style={{ background: cardBg }}>
                <h3 className="font-bold mb-4" style={{ color: text }}>
                  {state.lang === 'uz' ? 'Mashhur mahsulotlar' : 'Популярные продукты'}
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Hot Dog Ultra', pct: 78, color: '#FFD233' },
                    { name: 'Double Chizburger', pct: 62, color: '#E11D2E' },
                    { name: 'Kartoshka Fri', pct: 55, color: '#10B981' },
                    { name: 'Hot Dogger', pct: 44, color: '#6366F1' },
                  ].map(item => (
                    <div key={item.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span style={{ color: text }}>{item.name}</span>
                        <span style={{ color: muted }}>{item.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: c ? '#2A2A2A' : '#F3F4F6' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${item.pct}%`, background: item.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
