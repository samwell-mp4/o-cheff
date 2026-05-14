import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import Catalog from '../components/Catalog';
import PromotionsCarousel from '../components/PromotionsCarousel';

const Home = ({ searchQuery, onAddToCart }) => {
  useEffect(() => {
    document.title = "O Chefão dos Cards | Loja Oficial de Itens MM2 (Murder Mystery 2)";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', "A maior e melhor loja de itens Murder Mystery 2 (MM2) do Brasil. Godlys, Chromas e Sets exclusivos com entrega imediata.");
    }
  }, []);

  return (
    <main>
      <Hero />
      <PromotionsCarousel onAddToCart={onAddToCart} />
      <Catalog 
        searchQuery={searchQuery} 
        onAddToCart={onAddToCart} 
      />
    </main>
  );
};

export default Home;
