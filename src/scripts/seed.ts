// Debug environment variables
console.log('Current working directory:', process.cwd());
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Present' : 'Missing');

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined. Please check your .env.local file');
  process.exit(1);
}

const products = [
  // Rice
  {
    name: 'India Gate Basmati Rice',
    description: 'Premium quality basmati rice, aged for perfect texture and aroma',
    pricePerKg: 1299,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'rice',
    image: 'https://placehold.co/400x300?text=India+Gate+Rice',
    brand: 'India Gate',
    stock: Math.floor(Math.random() * 50) + 10,
    isFeatured: true
  },
  {
    name: 'Daawat Basmati Rice',
    description: 'Extra long grain basmati rice with rich aroma',
    pricePerKg: 1199,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'rice',
    image: 'https://placehold.co/400x300?text=Daawat+Rice',
    brand: 'Daawat',
    stock: Math.floor(Math.random() * 50) + 10,
    isFeatured: true
  },
  {
    name: 'Fortune Basmati Rice',
    description: 'Pure basmati rice with excellent cooking quality',
    pricePerKg: 1099,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'rice',
    image: 'https://placehold.co/400x300?text=Fortune+Rice',
    brand: 'Fortune',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'India Gate Brown Rice',
    description: 'Healthy brown rice with natural fiber',
    pricePerKg: 899,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'rice',
    image: 'https://placehold.co/400x300?text=Brown+Rice',
    brand: 'India Gate',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Tata Sampann Unpolished Rice',
    description: 'Unpolished rice with natural nutrients',
    pricePerKg: 999,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'rice',
    image: 'https://placehold.co/400x300?text=Unpolished+Rice',
    brand: 'Tata Sampann',
    stock: Math.floor(Math.random() * 50) + 10
  },

  // Flour
  {
    name: 'Aashirvaad Atta',
    description: 'Premium quality whole wheat flour',
    pricePerKg: 399,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'flour',
    image: 'https://placehold.co/400x300?text=Aashirvaad+Atta',
    brand: 'Aashirvaad',
    stock: Math.floor(Math.random() * 50) + 10,
    isFeatured: true
  },
  {
    name: 'Pillsbury Chakki Fresh Atta',
    description: 'Freshly milled whole wheat flour',
    pricePerKg: 449,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'flour',
    image: 'https://placehold.co/400x300?text=Pillsbury+Atta',
    brand: 'Pillsbury',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Aashirvaad Multigrain Atta',
    description: 'Multigrain flour with 6 grains',
    pricePerKg: 499,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'flour',
    image: 'https://placehold.co/400x300?text=Multigrain+Atta',
    brand: 'Aashirvaad',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Tata Sampann Besan',
    description: 'Premium quality gram flour',
    pricePerKg: 149,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'flour',
    image: 'https://placehold.co/400x300?text=Besan',
    brand: 'Tata Sampann',
    stock: Math.floor(Math.random() * 50) + 10
  },

  // Pulses
  {
    name: 'Tata Sampann Toor Dal',
    description: 'Premium quality toor dal',
    pricePerKg: 199,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'pulses',
    image: 'https://placehold.co/400x300?text=Toor+Dal',
    brand: 'Tata Sampann',
    stock: Math.floor(Math.random() * 50) + 10,
    isFeatured: true
  },
  {
    name: 'Fortune Chana Dal',
    description: 'High quality split chickpeas',
    pricePerKg: 179,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'pulses',
    image: 'https://placehold.co/400x300?text=Chana+Dal',
    brand: 'Fortune',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Tata Sampann Moong Dal',
    description: 'Premium quality split green gram',
    pricePerKg: 189,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'pulses',
    image: 'https://placehold.co/400x300?text=Moong+Dal',
    brand: 'Tata Sampann',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Fortune Urad Dal',
    description: 'Premium quality black gram',
    pricePerKg: 209,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'pulses',
    image: 'https://placehold.co/400x300?text=Urad+Dal',
    brand: 'Fortune',
    stock: Math.floor(Math.random() * 50) + 10
  },

  // Oil
  {
    name: 'Fortune Sunflower Oil',
    description: 'Pure sunflower oil, 1L bottle',
    pricePerKg: 0,
    pricePerPiece: 199,
    isPieceProduct: true,
    category: 'oil',
    image: 'https://placehold.co/400x300?text=Sunflower+Oil',
    brand: 'Fortune',
    stock: Math.floor(Math.random() * 50) + 10,
    isFeatured: true
  },
  {
    name: 'Saffola Gold Oil',
    description: 'Blended edible oil, 1L bottle',
    pricePerKg: 0,
    pricePerPiece: 219,
    isPieceProduct: true,
    category: 'oil',
    image: 'https://placehold.co/400x300?text=Saffola+Oil',
    brand: 'Saffola',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Fortune Rice Bran Oil',
    description: 'Healthy rice bran oil, 1L bottle',
    pricePerKg: 0,
    pricePerPiece: 189,
    isPieceProduct: true,
    category: 'oil',
    image: 'https://placehold.co/400x300?text=Rice+Bran+Oil',
    brand: 'Fortune',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Saffola Active Oil',
    description: 'Blended oil with antioxidants, 1L bottle',
    pricePerKg: 0,
    pricePerPiece: 229,
    isPieceProduct: true,
    category: 'oil',
    image: 'https://placehold.co/400x300?text=Active+Oil',
    brand: 'Saffola',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Fortune Mustard Oil',
    description: 'Pure mustard oil, 1L bottle',
    pricePerKg: 0,
    pricePerPiece: 179,
    isPieceProduct: true,
    category: 'oil',
    image: 'https://placehold.co/400x300?text=Mustard+Oil',
    brand: 'Fortune',
    stock: Math.floor(Math.random() * 50) + 10
  },

  // Essentials
  {
    name: 'Tata Salt',
    description: 'Iodized salt',
    pricePerKg: 20,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'essentials',
    image: 'https://placehold.co/400x300?text=Tata+Salt',
    brand: 'Tata',
    stock: Math.floor(Math.random() * 50) + 10,
    isFeatured: true
  },
  {
    name: 'Tata Tea Premium',
    description: 'Premium tea leaves',
    pricePerKg: 299,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'essentials',
    image: 'https://placehold.co/400x300?text=Tata+Tea',
    brand: 'Tata',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Tata Sampann Turmeric Powder',
    description: 'Pure turmeric powder',
    pricePerKg: 149,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'essentials',
    image: 'https://placehold.co/400x300?text=Turmeric',
    brand: 'Tata Sampann',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Tata Sampann Red Chilli Powder',
    description: 'Pure red chilli powder',
    pricePerKg: 129,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'essentials',
    image: 'https://placehold.co/400x300?text=Chilli+Powder',
    brand: 'Tata Sampann',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Tata Sampann Coriander Powder',
    description: 'Pure coriander powder',
    pricePerKg: 139,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'essentials',
    image: 'https://placehold.co/400x300?text=Coriander',
    brand: 'Tata Sampann',
    stock: Math.floor(Math.random() * 50) + 10
  },

  // New Items
  {
    name: 'Tata Sampann Cumin Powder',
    description: 'Pure cumin powder',
    pricePerKg: 159,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'essentials',
    image: 'https://placehold.co/400x300?text=Cumin',
    brand: 'Tata Sampann',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Tata Sampann Garam Masala',
    description: 'Premium garam masala blend',
    pricePerKg: 169,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'essentials',
    image: 'https://placehold.co/400x300?text=Garam+Masala',
    brand: 'Tata Sampann',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Tata Sampann Black Pepper',
    description: 'Whole black pepper',
    pricePerKg: 199,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'essentials',
    image: 'https://placehold.co/400x300?text=Black+Pepper',
    brand: 'Tata Sampann',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Tata Sampann Cinnamon',
    description: 'Pure cinnamon sticks',
    pricePerKg: 249,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'essentials',
    image: 'https://placehold.co/400x300?text=Cinnamon',
    brand: 'Tata Sampann',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Tata Sampann Cardamom',
    description: 'Premium green cardamom',
    pricePerKg: 299,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'essentials',
    image: 'https://placehold.co/400x300?text=Cardamom',
    brand: 'Tata Sampann',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Tata Sampann Cloves',
    description: 'Whole cloves',
    pricePerKg: 279,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'essentials',
    image: 'https://placehold.co/400x300?text=Cloves',
    brand: 'Tata Sampann',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Tata Sampann Bay Leaves',
    description: 'Dried bay leaves',
    pricePerKg: 189,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'essentials',
    image: 'https://placehold.co/400x300?text=Bay+Leaves',
    brand: 'Tata Sampann',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Tata Sampann Fennel Seeds',
    description: 'Whole fennel seeds',
    pricePerKg: 169,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'essentials',
    image: 'https://placehold.co/400x300?text=Fennel',
    brand: 'Tata Sampann',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Tata Sampann Fenugreek Seeds',
    description: 'Whole fenugreek seeds',
    pricePerKg: 149,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'essentials',
    image: 'https://placehold.co/400x300?text=Fenugreek',
    brand: 'Tata Sampann',
    stock: Math.floor(Math.random() * 50) + 10
  },
  {
    name: 'Tata Sampann Mustard Seeds',
    description: 'Whole mustard seeds',
    pricePerKg: 129,
    pricePerPiece: 0,
    isPieceProduct: false,
    category: 'essentials',
    image: 'https://placehold.co/400x300?text=Mustard+Seeds',
    brand: 'Tata Sampann',
    stock: Math.floor(Math.random() * 50) + 10
  }
];

async function seedProducts() {
  for (const product of products) {
    const res = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    const data = await res.json();
    console.log(data);
  }
}

seedProducts(); 