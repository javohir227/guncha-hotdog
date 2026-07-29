import { useState } from 'react'
import { useApp, T, type Order } from '../context'

const PAYMENTS = [
  { id: 'cash', label: 'Naqd pul / Наличные', icon: '💵', ru: 'Наличные', uz: 'Naqd pul' },
  { id: 'click', label: 'Click', icon: '📱', ru: 'Click', uz: 'Click' },
  { id: 'payme', label: 'Payme', icon: '💳', ru: 'Payme', uz: 'Payme' },
  { id: 'uzum', label: 'Uzum Bank', icon: '🏦', ru: 'Uzum Bank', uz: 'Uzum Bank' },
]

export default function CheckoutPage() {
  const { state, dispatch } = useApp()
  const t = T[state.lang]
  const c = state.dark

  const [form, setForm] = useState({
    name: state.user?.name || '',
    phone: state.user?.phone || '',
    address: '',
    apartment: '',
    floor: '',
    entrance: '',
    notes: '',
  })
  const [payment, setPayment] = useState('cash')
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState<'form' | 'payment_success'>('form')

  const subtotal = state.cart.reduce((s, i) => s + i.price * i.qty, 0)
  const delivery = 5000
  const total = subtotal + delivery
  const fmt = (n: number) => n.toLocaleString('uz-UZ') + ' UZS'

  const bg = c ? '#111111' : '#F7F7F7'
  const cardBg = c ? '#1A1A1A' : '#ffffff'
  const text = c ? '#F5F5F5' : '#1F1F1F'
  const muted = c ? '#888' : '#6B7280'
  const border = c ? 'rgba(255,255,255,0.08)' : '#E5E7EB'
  const inputBg = c ? '#222' : '#F9FAFB'

  const inputStyle = {
    background: inputBg,
    borderColor: border,
    color: text,
  }

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.address) return;

    setSubmitting(true);

    try {
      await fetch("http://localhost:8000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: `${form.address}${form.apartment ? ", xonadon " + form.apartment : ""
            }${form.floor ? ", " + form.floor + "-qavat" : ""}${form.entrance ? ", " + form.entrance + "-kirish" : ""
            }`,
          total,
          payment,
          products: state.cart.map((item) => ({
            name: item.name,
            qty: item.qty,
            price: item.price,
          })),
        }),
      });

      const order: Order = {
        id: `GHF-${Date.now().toString().slice(-6)}`,
        items: state.cart,
        total,
        status: "waiting",
        createdAt: new Date().toLocaleString("uz-UZ"),
        address: form.address,
        payment,
        customer: form.name,
        phone: form.phone,
        promoDiscount: 0,
      };

      dispatch({ type: "ADD_ORDER", payload: order });
      dispatch({ type: "SET_ORDER", payload: order });
      dispatch({ type: "CLEAR_CART" });

      setSubmitting(false);
      setStep("payment_success");
    } catch (e) {
      console.error(e);
      alert("Server bilan bog'lanishda xatolik.");
      setSubmitting(false);
    }
  };

  if (step === 'payment_success') {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: bg }}
      >
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6 float inline-block">✅</div>
          <h2
            className="font-black text-3xl md:text-4xl mb-4"
            style={{ color: text, fontFamily: 'Montserrat, sans-serif' }}
          >
            {state.lang === 'uz' ? 'Buyurtma qabul qilindi!' : 'Заказ принят!'}
          </h2>
          <p className="mb-2" style={{ color: muted }}>
            {state.lang === 'uz'
              ? `Buyurtma raqami: ${state.currentOrder?.id}`
              : `Номер заказа: ${state.currentOrder?.id}`}
          </p>
          <p className="mb-8" style={{ color: muted }}>
            {state.lang === 'uz'
              ? 'Siz bilan tez orada bog\'lanamiz!'
              : 'Мы свяжемся с вами в ближайшее время!'}
          </p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'tracking' })}
              className="px-6 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105"
              style={{ background: '#FFD233', color: '#1F1F1F', boxShadow: '0 8px 24px rgba(255,210,51,0.4)' }}
            >
              🔍 {t.trackOrder}
            </button>
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
              className="px-6 py-3 rounded-2xl font-bold text-sm transition-all"
              style={{ background: cardBg, color: text, border: `1px solid ${border}` }}
            >
              🏠 {t.home}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: bg }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Back */}
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
          className="flex items-center gap-2 text-sm font-medium mb-8 transition-opacity hover:opacity-70"
          style={{ color: muted }}
        >
          ← {t.home}
        </button>

        <h1
          className="font-black text-3xl md:text-4xl mb-10"
          style={{ color: text, fontFamily: 'Montserrat, sans-serif' }}
        >
          🛒 {t.checkout}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form col */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery info */}
            <div className="rounded-[20px] p-6" style={{ background: cardBg }}>
              <h3 className="font-bold text-lg mb-5" style={{ color: text }}>{t.delivery}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { key: 'name', label: t.name, type: 'text', placeholder: 'Aziz Toshmatov', sm: true },
                  { key: 'phone', label: t.phone, type: 'tel', placeholder: '+998 90 123 45 67', sm: true },
                  { key: 'address', label: t.address, type: 'text', placeholder: 'Ko\'chа, uy raqami', sm: false },
                  { key: 'apartment', label: t.apartment, type: 'text', placeholder: '14', sm: true },
                  { key: 'floor', label: t.floor, type: 'number', placeholder: '3', sm: true },
                  { key: 'entrance', label: t.entrance, type: 'number', placeholder: '1', sm: true },
                ].map(field => (
                  <div key={field.key} className={field.sm ? '' : 'sm:col-span-2'}>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: muted }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={form[field.key as keyof typeof form]}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border text-sm transition-all"
                      style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = '#FFD233'; e.target.style.boxShadow = '0 0 0 3px rgba(255,210,51,0.15)' }}
                      onBlur={e => { e.target.style.borderColor = border as string; e.target.style.boxShadow = 'none' }}
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5" style={{ color: muted }}>{t.notes}</label>
                  <textarea
                    rows={3}
                    placeholder={state.lang === 'uz' ? 'Qo\'shimcha izoh...' : 'Дополнительные пожелания...'}
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border text-sm resize-none transition-all"
                    style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#FFD233'; e.target.style.boxShadow = '0 0 0 3px rgba(255,210,51,0.15)' }}
                    onBlur={e => { e.target.style.borderColor = border as string; e.target.style.boxShadow = 'none' }}
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-[20px] p-6" style={{ background: cardBg }}>
              <h3 className="font-bold text-lg mb-5" style={{ color: text }}>{t.paymentMethod}</h3>
              <div className="grid grid-cols-2 gap-3">
                {PAYMENTS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPayment(p.id)}
                    className="flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left"
                    style={{
                      borderColor: payment === p.id ? '#FFD233' : border,
                      background: payment === p.id
                        ? 'rgba(255,210,51,0.08)'
                        : c ? '#222' : '#F9FAFB',
                    }}
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: text }}>
                        {p[state.lang]}
                      </div>
                    </div>
                    {payment === p.id && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-[#FFD233] flex items-center justify-center text-xs font-bold text-[#1F1F1F]">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="rounded-[20px] p-6 sticky top-24" style={{ background: cardBg }}>
              <h3 className="font-bold text-lg mb-5" style={{ color: text }}>
                {state.lang === 'uz' ? 'Buyurtma xulosasi' : 'Итог заказа'}
              </h3>

              <div className="space-y-3 mb-6">
                {state.cart.map(item => (
                  <div key={`${item.id}-${item.variant}`} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-amber-50">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{ color: text }}>{item.name}</div>
                      <div className="text-xs" style={{ color: muted }}>× {item.qty}</div>
                    </div>
                    <div className="text-sm font-bold" style={{ color: '#E11D2E' }}>
                      {fmt(item.price * item.qty)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t pt-4" style={{ borderColor: border }}>
                <div className="flex justify-between" style={{ color: muted }}>
                  <span>{t.subtotal}</span><span>{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between" style={{ color: muted }}>
                  <span>{t.deliveryFee}</span><span>{fmt(delivery)}</span>
                </div>
                <div className="flex justify-between font-black text-base pt-2 border-t" style={{ color: text, borderColor: border }}>
                  <span>{t.total}</span>
                  <span style={{ color: '#E11D2E' }}>{fmt(total)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !form.name || !form.phone || !form.address}
                className="w-full mt-6 py-4 rounded-2xl font-bold text-base transition-all"
                style={{
                  background: submitting || !form.name || !form.phone || !form.address
                    ? '#cccccc'
                    : '#FFD233',
                  color: '#1F1F1F',
                  cursor: submitting ? 'wait' : 'pointer',
                  boxShadow: submitting ? 'none' : '0 8px 24px rgba(255,210,51,0.4)',
                }}
              >
                {submitting
                  ? (state.lang === 'uz' ? '⏳ Yuklanmoqda...' : '⏳ Обработка...')
                  : `✅ ${t.placeOrder}`}
              </button>

              <p className="text-xs text-center mt-3" style={{ color: muted }}>
                {state.lang === 'uz'
                  ? '🔒 Xavfsiz buyurtma'
                  : '🔒 Безопасный заказ'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
