import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ item, type = 'product' }) => {
  if (!item) return null;

  const baseUrl = "https://chefaodoscards.com.br";
  const url = `${baseUrl}/produto/${item.slug}`;
  const title = `${item.name} | Comprar ${item.name} Original com Garantia`;
  const description = `Compre ${item.name} original da categoria ${item.category} com entrega rápida, garantia e segurança absoluta. Confira o estoque disponível no Chefão dos Cards!`;
  const image = item.image;

  // Schema.org JSON-LD
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": item.name,
    "image": image,
    "description": description,
    "brand": {
      "@type": "Brand",
      "name": "Murder Mystery 2"
    },
    "sku": `MM2-${item.id}`,
    "offers": {
      "@type": "Offer",
      "url": url,
      "priceCurrency": "BRL",
      "price": item.price,
      "priceValidUntil": "2026-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": baseUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": item.category,
        "item": `${baseUrl}/#catalog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": item.name,
        "item": url
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "O produto possui garantia?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim! Todos os nossos itens têm garantia vitalícia de procedência e entrega garantida."
        }
      },
      {
        "@type": "Question",
        "name": "A entrega é imediata?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, nossa média de entrega é de 5 a 10 minutos após a confirmação do pagamento via trade oficial no Roblox."
        }
      },
      {
        "@type": "Question",
        "name": "Como recebo meu item?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Após a compra, entraremos em contato via chat ou WhatsApp para realizar o trade dentro do jogo Murder Mystery 2."
        }
      }
    ]
  };

  return (
    <Helmet>
      {/* Head SEO Completo */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="product" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="O Chefão dos Cards" />
      <meta property="og:locale" content="pt_BR" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Schema.org Injections */}
      <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
    </Helmet>
  );
};

export default SEO;
