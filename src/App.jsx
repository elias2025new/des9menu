import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import FoodCard from './components/FoodCard';
import FoodModal from './components/FoodModal';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import AdminDashboard from './components/AdminDashboard';
import { fetchMenuFromDB, getDefaultMenuData } from './data/menuStore';

// ─── Main Menu Page ────────────────────────────────────────────────────────────
function MenuPage() {
  const [language, setLanguage] = useState('am');
  const [allMenuData, setAllMenuData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  // Load from Neon DB, fall back to static default
  useEffect(() => {
    fetchMenuFromDB().then(data => {
      const menu = data || getDefaultMenuData();
      setAllMenuData(menu);
      setActiveCategory(menu[language]?.[0]?.id || '');
    });
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  const handleCategoryClick = React.useCallback((id) => {
    setActiveCategory(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    if (!allMenuData) return;
    const currentMenuData = allMenuData[language] || [];
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveCategory(e.target.id); }),
      { root: null, rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    currentMenuData.forEach(cat => {
      const el = document.getElementById(cat.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [allMenuData, language]);

  if (!allMenuData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const currentMenuData = allMenuData[language] || [];

  return (
    <>
      <Layout>
        <CategoryNav
          categories={currentMenuData}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
          currentLang={language}
          onLanguageChange={setLanguage}
        />
        <div className="pt-48">
          <Header currentLang={language} />
        </div>
        <main className="px-5 pt-4 pb-0 flex-grow">
          {currentMenuData.map((category, index) => (
            <section key={category.id} id={category.id} className="mb-6 text-center scroll-mt-52">
              <h2 className="text-xl font-black text-hotel-green mb-3 tracking-tighter uppercase border-b-2 border-green-50 inline-block pb-0.5">
                {category.title}
              </h2>
              {category.description && (
                <p className="text-sm text-slate-600 mb-4 italic opacity-90 max-w-[85%] mx-auto leading-relaxed">
                  {category.description}
                </p>
              )}
              <div className="grid grid-cols-1 gap-2.5 text-left">
                {category.items.map((item, i) => (
                  <FoodCard key={`${category.id}-${i}`} item={item} onClick={setSelectedItem} />
                ))}
              </div>
              {index < currentMenuData.length - 1 && (
                <div className="mt-8 mb-5 border-b-2 border-slate-100 opacity-60 rounded-full mx-4" />
              )}
            </section>
          ))}
        </main>
        <Footer currentLang={language} />
        <FoodModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        <ScrollToTop />
      </Layout>
    </>
  );
}

// ─── Root with routing ─────────────────────────────────────────────────────────
function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/Admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
