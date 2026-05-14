import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import BannerCarousel from '../components/BannerCarousel';
import CategoryChoice from '../components/CategoryChoice';
import PromotionsCarousel from '../components/PromotionsCarousel';
import ShowcaseCarousel from '../components/ShowcaseCarousel';
import SailorShowcase from '../components/SailorShowcase';
import FAQ from '../components/FAQ';

const Home = ({ onAddToCart }) => {
  useEffect(() => {
    document.title = "O Chefão dos Cards | Loja Oficial de Itens MM2 e Sailor Piece";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', "A maior loja de itens Murder Mystery 2 (MM2) e Sailor Piece do Brasil. Godlys, Chromas e Sets exclusivos com entrega imediata e segurança absoluta.");
    }
  }, []);

  return (
    <main>
      <Hero />
      <BannerCarousel />
      <CategoryChoice />
      <PromotionsCarousel onAddToCart={onAddToCart} />
      <ShowcaseCarousel />
      <SailorShowcase />
      <FAQ />
    </main>
  );
};

export default Home;
