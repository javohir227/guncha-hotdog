import { useState, useEffect } from 'react'
import { useApp, T, type Order } from '../context'

const STATUSES: Order['status'][] = [
  'waiting', 'accepted', 'preparing', 'cooking', 'picked_up', 'on_way', 'delivered'
]

const STATUS_ICONS: Record<Order['status'], string> = {
  waiting:   '⏳',
  accepted:  '✅',
  preparing: '👨‍🍳',
  cooking:   '🔥',
  picked_up: '🏍️',
  on_way:    '🚀',
  delivered: '🎉',
}

const ESTIMATED_TIMES: Partial<Record<Order['status'], string>> = {
  waiting:   '1-2 daq',
  accepted:  '1-2 daq',
  preparing: '5-8 daq',
  cooking:   '10-15 daq',
  picked_up: '5-10 daq',
  on_way:    '10-20 daq',
  delivered: '✓',
}

export default function OrderTracking() {
  const { state, dispatch } = useApp()
  const t = T[state.lang]
  const c = state.dark

  const order = state.currentOrder || state.orders[0]

  const [searchId, setSearchId] = useState('')
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null)

  // Auto-advance demo (only if not already delivered)
  useEffect(() => {
    if (!order || order.status === 'delivered') return
    const idx = STATUSES.indexOf(order.status)
    if (idx < STATUSES.length - 1) {
      const timer = setTimeout(() => {
        dispatch({
          type: 'UPDATE_ORDER_STATUS',
          payload: { id: order.id, status: STATUSES[idx + 1] },
        })
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [order?.status])

  const displayOrder = searchedOrder || order

  const bg = c ? '#111111' : '#F7F7F7'
  const cardBg = c ? '#1A1A1A' : '#ffffff'
  const text = c ? '#F5F5F5' : '#1F1F1F'
  const muted = c ? '#888' : '#6B7280'
  const border = c ? 'rgba(255,255,255,0.08)' : '#E5E7EB'

  const currentIdx = displayOrder ? STATUSES.indexOf(displayOrder.status) : -1

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: bg }}>
      <div className="max-w-3xl mx-auto px-6">
        {/* Back */}
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
          className="flex items-center gap-2 text-sm font-medium mb-8 transition-opacity hover:opacity-70"
          style={{ color: muted }}
        >
          ← {t.home}
        </button>

        <h1
          className="font-black text-3xl md:text-4xl mb-8"
          style={{ color: text, fontFamily: 'Montserrat, sans-serif' }}
        >
          🔍 {t.trackOrder}
        </h1>

        {/* Search by ID */}
        <div className="flex gap-3 mb-8">
          <input
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
            placeholder={state.lang === 'uz' ? 'Buyurtma raqami (masalan: GHF-123456)' : 'Номер заказа (например: GHF-123456)'}
            className="flex-1 px-4 py-3 rounded-2xl border text-sm"
            style={{
              background: c ? '#222' : '#fff',
              borderColor: border,
              color: text,
            }}
          />
          <button
            onClick={() => {
              const found = state.orders.find(o => o.id === searchId.trim().toUpperCase())
              setSearchedOrder(found || null)
            }}
            className="px-6 py-3 rounded-2xl font-bold text-sm"
            style={{ background: '#FFD233', color: '#1F1F1F' }}
          >
            {t.search ?? 'Qidirish'}
          </button>
        </div>

        {!displayOrder ? (
          <div className="text-center py-20" style={{ color: muted }}>
            <div className="text-6xl mb-4">📋</div>
            <p className="font-semibold">
              {state.lang === 'uz' ? 'Buyurtma topilmadi' : 'Заказ не найден'}
            </p>
          </div>
        ) : (
          <>
            {/* Order header card */}
            <div className="rounded-[20px] p-6 mb-6" style={{ background: cardBg }}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: muted }}>{t.orderId}</div>
                  <div className="font-black text-2xl" style={{ color: '#FFD233', fontFamily: 'Montserrat, sans-serif' }}>
                    {displayOrder.id}
                  </div>
                  <div className="text-sm mt-1" style={{ color: muted }}>{displayOrder.createdAt}</div>
                </div>
                <div className="text-right">
                  <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm"
                    style={{
                      background: displayOrder.status === 'delivered' ? '#10B981' : '#FFD233',
                      color: '#1F1F1F',
                    }}
                  >
                    {STATUS_ICONS[displayOrder.status]}
                    {t.status[displayOrder.status]}
                  </div>
                  <div className="mt-2 font-black text-xl" style={{ color: '#E11D2E' }}>
                    {displayOrder.total.toLocaleString('uz-UZ')} UZS
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm" style={{ borderColor: border }}>
                <div>
                  <span style={{ color: muted }}>{t.name}: </span>
                  <span style={{ color: text }}>{displayOrder.customer}</span>
                </div>
                <div>
                  <span style={{ color: muted }}>{t.phone}: </span>
                  <span style={{ color: text }}>{displayOrder.phone}</span>
                </div>
                <div className="col-span-2">
                  <span style={{ color: muted }}>{t.address}: </span>
                  <span style={{ color: text }}>{displayOrder.address}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="rounded-[20px] p-6 mb-6" style={{ background: cardBg }}>
              <h3 className="font-bold text-lg mb-6" style={{ color: text }}>
                {state.lang === 'uz' ? 'Buyurtma holati' : 'Статус заказа'}
              </h3>

              <div className="relative">
                {/* Vertical line */}
                <div
                  className="absolute left-6 top-6 bottom-6 w-0.5"
                  style={{ background: border }}
                />
                {/* Progress line */}
                <div
                  className="absolute left-6 top-6 w-0.5 transition-all duration-700"
                  style={{
                    background: 'linear-gradient(to bottom, #FFD233, #E11D2E)',
                    height: `${Math.max(0, (currentIdx / (STATUSES.length - 1)) * 100)}%`,
                  }}
                />

                <div className="space-y-6">
                  {STATUSES.map((status, i) => {
                    const done = i <= currentIdx
                    const active = i === currentIdx
                    return (
                      <div key={status} className="flex items-start gap-5 relative">
                        {/* Dot */}
                        <div
                          className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0 transition-all duration-500"
                          style={{
                            background: done
                              ? active
                                ? '#FFD233'
                                : '#10B981'
                              : c ? '#2A2A2A' : '#F3F4F6',
                            boxShadow: active ? '0 0 0 6px rgba(255,210,51,0.25)' : 'none',
                            transform: active ? 'scale(1.15)' : 'scale(1)',
                          }}
                        >
                          {STATUS_ICONS[status]}
                        </div>

                        <div className="flex-1 pt-2.5">
                          <div
                            className="font-semibold text-sm transition-colors"
                            style={{ color: done ? text : muted }}
                          >
                            {t.status[status]}
                          </div>
                          {active && (
                            <div className="text-xs mt-0.5" style={{ color: '#FFD233' }}>
                              {state.lang === 'uz' ? '⏱ Taxminiy vaqt: ' : '⏱ Прим. время: '}
                              {ESTIMATED_TIMES[status]}
                            </div>
                          )}
                          {done && !active && (
                            <div className="text-xs mt-0.5" style={{ color: '#10B981' }}>✓</div>
                          )}
                        </div>

                        {active && (
                          <div
                            className="flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold"
                            style={{ background: 'rgba(255,210,51,0.15)', color: '#FFD233' }}
                          >
                            {state.lang === 'uz' ? 'Hozir' : 'Сейчас'}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Order items */}
            <div className="rounded-[20px] p-6" style={{ background: cardBg }}>
              <h3 className="font-bold text-lg mb-4" style={{ color: text }}>
                {state.lang === 'uz' ? 'Buyurtma tarkibi' : 'Состав заказа'}
              </h3>
              <div className="space-y-3">
                {displayOrder.items.map(item => (
                  <div key={`${item.id}-${item.variant}`} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-amber-50 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm" style={{ color: text }}>{item.name}</div>
                      <div className="text-xs" style={{ color: muted }}>× {item.qty}</div>
                    </div>
                    <div className="font-bold text-sm" style={{ color: '#E11D2E' }}>
                      {(item.price * item.qty).toLocaleString('uz-UZ')} UZS
                    </div>
                  </div>
                ))}
              </div>

              {/* Call button */}
              <div className="mt-6 flex gap-3">
                <a
                  href="tel:+998958034442"
                  className="flex-1 py-3 rounded-2xl font-bold text-sm text-center transition-all hover:scale-[1.02]"
                  style={{ background: '#25D366', color: '#fff' }}
                >
                  📞 +998 95 803 44 42
                </a>
                <a
                  href="https://t.me/guncha_hotfood"
                  className="flex-1 py-3 rounded-2xl font-bold text-sm text-center transition-all hover:scale-[1.02]"
                  style={{ background: '#229ED9', color: '#fff' }}
                >
                  ✈️ Telegram
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
