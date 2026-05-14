import React from 'react';
import Hero from '../components/Hero';
import Catalog from '../components/Catalog';

const Home = ({ searchQuery, onAddToCart }) => {
  return (
    <main>
      <Hero />
      <Catalog 
        searchQuery={searchQuery} 
        onAddToCart={onAddToCart} 
      />
    </main>
  );
};

export default Home;
