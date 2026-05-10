const prisma = require('../src/prismaClient');

const destinations = [
  // ─── ITALY ───────────────────────────────────────────────────
  { name: 'Amalfi Coast', country: 'Italy', description: 'A dramatic vertical landscape of cliffs and sea villages, the Amalfi Coast is Italy\'s most iconic stretch of coastline. Winding roads connect colorful villages clinging to the rock, while the Mediterranean shimmers below. Our concierge team arranges private boat charters and hidden lemon groves in Ravello.', cost: 2200, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Florence', country: 'Italy', description: 'The cradle of the Renaissance, Florence is a living museum of art, architecture and culture. Walk in the footsteps of Michelangelo, explore the Uffizi Gallery and feast on Tuscan cuisine. Every corner reveals masterworks that have shaped Western civilisation.', cost: 1800, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1543429567-8d82bae8b75e?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Venice', country: 'Italy', description: 'Built on a lagoon of 118 islands, Venice is unlike any other city on earth. Glide through timeless canals on a gondola, discover hidden piazzas and lose yourself in its labyrinthine streets. The city\'s unique beauty reveals itself at every turn.', cost: 2100, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Sicily', country: 'Italy', description: 'The Mediterranean\'s largest island blends Greek temples, Arab-Norman palaces and volcanic beaches. Sicily\'s rich history spans millennia of civilisations. Its cuisine alone—arancini, cannoli, swordfish al salmoriglio—justifies the journey entirely.', cost: 1600, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Cinque Terre', country: 'Italy', description: 'Five pastel-painted fishing villages cling to the rugged Ligurian coast. Connected by scenic hiking trails and turquoise coves, Cinque Terre is the jewel of the Italian Riviera. The views from the clifftop trails are simply unforgettable.', cost: 1900, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=2000&auto=format&fit=crop' },

  // ─── FRANCE ──────────────────────────────────────────────────
  { name: 'Paris', country: 'France', description: 'The City of Light needs no introduction. From the Eiffel Tower to the Louvre, from Montmartre cafés to haute couture on Avenue Montaigne, Paris remains the ultimate icon of romance and style. Every arrondissement tells a different story.', cost: 2500, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2000&auto=format&fit=crop' },
  { name: 'French Riviera', country: 'France', description: 'From Nice to Monaco, the Côte d\'Azur is the playground of the world\'s elite. Azure waters, Belle Époque villas, world-class casinos and Michelin-starred restaurants define this legendary coastline. The Riviera lifestyle is one of effortless glamour.', cost: 3200, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Provence', country: 'France', description: 'Endless lavender fields, medieval hilltop villages and Roman ruins form the backdrop of Provence. This sun-drenched region of southern France offers a slower, sensory pace of life. Markets overflow with local cheese, olives and fragrant herbs.', cost: 1900, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Bordeaux', country: 'France', description: 'A UNESCO World Heritage city of elegant 18th-century architecture, Bordeaux is the undisputed world capital of wine. Its wine estates and vibrant food scene make it a connoisseur\'s paradise. The Cité du Vin museum offers an extraordinary journey into wine culture.', cost: 1700, rating: 4.6, imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Mont Saint-Michel', country: 'France', description: 'A medieval monastery island rising from tidal flats, Mont Saint-Michel is one of France\'s most dramatic sights. It transforms from a peninsula at low tide into a true island when the sea rushes in. The Gothic abbey atop the rock is breathtaking at any hour.', cost: 1500, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?q=80&w=2000&auto=format&fit=crop' },

  // ─── EGYPT ───────────────────────────────────────────────────
  { name: 'The Pyramids of Giza', country: 'Egypt', description: 'The last surviving wonder of the ancient world. Standing on the edge of Cairo, the Great Pyramids and the enigmatic Sphinx are humbling monuments to human ambition that have awed visitors for millennia. No photograph can prepare you for their true scale.', cost: 1200, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Luxor', country: 'Egypt', description: 'Ancient Thebes is home to the Valley of the Kings, Karnak Temple and the Colossi of Memnon. Luxor is the world\'s greatest open-air museum. A hot-air balloon ride at dawn over the West Bank temples is an experience unlike anything else on earth.', cost: 1100, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d0b03c?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Sharm El-Sheikh', country: 'Egypt', description: 'A jewel of the Red Sea, Sharm El-Sheikh offers world-class diving and snorkeling in crystalline waters teeming with coral reefs and marine life. Luxury resorts line the shore while vibrant nightlife energises the evenings. The underwater world here is nothing short of magical.', cost: 1400, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1582550945154-66ea8fff25e1?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Aswan', country: 'Egypt', description: 'Where Africa meets the Nile, Aswan is a relaxed Nubian city of golden light and turquoise water. Sail a felucca around Elephantine Island, visit the Philae Temple and watch the sunset from the west bank. The pace of life here invites genuine reflection.', cost: 1000, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Alexandria', country: 'Egypt', description: 'Founded by Alexander the Great, this Mediterranean port city carries an extraordinary literary and cosmopolitan past. Stroll along the Corniche, explore the new Bibliotheca Alexandrina and taste its legendary seafood. Alexandria is Egypt\'s most cosmopolitan city.', cost: 900, rating: 4.5, imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=2000&auto=format&fit=crop' },

  // ─── JAPAN ───────────────────────────────────────────────────
  { name: 'Kyoto', country: 'Japan', description: 'Japan\'s ancient imperial capital dazzles with over 1,600 Buddhist temples, 400 Shinto shrines and the mesmerizing Arashiyama bamboo grove. Geisha still glide through the stone-paved lanes of Gion. Kyoto is the soul of traditional Japan preserved in exquisite detail.', cost: 2800, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Tokyo', country: 'Japan', description: 'A mesmerizing collision of ancient and hyper-modern, Tokyo is one of the world\'s most dynamic cities. From the neon glow of Shinjuku to the serenity of Meiji Shrine, it operates on a scale unlike anywhere else. The food scene alone warrants a dedicated journey.', cost: 3000, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Mount Fuji', country: 'Japan', description: 'Japan\'s most iconic peak is a sacred symbol of the nation. Hike to the summit for a sunrise that feels like the beginning of the world, or admire it from the tranquil Fuji Five Lakes. The mountain\'s perfect volcanic cone has inspired Japanese art for centuries.', cost: 2200, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1570459027562-4a916cc6113f?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Osaka', country: 'Japan', description: 'Japan\'s kitchen and comedy capital, Osaka is a city of extraordinary food, vibrant street life and a warm, down-to-earth character. Don\'t leave without eating takoyaki and exploring Dotonbori at night when the neon reflects beautifully in the canal below.', cost: 2400, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1590559899731-a382839e5549?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Hiroshima', country: 'Japan', description: 'A city reborn from tragedy, Hiroshima stands as a profound global symbol of peace. The Peace Memorial Park and the A-Bomb Dome are moving tributes. Nearby Miyajima Island\'s floating torii gate, especially at high tide, is one of Japan\'s most photographed scenes.', cost: 2000, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1576791363822-3fc86e4b3d91?q=80&w=2000&auto=format&fit=crop' },

  // ─── GREECE ──────────────────────────────────────────────────
  { name: 'Santorini', country: 'Greece', description: 'Perched on the rim of an ancient volcanic caldera, Santorini\'s whitewashed cubic houses and iconic blue-domed churches against the deep indigo Aegean Sea create one of the world\'s most recognisable panoramas. Sunsets in Oia are a sacred daily ritual.', cost: 2600, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Athens', country: 'Greece', description: 'The birthplace of democracy, philosophy and Western civilisation. The Acropolis still commands the skyline with the Parthenon at its crown, while the streets of Monastiraki buzz with life, history and exceptional street food. Athens rewards those who explore beyond the obvious.', cost: 1800, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Mykonos', country: 'Greece', description: 'The cosmopolitan jewel of the Cyclades enchants with its labyrinthine whitewashed lanes, iconic windmills and glamorous beaches. Mykonos attracts artists, celebrities and free spirits alike. Its nightlife is legendary, and its beaches among the finest in Europe.', cost: 2900, rating: 4.8, imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Crete', country: 'Greece', description: 'Greece\'s largest island is a world unto itself, home to the Minoan palace of Knossos, the dramatic Samaria Gorge and secluded pink-sand beaches. Cretan cuisine—dakos, fresh olive oil, aged graviera—is considered the finest in all of Greece without exception.', cost: 2000, rating: 4.7, imageUrl: 'https://images.unsplash.com/photo-1602088113235-229c19758e9f?q=80&w=2000&auto=format&fit=crop' },
  { name: 'Meteora', country: 'Greece', description: 'A UNESCO site unlike any other on earth. Ancient Byzantine monasteries perch impossibly atop colossal pillars of rock rising from the Thessaly plain. At sunrise, when mist fills the valley below, Meteora feels genuinely otherworldly and completely apart from modern life.', cost: 1500, rating: 4.9, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000&auto=format&fit=crop' },
];

async function main() {
  console.log('🧹 Clearing existing destination data...');
  await prisma.topPlace.deleteMany();
  await prisma.flight.deleteMany();
  await prisma.destination.deleteMany();
  console.log('✅ Cleared.');

  console.log('🌍 Seeding 25 destinations across 5 countries...');

  const flightNumbers = ['HZ101', 'HZ202', 'HZ303', 'HZ404', 'HZ505', 'HZ606', 'HZ707'];

  for (const dest of destinations) {
    const created = await prisma.destination.create({ data: dest });

    // 2 flights per destination
    for (let i = 0; i < 2; i++) {
      const deptDays = 10 + i * 14 + Math.floor(Math.random() * 7);
      const departure = new Date(Date.now() + deptDays * 86400000);
      await prisma.flight.create({
        data: {
          flightNumber: flightNumbers[Math.floor(Math.random() * flightNumbers.length)] + `-${created.id}${i}`,
          price: Math.round(dest.cost * 0.4 + Math.random() * 200),
          departure: departure.toISOString(),
          destinationId: created.id,
        },
      });
    }
    console.log(`  ✅ ${dest.name} (${dest.country})`);
  }

  console.log('\n🎉 Done! 25 destinations seeded.');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
