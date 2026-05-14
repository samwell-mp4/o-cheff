import fs from 'fs';
import mm2Items from '../src/data/mm2Items.js';

const BASE_URL = 'https://chefaodoscards.shop';
const date = new Date().toISOString().split('T')[0];

const staticPages = [
  '',
  '/shop',
  '/login',
  '/termos',
  '/privacidade',
  '/reembolso'
];

const generateSitemap = () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
  ${mm2Items.map(item => `
  <url>
    <loc>${BASE_URL}/produto/${item.slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
</urlset>`;

  fs.writeFileSync('./public/sitemap.xml', xml);
  console.log('✅ Sitemap gerado com sucesso para ' + mm2Items.length + ' produtos!');
};

generateSitemap();
