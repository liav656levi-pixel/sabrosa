import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Star,
  X,
  Menu,
  Phone,
  Instagram,
  MapPin,
  ChevronRight,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
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

// Data
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
    name: "מחמצת כוסמין קלאסית",
    description: "100% קמח כוסמין",
    price: 30,
    category: "כוסמין",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRZBdzHp5_sKQosw5NBJE3p_435uZSTYuxSdAkRjLOvbD5BOwO5ekHemAJhV6f-ucqcKgir1bipAOfWOYsX6Ib7A99OTBDYGOc_daTtHoqp8WSchFh0W0pshDjSXrCbvDCpNe6c6ryxA8_02bXhXeE9UpYXCQrJ009XiT_aG3e5lilQmf7sR-E3LufkVTQbqZhe_7N00HnoN8VtGN65Hy3ZWU8N6z-x6mKo7DKJWpnBdHbjN7TfFLQDVO_JWM2jzYbWqP4b5yjaHZT"
  },
  {
    id: 2,
    name: "מחמצת חיטה מלאה",
    description: "100% קמח חיטה מלאה",
    price: 30,
    category: "חיטה מלאה",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDZDeaSdtPFUHb9aCEtqdX7R2wNs_N-xKkv3ZDafQxZEuRtkPCTOfUtbY42xeVsaOXuRo6SWZpYJG5Eitkh0fwnXQFKcGVnrNG-yPEbYeJCI1X9QcCHx8_vp24PV-J-BsfICVibQsuilU2hd5YlzeD8r67Kuis2qnCas2gGem_ZC6YT4r8rsLXPswq-gdmJmH8B2boXqka7t6PGTHiP8zTQh6jadhzKM69IUZKWAAorxr8MaB9ydOA7r32tSRqVMGsZrOazLz_xpgT"
  },
  {
    id: 3,
    name: "מחמצת מתערובת קמחים ללא גלוטן",
    description: "תערובת קמחי מקור איכותיים ללא גלוטן בתהליך מחמצת טבעי וארוך.",
    price: 38,
    category: "ללא גלוטן",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDrOVPYhP1aLXeCx2a2w61NcENELCcnZUyHxSC_XNrEPByG0htPg315bhSxAmpLI7Hj_flIkz-e71w25Wu6BUQVRRfm0YcSOwWxXSAGsrzCy71kJnEMVAmX-a6Bf2uK921zosmtszAYmxHVjab8PhrtFKBgo7iATbH8Q5oT4OSIDBK8KiFrN4K3QSapcP0Q4lZTU9qZ0BzvzDAFenK7BD1_dsI3l3T8Sdt0606ccPdfLUaAKVka2CikCnTImhFxNGDR2NfM-FtTYC2h"
  }
];

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;
      if (current > lastScrollY && current > 100) setShowHeader(false);
      else setShowHeader(true);
      setLastScrollY(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleAddToCart = (product: Product, addOns: string[]) => {
    const hasRealAddOns = addOns.some(id => id !== 'plain');
    const itemPrice = product.price + (hasRealAddOns ? 5 : 0);
    
    setCartItems(prev => {
      const existing = prev.find(item => 
        item.product.id === product.id && 
        JSON.stringify([...item.addOns].sort()) === JSON.stringify([...addOns].sort())
      );
      if (existing) {
        return prev.map(item => item.cartId === existing.cartId 
          ? { ...item, quantity: item.quantity + 1, totalPrice: item.totalPrice + itemPrice }
          : item
        );
      }
      return [...prev, {
        cartId: Math.random().toString(36).substr(2, 9),
        product,
        addOns,
        totalPrice: itemPrice,
        quantity: 1
      }];
    });
    setCustomizingProduct(null);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartId === id) {
        const newQty = Math.max(1, item.quantity + delta);
        const unitPrice = item.totalPrice / item.quantity;
        return { ...item, quantity: newQty, totalPrice: unitPrice * newQty };
      }
      return item;
    }));
  };

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => {
      if (id === 'plain') return prev.includes('plain') ? [] : ['plain'];
      const filtered = prev.filter(a => a !== 'plain');
      return filtered.includes(id) ? filtered.filter(a => a !== id) : [...filtered, id];
    });
  };

  const getCartTotal = () => cartItems.reduce((s, i) => s + i.totalPrice, 0);

  const sendWhatsApp = () => {
    const text = cartItems.map(i => {
      const addons = i.addOns.map(id => ADD_ONS.find(a => a.id === id)?.name).join(', ');
      return `- ${i.product.name} (${addons}) x${i.quantity}: ₪${i.totalPrice}`;
    }).join('\n');
    window.open(`https://wa.me/972555567714?text=${encodeURIComponent("הזמנה חדשה:\n" + text + "\n\nסה\"כ: ₪" + getCartTotal())}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 font-sans" dir="rtl">
      {/* Header */}
      <header className={`fixed top-0 inset-x-0 z-50 glass px-6 py-4 flex justify-between items-center transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
        <button onClick={() => setShowNav(true)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-black italic leading-none tracking-tighter uppercase">Sabrosa</h1>
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#8B4513] mt-1">Artisan Bakery</span>
        </div>
        <div className="w-10" /> {/* Spacer for symmetry */}
      </header>

      {/* Navigation Drawer */}
      <AnimatePresence>
        {showNav && (
          <div className="fixed inset-0 z-[100] flex">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNav(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="relative bg-white w-full max-w-xs h-full p-10 flex flex-col shadow-2xl">
              <button onClick={() => setShowNav(false)} className="self-end p-2 mb-12"><X /></button>
              <nav className="space-y-8">
                <a href="#hero" onClick={() => setShowNav(false)} className="block text-2xl font-serif italic font-black">דף הבית</a>
                <a href="#about" onClick={() => setShowNav(false)} className="block text-2xl font-serif italic font-black">הסיפור שלנו</a>
                <a href="#menu" onClick={() => setShowNav(false)} className="block text-2xl font-serif italic font-black">התפריט שלנו</a>
                <a href="#contact" onClick={() => setShowNav(false)} className="block text-2xl font-serif italic font-black">צרו קשר</a>
              </nav>
              <div className="mt-auto space-y-4">
                <div className="flex gap-4">
                  <Instagram className="w-5 h-5 text-[#8B4513]" />
                  <Phone className="w-5 h-5 text-[#8B4513]" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sabrosa Artisan Bakery © 2024</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section id="hero" className="pt-28 px-6">
        <div className="relative h-[450px] rounded-[3rem] overflow-hidden shadow-2xl">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGozF64yDtA_fja7KBZ1-FLEehg6jIRZj3F7_IDma9Mfr9OV9Rn2nUGtJ_y3UVBOejoIlPX74JCqluyIE-8KFLiawCHwNalhwtWnUV2OtRCEqDy_LqR4DduwHAbpVLXxgDz-Exnlq24YSlXVje7ymPX-5ahrVlF0pynY1kZiYLU6q8nYViMNBLbVbVApwPjO0h2Gn4lpKpvFR3tTPUpNnVq8VYufjH_QyjhNlg8RqvIoAI4zGn7Kpz0eRpzPYQs8dpkWYYpez1dMHq" className="w-full h-full object-cover scale-105" />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-lg pointer-events-none">
             <svg viewBox="0 0 500 150" className="w-full drop-shadow-2xl">
                <path id="curve" d="M 50,120 Q 250,20 450,120" fill="transparent" />
                <text className="fill-white font-serif italic text-6xl font-black uppercase tracking-[0.2em]">
                  <textPath xlinkHref="#curve" startOffset="50%" textAnchor="middle">Sabrosa</textPath>
                </text>
                <text y="140" x="250" textAnchor="middle" className="fill-white/80 font-sans text-[10px] font-black uppercase tracking-[0.6em]">Artisan Bakery</text>
              </svg>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-serif italic font-black mb-10">הסיפור שלנו</h2>
        <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-medium italic">
          <p>
            הכל התחיל מרצון אמיתי ללחם טוב, כזה שנעשה בלי פשרות ובלי רגשות אשם. רצינו ליצור לחם שעונה על הצרכים של כולם – תערובת קמחים ללא גלוטן, כוסמין עשיר או חיטה מלאה.
          </p>
          <p>
            המחמצת שלנו עוברת תסיסה איטית ומבוקרת של 24 שעות להעמקת הטעמים והמרקם. כל כיכר נאפית בעבודת יד עם המון אהבה, תוך שימוש בקמחי מקור איכותיים בלבד.
          </p>
        </div>
        <div className="mt-12 flex justify-center gap-4">
          <div className="h-px w-12 bg-[#8B4513]/20 self-center" />
          <span className="font-serif italic font-bold text-[#8B4513]">Sabrosa</span>
          <div className="h-px w-12 bg-[#8B4513]/20 self-center" />
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 px-6 max-w-7xl mx-auto bg-white/50 rounded-[4rem] mb-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif italic font-black">התפריט שלנו</h2>
          <div className="mt-6 flex justify-center gap-4">
            <div className="h-px w-16 bg-[#8B4513]/20 self-center" />
            <div className="w-2 h-2 rounded-full bg-[#8B4513]/20 self-center" />
            <div className="h-px w-16 bg-[#8B4513]/20 self-center" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {PRODUCTS.map(p => (
            <div key={p.id} className="group bg-white rounded-[3rem] overflow-hidden border border-[#8B4513]/5 shadow-xl hover:shadow-2xl transition-all duration-500">
              <div className="relative h-72 overflow-hidden">
                <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-6 left-6 glass px-5 py-2 rounded-2xl font-black text-[#8B4513]">₪{p.price}</div>
              </div>
              <div className="p-10">
                <h3 className="text-2xl font-serif italic font-black">{p.name}</h3>
                {p.id === 1 && (
                  <div className="flex items-center gap-1 text-[#8B4513] text-[10px] font-black mt-2 uppercase tracking-widest">
                    <Star className="w-3 h-3 fill-current"/> המומלץ שלנו
                  </div>
                )}
                <p className="text-slate-500 text-sm mt-4 leading-relaxed">{p.description}</p>
                <button onClick={() => { setCustomizingProduct(p); setSelectedAddOns([]); }} className="w-full bg-[#8B4513] text-white py-5 rounded-2xl mt-10 font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[#8B4513]/20">הוסף לסל</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <footer id="contact" className="bg-[#1A120B] text-white py-24 px-6 rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-8">
            <div className="flex flex-col">
              <h2 className="text-4xl font-black italic tracking-tighter uppercase">Sabrosa</h2>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#8B4513]">Artisan Bakery</span>
            </div>
            <p className="text-white/50 leading-relaxed italic">
              אפייה מסורתית, חומרי גלם איכותיים, והמון אהבה בכל כיכר לחם.
            </p>
          </div>
          
          <div className="space-y-8">
            <h4 className="text-xl font-serif italic font-black">צרו קשר</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-white/70">
                <Phone className="w-5 h-5 text-[#8B4513]" />
                <span>055-556-7714</span>
              </div>
              <div className="flex items-center gap-4 text-white/70">
                <Instagram className="w-5 h-5 text-[#8B4513]" />
                <span>@sabrosa_bakery</span>
              </div>
              <div className="flex items-center gap-4 text-white/70">
                <MapPin className="w-5 h-5 text-[#8B4513]" />
                <span>האופה 1, תל אביב</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h4 className="text-xl font-serif italic font-black">שעות פעילות</h4>
            <div className="space-y-4 text-white/70">
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>א' - ה'</span>
                <span>08:00 - 20:00</span>
              </div>
              <div className="flex justify-between border-b border-white/10 pb-2">
                <span>יום ו'</span>
                <span>07:00 - 15:00</span>
              </div>
              <div className="flex justify-between text-[#8B4513] font-bold">
                <span>שבת</span>
                <span>סגור</span>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-white/5 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">
          Sabrosa Artisan Bakery © 2024 | All Rights Reserved
        </div>
      </footer>

      {/* Cart Button */}
      <button onClick={() => setShowCart(true)} className="fixed bottom-10 left-10 z-50 bg-[#8B4513] text-white p-6 rounded-full shadow-2xl hover:scale-110 transition-transform">
        <ShoppingCart className="w-7 h-7" />
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-[#8B4513] w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 border-[#8B4513] shadow-xl">
            {cartItems.reduce((s, i) => s + i.quantity, 0)}
          </span>
        )}
      </button>

      {/* Customization Modal */}
      <AnimatePresence>
        {customizingProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setCustomizingProduct(null)} />
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl">
              <h3 className="text-3xl font-serif italic font-black mb-8 text-center">תוספות ל{customizingProduct.name}</h3>
              <div className="space-y-4">
                {ADD_ONS.map(a => (
                  <button key={a.id} onClick={() => toggleAddOn(a.id)} className={`w-full p-5 rounded-2xl border-2 flex justify-between items-center transition-all ${selectedAddOns.includes(a.id) ? 'border-[#8B4513] bg-[#8B4513]/5' : 'border-slate-100 hover:border-[#8B4513]/20'}`}>
                    <span className="font-bold text-lg">{a.name}</span>
                    <span className="text-sm font-black text-[#8B4513]">{a.id === 'plain' ? '₪0' : '₪5'}</span>
                  </button>
                ))}
              </div>
              <button onClick={() => handleAddToCart(customizingProduct, selectedAddOns)} className="w-full bg-[#8B4513] text-white py-6 rounded-2xl mt-10 font-black text-lg shadow-xl">אישור והוספה</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {showCart && (
          <div className="fixed inset-0 z-[200] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCart(false)} />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="relative bg-white w-full max-w-md h-full p-10 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black italic">הסל שלי</h3>
                <button onClick={() => setShowCart(false)} className="p-2 hover:bg-slate-100 rounded-full"><X /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 font-medium">הסל שלך ריק...</div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.cartId} className="flex justify-between items-start border-b border-slate-100 pb-6">
                      <div className="flex-1">
                        <p className="font-bold text-lg">{item.product.name}</p>
                        <p className="text-xs text-slate-400 mt-1">
                          {item.addOns.map(id => ADD_ONS.find(a => a.id === id)?.name).join(', ')}
                        </p>
                        <div className="flex items-center gap-4 mt-4">
                          <button onClick={() => updateQuantity(item.cartId, -1)} className="w-8 h-8 border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50">-</button>
                          <span className="text-sm font-black">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartId, 1)} className="w-8 h-8 border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50">+</button>
                        </div>
                      </div>
                      <div className="text-left">
                        <span className="font-black text-lg">₪{item.totalPrice}</span>
                        <button onClick={() => setCartItems(prev => prev.filter(i => i.cartId !== item.cartId))} className="block text-[10px] text-red-500 mt-2 font-bold">הסר</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="pt-8 border-t border-slate-100 mt-auto">
                  <div className="flex justify-between mb-8 font-black text-2xl">
                    <span>סה"כ לתשלום:</span>
                    <span className="text-[#8B4513]">₪{getCartTotal()}</span>
                  </div>
                  <button onClick={sendWhatsApp} className="w-full bg-[#8B4513] text-white py-6 rounded-2xl font-black text-lg shadow-xl hover:opacity-95 transition-all">הזמן עכשיו בוואצאפ</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
