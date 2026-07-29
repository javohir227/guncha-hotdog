import { useState } from 'react'
import { useApp, T, type User } from '../context'

type AccTab = 'orders' | 'favorites' | 'addresses' | 'settings'

export default function AccountPage() {
  const { state, dispatch } = useApp()
  const t = T[state.lang]
  const c = state.dark
  const [tab, setTab] = useState<AccTab>('orders')

  // Auth state
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' })
  const [authError, setAuthError] = useState('')

  const bg = c ? '#111111' : '#F7F7F7'
  const cardBg = c ? '#1A1A1A' : '#ffffff'
  const text = c ? '#F5F5F5' : '#1F1F1F'
  const muted = c ? '#888' : '#6B7280'
  const border = c ? 'rgba(255,255,255,0.08)' : '#E5E7EB'
  const inputBg = c ? '#222' : '#F9FAFB'

  const handleAuth = () => {
    if (!form.phone || !form.password) { setAuthError(state.lang === 'uz' ? 'Barcha maydonlarni to\'ldiring' : 'Заполните все поля'); return }
    if (authMode === 'register' && !form.name) { setAuthError(state.lang === 'uz' ? 'Ismingizni kiriting' : 'Введите имя'); return }

    const user: User = {
      name: form.name || 'Mehmon',
      phone: form.phone,
      email: form.email,
      addresses: [],
    }
    dispatch({ type: 'SET_USER', payload: user })
    setAuthError('')
  }

  // Not logged in
  if (!state.user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: bg }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="font-black text-2xl" style={{ color: text, fontFamily: 'Montserrat, sans-serif' }}>
              {authMode === 'login' ? t.login : t.register}
            </h2>
            <p className="text-sm mt-1" style={{ color: muted }}>G'UNCHA HOT FOOD</p>
          </div>

          <div className="rounded-[20px] p-6 space-y-4" style={{ background: cardBg }}>
            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: muted }}>{t.name}</label>
                <input
                  type="text"
                  placeholder="Aziz Toshmatov"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border text-sm"
                  style={{ background: inputBg, borderColor: border, color: text }}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: muted }}>{t.phone}</label>
              <input
                type="tel"
                placeholder="+998 90 123 45 67"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border text-sm"
                style={{ background: inputBg, borderColor: border, color: text }}
              />
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: muted }}>Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border text-sm"
                  style={{ background: inputBg, borderColor: border, color: text }}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: muted }}>{t.password}</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border text-sm"
                style={{ background: inputBg, borderColor: border, color: text }}
              />
            </div>

            {authError && <p className="text-red-400 text-xs">{authError}</p>}

            <button
              onClick={handleAuth}
              className="w-full py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.02]"
              style={{ background: '#FFD233', color: '#1F1F1F', boxShadow: '0 8px 24px rgba(255,210,51,0.4)' }}
            >
              {authMode === 'login' ? t.login : t.register}
            </button>

            {/* Social login */}
            <div className="flex gap-3">
              <button
                className="flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                style={{ background: c ? '#2A2A2A' : '#F3F4F6', color: text, border: `1px solid ${border}` }}
              >
                🇬 Google
              </button>
              <button
                className="flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                style={{ background: '#229ED9', color: '#fff' }}
              >
                ✈️ Telegram
              </button>
            </div>

            <button
              onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setAuthError('') }}
              className="w-full text-sm text-center transition-colors"
              style={{ color: '#E11D2E' }}
            >
              {authMode === 'login'
                ? (state.lang === 'uz' ? "Ro'yxatdan o'tilmadimi? Ro'yxatdan o'ting" : 'Нет аккаунта? Зарегистрироваться')
                : (state.lang === 'uz' ? "Hisobingiz bormi? Kiring" : 'Уже есть аккаунт? Войти')
              }
            </button>
          </div>

          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
            className="w-full mt-4 py-3 rounded-xl text-sm transition-colors text-center"
            style={{ color: muted }}
          >
            ← {t.home}
          </button>
        </div>
      </div>
    )
  }

  // Logged in
  const accountTabs: { id: AccTab; label: string; icon: string }[] = [
    { id: 'orders', label: t.myOrders, icon: '📋' },
    { id: 'favorites', label: t.favorites, icon: '❤️' },
    { id: 'addresses', label: t.addresses, icon: '📍' },
    { id: 'settings', label: t.settings ?? 'Sozlamalar', icon: '⚙️' },
  ]

  const PRODUCTS_MAP: Record<number, { name: string; image: string; price: number }> = {
    1: { name: 'Hot Dog', image: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=200&h=200&fit=crop&auto=format', price: 25000 },
    2: { name: 'Salad Hot Dog', image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=200&h=200&fit=crop&auto=format', price: 25000 },
    3: { name: 'Hot Dogger', image: 'https://images.unsplash.com/photo-1678033382919-fa907632fdda?w=200&h=200&fit=crop&auto=format', price: 35000 },
    4: { name: 'Chizburger', image: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=200&h=200&fit=crop&auto=format', price: 30000 },
    5: { name: 'Double Chizburger', image: 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=200&h=200&fit=crop&auto=format', price: 40000 },
    6: { name: 'Kartoshka Fri', image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=200&h=200&fit=crop&auto=format', price: 20000 },
    7: { name: 'Ketchup', image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=200&h=200&fit=crop&auto=format', price: 3000 },
    8: { name: 'Special Sauce', image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=200&h=200&fit=crop&auto=format', price: 5000 },
  }

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: bg }}>
      <div className="max-w-5xl mx-auto px-6">
        {/* Back */}
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
          className="flex items-center gap-2 text-sm font-medium mb-6 transition-opacity hover:opacity-70"
          style={{ color: muted }}
        >
          ← {t.home}
        </button>

        {/* Profile header */}
        <div className="rounded-[20px] p-6 mb-6 flex items-center gap-5" style={{ background: cardBg }}>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl text-[#1F1F1F] flex-shrink-0"
            style={{ background: '#FFD233' }}
          >
            {state.user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="font-black text-lg" style={{ color: text, fontFamily: 'Montserrat, sans-serif' }}>
              {state.user.name}
            </div>
            <div className="text-sm" style={{ color: muted }}>{state.user.phone}</div>
            {state.user.email && <div className="text-sm" style={{ color: muted }}>{state.user.email}</div>}
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_USER', payload: null })}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
            style={{ background: 'rgba(225,29,46,0.1)', color: '#E11D2E' }}
          >
            {t.logout}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {accountTabs.map(tb => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm flex-shrink-0 transition-all"
              style={
                tab === tb.id
                  ? { background: '#FFD233', color: '#1F1F1F', boxShadow: '0 4px 16px rgba(255,210,51,0.4)' }
                  : { background: cardBg, color: muted }
              }
            >
              {tb.icon} {tb.label}
            </button>
          ))}
        </div>

        {/* Orders tab */}
        {tab === 'orders' && (
          <div className="space-y-4">
            {state.orders.length === 0 ? (
              <div className="text-center py-16" style={{ color: muted }}>
                <div className="text-6xl mb-4">📋</div>
                <p className="font-semibold">
                  {state.lang === 'uz' ? 'Hali buyurtmalar yo\'q' : 'Заказов пока нет'}
                </p>
                <button
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
                  className="mt-4 px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105"
                  style={{ background: '#FFD233', color: '#1F1F1F' }}
                >
                  {t.menu}
                </button>
              </div>
            ) : (
              state.orders.map(order => (
                <div key={order.id} className="rounded-[20px] p-5" style={{ background: cardBg }}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-black text-sm" style={{ color: '#FFD233' }}>{order.id}</div>
                      <div className="text-xs mt-0.5" style={{ color: muted }}>{order.createdAt}</div>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}
                    >
                      {t.status[order.status]}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-4 overflow-x-auto">
                    {order.items.map(item => (
                      <div key={`${item.id}-${item.variant}`} className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-amber-50">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="font-black" style={{ color: '#E11D2E' }}>
                      {order.total.toLocaleString('uz-UZ')} UZS
                    </div>
                    <button
                      onClick={() => { dispatch({ type: 'SET_ORDER', payload: order }); dispatch({ type: 'SET_VIEW', payload: 'tracking' }) }}
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                      style={{ background: 'rgba(255,210,51,0.15)', color: '#FFD233' }}
                    >
                      🔍 {t.trackOrder}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Favorites tab */}
        {tab === 'favorites' && (
          <div>
            {state.favorites.length === 0 ? (
              <div className="text-center py-16" style={{ color: muted }}>
                <div className="text-6xl mb-4">❤️</div>
                <p className="font-semibold">
                  {state.lang === 'uz' ? 'Hali sevimlilar yo\'q' : 'Избранное пусто'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {state.favorites.map(id => {
                  const prod = PRODUCTS_MAP[id]
                  if (!prod) return null
                  return (
                    <div key={id} className="rounded-[20px] overflow-hidden" style={{ background: cardBg }}>
                      <div className="h-32 overflow-hidden">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <div className="font-semibold text-sm" style={{ color: text }}>{prod.name}</div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-sm" style={{ color: '#E11D2E' }}>
                            {prod.price.toLocaleString('uz-UZ')} UZS
                          </span>
                          <button
                            onClick={() => dispatch({ type: 'TOGGLE_FAV', payload: id })}
                            className="text-red-500 text-lg"
                          >
                            ❤️
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Addresses */}
        {tab === 'addresses' && (
          <div className="space-y-4">
            <div className="rounded-[20px] p-5 border-2 border-dashed flex items-center justify-center gap-3 cursor-pointer transition-all hover:scale-[1.01]"
              style={{ borderColor: border }}>
              <span className="text-2xl">+</span>
              <span className="font-semibold" style={{ color: muted }}>
                {state.lang === 'uz' ? 'Yangi manzil qo\'shish' : 'Добавить новый адрес'}
              </span>
            </div>

            {[
              { id: '1', label: state.lang === 'uz' ? 'Uy' : 'Дом', street: 'Navoiy ko\'chasi 15', apartment: '14', floor: '3' },
              { id: '2', label: state.lang === 'uz' ? 'Ish joyi' : 'Работа', street: 'Mustaqillik shoh ko\'chasi 8', apartment: '205', floor: '2' },
            ].map(addr => (
              <div key={addr.id} className="rounded-[20px] p-5 flex items-start gap-4" style={{ background: cardBg }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(255,210,51,0.15)' }}>
                  📍
                </div>
                <div className="flex-1">
                  <div className="font-bold text-sm" style={{ color: text }}>{addr.label}</div>
                  <div className="text-sm mt-0.5" style={{ color: muted }}>
                    {addr.street}, xonadon {addr.apartment}, {addr.floor}-qavat
                  </div>
                </div>
                <button className="text-sm" style={{ color: '#6366F1' }}>✏️</button>
              </div>
            ))}
          </div>
        )}

        {/* Settings */}
        {tab === 'settings' && (
          <div className="rounded-[20px] p-6 space-y-5" style={{ background: cardBg }}>
            <h3 className="font-bold text-lg" style={{ color: text }}>{t.settings ?? 'Sozlamalar'}</h3>

            {[
              { label: t.name, value: state.user.name, type: 'text' },
              { label: t.phone, value: state.user.phone, type: 'tel' },
              { label: 'Email', value: state.user.email, type: 'email' },
            ].map(field => (
              <div key={field.label}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: muted }}>{field.label}</label>
                <input
                  type={field.type}
                  defaultValue={field.value}
                  className="w-full px-4 py-3 rounded-xl border text-sm"
                  style={{ background: c ? '#222' : '#F9FAFB', borderColor: border, color: text }}
                />
              </div>
            ))}

            <button
              className="px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: '#FFD233', color: '#1F1F1F' }}
            >
              {t.save}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}