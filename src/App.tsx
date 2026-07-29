import { useState, useEffect } from 'react'
import { AppProvider, useApp, T, type Lang } from './context'
import CartSidebar from './components/CartSidebar'
import CheckoutPage from './pages/CheckoutPage'
import OrderTracking from './pages/OrderTracking'
import AdminPage from './pages/AdminPage'
import AccountPage from './pages/AccountPage'

// ─── Data ────────────────────────────────────────────────
interface Price {
  label: string
  amount: string
  value: number
}

interface Product {
  id: number
  name: string
  description: string
  nameRu: string
  descRu: string
  prices: Price[]
  image: string
  category: string
  badge?: string
  weight?: string
  calories?: string
  ingredients?: string
  ingredientsRu?: string
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Hot Dog',
    nameRu: 'Хот-дог',
    description: 'Yangi pishirilgan non va shirali kolbasa bilan klassik hot dog',
    descRu: 'Классический хот-дог со свежей булкой и сочной сосиской',
    prices: [
      { label: 'Melinkiy', amount: '15 000', value: 15000 },
      { label: 'Sredniy', amount: '25 000', value: 25000 },
      { label: 'Ultra', amount: '35 000', value: 35000 },
    ],
    image: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=500&h=400&fit=crop&auto=format',
    category: 'hotdogs',
    badge: 'Popular',
    weight: '180g',
    calories: '420 kcal',
    ingredients: 'Kolbasa, non, ketchup, gorchitsa, karam, bodring',
    ingredientsRu: 'Сосиска, булка, кетчуп, горчица, капуста, огурец',
  },
  {
    id: 2,
    name: 'Salad Hot Dog',
    nameRu: 'Хот-дог салат',
    description: 'Yangi sabzavotlar va maxsus sous bilan mazali salad hot dog',
    descRu: 'Вкусный хот-дог с салатом, свежими овощами и специальным соусом',
    prices: [
      { label: 'Small', amount: '12 000', value: 12000 },
      { label: 'Large', amount: '25 000', value: 25000 },
    ],
    image: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=500&h=400&fit=crop&auto=format',
    category: 'hotdogs',
    weight: '200g',
    calories: '380 kcal',
    ingredients: 'Kolbasa, salad, pomidor, bodring, maxsus sous',
    ingredientsRu: 'Сосиска, салат, помидор, огурец, специальный соус',
  },
  {
    id: 3,
    name: 'Hot Dogger',
    nameRu: 'Хот Доггер',
    description: 'Premium tarkibli bizning maxsus hot doggerimiz',
    descRu: 'Наш фирменный хот-доггер с премиум начинкой',
    prices: [{ label: '', amount: '35 000', value: 35000 }],
    image: 'https://images.unsplash.com/photo-1678033382919-fa907632fdda?w=500&h=400&fit=crop&auto=format',
    category: 'hotdogs',
    badge: "Chef's Pick",
    weight: '220g',
    calories: '510 kcal',
    ingredients: 'Premium kolbasa, ikki qavat non, pishloq, sous',
    ingredientsRu: 'Премиум сосиска, двойная булка, сыр, соус',
  },
  {
    id: 4,
    name: 'Chizburger',
    nameRu: 'Чизбургер',
    description: 'Erib turgan pishloq bilan shirasli mol go\'shti',
    descRu: 'Сочная говяжья котлета с плавленым сыром и свежими овощами',
    prices: [{ label: '', amount: '30 000', value: 30000 }],
    image: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=500&h=400&fit=crop&auto=format',
    category: 'burgers',
    weight: '250g',
    calories: '580 kcal',
    ingredients: 'Mol go\'shti kotleta, pishloq, karam, pomidor, sous',
    ingredientsRu: 'Говяжья котлета, сыр, капуста, помидор, соус',
  },
  {
    id: 5,
    name: 'Double Chizburger',
    nameRu: 'Двойной чизбургер',
    description: 'Ikki kotleta, ikki pishloq — ikki baravar lazzat',
    descRu: 'Две котлеты, два сыра — двойное удовольствие',
    prices: [{ label: '', amount: '40 000', value: 40000 }],
    image: 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=500&h=400&fit=crop&auto=format',
    category: 'burgers',
    badge: 'Best Value',
    weight: '350g',
    calories: '780 kcal',
    ingredients: '2× mol go\'shti kotleta, 2× pishloq, barcha garnishlar',
    ingredientsRu: '2× говяжья котлета, 2× сыр, все гарниры',
  },
  {
    id: 6,
    name: 'Kartoshka Fri',
    nameRu: 'Картошка Фри',
    description: 'Oltin rang, qitirloq va mazali kartoshka fri',
    descRu: 'Золотистая, хрустящая и вкусная картошка фри',
    prices: [{ label: '', amount: '20 000', value: 20000 }],
    image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&h=400&fit=crop&auto=format',
    category: 'fries',
    weight: '150g',
    calories: '320 kcal',
    ingredients: 'Kartoshka, o\'simlik yog\'i, tuz',
    ingredientsRu: 'Картофель, растительное масло, соль',
  },
  {
    id: 7,
    name: 'Ketchup',
    nameRu: 'Кетчуп',
    description: 'Klassik boy pomidor ketchup',
    descRu: 'Классический томатный кетчуп',
    prices: [{ label: '', amount: '3 000', value: 3000 }],
    image: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=500&h=300&fit=crop&auto=format',
    category: 'sauces',
    weight: '50g',
    calories: '40 kcal',
    ingredients: 'Pomidor, shakar, sirka, tuz, ziravorlar',
    ingredientsRu: 'Томат, сахар, уксус, соль, специи',
  },
  {
    id: 8,
    name: 'Special Sauce',
    nameRu: 'Специальный соус',
    description: 'Bizning maxfiy uy retsepti sousi',
    descRu: 'Наш секретный фирменный соус',
    prices: [{ label: '', amount: '5 000', value: 5000 }],
    image: 'https://images.unsplash.com/photo-1596649299486-4cdea56fd59d?w=500&h=300&fit=crop&auto=format',
    category: 'sauces',
    badge: 'House Recipe',
    weight: '50g',
    calories: '60 kcal',
    ingredients: 'Maxfiy tarkib :)',
    ingredientsRu: 'Секретный состав :)',
  },
]

const FAQS: Record<Lang, { q: string; a: string }[]> = {
  uz: [
    { q: 'Ish vaqtingiz qanday?', a: 'Biz 24 soat, haftaning 7 kuni, yil bo\'yi ochamiz. Hech qachon yopilmaymiz!' },
    { q: 'Yetkazib berish xizmatim bormi?', a: 'Ha! Shahar bo\'ylab tez yetkazib berish mavjud. Taxminiy vaqt 20-30 daqiqa.' },
    { q: 'Qanday buyurtma berish mumkin?', a: '+998 95 803 44 42 ga qo\'ng\'iroq qiling, WhatsApp, Telegram yoki sayt orqali.' },
    { q: 'Qanday to\'lov usullari qabul qilinadi?', a: 'Naqd pul, Click, Payme va Uzum Bank orqali to\'lov qilish mumkin.' },
    { q: 'Mahsulotlar yangi tayyorlanadimi?', a: 'Albatta! Biz har kuni yangi mahsulotlardan foydalanamiz. Hech narsa muzlatilmaydi.' },
  ],
  ru: [
    { q: 'Какой у вас режим работы?', a: 'Мы работаем 24 часа в сутки, 7 дней в неделю, круглый год. Мы никогда не закрываемся!' },
    { q: 'Есть ли у вас доставка?', a: 'Да! Доставка по всему городу. Ориентировочное время 20-30 минут.' },
    { q: 'Как сделать заказ?', a: 'Позвоните +998 95 803 44 42, через WhatsApp, Telegram или на сайте.' },
    { q: 'Какие способы оплаты принимаете?', a: 'Наличные, Click, Payme и Uzum Bank.' },
    { q: 'Ингредиенты свежие?', a: 'Конечно! Мы используем свежие ингредиенты каждый день. Ничего замороженного.' },
  ],
}

// ─── Small Helpers ────────────────────────────────────────
function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill="#FFD233">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

// ─── Product Card ─────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const { state, dispatch } = useApp()
  const c = state.dark
  const [added, setAdded] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState(0)
  const [qty, setQty] = useState(1)

  const isFav = state.favorites.includes(product.id)
  const price = product.prices[selectedPrice]
  const cardBg = c ? '#222222' : '#ffffff'
  const text = c ? '#F5F5F5' : '#1F1F1F'
  const muted = c ? '#888' : '#6B7280'
  const surface = c ? '#2A2A2A' : '#F7F7F7'

  const handleAdd = () => {
    dispatch({
      type: 'ADD',
      payload: {
        id: product.id,
        name: state.lang === 'uz' ? product.name : product.nameRu,
        price: price.value,
        image: product.image,
        qty,
        variant: price.label || undefined,
      },
    })
    dispatch({ type: 'SET_CART_OPEN', payload: true })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div
      className="group relative rounded-[20px] overflow-hidden transition-all duration-300 hover:-translate-y-2"
      style={{
        background: cardBg,
        boxShadow: c ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.08)',
      }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = c ? '0 16px 48px rgba(0,0,0,0.6)' : '0 16px 48px rgba(0,0,0,0.16)'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = c ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.08)'}
    >
      {product.badge && (
        <div className="absolute top-4 left-4 z-10 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ background: '#E11D2E' }}>
          {product.badge}
        </div>
      )}

      <button
        onClick={() => dispatch({ type: 'TOGGLE_FAV', payload: product.id })}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-transform hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.9)' }}
        aria-label="Favorite"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" stroke={isFav ? '#E11D2E' : '#9CA3AF'}
          fill={isFav ? '#E11D2E' : 'none'} strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      <div className="relative h-48 overflow-hidden bg-amber-50">
        <img
          src={product.image}
          alt={state.lang === 'uz' ? product.name : product.nameRu}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      <div className="p-5">
        <h3 className="font-bold text-[16px] mb-1" style={{ color: text, fontFamily: 'Montserrat, sans-serif' }}>
          {state.lang === 'uz' ? product.name : product.nameRu}
        </h3>
        <p className="text-xs leading-relaxed mb-2" style={{ color: muted }}>
          {state.lang === 'uz' ? product.description : product.descRu}
        </p>

        {/* Meta */}
        {(product.weight || product.calories) && (
          <div className="flex gap-3 mb-3">
            {product.weight && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: surface, color: muted }}>{product.weight}</span>}
            {product.calories && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: surface, color: muted }}>{product.calories}</span>}
          </div>
        )}

        <Stars />

        {/* Variant selector */}
        {product.prices.length > 1 && (
          <div className="flex gap-2 mt-3">
            {product.prices.map((p, i) => (
              <button
                key={i}
                onClick={() => setSelectedPrice(i)}
                className="flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={
                  selectedPrice === i
                    ? { background: '#FFD233', color: '#1F1F1F' }
                    : { background: surface, color: muted }
                }
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-2">
          <div>
            <div className="font-black text-base" style={{ color: '#E11D2E' }}>
              {product.prices[selectedPrice].amount} UZS
            </div>
          </div>

          {/* Qty + add */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl overflow-hidden" style={{ background: surface }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-8 h-8 flex items-center justify-center font-bold text-sm" style={{ color: text }}>−</button>
              <span className="w-5 text-center text-sm font-bold" style={{ color: text }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-8 h-8 flex items-center justify-center font-bold text-sm" style={{ color: text }}>+</button>
            </div>

            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{
                background: added ? '#10B981' : '#FFD233',
                color: added ? '#fff' : '#1F1F1F',
              }}
            >
              {added ? '✓' : '+'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Header ───────────────────────────────────────────────
function Header() {
  const { state, dispatch } = useApp()
  const t = T[state.lang]
  const c = state.dark
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0)

  const navLinks = [
    { label: t.home, href: '#home' },
    { label: t.menu, href: '#menu' },
    { label: t.about, href: '#about' },
    { label: t.delivery, href: '#delivery' },
    { label: t.gallery, href: '#gallery' },
    { label: t.contact, href: '#contact' },
  ]

  const headerBg = scrolled
    ? c ? 'rgba(17,17,17,0.94)' : 'rgba(255,255,255,0.94)'
    : 'transparent'

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: headerBg,
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.08)' : 'none',
        padding: scrolled ? '12px 0' : '18px 0',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
          className="flex items-center gap-3 group"
        >
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xl text-[#1F1F1F] transition-transform group-hover:scale-105"
            style={{ background: '#FFD233', boxShadow: '0 4px 14px rgba(255,210,51,0.5)' }}
          >
            G
          </div>
          <div>
            <div className="font-black text-[16px] leading-tight" style={{ color: c ? '#F5F5F5' : '#1F1F1F', fontFamily: 'Montserrat, sans-serif' }}>
              G'UNCHA
            </div>
            <div className="text-[9px] font-bold tracking-widest" style={{ color: '#E11D2E' }}>HOT FOOD</div>
          </div>
        </button>

        {/* Desktop nav */}
        <nav className="hidden xl:flex items-center gap-6">
          {navLinks.map(link => (
            <a key={link.label} href={link.href}
              className="text-sm font-medium relative group transition-colors"
              style={{ color: c ? '#CCCCCC' : '#374151' }}
              onClick={() => { if (state.view !== 'home') dispatch({ type: 'SET_VIEW', payload: 'home' }) }}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 rounded-full group-hover:w-full transition-all duration-300" style={{ background: '#FFD233' }} />
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Language */}
          <button
            onClick={() => dispatch({ type: 'SET_LANG', payload: state.lang === 'uz' ? 'ru' : 'uz' })}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
            style={{ background: c ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', color: c ? '#F5F5F5' : '#374151' }}
          >
            {state.lang === 'uz' ? '🇺🇿 UZ' : '🇷🇺 RU'}
          </button>

          {/* Dark mode */}
          <button
            onClick={() => dispatch({ type: 'SET_DARK', payload: !c })}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: c ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }}
            aria-label="Toggle dark mode"
          >
            <span>{c ? '☀️' : '🌙'}</span>
          </button>

          {/* Account */}
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'account' })}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
            style={{ background: c ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' }}
            aria-label="Account"
          >
            <span>{state.user ? '👤' : '🔑'}</span>
          </button>

          {/* Cart */}
          <button
            onClick={() => dispatch({ type: 'SET_CART_OPEN', payload: true })}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
            style={{ background: '#FFD233', color: '#1F1F1F', boxShadow: '0 4px 14px rgba(255,210,51,0.45)' }}
          >
            🛒
            {cartCount > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-black"
                style={{ background: '#E11D2E' }}
              >
                {cartCount}
              </span>
            )}
            <span className="hidden sm:block">{t.cart}</span>
          </button>

          {/* Admin shortcut */}
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'admin' })}
            className="hidden lg:flex w-9 h-9 rounded-xl items-center justify-center transition-all hover:scale-110"
            style={{ background: c ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)', color: c ? '#666' : '#aaa' }}
            title="Admin"
          >
            ⚙️
          </button>

          {/* Mobile hamburger */}
          <button
            className="xl:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="block w-5 h-0.5 rounded-full transition-all duration-300"
                style={{
                  background: c ? '#F5F5F5' : '#1F1F1F',
                  transform: menuOpen ? (i === 0 ? 'rotate(45deg) translateY(8px)' : i === 2 ? 'rotate(-45deg) translateY(-8px)' : 'scaleX(0)') : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="xl:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: menuOpen ? '400px' : '0', background: c ? '#111' : '#fff', borderTop: menuOpen ? `1px solid ${c ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` : 'none' }}
      >
        <div className="px-6 py-4 space-y-1">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} onClick={() => { setMenuOpen(false); if (state.view !== 'home') dispatch({ type: 'SET_VIEW', payload: 'home' }) }}
              className="block py-3 text-sm font-medium border-b transition-colors"
              style={{ color: c ? '#CCC' : '#374151', borderColor: c ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
              {link.label}
            </a>
          ))}
          <div className="pt-4 flex gap-3">
            <button
              onClick={() => dispatch({ type: 'SET_LANG', payload: state.lang === 'uz' ? 'ru' : 'uz' })}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold"
              style={{ background: c ? '#2A2A2A' : '#F3F4F6', color: c ? '#F5F5F5' : '#374151' }}
            >
              {state.lang === 'uz' ? '🇷🇺 RU' : '🇺🇿 UZ'}
            </button>
            <a href="tel:+998958034442" onClick={() => setMenuOpen(false)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-center"
              style={{ background: '#FFD233', color: '#1F1F1F' }}>
              📞 Call
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────
function Hero() {
  const { state, dispatch } = useApp()
  const t = T[state.lang]
  const c = state.dark

  const ingredients = [
    { emoji: '🧀', label: c ? 'Pishloq' : 'Cheese', delay: '0s', pos: { top: '8%', left: '4%' } },
    { emoji: '🌶️', label: c ? 'Kolbasa' : 'Sausage', delay: '0.6s', pos: { top: '14%', right: '3%' } },
    { emoji: '🍅', label: c ? 'Pomidor' : 'Tomato', delay: '1.1s', pos: { top: '44%', right: '-1%' } },
    { emoji: '🥬', label: c ? 'Karam' : 'Lettuce', delay: '1.6s', pos: { bottom: '24%', right: '2%' } },
    { emoji: '🍟', label: c ? 'Fri' : 'Fries', delay: '0.8s', pos: { bottom: '10%', left: '8%' } },
    { emoji: '🥤', label: c ? 'Ichimlik' : 'Drink', delay: '0.3s', pos: { top: '48%', left: '-1%' } },
    { emoji: '🌭', label: c ? 'Gorchitsa' : 'Mustard', delay: '1.4s', pos: { top: '68%', left: '12%' } },
  ]

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: c
          ? 'linear-gradient(135deg, #1A1008 0%, #2A1A05 40%, #3A2A08 70%, #2A1A05 100%)'
          : 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 35%, #FDE68A 65%, #FCD34D 100%)',
      }}
    >
      {/* Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #FFD233, transparent 70%)' }} />
        <div className="absolute top-1/2 -left-24 w-72 h-72 rounded-full opacity-10" style={{ background: '#E11D2E' }} />
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 rounded-full opacity-15" style={{ background: '#FFD233' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-full">
        <div className="relative z-10">
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium mb-6"
            style={{ background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.7)', color: '#374151' }}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {t.fresh} • {t.open247} • {t.fastDelivery}
          </div>

          <h1
            className="font-black leading-[1.05] mb-5"
            style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 'clamp(2.8rem, 7vw, 5rem)', color: c ? '#F5F5F5' : '#1F1F1F' }}
          >
            {t.heroTitle}<br />
            <span style={{ color: '#E11D2E' }}>{t.heroSub}</span>
          </h1>

          <p className="text-lg leading-relaxed mb-8 max-w-[500px]" style={{ color: c ? '#AAAAAA' : '#4B5563' }}>
            {t.heroDesc}
            <strong style={{ color: c ? '#F5F5F5' : '#1F1F1F' }}> {t.open247}. {t.fastDelivery}. 20-30 min.</strong>
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
              className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl text-base transition-all hover:scale-105"
              style={{ background: '#FFD233', color: '#1F1F1F', boxShadow: '0 8px 32px rgba(255,210,51,0.55)' }}
            >
              🛒 {t.orderNow}
            </button>
            <a
              href="#menu"
              className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-2xl text-base transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.8)', color: '#1F1F1F' }}
            >
              📋 {t.viewMenu}
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-8">
            {[
              { value: '500+', label: state.lang === 'uz' ? 'Mamnun mijozlar' : 'Довольных клиентов' },
              { value: '24/7', label: t.open247 },
              { value: '20min', label: state.lang === 'uz' ? 'O\'rtacha yetkazib berish' : 'Средняя доставка' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-black" style={{ fontFamily: 'Montserrat, sans-serif', color: c ? '#F5F5F5' : '#1F1F1F' }}>{s.value}</div>
                <div className="text-sm" style={{ color: c ? '#888' : '#6B7280' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right image */}
        <div className="relative flex items-center justify-center h-[480px] lg:h-[580px]">
          <div className="absolute inset-0 m-auto w-72 h-72 rounded-full opacity-40" style={{ background: 'radial-gradient(circle, #FFD233 0%, transparent 70%)' }} />

          <div
            className="relative z-10 w-72 h-72 lg:w-[340px] lg:h-[340px] rounded-[40px] overflow-hidden float-s"
            style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}
          >
            <img src="https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=680&h=680&fit=crop&auto=format" alt="G'UNCHA signature hot dog" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            {[0, 1, 2].map(i => (
              <div key={i} className="absolute bottom-full w-1 rounded-full"
                style={{ left: `${30 + i * 20}%`, height: '40px', background: 'rgba(255,255,255,0.6)', filter: 'blur(3px)', animation: `steam ${1.8 + i * 0.4}s ease-out infinite`, animationDelay: `${i * 0.5}s` }} />
            ))}
          </div>

          {ingredients.map(({ emoji, label, delay, pos }) => (
            <div key={label} className="absolute z-20 flex items-center gap-2 px-3 py-2 rounded-2xl shadow-lg float"
              style={{ ...pos, animationDelay: delay, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.9)' }}>
              <span className="text-lg">{emoji}</span>
              <span className="text-xs font-semibold text-gray-700">{label}</span>
            </div>
          ))}

          <div
            className="absolute bottom-16 right-4 z-20 text-white rounded-2xl px-5 py-3 shadow-xl float-r"
            style={{ background: '#E11D2E', boxShadow: '0 8px 24px rgba(225,29,46,0.45)' }}
          >
            <div className="text-xs font-medium opacity-75">{state.lang === 'uz' ? 'Doim' : 'Всегда'}</div>
            <div className="text-2xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>24/7</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 70" fill={c ? '#111111' : '#ffffff'} xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0,35 C360,70 1080,0 1440,35 L1440,70 L0,70 Z" />
        </svg>
      </div>
    </section>
  )
}

// ─── Popular Products ──────────────────────────────────────
function PopularProducts({ products }: { products: Product[] }) {
  const { state } = useApp()
  const t = T[state.lang]
  const c = state.dark

  return (
    <section id="products" className="py-24" style={{ background: c ? '#111111' : '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-block font-semibold px-4 py-1.5 rounded-full text-sm mb-4" style={{ background: 'rgba(255,210,51,0.18)', color: '#E11D2E' }}>
            {t.menu}
          </div>
          <h2 className="font-black text-4xl md:text-5xl mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: c ? '#F5F5F5' : '#1F1F1F' }}>
            {t.popular}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  )
}

// ─── Menu ─────────────────────────────────────────────────
function Menu({ products }: { products: Product[] }) {
  const { state } = useApp()
  const t = T[state.lang]
  const c = state.dark
  const [activeTab, setActiveTab] = useState('hotdogs')

  const tabs = [
    { id: 'hotdogs', label: '🌭 ' + (state.lang === 'uz' ? 'Hot Doglar' : 'Хот-доги') },
    { id: 'burgers', label: '🍔 ' + (state.lang === 'uz' ? 'Burgerlar' : 'Бургеры') },
    { id: 'fries', label: '🍟 ' + (state.lang === 'uz' ? 'Fri' : 'Фри') },
    { id: 'sauces', label: '🥫 ' + (state.lang === 'uz' ? 'Souslar' : 'Соусы') },
  ]

  return (
    <section id="menu" className="py-24" style={{ background: c ? '#1A1A1A' : '#F7F7F7' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-block font-semibold px-4 py-1.5 rounded-full text-sm mb-4" style={{ background: 'rgba(255,210,51,0.18)', color: '#E11D2E' }}>
            {t.menu}
          </div>
          <h2 className="font-black text-4xl md:text-5xl mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: c ? '#F5F5F5' : '#1F1F1F' }}>
            {state.lang === 'uz' ? 'Menyu' : 'Меню'}
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200"
              style={activeTab === tab.id
                ? { background: '#FFD233', color: '#1F1F1F', boxShadow: '0 4px 16px rgba(255,210,51,0.45)', transform: 'scale(1.05)' }
                : { background: c ? '#2A2A2A' : '#ffffff', color: c ? '#888' : '#6B7280' }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.filter(p => p.category === activeTab).map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  )
}

// ─── Why Choose Us ─────────────────────────────────────────
function WhyChooseUs() {
  const { state } = useApp()
  const c = state.dark

  const features = [
    { icon: '⚡', title: state.lang === 'uz' ? 'Tez Yetkazish' : 'Быстрая доставка', desc: state.lang === 'uz' ? '20-30 daqiqada issiq va yangi taom.' : 'Горячая еда за 20-30 минут.', accent: '#FFD233', bg: 'rgba(255,210,51,0.1)' },
    { icon: '🥩', title: state.lang === 'uz' ? 'Yangi Tarkib' : 'Свежие ингредиенты', desc: state.lang === 'uz' ? 'Har kuni eng sifatli mahsulotlar.' : 'Каждый день только качественные продукты.', accent: '#10B981', bg: 'rgba(16,185,129,0.1)' },
    { icon: '🕒', title: state.lang === 'uz' ? '24/7 Ochiq' : 'Открыто 24/7', desc: state.lang === 'uz' ? 'Hech qachon yopilmaymiz. Xohlagan vaqtda buyurtma bering.' : 'Никогда не закрываемся.', accent: '#6366F1', bg: 'rgba(99,102,241,0.1)' },
    { icon: '❤️', title: state.lang === 'uz' ? 'Eng Sifatli' : 'Лучшее качество', desc: state.lang === 'uz' ? 'Har bir taom mehr va g\'amxo\'rlik bilan tayyorlanadi.' : 'Каждое блюдо приготовлено с любовью.', accent: '#E11D2E', bg: 'rgba(225,29,46,0.1)' },
  ]

  return (
    <section className="py-24" style={{ background: c ? '#111111' : '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-block font-semibold px-4 py-1.5 rounded-full text-sm mb-4" style={{ background: 'rgba(255,210,51,0.18)', color: '#E11D2E' }}>
            {T[state.lang].whyUs}
          </div>
          <h2 className="font-black text-4xl md:text-5xl mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: c ? '#F5F5F5' : '#1F1F1F' }}>
            {state.lang === 'uz' ? 'Nega G\'UNCHA?' : 'Почему G\'UNCHA?'}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map(f => (
            <div
              key={f.title}
              className="group p-8 rounded-[20px] border transition-all duration-300 hover:-translate-y-2 cursor-default"
              style={{ borderColor: c ? 'rgba(255,255,255,0.07)' : '#F3F4F6', background: c ? '#1A1A1A' : '#ffffff' }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = `0 20px 50px rgba(0,0,0,${c ? '0.4' : '0.12'})`; el.style.borderColor = f.accent }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = ''; el.style.borderColor = c ? 'rgba(255,255,255,0.07)' : '#F3F4F6' }}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-transform group-hover:scale-110" style={{ background: f.bg }}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: c ? '#F5F5F5' : '#1F1F1F' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: c ? '#888' : '#6B7280' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── About ────────────────────────────────────────────────
function About() {
  const { state } = useApp()

  return (
    <section id="about" className="py-24 overflow-hidden relative" style={{ background: '#1F1F1F' }}>
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="rounded-[28px] overflow-hidden">
              <img src="https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=700&h=500&fit=crop&auto=format" alt="G'UNCHA restaurant" className="w-full h-80 lg:h-96 object-cover" />
              <div className="absolute inset-0 rounded-[28px] bg-gradient-to-tr from-[#FFD233]/20 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-4 rounded-2xl p-6 shadow-2xl" style={{ background: '#FFD233' }}>
              <div className="text-4xl font-black text-[#1F1F1F]" style={{ fontFamily: 'Montserrat, sans-serif' }}>10+</div>
              <div className="text-xs font-semibold text-[#1F1F1F]/70 mt-0.5">
                {state.lang === 'uz' ? 'Yillik tajriba' : 'Лет опыта'}
              </div>
            </div>
            <div className="absolute -top-4 -left-4 rounded-2xl p-4 shadow-xl text-white" style={{ background: '#E11D2E' }}>
              <div className="text-3xl font-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>4.9</div>
              <Stars />
              <div className="text-xs mt-1 opacity-80">{state.lang === 'uz' ? '500+ sharh' : '500+ отзывов'}</div>
            </div>
          </div>

          <div>
            <div className="inline-block font-semibold px-4 py-1.5 rounded-full text-sm mb-6" style={{ background: 'rgba(255,210,51,0.15)', color: '#FFD233' }}>
              {T[state.lang].aboutTitle}
            </div>
            <h2 className="font-black text-4xl md:text-5xl mb-6 leading-tight text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {state.lang === 'uz' ? "G'UNCHA haqida" : "О G'UNCHA"}
              <br /><span style={{ color: '#FFD233' }}>HOT FOOD</span>
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {state.lang === 'uz'
                ? "G'UNCHA HOT FOOD har kuni sifatli mahsulotlardan yangi va mazali tez taomlar tayyorlaydi. Mijoz mamnuniyati bizning eng yuqori ustuvorligimizdir."
                : "G'UNCHA HOT FOOD каждый день готовит свежие и вкусные блюда из качественных продуктов. Удовлетворённость клиентов — наш главный приоритет."}
            </p>
            <div className="space-y-4">
              {[
                { icon: '🌿', text: state.lang === 'uz' ? 'Har kuni yangi, yuqori sifatli mahsulotlar' : 'Ежедневно свежие продукты высокого качества' },
                { icon: '😊', text: state.lang === 'uz' ? 'Har bir buyurtmani alohida e\'tibor bilan' : 'Каждый заказ с особым вниманием' },
                { icon: '💰', text: state.lang === 'uz' ? 'Sifatdan murosasiz hamyonbop narxlar' : 'Доступные цены без компромисса по качеству' },
              ].map(item => (
                <div key={item.text} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 mt-0.5" style={{ background: 'rgba(255,210,51,0.12)' }}>
                    {item.icon}
                  </div>
                  <p className="text-gray-300 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Delivery ─────────────────────────────────────────────
function Delivery() {
  const { state } = useApp()
  const t = T[state.lang]
  const c = state.dark

  return (
    <section id="delivery" className="py-24 overflow-hidden" style={{ background: c ? '#1A1A1A' : '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-block font-semibold px-4 py-1.5 rounded-full text-sm mb-6" style={{ background: 'rgba(255,210,51,0.18)', color: '#E11D2E' }}>
            {t.delivery}
          </div>
          <h2 className="font-black text-4xl md:text-5xl mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif', color: c ? '#F5F5F5' : '#1F1F1F' }}>
            {state.lang === 'uz' ? 'Tez va Yangi' : 'Быстрая и Свежая'}<br />
            <span style={{ color: '#E11D2E' }}>{t.delivery}</span>
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: c ? '#888' : '#6B7280' }}>
            {state.lang === 'uz'
              ? 'Shahar bo\'ylab yetkazib berish mavjud. Taxminiy vaqt:'
              : 'Доставка по всему городу. Примерное время:'}
            {' '}<strong style={{ color: c ? '#F5F5F5' : '#1F1F1F' }}>20-30 {state.lang === 'uz' ? 'daqiqa' : 'минут'}</strong>.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { icon: '🕒', label: t.open247 },
              { icon: '🚀', label: t.fastDelivery },
              { icon: '🌿', label: state.lang === 'uz' ? 'Yangi taom' : 'Свежая еда' },
            ].map(f => (
              <div key={f.label} className="text-center py-5 px-3 rounded-2xl" style={{ background: c ? '#222' : '#F7F7F7' }}>
                <div className="text-3xl mb-2">{f.icon}</div>
                <div className="text-sm font-semibold" style={{ color: c ? '#F5F5F5' : '#1F1F1F' }}>{f.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="tel:+998958034442" className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl text-base transition-all hover:scale-105"
              style={{ background: '#FFD233', color: '#1F1F1F', boxShadow: '0 8px 28px rgba(255,210,51,0.45)' }}>
              📞 {state.lang === 'uz' ? 'Qo\'ng\'iroq qiling' : 'Позвонить'}
            </a>
            <a href="https://wa.me/998958034442" className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl text-base text-white transition-all hover:scale-105"
              style={{ background: '#25D366' }}>
              💬 WhatsApp
            </a>
            <a href="https://t.me/guncha_hotfood" className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-2xl text-base text-white transition-all hover:scale-105"
              style={{ background: '#229ED9' }}>
              ✈️ Telegram
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-[28px] overflow-hidden shadow-2xl">
            <img src="https://images.unsplash.com/photo-1612006567758-1846b36dd130?w=700&h=520&fit=crop&auto=format" alt="Delivery courier" className="w-full h-96 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFD233]/25 to-transparent" />
          </div>
          <div className="absolute top-6 right-6 rounded-2xl p-5 shadow-xl text-center" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)' }}>
            <div className="text-4xl font-black text-[#1F1F1F]" style={{ fontFamily: 'Montserrat, sans-serif' }}>20</div>
            <div className="text-xs text-gray-500 font-semibold">{state.lang === 'uz' ? 'daq. o\'rtacha' : 'мин среднее'}</div>
          </div>
          <div className="absolute bottom-6 left-6 rounded-2xl px-5 py-4 shadow-xl" style={{ background: '#1F1F1F' }}>
            <div className="text-xs text-gray-400 mb-0.5">{state.lang === 'uz' ? 'Bizga qo\'ng\'iroq qiling' : 'Позвоните нам'}</div>
            <div className="font-bold text-white text-sm">+998 95 803 44 42</div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Gallery ──────────────────────────────────────────────
function Gallery() {
  const { state } = useApp()
  const c = state.dark

  const images = [
    { url: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=700&h=450&fit=crop&auto=format', alt: 'Hot dog', col: 'lg:col-span-2' },
    { url: 'https://images.unsplash.com/photo-1610440042657-612c34d95e9f?w=450&h=450&fit=crop&auto=format', alt: 'Burger', col: '' },
    { url: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=450&h=300&fit=crop&auto=format', alt: 'Fries', col: '' },
    { url: 'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=450&h=450&fit=crop&auto=format', alt: 'Salad hot dog', col: '' },
    { url: 'https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?w=700&h=400&fit=crop&auto=format', alt: 'Double burger', col: 'lg:col-span-2' },
    { url: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=450&h=300&fit=crop&auto=format', alt: 'Sauce', col: '' },
  ]

  return (
    <section id="gallery" className="py-24" style={{ background: c ? '#111111' : '#F7F7F7' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-block font-semibold px-4 py-1.5 rounded-full text-sm mb-4" style={{ background: 'rgba(255,210,51,0.18)', color: '#E11D2E' }}>
            {T[state.lang].gallery}
          </div>
          <h2 className="font-black text-4xl md:text-5xl mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: c ? '#F5F5F5' : '#1F1F1F' }}>
            {state.lang === 'uz' ? 'Foto Galereya' : 'Фото Галерея'}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridAutoRows: '220px' }}>
          {images.map((img, i) => (
            <div key={i} className={`group overflow-hidden rounded-[20px] cursor-pointer ${img.col}`}>
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Reviews ──────────────────────────────────────────────
function Reviews() {
  const { state } = useApp()

  const reviews: Record<Lang, { name: string; role: string; text: string; initials: string; color: string }[]> = {
    uz: [
      { name: 'Aziz Toshmatov', role: 'Doimiy mijoz', initials: 'AT', color: '#FFD233', text: "Shahardagi eng yaxshi hot doglar! Doim yangi, doim issiq. Ultra hajm mutlaqo ajoyib. Haftasiga kamida ikki marta buyurtma beraman!" },
      { name: 'Malika Yusupova', role: 'Oziq-ovqat blogeri', initials: 'MY', color: '#E11D2E', text: "G'UNCHA HOT FOOD har safar ajoyib tajriba taqdim etadi. Sifat doim yuqori va yetkazib berish juda tez. Tavsiya qilaman!" },
      { name: 'Bobur Rahimov', role: 'Har kunlik mijoz', initials: 'BR', color: '#6366F1', text: "24/7 ochiq bo'lishi katta qulay! Kech tunda ishtaha yoqdi — muammo yo'q. Double Chizburger — mening sevimli!" },
    ],
    ru: [
      { name: 'Азиз Тошматов', role: 'Постоянный клиент', initials: 'AT', color: '#FFD233', text: "Лучшие хот-доги в городе! Всегда свежие, всегда горячие. Ультра размер — это просто шедевр. Заказываю минимум дважды в неделю!" },
      { name: 'Малика Юсупова', role: 'Фуд-блогер', initials: 'MY', color: '#E11D2E', text: "G'UNCHA HOT FOOD каждый раз предоставляет потрясающий опыт. Качество стабильно высокое, доставка очень быстрая. Рекомендую!" },
      { name: 'Бобур Рахимов', role: 'Ежедневный клиент', initials: 'BR', color: '#6366F1', text: "Работа 24/7 — огромное удобство! Ночной голод решён мгновенно. Двойной чизбургер — мой абсолютный фаворит!" },
    ],
  }

  return (
    <section className="py-24" style={{ background: '#1F1F1F' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-block font-semibold px-4 py-1.5 rounded-full text-sm mb-4" style={{ background: 'rgba(255,255,255,0.08)', color: '#FFD233' }}>
            {T[state.lang].reviews}
          </div>
          <h2 className="font-black text-4xl md:text-5xl text-white mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {T[state.lang].reviews}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews[state.lang].map(r => (
            <div
              key={r.name}
              className="p-8 rounded-[20px] transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,210,51,0.3)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'}
            >
              <div className="text-5xl font-black mb-2 leading-none" style={{ color: '#FFD233', opacity: 0.4 }}>"</div>
              <Stars />
              <p className="text-gray-300 mt-4 mb-6 leading-relaxed text-sm">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-[#1F1F1F] text-sm flex-shrink-0" style={{ background: r.color }}>
                  {r.initials}
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{r.name}</div>
                  <div className="text-xs text-gray-500">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────
function FAQ() {
  const { state } = useApp()
  const c = state.dark
  const [open, setOpen] = useState<number | null>(null)
  const faqs = FAQS[state.lang]

  return (
    <section className="py-24" style={{ background: c ? '#1A1A1A' : '#ffffff' }}>
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-block font-semibold px-4 py-1.5 rounded-full text-sm mb-4" style={{ background: 'rgba(255,210,51,0.18)', color: '#E11D2E' }}>
            {T[state.lang].faq}
          </div>
          <h2 className="font-black text-4xl md:text-5xl mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: c ? '#F5F5F5' : '#1F1F1F' }}>
            {T[state.lang].faq}
          </h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-[20px] border overflow-hidden transition-all duration-300"
              style={{ borderColor: open === i ? '#FFD233' : c ? 'rgba(255,255,255,0.07)' : '#E5E7EB', background: c ? '#222' : '#fff', boxShadow: open === i ? '0 8px 30px rgba(255,210,51,0.15)' : 'none' }}
            >
              <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left gap-4">
                <span className="font-semibold" style={{ color: c ? '#F5F5F5' : '#1F1F1F' }}>{faq.q}</span>
                <span className="text-2xl font-light flex-shrink-0 transition-transform duration-300" style={{ color: '#E11D2E', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: open === i ? '200px' : '0' }}>
                <p className="px-6 pb-6 leading-relaxed text-sm" style={{ color: c ? '#888' : '#6B7280' }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────
function Contact() {
  const { state } = useApp()
  const t = T[state.lang]
  const c = state.dark
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
    setForm({ name: '', phone: '', message: '' })
  }

  const cardBg = c ? '#1A1A1A' : '#ffffff'
  const text = c ? '#F5F5F5' : '#1F1F1F'
  const muted = c ? '#888' : '#6B7280'
  const border = c ? 'rgba(255,255,255,0.08)' : '#E5E7EB'
  const inputBg = c ? '#222' : '#F9FAFB'

  return (
    <section id="contact" className="py-24" style={{ background: c ? '#111111' : '#F7F7F7' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <div className="inline-block font-semibold px-4 py-1.5 rounded-full text-sm mb-4" style={{ background: 'rgba(255,210,51,0.18)', color: '#E11D2E' }}>
            {t.contactTitle}
          </div>
          <h2 className="font-black text-4xl md:text-5xl mb-4" style={{ fontFamily: 'Montserrat, sans-serif', color: text }}>
            {t.contactTitle}
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-5">
            {[
              { icon: '📞', label: t.phone, value: '+998 95 803 44 42', href: 'tel:+998958034442', sub: '' },
              { icon: '🕒', label: state.lang === 'uz' ? 'Ish vaqti' : 'Режим работы', value: t.open247, href: '', sub: state.lang === 'uz' ? 'Har doim xizmatda' : 'Всегда на связи' },
              { icon: '🚀', label: t.delivery, value: state.lang === 'uz' ? 'Mavjud' : 'Доступна', href: '', sub: state.lang === 'uz' ? '20-30 daqiqa' : '20-30 минут' },
            ].map(card => (
              <div key={card.label} className="flex items-center gap-5 p-6 rounded-[20px]" style={{ background: cardBg }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: 'rgba(255,210,51,0.15)' }}>
                  {card.icon}
                </div>
                <div>
                  <div className="text-sm mb-0.5" style={{ color: muted }}>{card.label}</div>
                  {card.href ? (
                    <a href={card.href} className="text-xl font-bold transition-colors hover:opacity-80" style={{ color: text }}>{card.value}</a>
                  ) : (
                    <div className="text-xl font-bold" style={{ color: text }}>{card.value}</div>
                  )}
                  {card.sub && <div className="text-sm mt-0.5 font-semibold" style={{ color: '#10B981' }}>{card.sub}</div>}
                </div>
              </div>
            ))}
            <div className="rounded-[20px] h-52 flex items-center justify-center relative overflow-hidden" style={{ background: '#1F1F1F' }}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#FFD233 1px, transparent 1px), linear-gradient(90deg, #FFD233 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
              <div className="relative text-center text-white">
                <div className="text-5xl mb-3 float-s inline-block">📍</div>
                <div className="font-bold text-base">G'UNCHA HOT FOOD</div>
                <div className="text-sm text-gray-400 mt-1">Toshkent, O'zbekiston</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 rounded-[20px] space-y-5" style={{ background: cardBg }}>
            <h3 className="text-2xl font-bold mb-6" style={{ color: text, fontFamily: 'Montserrat, sans-serif' }}>{t.sendMessage}</h3>
            {[
              { key: 'name', label: t.yourName, type: 'text', placeholder: 'Aziz Toshmatov' },
              { key: 'phone', label: t.yourPhone, type: 'tel', placeholder: '+998 90 123 45 67' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-1.5" style={{ color: muted }}>{field.label}</label>
                <input type={field.type} placeholder={field.placeholder} value={form[field.key as keyof typeof form]}
                  onChange={e => setForm(d => ({ ...d, [field.key]: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border text-sm transition-all"
                  style={{ background: inputBg, borderColor: border, color: text }}
                  onFocus={e => { e.target.style.borderColor = '#FFD233'; e.target.style.boxShadow = '0 0 0 3px rgba(255,210,51,0.15)' }}
                  onBlur={e => { e.target.style.borderColor = border as string; e.target.style.boxShadow = 'none' }}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: muted }}>{t.message}</label>
              <textarea rows={4} placeholder={state.lang === 'uz' ? 'Qanday yordam kerak?' : 'Чем можем помочь?'}
                value={form.message} onChange={e => setForm(d => ({ ...d, message: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border text-sm resize-none transition-all"
                style={{ background: inputBg, borderColor: border, color: text }}
                onFocus={e => { e.target.style.borderColor = '#FFD233'; e.target.style.boxShadow = '0 0 0 3px rgba(255,210,51,0.15)' }}
                onBlur={e => { e.target.style.borderColor = border as string; e.target.style.boxShadow = 'none' }}
              />
            </div>
            <button type="submit" className="w-full py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={sent ? { background: '#10B981', color: '#fff' } : { background: '#FFD233', color: '#1F1F1F', boxShadow: '0 8px 24px rgba(255,210,51,0.4)' }}>
              {sent ? `✓ ${t.messageSent}` : t.sendMessage}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────
function Footer() {
  const { state, dispatch } = useApp()
  const t = T[state.lang]

  return (
    <footer style={{ background: '#111111' }} className="text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl text-[#1F1F1F]" style={{ background: '#FFD233' }}>G</div>
              <div>
                <div className="font-black text-lg leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>G'UNCHA</div>
                <div className="text-[10px] font-bold tracking-widest" style={{ color: '#FFD233' }}>HOT FOOD</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {state.lang === 'uz' ? 'Har kuni sevgi bilan tayyorlangan yangi va mazali tez taomlar.' : 'Свежая и вкусная еда, приготовленная с любовью каждый день.'}
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: '📘', label: 'Facebook' },
                { icon: '📷', label: 'Instagram' },
                { icon: '✈️', label: 'Telegram' },
              ].map(s => (
                <button key={s.label} className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                  aria-label={s.label}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFD233' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)' }}>
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="font-bold text-[#FFD233] mb-5 tracking-wide text-sm">
              {state.lang === 'uz' ? 'Tezkor havolalar' : 'Быстрые ссылки'}
            </div>
            <ul className="space-y-3">
              {[
                { label: t.home, href: '#home' },
                { label: t.menu, href: '#menu' },
                { label: t.about, href: '#about' },
                { label: t.gallery, href: '#gallery' },
                { label: t.contact, href: '#contact' },
              ].map(link => (
                <li key={link.label}>
                  <a href={link.href} onClick={() => { if (state.view !== 'home') dispatch({ type: 'SET_VIEW', payload: 'home' }) }}
                    className="text-gray-400 text-sm transition-colors hover:text-white">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-bold text-[#FFD233] mb-5 tracking-wide text-sm">{t.menu}</div>
            <ul className="space-y-3">
              {['🌭 Hot Dogs', '🍔 Burgerlar', '🍟 Kartoshka Fri', '🥫 Souslar'].map(item => (
                <li key={item}><a href="#menu" className="text-gray-400 text-sm transition-colors hover:text-white">{item}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-bold text-[#FFD233] mb-5 tracking-wide text-sm">{t.contact}</div>
            <div className="space-y-3">
              <a href="tel:+998958034442" className="flex items-center gap-2 text-gray-400 text-sm hover:text-white transition-colors">
                <span>📞</span> +998 95 803 44 42
              </a>
              <div className="flex items-center gap-2 text-gray-400 text-sm"><span>🕒</span> {t.open247}</div>
              <div className="flex items-center gap-2 text-gray-400 text-sm"><span>🚀</span> {t.fastDelivery}</div>
              <div className="flex items-center gap-2 text-gray-400 text-sm"><span>📍</span> Toshkent, O'zbekiston</div>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
          <p className="text-gray-500 text-sm">© 2024 G'UNCHA HOT FOOD. {state.lang === 'uz' ? 'Barcha huquqlar himoyalangan.' : 'Все права защищены.'}</p>
          <p className="text-gray-600 text-sm">{state.lang === 'uz' ? 'O\'zbekistonda ❤️ bilan yaratilgan' : 'Сделано с ❤️ в Узбекистане'}</p>
        </div>
      </div>
    </footer>
  )
}

// ─── Scroll Top ───────────────────────────────────────────
function ScrollTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-[#1F1F1F] transition-all duration-300"
      style={{
        background: '#FFD233', boxShadow: '0 8px 24px rgba(255,210,51,0.5)',
        opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none',
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.8)',
      }}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  )
}

// ─── Loading ──────────────────────────────────────────────
function LoadingScreen({ done }: { done: boolean }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700"
      style={{ background: '#1F1F1F', opacity: done ? 0 : 1, pointerEvents: done ? 'none' : 'all' }}
    >
      <div className="text-center">
        <div className="text-7xl mb-6 float inline-block" style={{ animationDuration: '1.2s' }}>🌭</div>
        <div className="font-black text-3xl text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>G'UNCHA</div>
        <div className="text-sm font-bold tracking-widest mb-6" style={{ color: '#FFD233' }}>HOT FOOD</div>
        <div className="flex gap-1.5 justify-center">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: '#FFD233', animation: 'float 0.8s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Landing Page ─────────────────────────────────────────
function LandingPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS)

  useEffect(() => {
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) => {
        const newProducts: Product[] = data.map((item: any) => ({
          id: item.id,
          name: item.name_uz,
          nameRu: item.name_ru,
          description: item.description_uz,
          descRu: item.description_ru,
          prices: [
            {
              label: "",
              amount: String(item.price),
              value: Number(item.price),
            },
          ],
          image: item.image,
          category:
            item.category_id == 1
              ? "burgers"
              : item.category_id == 2
                ? "hotdogs"
                : item.category_id == 3
                  ? "fries"
                  : "sauces",
        }))

        setProducts(newProducts)
      })
      .catch((err) => {
        console.error("Mahsulotlarni yuklashda xatolik:", err)
      })
  }, [])

  return (
    <>
      <Hero />
      <PopularProducts products={products} />
      <Menu products={products} />
      <WhyChooseUs />
      <About />
      <Delivery />
      <Gallery />
      <Reviews />
      <FAQ />
      <Contact />
      <Footer />
    </>
  )
}


// ─── Inner App (has context access) ───────────────────────
function InnerApp() {
  const { state } = useApp()
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 1400); return () => clearTimeout(t) }, [])

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif' }}>
      <LoadingScreen done={loaded} />
      <Header />
      <main>
        {state.view === 'home' && <LandingPage />}
        {state.view === 'checkout' && <CheckoutPage />}
        {state.view === 'tracking' && <OrderTracking />}
        {state.view === 'admin' && <AdminPage />}
        {state.view === 'account' && <AccountPage />}
      </main>
      <CartSidebar />
      {state.view === 'home' && <ScrollTop />}
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────
export default function App() {
  return (
    <AppProvider>
      <InnerApp />
    </AppProvider>
  )
}