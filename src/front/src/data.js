export const destinations = [
  // --- ITALY (6) ---
  { 
    id: 1,  name: 'Amalfi Coast', country: 'Italy', rating: 4.9, cost: 3400,
    images: 'https://images.unsplash.com/photo-1533676802871-eca1ae998cd5?q=80&w=1500&auto=format&fit=crop',
    tagline: 'ITALIAN RIVIERA',
    description: 'A dramatic vertical landscape where pastel-colored villages cling to rugged cliffs above a shimmering sapphire sea.',
    highlights: ['Private boat charters', 'Michelin-starred dining', 'Lemon groves in Ravello'],
    vCards: [
      { tag: 'HERITAGE', title: 'Ravello Villas', img: 'https://images.unsplash.com/photo-1549646849-fb93be1d4a04?q=80&w=800&auto=format&fit=crop' },
      { tag: 'SPIRIT', title: 'Lunch with a View', img: 'https://images.unsplash.com/photo-1515859005217-8a1f08870f59?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  { 
    id: 2,  name: 'Rome', country: 'Italy', rating: 4.8, cost: 2900,
    images: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=1500&auto=format&fit=crop',
    tagline: 'THE ETERNAL CITY',
    description: 'Walk through history in a city where ancient ruins and modern life coexist in perfect harmony.',
    highlights: ['Vatican Museums', 'Pantheon Sunsets', 'Pasta making class'],
    vCards: [
      { tag: 'ANCIENT', title: 'Colosseum', img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop' },
      { tag: 'VIBES', title: 'Trastevere', img: 'https://images.unsplash.com/photo-1515542682120-0c03473f32d9?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  { 
    id: 3, name: 'Venice', country: 'Italy', rating: 4.9, cost: 3100,
    images: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=1500&auto=format&fit=crop',
    tagline: 'CITY OF CANALS',
    description: 'Glide through winding waterways on a gondola and lose yourself in the labyrinthine streets.',
    highlights: ['Gondola serenade', 'Doge\'s Palace VIP', 'Murano glass'],
    vCards: [
      { tag: 'WATERWAYS', title: 'Grand Canal', img: 'https://images.unsplash.com/photo-1514890547357-a9ee2887a35f?q=80&w=800&auto=format&fit=crop' },
      { tag: 'GEMS', title: 'Dorsoduro', img: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  { 
    id: 4, name: 'Florence', country: 'Italy', rating: 4.7, cost: 2350,
    images: 'https://images.unsplash.com/photo-1543429258-10b8e692a828?q=80&w=1500&auto=format&fit=crop',
    tagline: 'RENAISSANCE CRADLE',
    description: 'Immerse yourself in the art and culture that defined an era in the heart of Tuscany.',
    highlights: ['Michelangelo\'s David', 'Chianti wine tour', 'Duomo views'],
    vCards: [
      { tag: 'ART', title: 'Uffizi Gallery', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop' },
      { tag: 'FLAVOR', title: 'Tuscan Sunsets', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  { 
    id: 5, name: 'Lake Como', country: 'Italy', rating: 4.8, cost: 4200,
    images: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1500&auto=format&fit=crop',
    tagline: 'LAKESIDE ELEGANCE',
    description: 'Serene waters surrounded by majestic mountains and opulent 17th-century villas.',
    highlights: ['Private boat tour', 'Bellagio lunch', 'Villa Balbianello'],
    vCards: [
      { tag: 'LUXURY', title: 'Villa Living', img: 'https://images.unsplash.com/photo-1493246507139-91e8bef99c17?q=80&w=800&auto=format&fit=crop' },
      { tag: 'PEACE', title: 'Alpine Retreat', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  { 
    id: 6, name: 'Tuscany', country: 'Italy', rating: 4.9, cost: 2600,
    images: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1500&auto=format&fit=crop',
    tagline: 'ROLLING HILLS',
    description: 'Golden landscapes and world-class vineyards that stretch as far as the eye can see.',
    highlights: ['Wine tasting', 'Medieval villages', 'Farm-to-table dining'],
    vCards: [
      { tag: 'NATURE', title: 'Val d\'Orcia', img: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop' },
      { tag: 'CRAFTS', title: 'Siena Art', img: 'https://images.unsplash.com/photo-1515542682120-0c03473f32d9?q=80&w=800&auto=format&fit=crop' }
    ]
  },

  // --- FRANCE (6) ---
  { 
    id: 10, name: 'Parisian Getaway', country: 'France', rating: 4.9, cost: 2100,
    images: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1500&auto=format&fit=crop',
    tagline: 'CITY OF LIGHT',
    description: 'From the iconic Eiffel Tower to the charming streets of Montmartre.',
    highlights: ['Seine cruise', 'Louvre VIP', 'Pastry workshop'],
    vCards: [
      { tag: 'ICONS', title: 'Eiffel Tower', img: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=800&auto=format&fit=crop' },
      { tag: 'CHARM', title: 'Montmartre', img: 'https://images.unsplash.com/photo-1543165796-5426273eaab3?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  { 
    id: 11, name: 'French Riviera', country: 'France', rating: 4.8, cost: 3200,
    images: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=1500&auto=format&fit=crop',
    tagline: 'AZURE COAST',
    description: 'Glamour and natural beauty meet in Nice, Cannes, and the principality of Monaco.',
    highlights: ['Private yacht', 'Casino de Monaco', 'Old Town Nice'],
    vCards: [
      { tag: 'GLAMOUR', title: 'Cannes Coast', img: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?q=80&w=800&auto=format&fit=crop' },
      { tag: 'BLUE', title: 'Monaco Views', img: 'https://images.unsplash.com/photo-1565073182887-6bcefbe225b1?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  { 
    id: 12, name: 'Provence', country: 'France', rating: 4.7, cost: 2800,
    images: 'https://images.unsplash.com/photo-1499346030926-9a72daac6c63?q=80&w=1500&auto=format&fit=crop',
    tagline: 'LAVENDER DREAMS',
    description: 'Fields of purple, charming villages, and the soft light that inspired the Impressionists.',
    highlights: ['Lavender fields', 'Avignon Palace', 'Antique markets'],
    vCards: [
      { tag: 'COLOR', title: 'Lavender Bloom', img: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?q=80&w=800&auto=format&fit=crop' },
      { tag: 'RURAL', title: 'Luberon Hills', img: 'https://images.unsplash.com/photo-1491166617655-0723a0999cfc?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  { 
    id: 13, name: 'Lyon', country: 'France', rating: 4.6, cost: 1900,
    images: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?q=80&w=1500&auto=format&fit=crop',
    tagline: 'GASTRONOMY CAPITAL',
    description: 'A city of two rivers, hidden passageways, and the finest cuisine in France.',
    highlights: ['Bouchon dining', 'Vieux Lyon tours', 'Light festival'],
    vCards: [
      { tag: 'FOOD', title: 'Local Delicacies', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=800&auto=format&fit=crop' },
      { tag: 'HISTORY', title: 'Roman Theater', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  { 
    id: 14, name: 'Bordeaux', country: 'France', rating: 4.7, cost: 2400,
    images: 'https://images.unsplash.com/photo-1565073182887-6bcefbe225b1?q=80&w=1500&auto=format&fit=crop',
    tagline: 'WINE HERITAGE',
    description: 'The world\'s most famous wine region combined with elegant 18th-century architecture.',
    highlights: ['Château tasting', 'Cité du Vin', 'Saint-Émilion'],
    vCards: [
      { tag: 'VINEYARD', title: 'Grand Cru', img: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?q=80&w=800&auto=format&fit=crop' },
      { tag: 'URBAN', title: 'Place de la Bourse', img: 'https://images.unsplash.com/photo-1491166617655-0723a0999cfc?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  { 
    id: 15, name: 'Mont Saint-Michel', country: 'France', rating: 4.8, cost: 2600,
    images: 'https://images.unsplash.com/photo-1491166617655-0723a0999cfc?q=80&w=1500&auto=format&fit=crop',
    tagline: 'ISLAND ABBEY',
    description: 'A magical island commune and abbey that rises dramatically from the sea.',
    highlights: ['Abbey tour', 'Bay walks', 'Cider tasting'],
    vCards: [
      { tag: 'MYSTERY', title: 'The Abbey', img: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?q=80&w=800&auto=format&fit=crop' },
      { tag: 'COAST', title: 'Brittany Shores', img: 'https://images.unsplash.com/photo-1565073182887-6bcefbe225b1?q=80&w=800&auto=format&fit=crop' }
    ]
  },

  // --- EGYPT (6) ---
  { 
    id: 16, name: 'Cairo & Pyramids', country: 'Egypt', rating: 4.9, cost: 1800,
    images: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=1500&auto=format&fit=crop',
    tagline: 'ANCIENT MAJESTY',
    description: 'Stand in awe of the Great Pyramids of Giza and the vibrant markets of Old Cairo.',
    highlights: ['Camel trek', 'Egyptian Museum', 'Sphinx dinner'],
    vCards: [
      { tag: 'WONDERS', title: 'The Pyramids', img: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?q=80&w=800&auto=format&fit=crop' },
      { tag: 'LOCAL', title: 'Khan el-Khalili', img: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  { 
    id: 17, name: 'Luxor Temples', country: 'Egypt', rating: 4.8, cost: 2200,
    images: 'https://images.unsplash.com/photo-1568322445389-f64e1bbea1a5?q=80&w=1500&auto=format&fit=crop',
    tagline: 'THEBES LEGACY',
    description: 'Explore the world\'s largest open-air museum, from Karnak to the Valley of the Kings.',
    highlights: ['Karnak Temple', 'Hot air balloon', 'Tutankhamun Tomb'],
    vCards: [
      { tag: 'SACRED', title: 'Luxor Temple', img: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=800&auto=format&fit=crop' },
      { tag: 'VALLEY', title: 'Tomb Art', img: 'https://images.unsplash.com/photo-1590059390047-f5e617e3a25c?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  { 
    id: 18, name: 'Nile Cruise', country: 'Egypt', rating: 4.7, cost: 3500,
    images: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=1500&auto=format&fit=crop',
    tagline: 'RIVER OF LIFE',
    description: 'A luxurious journey down the Nile, stopping at temples that have stood for millennia.',
    highlights: ['Private Dahabiya', 'Kom Ombo', 'Edfu Temple'],
    vCards: [
      { tag: 'RIVER', title: 'Nile Sunset', img: 'https://images.unsplash.com/photo-1590059390047-f5e617e3a25c?q=80&w=800&auto=format&fit=crop' },
      { tag: 'VESSEL', title: 'Dahabiya Life', img: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  { 
    id: 19, name: 'Red Sea Resort', country: 'Egypt', rating: 4.8, cost: 2000,
    images: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1500&auto=format&fit=crop',
    tagline: 'CORAL GARDENS',
    description: 'Pristine beaches and world-class diving in the crystal clear waters of Hurghada.',
    highlights: ['Coral reef diving', 'Desert safari', 'Beachfront luxury'],
    vCards: [
      { tag: 'UNDERWATER', title: 'Reef Life', img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop' },
      { tag: 'BEACH', title: 'Sahl Hasheesh', img: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  { 
    id: 20, name: 'Aswan', country: 'Egypt', rating: 4.6, cost: 1600,
    images: 'https://images.unsplash.com/photo-1590059390047-f5e617e3a25c?q=80&w=1500&auto=format&fit=crop',
    tagline: 'NUBIAN SERENITY',
    description: 'The most beautiful part of the Nile, characterized by granite rocks and Nubian culture.',
    highlights: ['Philae Temple', 'Old Cataract Hotel', 'Nubian Village'],
    vCards: [
      { tag: 'CULTURE', title: 'Nubian Colors', img: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=800&auto=format&fit=crop' },
      { tag: 'TEMPLE', title: 'Philae Island', img: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?q=80&w=800&auto=format&fit=crop' }
    ]
  },
  { 
    id: 21, name: 'Alexandria', country: 'Egypt', rating: 4.5, cost: 1500,
    images: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=1500&auto=format&fit=crop',
    tagline: 'MEDITERRANEAN PEARL',
    description: 'A cosmopolitan city with a rich Greco-Roman history and a stunning sea library.',
    highlights: ['Bibliotheca', 'Citadel of Qaitbay', 'Corniche walk'],
    vCards: [
      { tag: 'SEA', title: 'Corniche', img: 'https://images.unsplash.com/photo-1590059390047-f5e617e3a25c?q=80&w=800&auto=format&fit=crop' },
      { tag: 'LIBRARY', title: 'Modern Library', img: 'https://images.unsplash.com/photo-1568322445389-f64e1bbea1a5?q=80&w=800&auto=format&fit=crop' }
    ]
  }
];
