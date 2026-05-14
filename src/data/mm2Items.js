const mm2Items = [
  {
    id: 999,
    name: "🧪 TESTE REAL — CHEFÃO",
    price: 0.10,
    rarity: "Unique",
    category: "Testes",
    image: "https://static.wikia.nocookie.net/murder-mystery-2/images/d/df/Bioblade.png",
    description: "Item de teste para validação de pagamento real via Mercado Pago. Valor simbólico."
  },
  // Godlys (R$ 3,90) - Standard
  { id: 1, name: "Eggblade", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Eggblade.png" },
  { id: 2, name: "Bioblade", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Bioblade.png" },
  { id: 3, name: "Cookieblade", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Cookieblade.png" },
  { id: 4, name: "Eternal I", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Eternal.png" },
  { id: 5, name: "Eternal II", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Eternal_2.png" },
  { id: 6, name: "Eternal III", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Eternal_III.png" },
  { id: 7, name: "Eternal IV", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Eternal_IIII.png" },
  { id: 8, name: "Nebula", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Nebula.png" },
  { id: 9, name: "Prismatic", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Prismatic.png" },
  { id: 10, name: "Clockwork", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Clockwork.png" },
  { id: 11, name: "Slasher", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Slasher.png" },
  { id: 12, name: "Fang", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Fang.png" },
  { id: 13, name: "Flames", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Flames.png" },
  { id: 14, name: "Saw", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Saw.png" },
  { id: 15, name: "Tides", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Tides.png" },
  { id: 16, name: "Ice Sabre", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Ice_Sabre.png" },
  { id: 17, name: "Minty", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Minty.png" },
  { id: 18, name: "Snowflake", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Snowflake.png" },
  { id: 19, name: "Winters Edge", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Winters_Edge.png" },
  { id: 20, name: "Battle Axe", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Battle_Axe.png" },
  { id: 21, name: "Boneblade", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Boneblade.png" },
  { id: 22, name: "Hallows Edge", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Hallows_Edge.png" },
  { id: 23, name: "Pumpking", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Pumpking.png" },
  { id: 24, name: "Handsaw", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Handsaw.png" },
  { id: 25, name: "Ice Dragon", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Ice_Dragon.png" },
  { id: 26, name: "Ice Shard", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Ice_Shard.png" },
  { id: 27, name: "Jinglegun", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Jinglegun.png" },
  { id: 28, name: "Hallowgun", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Hallowgun.png" },
  { id: 29, name: "Spider", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Spider.png" },
  { id: 30, name: "Vampires Edge", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Vampires_Edge.png" },
  { id: 31, name: "Pixel", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Pixel.png" },
  { id: 32, name: "Nightblade", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Nightblade.png" },
  { id: 33, name: "Heat", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Heat.png" },
  { id: 34, name: "Shark", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Shark.png" },
  { id: 35, name: "Blaster", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Blaster.png" },
  { id: 36, name: "Icebeam", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Icebeam.png" },
  { id: 37, name: "Battle Axe II", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Battle_Axe_II.png" },
  { id: 38, name: "Gemstone", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Gemstone.png" },
  { id: 39, name: "Virtual", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Virtual.png" },
  { id: 40, name: "Ghost Blade", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Ghost_Blade.png" },
  { id: 41, name: "Xmas", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Xmas.png" },
  { id: 42, name: "Ginger Luger", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Ginger_Luger.png" },
  { id: 43, name: "Gingerblade", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Gingerblade.png" },
  { id: 44, name: "Logchopper", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Logchopper.png" },
  { id: 45, name: "Eternalcane", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Eternalcane.png" },
  { id: 46, name: "Lugercane", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Lugercane.png" },
  { id: 47, name: "Chill", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Chill.png" },
  { id: 48, name: "Amerilaser", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Amerilaser.png" },
  { id: 49, name: "Old Glory", price: 3.90, category: "Godly", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Old_Glory.png" },

  // Valued Godlies
  { id: 100, name: "Alien Bean", price: 43.90, category: "Valued", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/AlienBean.png" },
  { id: 101, name: "Raygun", price: 29.90, category: "Valued", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Raygun.png" },
  { id: 102, name: "Bat", price: 19.90, category: "Valued", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Bat_Weapon.png" },
  { id: 103, name: "Watergun", price: 15.90, category: "Valued", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Watergun.png" },
  { id: 104, name: "Heartblade", price: 9.90, category: "Valued", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/HeartBlade.png" },
  { id: 105, name: "Batwing", price: 9.90, category: "Valued", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Batwing.png" },
  { id: 106, name: "Luger", price: 7.90, category: "Valued", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Luger.png" },
  { id: 107, name: "Lightbringer", price: 7.90, category: "Valued", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Lightbringer.png" },
  { id: 108, name: "Darkbringer", price: 7.90, category: "Valued", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Darkbringer.png" },
  { id: 109, name: "Luger Vermelha", price: 6.90, category: "Valued", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Red_Luger.png" },
  { id: 110, name: "Luger Verde", price: 4.90, category: "Valued", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Green_Luger.png" },
  { id: 111, name: "Laser", price: 4.90, category: "Valued", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Laser.png" },

  // Sets MM2
  { id: 300, name: "Set Sunset", price: 54.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/SunsetKnife.webp" },
  { id: 301, name: "Bloom Set", price: 54.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Bloom.png" },
  { id: 302, name: "Flowerwood Set", price: 36.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Flowerwood.png" },
  { id: 303, name: "Waves Set", price: 36.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Waves.png" },
  { id: 304, name: "Set Xeno", price: 36.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Xeno.png" },
  { id: 305, name: "Borealis Set", price: 29.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Borealis.png" },
  { id: 306, name: "Sparkle Set (1–10)", price: 24.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Sparkle.png" },
  { id: 307, name: "Set Candy", price: 19.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Candy.png" },
  { id: 308, name: "Set Icebreaker", price: 19.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Icebreaker.png" },
  { id: 309, name: "Pearl Set", price: 16.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Pearl_Knife.png" },
  { id: 310, name: "Set Phantom", price: 19.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Phantom.png" },
  { id: 311, name: "Set Vintage", price: 12.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Vintage.png" },
  { id: 312, name: "Set Elderwood", price: 12.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Elderwood_Scythe.png" },
  { id: 313, name: "Set Hallow", price: 10.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Hallows_Edge.png" },
  { id: 314, name: "Set Eternal", price: 8.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Eternal.png" },

  // Sets MM2 - Escolha (R$ 5,90)
  { id: 500, name: "Set Seer", price: 5.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Seer.png" },
  { id: 501, name: "Set Old Glory", price: 5.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Old_Glory.png" },
  { id: 502, name: "Set Ginger", price: 5.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Gingerblade.png" },
  { id: 503, name: "Set Plasma", price: 5.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Plasma_Blade.png" },
  { id: 504, name: "Set Logchopper", price: 5.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Logchopper.png" },
  { id: 505, name: "Set Virtual", price: 5.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Virtual.png" },
  { id: 506, name: "Set Iceflake", price: 5.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Iceflake.png" },
  { id: 507, name: "Set Xmas", price: 5.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Xmas.png" },
  { id: 508, name: "Set Eternalcane", price: 5.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Eternalcane.png" },
  { id: 509, name: "Set Hallow Blades", price: 5.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Hallows_Edge.png" },
  { id: 510, name: "Set Axe", price: 5.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Battle_Axe.png" },
  { id: 511, name: "Set Marés", price: 5.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Tides.png" },
  { id: 512, name: "Set Chill", price: 5.90, category: "Set", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Chill.png" },

  // Chroma (R$ 14,90)
  { id: 200, name: "Chroma Candeflame", price: 14.90, category: "Chroma", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/ChromaCandeflame.png" },
  { id: 201, name: "Chroma Elderwood Blade", price: 14.90, category: "Chroma", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/ChromaElderwoodBlade.png" },
  { id: 202, name: "Chroma CookieCane", price: 14.90, category: "Chroma", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/ChromaCookieCane.png" },
  { id: 203, name: "Chroma Swirly Gun", price: 14.90, category: "Chroma", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/ChromaSwirlyGun.png" },
  { id: 204, name: "Chroma Darkbringer", price: 14.90, category: "Chroma", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/ChromaDarkbringer.png" },

  // Pets Godlys (R$ 9,90)
  { id: 400, name: "Fire Bat", price: 9.90, category: "Pet", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/FireBat.png" },
  { id: 401, name: "Fire Bear", price: 9.90, category: "Pet", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/FireBear.png" },
  { id: 402, name: "Fire Bunny", price: 9.90, category: "Pet", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/FireBunny.png" },
  { id: 403, name: "Fire Cat", price: 9.90, category: "Pet", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/FireCat.png" },
  { id: 404, name: "Fire Dog", price: 9.90, category: "Pet", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/FireDog.png" },
  { id: 405, name: "Fire Fox", price: 9.90, category: "Pet", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/FireFox.png" },
  { id: 406, name: "Fire Pig", price: 9.90, category: "Pet", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/FirePig.png" },

  // Regular Pets (R$ 3,90)
  { id: 600, name: "Ice Phoenix", price: 3.90, category: "Pet", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/IcePhoenix.png" },
  { id: 601, name: "Frostbird", price: 3.90, category: "Pet", image: "https://murder-mystery-2.fandom.com/wiki/Special:FilePath/Frostbird.png" },
];

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Add slug to all items
mm2Items.forEach(item => {
  item.slug = slugify(item.name);
});

export { slugify };
export default mm2Items;
