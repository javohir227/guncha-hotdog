import { useState } from 'react'
import { useApp, T } from '../context'

const PROMO_CODES: Record<string, number> = {
  GUNCHA10: 10,
  HOTFOOD: 15,
  YANGI20: 20,
}

export default function CartSidebar() {
  const { state, dispatch } = useApp()
  const t = T[state.lang]
  const [promo, setPromo] = useState('')
  const [promoApplied, setPromoApplied] = useState<number>(0)
  const [promoError, setPromoError] = useState(false)

  const subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0)
  const delivery = subtotal > 0 ? 5000 : 0
  const discountAmt = Math.round(subtotal * (promoApplied / 100))
  const total = subtotal + delivery - discountAmt

  const applyPromo = () => {
    const pct = PROMO_CODES[promo.toUpperCase()]
    if (pct) {
      setPromoApplied(pct)
      setPromoError(false)
    } else {
      setPromoError(true)
      setPromoApplied(0)
    }
  }

  const fmt = (n: number) => n.toLocaleString('uz-UZ') + ' UZS'

  const c = state.dark
  const bg = c ? '#1A1A1A' : '#ffffff'
  const surface = c ? '#222222' : '#F7F7F7'
  const text = c ? '#F5F5F5' : '#1F1F1F'
  const muted = c ? '#888' : '#6B7280'
  const border = c ? 'rgba(255,255,255,0.07)' : '#E5E7EB'

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-300"
        style={{
          background: 'rgba(0,0,0,0.55)',
          opacity: state.cartOpen ? 1 : 0,
          pointerEvents: state.cartOpen ? 'auto' : 'none',
        }}
        onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-[420px] flex flex-col transition-transform duration-350"
        style={{
          background: bg,
          transform: state.cartOpen ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: '-8px 0 48px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: border }}
        >
          <div>
            <h2 className="font-black text-xl" style={{ color: text, fontFamily: 'Montserrat, sans-serif' }}>
              🛒 {t.cart}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: muted }}>
              {state.cart.reduce((s, i) => s + i.qty, 0)} ta mahsulot
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: false })}
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: surface, color: muted }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {state.cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <div className="text-7xl mb-4 opacity-30">🛒</div>
              <p className="font-semibold text-lg" style={{ color: muted }}>
                {state.lang === 'uz' ? 'Savat bo\'sh' : 'Корзина пуста'}
              </p>
              <p className="text-sm mt-1" style={{ color: muted }}>
                {state.lang === 'uz' ? 'Menyu\'dan mahsulot qo\'shing' : 'Добавьте товары из меню'}
              </p>
            </div>
          ) : (
            state.cart.map(item => (
              <div
                key={`${item.id}-${item.variant}`}
                className="flex items-center gap-4 p-4 rounded-2xl"
                style={{ background: surface }}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-amber-50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate" style={{ color: text }}>
                    {item.name}
                    {item.variant && <span className="text-xs ml-1" style={{ color: muted }}>({item.variant})</span>}
                  </div>
                  <div className="font-bold text-sm mt-1" style={{ color: '#E11D2E' }}>
                    {fmt(item.price)}
                  </div>

                  {/* Qty */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => dispatch({ type: 'SET_QTY', payload: { id: item.id, qty: item.qty - 1 } })}
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm transition-all hover:scale-110"
                      style={{ background: '#FFD233', color: '#1F1F1F' }}
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold text-sm" style={{ color: text }}>
                      {item.qty}
                    </span>
                    <button
                      onClick={() => dispatch({ type: 'SET_QTY', payload: { id: item.id, qty: item.qty + 1 } })}
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm transition-all hover:scale-110"
                      style={{ background: '#FFD233', color: '#1F1F1F' }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-sm" style={{ color: text }}>
                    {fmt(item.price * item.qty)}
                  </div>
                  <button
                    onClick={() => dispatch({ type: 'REMOVE', payload: item.id })}
                    className="text-xs mt-2 transition-colors hover:text-red-500"
                    style={{ color: muted }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {state.cart.length > 0 && (
          <div className="px-6 py-5 border-t space-y-4" style={{ borderColor: border }}>
            {/* Promo */}
            <div className="flex gap-2">
              <input
                value={promo}
                onChange={e => { setPromo(e.target.value); setPromoError(false) }}
                placeholder={t.promoCode}
                className="flex-1 px-4 py-2.5 rounded-xl border text-sm transition-all"
                style={{
                  background: c ? '#2A2A2A' : '#F7F7F7',
                  borderColor: promoError ? '#E11D2E' : promoApplied ? '#10B981' : border,
                  color: text,
                }}
              />
              <button
                onClick={applyPromo}
                className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{ background: '#FFD233', color: '#1F1F1F' }}
              >
                {t.applyCode}
              </button>
            </div>
            {promoApplied > 0 && (
              <p className="text-xs text-green-500 font-semibold">✓ {promoApplied}% chegirma qo'llandi!</p>
            )}
            {promoError && (
              <p className="text-xs text-red-500">❌ Noto'g'ri promo kod</p>
            )}

            {/* Summary */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between" style={{ color: muted }}>
                <span>{t.subtotal}</span><span>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between" style={{ color: muted }}>
                <span>{t.deliveryFee}</span><span>{fmt(delivery)}</span>
              </div>
              {discountAmt > 0 && (
                <div className="flex justify-between text-green-500">
                  <span>{t.discount}</span><span>−{fmt(discountAmt)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-base pt-2 border-t" style={{ color: text, borderColor: border }}>
                <span>{t.total}</span><span style={{ color: '#E11D2E' }}>{fmt(total)}</span>
              </div>
            </div>

            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'checkout' })}
              className="w-full py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: '#FFD233',
                color: '#1F1F1F',
                boxShadow: '0 8px 24px rgba(255,210,51,0.4)',
              }}
            >
              {t.checkout} →
            </button>

            <button
              onClick={() => dispatch({ type: 'CLEAR_CART' })}
              className="w-full py-2.5 rounded-xl text-sm transition-colors"
              style={{ color: muted }}
            >
              {state.lang === 'uz' ? 'Savatni tozalash' : 'Очистить корзину'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
