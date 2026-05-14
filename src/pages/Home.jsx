import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import CategoryChoice from '../components/CategoryChoice';
import ShowcaseCarousel from '../components/ShowcaseCarousel';
import SailorShowcase from '../components/SailorShowcase';
import FAQ from '../components/FAQ';

const Home = ({ onAddToCart }) => {
  useEffect(() => {
    document.title = "O Chefão dos Cards | Loja Oficial de Itens MM2 e Sailor Piece";
  }, []);

  return (
    <main>
      <Hero />
      <CategoryChoice />
      <ShowcaseCarousel onAddToCart={onAddToCart} />
      <SailorShowcase onAddToCart={onAddToCart} />
      <FAQ />
    </main>
  );
};

export default Home;
