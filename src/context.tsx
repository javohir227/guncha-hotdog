import { createContext, useContext, useReducer, type ReactNode } from 'react'

// ── Types ──────────────────────────────────────────────
export type Lang = 'uz' | 'ru'
export type View = 'home' | 'checkout' | 'tracking' | 'admin' | 'account'

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  qty: number
  variant?: string
}

export interface Address {
  id: string
  label: string
  street: string
  apartment: string
  floor: string
}

export interface User {
  name: string
  phone: string
  email: string
  addresses: Address[]
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: 'waiting' | 'accepted' | 'preparing' | 'cooking' | 'picked_up' | 'on_way' | 'delivered'
  createdAt: string
  address: string
  payment: string
  customer: string
  phone: string
  promoDiscount: number
}

interface State {
  cart: CartItem[]
  lang: Lang
  dark: boolean
  user: User | null
  cartOpen: boolean
  view: View
  currentOrder: Order | null
  orders: Order[]
  favorites: number[]
  adminAuthed: boolean
}

type Action =
  | { type: 'ADD'; payload: CartItem }
  | { type: 'REMOVE'; payload: number }
  | { type: 'SET_QTY'; payload: { id: number; qty: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LANG'; payload: Lang }
  | { type: 'SET_DARK'; payload: boolean }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'SET_VIEW'; payload: View }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ORDER'; payload: Order }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { id: string; status: Order['status'] } }
  | { type: 'TOGGLE_FAV'; payload: number }
  | { type: 'SET_ADMIN'; payload: boolean }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD': {
      const key = action.payload.variant
        ? `${action.payload.id}-${action.payload.variant}`
        : String(action.payload.id)
      const existing = state.cart.find(
        i => (i.variant ? `${i.id}-${i.variant}` : String(i.id)) === key
      )
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(i =>
            (i.variant ? `${i.id}-${i.variant}` : String(i.id)) === key
              ? { ...i, qty: i.qty + 1 }
              : i
          ),
        }
      }
      return { ...state, cart: [...state.cart, action.payload] }
    }
    case 'REMOVE':
      return { ...state, cart: state.cart.filter(i => i.id !== action.payload) }
    case 'SET_QTY':
      return {
        ...state,
        cart: action.payload.qty <= 0
          ? state.cart.filter(i => i.id !== action.payload.id)
          : state.cart.map(i => i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i),
      }
    case 'CLEAR_CART':
      return { ...state, cart: [] }
    case 'SET_LANG':
      return { ...state, lang: action.payload }
    case 'SET_DARK':
      return { ...state, dark: action.payload }
    case 'SET_CART_OPEN':
      return { ...state, cartOpen: action.payload }
    case 'SET_VIEW':
      return { ...state, view: action.payload, cartOpen: false }
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_ORDER':
      return { ...state, currentOrder: action.payload }
    case 'ADD_ORDER':
      return { ...state, orders: [action.payload, ...state.orders] }
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === action.payload.id ? { ...o, status: action.payload.status } : o
        ),
        currentOrder:
          state.currentOrder?.id === action.payload.id
            ? { ...state.currentOrder, status: action.payload.status }
            : state.currentOrder,
      }
    case 'TOGGLE_FAV':
      return {
        ...state,
        favorites: state.favorites.includes(action.payload)
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload],
      }
    case 'SET_ADMIN':
      return { ...state, adminAuthed: action.payload }
    default:
      return state
  }
}

const initial: State = {
  cart: [],
  lang: 'uz',
  dark: false,
  user: null,
  cartOpen: false,
  view: 'home',
  currentOrder: null,
  orders: [],
  favorites: [],
  adminAuthed: false,
}

// ── Context ─────────────────────────────────────────────
const Ctx = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial)
  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}

// ── Translations ─────────────────────────────────────────
export const T = {
  uz: {
    home: "Bosh sahifa", menu: "Menyu", about: "Biz haqimizda",
    delivery: "Yetkazib berish", gallery: "Galereya", contact: "Aloqa",
    orderNow: "Buyurtma berish", viewMenu: "Menyu ko'rish",
    addToCart: "Savatga qo'shish", checkout: "Rasmiylashtirish",
    cart: "Savat", myOrders: "Buyurtmalarim", login: "Kirish",
    register: "Ro'yxatdan o'tish", logout: "Chiqish", account: "Profil",
    total: "Jami", subtotal: "Summa", deliveryFee: "Yetkazib berish",
    discount: "Chegirma", promoCode: "Promo kod", applyCode: "Qo'llash",
    placeOrder: "Buyurtmani tasdiqlash", trackOrder: "Buyurtmani kuzatish",
    name: "Ism", phone: "Telefon", address: "Manzil",
    apartment: "Xonadon", floor: "Qavat", entrance: "Kirish",
    notes: "Izoh", paymentMethod: "To'lov usuli",
    cash: "Naqd pul", close: "Yopish", save: "Saqlash",
    fresh: "Yangi", open247: "24/7 ochiq", fastDelivery: "Tez yetkazib berish",
    orderId: "Buyurtma raqami", orderStatus: "Holat", orderTime: "Vaqt",
    adminPanel: "Admin panel", password: "Parol", enter: "Kirish",
    todayOrders: "Bugungi buyurtmalar", todayIncome: "Bugungi daromad",
    totalOrders: "Jami buyurtmalar", customers: "Mijozlar",
    products: "Mahsulotlar", categories: "Kategoriyalar",
    status: {
      waiting: "Kutilmoqda", accepted: "Qabul qilindi",
      preparing: "Tayyorlanmoqda", cooking: "Pishirilmoqda",
      picked_up: "Kuryer oldi", on_way: "Yo'lda", delivered: "Yetkazildi"
    },
    heroTitle: "G'UNCHA", heroSub: "HOT FOOD",
    heroDesc: "Har kuni yangi va mazali tez taomlar tayyorlaymiz.",
    favorites: "Sevimlilar", addresses: "Manzillar", settings: "Sozlamalar",
    search: "Qidirish", popular: "Mashhur mahsulotlar",
    whyUs: "Nega biz?", aboutTitle: "Biz haqimizda",
    reviews: "Mijozlar sharhlari", faq: "Ko'p beriladigan savollar",
    contactTitle: "Aloqa", sendMessage: "Xabar yuborish",
    yourName: "Ismingiz", yourPhone: "Telefon raqamingiz",
    message: "Xabar", messageSent: "Xabar yuborildi!",
    ingredients: "Tarkibi", weight: "Og'irligi", calories: "Kaloriya",
    rating: "Reyting",
  },
  ru: {
    home: "Главная", menu: "Меню", about: "О нас",
    delivery: "Доставка", gallery: "Галерея", contact: "Контакты",
    orderNow: "Заказать", viewMenu: "Смотреть меню",
    addToCart: "В корзину", checkout: "Оформить",
    cart: "Корзина", myOrders: "Мои заказы", login: "Войти",
    register: "Регистрация", logout: "Выйти", account: "Профиль",
    total: "Итого", subtotal: "Сумма", deliveryFee: "Доставка",
    discount: "Скидка", promoCode: "Промокод", applyCode: "Применить",
    placeOrder: "Подтвердить заказ", trackOrder: "Отследить заказ",
    name: "Имя", phone: "Телефон", address: "Адрес",
    apartment: "Квартира", floor: "Этаж", entrance: "Подъезд",
    notes: "Примечание", paymentMethod: "Способ оплаты",
    cash: "Наличные", close: "Закрыть", save: "Сохранить",
    fresh: "Свежий", open247: "Открыто 24/7", fastDelivery: "Быстрая доставка",
    orderId: "Номер заказа", orderStatus: "Статус", orderTime: "Время",
    adminPanel: "Панель администратора", password: "Пароль", enter: "Войти",
    todayOrders: "Заказы сегодня", todayIncome: "Доход сегодня",
    totalOrders: "Всего заказов", customers: "Клиенты",
    products: "Продукты", categories: "Категории",
    status: {
      waiting: "Ожидание", accepted: "Принят",
      preparing: "Готовится", cooking: "Готовится",
      picked_up: "Курьер забрал", on_way: "В пути", delivered: "Доставлен"
    },
    heroTitle: "G'UNCHA", heroSub: "HOT FOOD",
    heroDesc: "Каждый день готовим свежие и вкусные блюда из качественных продуктов.",
    favorites: "Избранное", addresses: "Адреса", settings: "Настройки",
    search: "Поиск", popular: "Популярные блюда",
    whyUs: "Почему мы?", aboutTitle: "О нас",
    reviews: "Отзывы клиентов", faq: "Часто задаваемые вопросы",
    contactTitle: "Контакты", sendMessage: "Отправить сообщение",
    yourName: "Ваше имя", yourPhone: "Ваш телефон",
    message: "Сообщение", messageSent: "Сообщение отправлено!",
    ingredients: "Состав", weight: "Вес", calories: "Калории",
    rating: "Рейтинг",
  },
} as const
