import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Header from './components/Header';
import ImportantInfo from './components/ImportantInfo';
import CategoryNav from './components/CategoryNav';
import FoodCard from './components/FoodCard';
import FoodModal from './components/FoodModal';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { menuData } from './data/menuData';

function App() {
  const [language, setLanguage] = useState('am');
  // Get the current menu data based on the selected language
  const currentMenuData = menuData[language];
  const [activeCategory, setActiveCategory] = useState(currentMenuData[0].id);
  const [selectedItem, setSelectedItem] = useState(null);

  // Force scroll to top on refresh and handle image preloading
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const handleCategoryClick = React.useCallback((id) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);


  // Update active category on scroll (Throttled & Efficient)
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -50% 0px', // Trigger when section is in middle of screen
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveCategory(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Watch all menu sections
    currentMenuData.forEach((category) => {
      const element = document.getElementById(category.id);
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

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

              <div className="grid grid-cols-2 gap-2.5 text-left">
                {category.items.map((item, itemIndex) => (
                  <FoodCard
                    key={`${category.id}-${itemIndex}`}
                    item={item}
                    onClick={setSelectedItem}
                  />
                ))}
              </div>

              {/* Divider Line between sections, hide for last item */}
              {index < currentMenuData.length - 1 && (
                <div className="mt-8 mb-5 border-b-2 border-slate-100 opacity-60 rounded-full mx-4"></div>
              )}
            </section>
          ))}
        </main>

        <Footer currentLang={language} />

        <FoodModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />

        <ScrollToTop />
      </Layout>
    </>
  );
}

export default App;
