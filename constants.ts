
import { HeadshotStyle } from './types';

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  {
    id: 'corporate-studio',
    name: 'Corporate Studio',
    description: 'Classic grey background, soft professional lighting, suit and tie or formal blazer.',
    promptModifier: 'high-end professional business headshot, wearing a dark tailored suit, professional corporate studio setting, neutral grey gradient background, soft box lighting, confident expression, 85mm lens',
    previewColor: 'bg-slate-700',
    thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'modern-office',
    name: 'Modern Workspace',
    description: 'Blurred modern office background, smart casual attire, bright and airy.',
    promptModifier: 'professional business headshot, wearing smart casual business attire, modern open-plan office background with blurred glass and plants, bright natural lighting, approachable, 85mm lens',
    previewColor: 'bg-blue-100',
    thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'tech-startup',
    name: 'Startup Founder',
    description: 'Minimalist aesthetic, solid color or brick wall, t-shirt with blazer.',
    promptModifier: 'modern professional headshot, wearing a high-quality t-shirt and casual blazer, modern tech startup environment, loft style brick wall background, edgy but professional lighting, sharp focus',
    previewColor: 'bg-orange-100',
    thumbnail: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'outdoor-natural',
    name: 'Outdoor Natural',
    description: 'Greenery bokeh, natural sunlight, approachable and friendly.',
    promptModifier: 'professional outdoor headshot, wearing business casual, outdoors in a park with blurred green trees in background, golden hour sunlight, warm and friendly smile, natural skin texture',
    previewColor: 'bg-green-100',
    thumbnail: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'executive-luxury',
    name: 'Executive Luxury',
    description: 'High-end boardroom or library, dramatic lighting, premium formal wear.',
    promptModifier: 'prestigious executive portrait, wearing expensive formal business wear, luxury executive boardroom background, dramatic cinematic lighting, authoritative and trustworthy, high detail',
    previewColor: 'bg-amber-900',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'creative-studio',
    name: 'Creative Professional',
    description: 'Vibrant color pop background, stylish eyewear/accessories permitted.',
    promptModifier: 'artistic creative professional headshot, wearing stylish attire, vibrant solid blue or purple studio background, high contrast fashion lighting, sharp focus, expressive',
    previewColor: 'bg-purple-600',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'
  }
];

export const CREATIVE_CATEGORIES = [
  {
    name: 'Artistic & Traditional',
    styles: [
      {
        id: 'ghibli-sky',
        name: 'Studio Ghibli Sky',
        description: 'Whimsical hand-painted animation style with dreamy pastel skies.',
        promptModifier: 'GHIBSKY style, dreamy watercolor sky, soft cumulus clouds, pastel gradient, gentle natural light, whimsical atmosphere.',
        previewColor: 'bg-sky-200',
        thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: '3d-caricature',
        name: '3D Caricature',
        description: 'Playful 3D exaggeration with character recognition.',
        promptModifier: 'A highly stylized 3D caricature of this Character, with expressive facial features, and playful exaggeration. Rendered in a smooth, polished style with clean materials and soft ambient lighting. Bold color background to emphasize the character’s charm and presence.',
        previewColor: 'bg-indigo-200',
        thumbnail: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'kawaii-sticker',
        name: 'Stylized Stickers',
        description: 'Kawaii stickers with bold outlines and vibrant colors.',
        promptModifier: 'kawaii-style sticker image, bold clean outlines, simple cel-shading, vibrant colors, white background, high contrast, clean cut lines, die-cut sticker aesthetic',
        previewColor: 'bg-yellow-100',
        thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'watercolor',
        name: 'Watercolor',
        description: 'Soft painting with visible brush strokes and paper texture.',
        promptModifier: 'Soft watercolor painting illustration with visible brush strokes, light color bleeding, paper texture, artistic and airy portrait',
        previewColor: 'bg-pink-100',
        thumbnail: 'https://images.unsplash.com/photo-1581337204873-ef367185181a?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'oil-painting',
        name: 'Oil Painting',
        description: 'Classic rich textures and deep colors with realistic lighting.',
        promptModifier: 'Classic oil painting portrait with rich textures, thick impasto brushwork, deep colors, realistic museum lighting',
        previewColor: 'bg-yellow-900',
        thumbnail: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'pencil-sketch',
        name: 'Pencil Sketch',
        description: 'Detailed monochrome fine line work and hand-drawn look.',
        promptModifier: 'Detailed pencil sketch portrait with fine line work, graphite textures, monochrome shading, sketchbook style',
        previewColor: 'bg-slate-300',
        thumbnail: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'charcoal',
        name: 'Charcoal Drawing',
        description: 'Rough textures and expressive shading with strong contrast.',
        promptModifier: 'Expressive charcoal illustration portrait with rough paper textures, strong chiaroscuro contrast, hand-drawn aesthetic',
        previewColor: 'bg-slate-800',
        thumbnail: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'ink-wash',
        name: 'Ink Wash',
        description: 'Minimal flowing strokes in traditional Asian painting style.',
        promptModifier: 'Minimalist ink wash portrait with flowing brush strokes, traditional black ink on rice paper, elegant and artistic',
        previewColor: 'bg-slate-100',
        thumbnail: 'https://images.unsplash.com/photo-1544273677-c433136021d4?q=80&w=400&auto=format&fit=crop'
      }
    ]
  },
  {
    name: '3D & Materials',
    styles: [
      {
        id: 'clay-3d',
        name: 'Clay 3D',
        description: 'Cute handmade 3D model with soft playful shapes.',
        promptModifier: 'Cute 3D clay sculpture portrait, soft rounded shapes, handmade fingerprints texture, playful studio lighting, stop-motion aesthetic',
        previewColor: 'bg-orange-200',
        thumbnail: 'https://images.unsplash.com/photo-1635332043388-5a4e3d39506b?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'realistic-3d',
        name: 'Realistic 3D',
        description: 'Detailed materials and studio lighting render.',
        promptModifier: 'Highly realistic Octane 3D render, subsurface scattering on skin, detailed materials, cinematic lighting, 8k resolution',
        previewColor: 'bg-blue-900',
        thumbnail: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'marble',
        name: 'Marble',
        description: 'Classical statue aesthetic with smooth stone texture.',
        promptModifier: 'Sculpted white marble statue portrait, smooth stone texture, fine classical carving details, museum lighting',
        previewColor: 'bg-stone-200',
        thumbnail: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'paper-cutout',
        name: 'Paper Cutout',
        description: 'Handcrafted layered illustration with deep shadows.',
        promptModifier: 'Multi-layered paper cutout illustration portrait, visible paper edges and shadows, handcrafted dioroma aesthetic',
        previewColor: 'bg-green-200',
        thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'glass-art',
        name: 'Glass Art',
        description: 'Modern transparent material with elegant refractions.',
        promptModifier: 'Translucent frosted glass sculpture portrait, elegant light refractions and caustics, modern crystalline aesthetic',
        previewColor: 'bg-cyan-50',
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop'
      }
    ]
  }
];

export const INDIAN_CULTURE_CATEGORIES = [
  {
    name: 'Traditional Indian Art Styles',
    styles: [
      {
        id: 'madhubani',
        name: 'Madhubani Painting',
        description: 'Intricate line work, nature motifs, and vibrant folk art.',
        promptModifier: 'Traditional Madhubani folk art style, intricate geometric line work, nature motifs, flat vibrant colors, Bihar heritage aesthetic',
        previewColor: 'bg-orange-600',
        thumbnail: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'warli',
        name: 'Warli Art',
        description: 'Minimal tribal art with geometric white figures.',
        promptModifier: 'Warli tribal art style, minimal white silhouettes, geometric human figures on earthy red-ochre background, ancient tribal wall painting aesthetic',
        previewColor: 'bg-red-900',
        thumbnail: 'https://images.unsplash.com/photo-1541462608141-ad60397d4573?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'pattachitra',
        name: 'Pattachitra',
        description: 'Detailed storytelling with bold outlines and mythological themes.',
        promptModifier: 'Odishan Pattachitra art style, detailed storytelling illustration, bold black outlines, vibrant natural pigment colors, mythological aesthetic',
        previewColor: 'bg-yellow-700',
        thumbnail: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe1?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'kalamkari',
        name: 'Kalamkari',
        description: 'Hand-painted textile style with earthy tones.',
        promptModifier: 'Hand-painted Kalamkari textile style, earthy vegetable dye tones, traditional floral and vine patterns, mythological motifs, fabric texture',
        previewColor: 'bg-amber-800',
        thumbnail: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'miniature',
        name: 'Miniature Painting',
        description: 'Highly detailed, royal-era aesthetic with rich colors.',
        promptModifier: 'Indian Miniature painting style, Rajput royal-era aesthetic, rich vibrant colors, extremely fine brushwork details, courtly portrait style',
        previewColor: 'bg-emerald-900',
        thumbnail: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'tanjore',
        name: 'Tanjore Painting',
        description: 'Gold foil highlights and embossed divine look.',
        promptModifier: 'Thanjavur Tanjore painting style, authentic gold foil highlights, embossed 3D texture, rich jewel tones, divine spiritual aesthetic',
        previewColor: 'bg-yellow-500',
        thumbnail: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=400&auto=format&fit=crop'
      }
    ]
  },
  {
    name: 'Material & Craft-Based Styles',
    styles: [
      {
        id: 'terracotta',
        name: 'Terracotta Art',
        description: 'Earthy clay textures inspired by traditional sculptures.',
        promptModifier: 'Terracotta clay sculpture portrait, earthy kiln-fired brown textures, inspired by traditional Indian pottery, matte finish',
        previewColor: 'bg-orange-800',
        thumbnail: 'https://images.unsplash.com/photo-1603481546238-487240415921?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'handloom',
        name: 'Handloom Textile',
        description: 'Fabric-like textures inspired by khadi and silk weaves.',
        promptModifier: 'Indian handloom textile aesthetic, rough khadi or smooth silk fabric texture, woven patterns, organic earthy fiber look',
        previewColor: 'bg-sky-900',
        thumbnail: 'https://images.unsplash.com/photo-1610116303244-cd464205fd5d?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'block-print',
        name: 'Block Print',
        description: 'Repeating hand-stamped patterns on traditional fabrics.',
        promptModifier: 'Traditional Indian block print fabric style, repeating hand-stamped floral patterns, artisan fabric texture, earthy dye aesthetic',
        previewColor: 'bg-rose-900',
        thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop'
      }
    ]
  },
  {
    name: 'Cultural & Festive Styles',
    styles: [
      {
        id: 'diwali',
        name: 'Diwali Festive',
        description: 'Warm lighting, diyas, and vibrant celebratory colors.',
        promptModifier: 'Diwali festive atmosphere, warm golden diya lighting, vibrant celebratory colors, fireworks bokeh in background, joyful mood',
        previewColor: 'bg-amber-600',
        thumbnail: 'https://images.unsplash.com/photo-1542442828-287217bfb87f?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'rangoli',
        name: 'Rangoli Art',
        description: 'Colorful floor patterns with symmetric aesthetics.',
        promptModifier: 'Rangoli sand art style, colorful symmetric geometric patterns, vibrant festive Indian sand textures, celebratory aesthetic',
        previewColor: 'bg-pink-600',
        thumbnail: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'spiritual',
        name: 'Spiritual / Temple',
        description: 'Soft lighting and incense for a sacred visuals.',
        promptModifier: 'Spiritual Indian temple atmosphere, soft divine lighting, subtle incense smoke, sacred and calm visuals, traditional prayer room aesthetic',
        previewColor: 'bg-orange-500',
        thumbnail: 'https://images.unsplash.com/photo-1544273677-c433136021d4?q=80&w=400&auto=format&fit=crop'
      }
    ]
  },
  {
    name: 'Indian Photography & Cinema',
    styles: [
      {
        id: 'studio-cinematic',
        name: 'Studio Cinematic',
        description: 'Dramatic lighting and high-glamour movie look.',
        promptModifier: 'Dramatic cinematic movie studio lighting, professional film photography, vibrant saturated colors, expressive cinematic framing, glamorous artistic aesthetic',
        previewColor: 'bg-blue-600',
        thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'indian-street',
        name: 'Indian Street',
        description: 'Candid moments and colorful market backgrounds.',
        promptModifier: 'Indian street photography style, candid moment, busy colorful market background with bokeh, warm natural sunlight, urban life aesthetic',
        previewColor: 'bg-orange-400',
        thumbnail: 'https://images.unsplash.com/photo-1506755854403-d14d3d20dbc3?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'vintage-indian-film',
        name: 'Vintage Indian Film',
        description: 'Muted colors and grain inspired by old cinema.',
        promptModifier: 'Vintage Indian movie style, muted sepia and grainy film tones, inspired by 1960s classic Hindi cinema, nostalgic film aesthetic',
        previewColor: 'bg-slate-700',
        thumbnail: 'https://images.unsplash.com/photo-1552083375-1447ce886485?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'monsoon-mood',
        name: 'Monsoon Mood',
        description: 'Overcast skies and rain-soaked street reflections.',
        promptModifier: 'Indian monsoon mood photography, overcast moody skies, rain-soaked streets with reflections, atmospheric rainy day aesthetic',
        previewColor: 'bg-slate-800',
        thumbnail: 'https://images.unsplash.com/photo-1534274988757-a28bf1f539cf?q=80&w=400&auto=format&fit=crop'
      }
    ]
  }
];

export const INDIAN_COSTUME_CATEGORIES = [
  {
    name: '🇮🇳 North India',
    styles: [
      {
        id: 'punjabi-costume',
        name: 'Punjabi',
        isCostume: true,
        description: 'Phulkari dupatta, salwar kameez, or vibrant turban.',
        promptModifier: 'traditional Punjabi regional attire with authentic North Indian cultural details',
        previewColor: 'bg-orange-500',
        thumbnail: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'kashmiri-costume',
        name: 'Kashmiri',
        isCostume: true,
        description: 'Pheran with embroidery and woolen shawl.',
        promptModifier: 'traditional Kashmiri Pheran style with Himalayan woolen shawl aesthetic',
        previewColor: 'bg-blue-300',
        thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'himachali-costume',
        name: 'Himachali',
        isCostume: true,
        description: 'Colorful caps and traditional woolen attire.',
        promptModifier: 'traditional Himachali regional attire with colorful geometric mountain patterns',
        previewColor: 'bg-green-600',
        thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'rajasthani-costume',
        name: 'Rajasthani',
        isCostume: true,
        description: 'Ghagra choli, odhni, and mirror work.',
        promptModifier: 'vibrant Rajasthani regional attire with mirror work and desert culture aesthetic',
        previewColor: 'bg-yellow-600',
        thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'haryanvi-costume',
        name: 'Haryanvi',
        isCostume: true,
        description: 'Simple ghagra with bold jewelry.',
        promptModifier: 'traditional Haryanvi regional attire with rural heritage aesthetic and bold jewelry',
        previewColor: 'bg-rose-500',
        thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop'
      }
    ]
  },
  {
    name: '🏛️ West India',
    styles: [
      {
        id: 'gujarati-costume',
        name: 'Gujarati',
        isCostume: true,
        description: 'Chaniya choli, bandhani, and mirror work.',
        promptModifier: 'traditional Gujarati regional attire with Bandhani prints and mirror work, festive Navratri aesthetic',
        previewColor: 'bg-red-600',
        thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'maharashtrian-costume',
        name: 'Maharashtrian',
        isCostume: true,
        description: 'Nauvari saree and traditional jewelry.',
        promptModifier: 'traditional Maharashtrian regional attire with Marathi heritage jewelry and authentic drape',
        previewColor: 'bg-purple-700',
        thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'goan-costume',
        name: 'Goan',
        isCostume: true,
        description: 'Kunbi saree and floral patterns.',
        promptModifier: 'traditional Goan regional coastal attire with distinct checks and Indo-Portuguese Goan aesthetic',
        previewColor: 'bg-sky-400',
        thumbnail: 'https://images.unsplash.com/photo-1542442828-287217bfb87f?q=80&w=400&auto=format&fit=crop'
      }
    ]
  },
  {
    name: '🌾 East India',
    styles: [
      {
        id: 'bengali-costume',
        name: 'Bengali',
        isCostume: true,
        description: 'White saree with red border, traditional jewelry.',
        promptModifier: 'classic Bengali regional attire with Kolkata heritage aesthetic and traditional silk patterns',
        previewColor: 'bg-white',
        thumbnail: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'odia-costume',
        name: 'Odia',
        isCostume: true,
        description: 'Sambalpuri saree and ikat patterns.',
        promptModifier: 'traditional Odia regional attire with intricate Ikat handwoven patterns and Odisha culture aesthetic',
        previewColor: 'bg-red-800',
        thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'bihari-costume',
        name: 'Bihari',
        isCostume: true,
        description: 'Tussar silk saree in earthy tones.',
        promptModifier: 'traditional Bihari regional attire with Tussar silk textures and elegant heritage aesthetic',
        previewColor: 'bg-amber-100',
        thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'assamese-costume',
        name: 'Assamese',
        isCostume: true,
        description: 'Mekhela chador with woven motifs.',
        promptModifier: 'traditional Assamese regional attire with golden woven motifs and North-East Indian culture aesthetic',
        previewColor: 'bg-yellow-100',
        thumbnail: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=400&auto=format&fit=crop'
      }
    ]
  },
  {
    name: '🌴 South India',
    styles: [
      {
        id: 'tamil-costume',
        name: 'Tamil',
        isCostume: true,
        description: 'Kanchipuram silk saree and temple jewelry.',
        promptModifier: 'heavy Tamil regional attire with golden zari and regal South Indian temple jewelry aesthetic',
        previewColor: 'bg-emerald-700',
        thumbnail: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'kerala-costume',
        name: 'Kerala',
        isCostume: true,
        description: 'Kasavu saree, gold border, jasmine flowers.',
        promptModifier: 'traditional Kerala regional attire with gold borders and serene coastal South Indian aesthetic',
        previewColor: 'bg-amber-50',
        thumbnail: 'https://images.unsplash.com/photo-1544273677-c433136021d4?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'kannadiga-costume',
        name: 'Kannadiga',
        isCostume: true,
        description: 'Mysore silk saree and elegant gold jewelry.',
        promptModifier: 'luxurious Mysore regional attire with Karnataka heritage aesthetic and rich silk colors',
        previewColor: 'bg-purple-900',
        thumbnail: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'telangana-costume',
        name: 'Andhra / Telangana',
        isCostume: true,
        description: 'Gadwal or Pochampally silk saree.',
        promptModifier: 'traditional Telugu regional attire with Pochampally Ikat or Gadwal weaves and vibrant culture aesthetic',
        previewColor: 'bg-rose-700',
        thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=400&auto=format&fit=crop'
      }
    ]
  },
  {
    name: '🏔️ Northeast India',
    styles: [
      {
        id: 'naga-costume',
        name: 'Naga',
        isCostume: true,
        description: 'Handwoven shawls and bold tribal patterns.',
        promptModifier: 'traditional Naga regional tribal attire with Nagaland heritage shawls and bold patterns',
        previewColor: 'bg-red-900',
        thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'mizo-costume',
        name: 'Mizo',
        isCostume: true,
        description: 'Striped wrap garments and bright colors.',
        promptModifier: 'traditional Mizo regional attire with vibrant striped wrap garments and North-East tribal aesthetic',
        previewColor: 'bg-pink-500',
        thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'manipuri-costume',
        name: 'Manipuri',
        isCostume: true,
        description: 'Phanek with delicate embroidery.',
        promptModifier: 'traditional Manipuri regional attire with delicate hand-embroidery and authentic Manipur culture aesthetic',
        previewColor: 'bg-indigo-400',
        thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'arunachali-costume',
        name: 'Arunachali',
        isCostume: true,
        description: 'Layered tribal attire with intricate beads.',
        promptModifier: 'traditional Arunachali regional tribal attire with intricate colorful beads and diverse North-East heritage aesthetic',
        previewColor: 'bg-orange-900',
        thumbnail: 'https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=400&auto=format&fit=crop'
      }
    ]
  },
  {
    name: '🧕 Pan-Indian / Special Attire',
    styles: [
      {
        id: 'bridal-north-costume',
        name: 'North Indian Bridal',
        isCostume: true,
        recommendedFor: 'female',
        description: 'Red lehenga and heavy gold jewelry.',
        promptModifier: 'luxurious North Indian bridal attire with heavy Zardozi embroidery and opulent wedding aesthetic',
        previewColor: 'bg-red-700',
        thumbnail: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'bridal-south-costume',
        name: 'South Indian Bridal',
        isCostume: true,
        recommendedFor: 'female',
        description: 'Silk saree and temple jewelry.',
        promptModifier: 'traditional South Indian bridal attire with temple gold jewelry and divine wedding aesthetic',
        previewColor: 'bg-amber-600',
        thumbnail: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'classical-dance-costume',
        name: 'Classical Dance',
        isCostume: true,
        description: 'Bharatanatyam or Kathak costume.',
        promptModifier: 'authentic Indian classical dance costume (Bharatanatyam or Kathak) with traditional silk and expressive movement aesthetic',
        previewColor: 'bg-purple-600',
        thumbnail: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=400&auto=format&fit=crop'
      },
      {
        id: 'maharaja-costume',
        name: 'Royal Maharaja',
        isCostume: true,
        recommendedFor: 'male',
        description: 'Sherwani, turban, and regal accessories.',
        promptModifier: 'regal Royal Maharaja attire with heavy gold embroidery, safa, and authoritative heritage aesthetic',
        previewColor: 'bg-blue-900',
        thumbnail: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop'
      }
    ]
  }
];

// --- STRIPE CONFIGURATION ---
export const STRIPE_PUBLISHABLE_KEY = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || '';

// Google Apps Script Web App URL for Enterprise Sales Form
export const APPS_SCRIPT_WEB_APP_URL = (import.meta as any).env.VITE_APPS_SCRIPT_URL || '';

// Support contact email
export const SUPPORT_EMAIL = (import.meta as any).env.VITE_SUPPORT_EMAIL || '';
