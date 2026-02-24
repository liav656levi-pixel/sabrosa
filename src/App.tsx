import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  ShoppingCart, 
  Plus,
  Phone,
  Instagram,
  Star,
  ReceiptText,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  cartId: string;
  product: Product;
  addOns: string[];
  totalPrice: number;
  quantity: number;
}

const ADD_ONS: AddOn[] = [
  { id: 'plain', name: 'נקי', price: 0 },
  { id: 'walnuts', name: 'אגוזי מלך', price: 5 },
  { id: 'pecan', name: 'פקאן', price: 5 },
  { id: 'seeds_mix', name: 'תערובת גרעינים', price: 5 },
  { id: 'kalamata', name: 'זיתי קלמטה', price: 5 },
];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "מחמצת כוסמין מלא",
    description: "לחם מחמצת כוסמין 100% בעבודת יד",
    price: 30,
    category: "כוסמין",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRZBdzHp5_sKQosw5NBJE3p_435uZSTYuxSdAkRjLOvbD5BOwO5ekHemAJhV6f-ucqcKgir1bipAOfWOYsX6Ib7A99OTBDYGOc_daTtHoqp8WSchFh0W0pshDjSXrCbvDCpNe6c6ryxA8_02bXhXeE9UpYXCQrJ009XiT_aG3e5lilQmf7sR-E3LufkVTQbqZhe_7N00HnoN8VtGN65Hy3ZWU8N6z-x6mKo7DKJWpnBdHbjN7TfFLQDVO_JWM2jzYbWqP4b5yjaHZT"
  },
  {
    id: 2,
    name: "מחמצת חיטה מלאה",
    description: "לחם מחמצת 100% חיטה מלאה בטחינה דקה",
    price: 30,
    category: "חיטה מלאה",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDZDeaSdtPFUHb9aCEtqdX7R2wNs_N-xKkv3ZDafQxZEuRtkPCTOfUtbY42xeVsaOXuRo6SWZpYJG5Eitkh0fwnXQFKcGVnrNG-yPEbYeJCI1X9QcCHx8_vp24PV-J-BsfICVibQsuilU2hd5YlzeD8r67Kuis2qnCas2gGem_ZC6YT4r8rsLXPswq-gdmJmH8B2boXqka7t6PGTHiP8zTQh6jadhzKM69IUZKWAAorxr8MaB9ydOA7r32tSRqVMGsZrOazLz_xpgT"
  },
  {
    id: 3,
    name: "מחמצת ללא גלוטן",
    description: "מחמצת מקמחי מקור איכותיים ללא גלוטן",
    price: 38,
    category: "ללא גלוטן",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrOVPYhP1aLXeCx2a2w61NcENELCcnZUyHxSC_XNrEPByG0htPg315bhSxAmpLI7Hj_flIkz-e71w25Wu6BUQVRRfm0YcSOwWxXSAGsrzCy71kJnEMVAmX-a6Bf2uK921zosmtszAYmxHVjab8PhrtFKBgo7iATbH8Q5oT4OSIDBK8KiFrN4K3QSapcP0Q4lZTU9qZ0BzvzDAFenK7BD1_dsI3l3T8Sdt0606ccPdfLUaAKVka2CikCnTImhFxNGDR2NfM-FtTYC2h"
  }
];

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [editingCartId, setEditingCartId] = useState<string | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const smoothScroll = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const startPosition = window.scrollY;
      const targetPosition = element.getBoundingClientRect().top + window.scrollY - offset;
      const distance = targetPosition - startPosition;
      const duration = 2000;
      let start: number | null = null;

      const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);
        window.scrollTo(0, startPosition + distance * easedProgress);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      };
      requestAnimationFrame(animation);
      setShowNav(false);
    }
  };

  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        if (Math.abs(currentScrollY - lastScrollY) < 10) return;
        setShowHeader(currentScrollY <= lastScrollY || currentScrollY <= 100);
        setLastScrollY(currentScrollY);
      }
    };
    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);

  const handleAddToCart = (product: Product, addOns: string[] = []) => {
    const hasRealAddOns = addOns.some(id => id !== 'plain');
    const itemPrice = product.price + (hasRealAddOns ? 5 : 0);

    setCartItems(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id && 
        JSON.stringify([...item.addOns].sort()) === JSON.stringify([...addOns].sort())
      );

      if (existingIndex > -1) {
        const newItems = [...prev];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1,
          totalPrice: newItems[existingIndex].totalPrice + itemPrice
        };
        return newItems;
      }

      return [...prev, {
        cartId: Math.random().toString(36).substr(2, 9),
        product, addOns, totalPrice: itemPrice, quantity: 1
      }];
    });

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const openCustomization = (product: Product) => {
    setCustomizingProduct(product);
    setEditingCartId(null);
    setSelectedAddOns([]);
  };

  const openEditCartItem = (item: CartItem) => {
    setCustomizingProduct(item.product);
    setEditingCartId(item.cartId);
    setSelectedAddOns(item.addOns);
    setShowCart(false);
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => {
      if (id === 'plain') return prev.includes('plain') ? [] : ['plain'];
      const filtered = prev.filter(a => a !== 'plain');
      return filtered.includes(id) ? filtered.filter(a => a !== id) : [...filtered, id];
    });
  };

  const confirmCustomization = () => {
    if (customizingProduct) {
      const hasRealAddOns = selectedAddOns.some(id => id !== 'plain');
      const itemPrice = customizingProduct.price + (hasRealAddOns ? 5 : 0);

      if (editingCartId) {
        setCartItems(prev => prev.map(item => 
          item.cartId === editingCartId 
            ? { ...item, addOns: selectedAddOns, totalPrice: itemPrice * item.quantity }
            : item
        ));
        setShowCart(true);
      } else {
        handleAddToCart(customizingProduct, selectedAddOns);
      }
      setCustomizingProduct(null);
      setEditingCartId(null);
    }
  };

  const getCartTotal = () => cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const getCartItemsCount = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const sendOrderWhatsApp = () => {
    const orderDetails = cartItems.map(item => {
      const addOnsText = item.addOns.length > 0 
        ? ` (תוספות: ${item.addOns.map(id => ADD_ONS.find(a => a.id === id)?.name).join(', ')})`
        : '';
      return `- ${item.product.name}${addOnsText}${item.quantity > 1 ? ` x${item.quantity}` : ''}: ₪${item.totalPrice}`;
    }).join('\n');

    const message = encodeURIComponent(`שלום,\n\nאשמח להזמין את הלחמים הבאים:\n\n${orderDetails}\n\nסה"כ לתשלום: ₪${getCartTotal()}\n\nתודה!`);
    window.open(`https://wa.me/972555567714?text=${message}`, '_blank');
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#FAF9F6] text-slate-900 font-sans" dir="rtl">
      {/* Side Nav */}
      <AnimatePresence>
        {showNav && (
          <div className="fixed inset-0 z-[150] flex justify-start">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              onClick={() => setShowNav(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[280px] bg-[#FAF9F6] h-full shadow-2xl flex flex-col border-l border-primary/10"
            >
              <div className="p-8 border-b border-primary/10 flex items-center justify-between">
                <h3 className="text-2xl font-black uppercase">תפריט</h3>
                <button onClick={() => setShowNav(false)} className="p-2 hover:bg-black/5 rounded-full">
                  <Plus className="w-6 h-6 rotate-45" />
                </button>
              </div>
              <nav className="flex-1 p-8 space-y-6">
                {['about', 'menu', 'contact'].map((id, idx) => (
                  <motion.button
                    key={id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.5, delay: 0.5 + (idx * 0.2) }}
                    onClick={(e) => smoothScroll(e, id)}
                    className="block w-full text-right text-xl font-bold hover:text-[#8B4513]"
                  >
                    {id === 'about' ? 'הסיפור שלנו' : id === 'menu' ? 'התפריט שלנו' : 'צור קשר'}
                  </motion.button>
                ))}
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md px-6 py-5 flex items-center justify-between border-b border-black/5 transition-transform duration-500 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={() => setShowNav(true)} className="p-3 bg-black/5 rounded-2xl text-[#8B4513]">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-black uppercase leading-none">Sabrosa</h1>
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#8B4513] mt-1">Artisan Bakery</span>
        </div>
        <div className="w-10" />
      </header>

      <main className="flex-1 pt-24 pb-12">
        {/* Hero */}
        <div className="px-6 py-8">
          <div className="relative h-[30rem] w-full overflow-hidden rounded-[3rem] shadow-2xl">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGozF64yDtA_fja7KBZ1-FLEehg6jIRZj3F7_IDma9Mfr9OV9Rn2nUGtJ_y3UVBOejoIlPX74JCqluyIE-8KFLiawCHwNalhwtWnUV2OtRCEqDy_LqR4DduwHAbpVLXxgDz-Exnlq24YSlXVje7ymPX-5ahrVlF0pynY1kZiYLU6q8nYViMNBLbVbVApwPjO0h2Gn4lpKpvFR3tTPUpNnVq8VYufjH_QyjhNlg8RqvIoAI4zGn7Kpz0eRpzPYQs8dpkWYYpez1dMHq" className="h-full w-full object-cover" alt="Hero" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute top-12 left-1/2 -translate-x-1/2 text-center text-white">
              <h2 className="text-6xl font-black uppercase tracking-[0.3em] drop-shadow-2xl">Sabrosa</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.6em] mt-2">Artisan Bakery</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div id="menu" className="px-6 mt-20">
          <h3 className="text-3xl font-black text-center mb-12">התפריט שלנו</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((product) => (
              <motion.div 
                key={product.id}
                onClick={() => openCustomization(product)}
                className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-black/5 hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={product.image} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt={product.name} />
                  <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl font-black text-[#8B4513]">₪{product.price}</div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#8B4513] mb-2">{product.category}</span>
                  <h4 className="text-2xl font-black mb-2">{product.name}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">{product.description}</p>
                  <button className="mt-auto w-full bg-[#8B4513] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest">הוסף לסל</button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Cart Button */}
      <div className="fixed bottom-8 left-8 z-[100]">
        <button onClick={() => setShowCart(true)} className="relative p-5 bg-[#8B4513] text-white rounded-full shadow-2xl hover:scale-110 transition-all">
          <ShoppingCart className="w-7 h-7" />
          {getCartItemsCount() > 0 && (
            <span className="absolute -top-1 -right-1 h-7 w-7 flex items-center justify-center rounded-full bg-white text-[#8B4513] text-xs font-black border-2 border-[#8B4513]">
              {getCartItemsCount()}
            </span>
          )}
        </button>
      </div>

      {/* Customization Modal */}
      <AnimatePresence>
        {customizingProduct && (
          <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setCustomizingProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="relative w-full max-w-2xl bg-white rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="relative h-64 shrink-0">
                <img src={customizingProduct.image} className="w-full h-full object-cover" alt="Custom" />
                <button onClick={() => setCustomizingProduct(null)} className="absolute top-6 right-6 bg-black/20 text-white p-3 rounded-full"><Plus className="w-6 h-6 rotate-45" /></button>
                <div className="absolute bottom-6 right-8 text-white">
                  <h3 className="text-4xl font-black">{customizingProduct.name}</h3>
                </div>
              </div>
              <div className="p-8 overflow-y-auto">
                <h4 className="font-black text-xs uppercase tracking-widest text-[#8B4513] mb-6">תוספות ושדרוגים</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ADD_ONS.map((addon) => (
                    <button 
                      key={addon.id}
                      onClick={() => toggleAddOn(addon.id)}
                      className={`flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all ${selectedAddOns.includes(addon.id) ? "border-[#8B4513] bg-[#8B4513]/5" : "border-slate-100"}`}
                    >
                      <span className="font-bold">{addon.name}</span>
                      <span className="text-xs font-black">₪{addon.price}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-8 border-t flex items-center justify-between gap-8">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase">סה"כ</span>
                  <span className="text-3xl font-black text-[#8B4513]">₪{calculateTotalPrice()}</span>
                </div>
                <button onClick={confirmCustomization} className="flex-1 bg-[#8B4513] text-white py-5 rounded-[2rem] font-black text-lg">
                  {editingCartId ? 'עדכן הזמנה' : 'הוסף לסל'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-[200] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b flex items-center justify-between">
                <h3 className="text-3xl font-black uppercase">הסל שלי</h3>
                <button onClick={() => setShowCart(false)} className="p-3 bg-black/5 rounded-full"><Plus className="w-6 h-6 rotate-45" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cartItems.map((item) => (
                  <div key={item.cartId} className="flex gap-4 bg-black/5 p-4 rounded-3xl">
                    <img src={item.product.image} className="w-20 h-20 object-cover rounded-2xl" alt="Cart Item" />
                    <div className="flex-1">
                      <h4 className="font-bold">{item.product.name}</h4>
                      <p className="text-xs text-slate-500">{item.addOns.join(', ')}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-black text-[#8B4513]">₪{item.totalPrice}</span>
                        <button onClick={() => removeFromCart(item.cartId)} className="text-xs text-red-500 font-bold">הסרה</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-8 border-t">
                <div className="flex justify-between mb-6">
                  <span className="font-bold">סה"כ לתשלום:</span>
                  <span className="text-3xl font-black text-[#8B4513]">₪{getCartTotal()}</span>
                </div>
                <button onClick={sendOrderWhatsApp} className="w-full bg-[#8B4513] text-white py-5 rounded-3xl font-black text-lg">שלח הזמנה בוואצאפ</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
