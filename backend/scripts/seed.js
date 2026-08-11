const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Cafe = require('../models/Cafe');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Rating = require('../models/Rating');

// Load environment variables from backend directory
dotenv.config({ path: path.join(__dirname, '../.env') });

// Category-based image map for Mayuri menu
const IMGS = {
  tandoor: 'https://images.unsplash.com/photo-1599487488155-062d9085ca1f?auto=format&fit=crop&w=600&q=80',
  paneerCurry: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
  dalCurry: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
  juice: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80',
  noodles: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
  pasta: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80',
  pizza: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80',
  sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
  roti: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
  roll: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=600&q=80',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
  hotdog: 'https://images.unsplash.com/photo-1619740455993-9d54c2e1da28?auto=format&fit=crop&w=600&q=80',
  shake: 'https://images.unsplash.com/photo-1568901839119-631418a3910d?auto=format&fit=crop&w=600&q=80',
  coldcoffee: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=600&q=80',
  momo: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
  mocktail: 'https://images.unsplash.com/photo-1560508180-03f285f67ded?auto=format&fit=crop&w=600&q=80',
  hotbev: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
  chaat: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
  rice: 'https://images.unsplash.com/photo-1536304993881-ff86e0c9ef1a?auto=format&fit=crop&w=600&q=80',
  combo: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80',
  icecream: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
  water: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=600&q=80',
  bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  specialbev: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
  // Bistro
  fries: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=600&q=80',
  iced: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
  // AB Dakshin
  dosa: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
  idli: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
  filtercoffee: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
  lemon: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
};

const seedData = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus_bites';
    console.log(`Connecting to database: ${connStr}`);
    await mongoose.connect(connStr);

    console.log('Clearing existing collections...');
    await User.deleteMany();
    await Cafe.deleteMany();
    await MenuItem.deleteMany();
    await Order.deleteMany();
    await Payment.deleteMany();
    await Rating.deleteMany();
    console.log('Database cleared.');

    // ── 1. Seed Cafes ────────────────────────────────────────────────────────
    console.log('Seeding Cafés...');
    const cafes = await Cafe.create([
      {
        name: 'Mayuri - Special Block',
        slug: 'mayuri-special-block',
        description: 'Fresh • Fast • Campus Favourite. Tandoor snacks, North Indian mains, international dishes, shakes & more.',
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
        location: 'Special Block',
        isActive: true,
      },
      {
        name: 'Bistro',
        slug: 'bistro',
        description: 'Pizzas • Pastas • Burgers • Chinese • Wraps • Coffee & Desserts. VIT’s most diverse campus café.',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        location: 'Special Block',
        isActive: true,
      },
      {
        name: 'AB Dakshin',
        slug: 'ab-dakshin',
        description: 'Dosas • Idlis • Chicken Curries & Tikka • Biryanis • Chaat • Juices & Shakes. A complete multi-cuisine hub.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
        location: 'Special Block',
        isActive: true,
      },
      {
        name: 'Mayuri',
        slug: 'mayuri',
        description: 'Samosas, chaat, combos, South Indian snacks, fries, sweet lassi and milkshakes.',
        image: '/mayuri_ab1.jpg',
        location: 'Near Academic Block 1',
        isActive: true,
      },
      {
        name: 'Underbelly',
        slug: 'underbelly',
        description: 'Delicious chicken tikka sandwiches, egg bhurji, nachos, penne pasta, and rich Nutella shakes.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        location: 'Near Academic Block 1',
        isActive: true,
      },
    ]);

    const [mayuri, bistro, abDakshin, mayuriCafe, underbelly] = cafes;
    console.log(`Seeded ${cafes.length} cafés.`);

    // ── 2. Seed Menu Items ───────────────────────────────────────────────────
    console.log('Seeding Menu Items...');
    const menuItems = [

      // ════════════════════════════════════════════════════
      //  MAYURI — Full Menu
      // ════════════════════════════════════════════════════

      // Tandoor Snacks
      { cafeId: mayuri._id, name: 'Soya Malai Tikka', description: 'Marinated soya chunks grilled in a clay tandoor with malai cream and spices', category: 'Tandoor Snacks', price: 160, image: IMGS.tandoor, isVeg: true },
      { cafeId: mayuri._id, name: 'Paneer Malai Tikka', description: 'Soft paneer marinated in creamy malai and spices, grilled to perfection in tandoor', category: 'Tandoor Snacks', price: 180, image: IMGS.tandoor, isVeg: true },
      { cafeId: mayuri._id, name: 'Paneer Masala Tikka', description: 'Paneer cubes marinated in spicy masala and grilled in tandoor', category: 'Tandoor Snacks', price: 180, image: IMGS.tandoor, isVeg: true },
      { cafeId: mayuri._id, name: 'Soya Masala Tikka', description: 'Spicy masala marinated soya chunks grilled over live tandoor coals', category: 'Tandoor Snacks', price: 160, image: IMGS.tandoor, isVeg: true },
      { cafeId: mayuri._id, name: 'Tandoori Platter', description: 'Assorted tandoor grills — paneer tikka, soya tikka & mint chutney', category: 'Tandoor Snacks', price: 220, image: IMGS.tandoor, isVeg: true },

      // Veg Tables (Curries)
      { cafeId: mayuri._id, name: 'Paneer Butter Masala', description: 'Rich, creamy tomato-cashew gravy with soft paneer cubes and aromatic spices', category: 'Veg Tables', price: 150, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: mayuri._id, name: 'Kadai Paneer', description: 'Paneer cooked with bell peppers, onions and kadai masala in a dry-style gravy', category: 'Veg Tables', price: 170, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: mayuri._id, name: 'Paneer Lababdar', description: 'Paneer simmered in a rich onion-tomato gravy with cream and whole spices', category: 'Veg Tables', price: 170, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: mayuri._id, name: 'Paneer Tikka Masala', description: 'Grilled paneer tikka tossed in a vibrant spiced tomato-onion masala', category: 'Veg Tables', price: 190, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: mayuri._id, name: 'Seasonal Veg', description: 'Fresh seasonal vegetables cooked with Indian spices and herbs', category: 'Veg Tables', price: 120, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: mayuri._id, name: 'Dal Fry', description: 'Yellow lentils tempered with cumin, garlic and fresh coriander', category: 'Veg Tables', price: 110, image: IMGS.dalCurry, isVeg: true },
      { cafeId: mayuri._id, name: 'Dal Tadka', description: 'Slow-cooked lentils finished with a smoky tadka of ghee and whole spices', category: 'Veg Tables', price: 120, image: IMGS.dalCurry, isVeg: true },
      { cafeId: mayuri._id, name: 'Dal Makhani', description: 'Black lentils slow-cooked overnight with butter, cream and aromatic spices', category: 'Veg Tables', price: 140, image: IMGS.dalCurry, isVeg: true },

      // Juice
      { cafeId: mayuri._id, name: 'Pineapple Juice', description: 'Chilled freshly pressed pineapple juice with a hint of black salt', category: 'Juice', price: 100, image: IMGS.juice, isVeg: true },
      { cafeId: mayuri._id, name: 'Water Melon Seasonal', description: 'Fresh seasonal watermelon blended to a smooth refreshing chilled juice', category: 'Juice', price: 100, image: IMGS.juice, isVeg: true },
      { cafeId: mayuri._id, name: 'Mixfruit Juice', description: 'A medley of seasonal fresh fruits blended into a vibrant chilled juice', category: 'Juice', price: 120, image: IMGS.juice, isVeg: true },
      { cafeId: mayuri._id, name: 'Orange Juice', description: 'Freshly squeezed sweet orange juice served chilled', category: 'Juice', price: 100, image: IMGS.juice, isVeg: true },

      // International
      { cafeId: mayuri._id, name: 'Chilli Paneer', description: 'Crispy paneer tossed with capsicum, onions and Indo-Chinese chilli sauce', category: 'International', price: 160, image: IMGS.noodles, isVeg: true },
      { cafeId: mayuri._id, name: 'Veg Noodles', description: 'Stir-fried noodles with fresh vegetables in a savory soy-based sauce', category: 'International', price: 110, image: IMGS.noodles, isVeg: true },
      { cafeId: mayuri._id, name: 'Veg Hakka Noodles', description: 'Classic Hakka noodles tossed with veggies and light soy sauce', category: 'International', price: 130, image: IMGS.noodles, isVeg: true },
      { cafeId: mayuri._id, name: 'Schezwan Noodles', description: 'Fiery Schezwan sauce tossed noodles with crunchy vegetables', category: 'International', price: 130, image: IMGS.noodles, isVeg: true },
      { cafeId: mayuri._id, name: 'Arrabiata Pasta (Red)', description: 'Spicy Italian red sauce pasta with garlic, chili and fresh tomatoes', category: 'International', price: 160, image: IMGS.pasta, isVeg: true },
      { cafeId: mayuri._id, name: 'Alfredo Pasta (White)', description: 'Creamy white sauce pasta with broccoli, sweet corn and herbs', category: 'International', price: 170, image: IMGS.pasta, isVeg: true },
      { cafeId: mayuri._id, name: 'Aglio Olio Pasta', description: 'Classic Italian garlic and olive oil pasta with chili flakes and parmesan', category: 'International', price: 220, image: IMGS.pasta, isVeg: true },
      { cafeId: mayuri._id, name: 'Farmhouse Pizza', description: 'Loaded with capsicum, onion, tomato and fresh mushrooms on thin crust', category: 'International', price: 160, image: IMGS.pizza, isVeg: true },
      { cafeId: mayuri._id, name: 'Tandoori Paneer Pizza', description: 'Tandoori marinated paneer with onions and peppers on a crisp pizza base', category: 'International', price: 190, image: IMGS.pizza, isVeg: true },
      { cafeId: mayuri._id, name: 'Cheese Corn Tomato Pizza', description: 'Double cheese topped pizza with sweet corn and fresh tomatoes', category: 'International', price: 170, image: IMGS.pizza, isVeg: true },
      { cafeId: mayuri._id, name: 'Quesadilla', description: 'Crispy folded tortilla stuffed with cheese, peppers and spiced paneer', category: 'International', price: 180, image: IMGS.sandwich, isVeg: true },

      // Sandwich
      { cafeId: mayuri._id, name: 'Veg Loaded Sandwich', description: 'Grilled sandwich packed with fresh veggies, cheese and special mayo', category: 'Sandwich', price: 110, image: IMGS.sandwich, isVeg: true },
      { cafeId: mayuri._id, name: 'Corn Paneer Tikka Sandwich', description: 'Spiced corn and paneer tikka filled sandwich, grilled in butter', category: 'Sandwich', price: 130, image: IMGS.sandwich, isVeg: true },
      { cafeId: mayuri._id, name: 'Veg Club Sandwich', description: 'Triple decker toast with cucumber, tomato, potato and cheese slice', category: 'Sandwich', price: 140, image: IMGS.sandwich, isVeg: true },

      // Roti / Bread
      { cafeId: mayuri._id, name: 'Tandoori Roti', description: 'Whole wheat flatbread baked fresh in a clay tandoor oven', category: 'Roti', price: 30, image: IMGS.roti, isVeg: true },
      { cafeId: mayuri._id, name: 'Butter Tandoori Roti', description: 'Freshly baked tandoor roti finished with a generous brush of butter', category: 'Roti', price: 35, image: IMGS.roti, isVeg: true },
      { cafeId: mayuri._id, name: 'Naan', description: 'Soft leavened bread baked in tandoor — the classic accompaniment', category: 'Roti', price: 40, image: IMGS.roti, isVeg: true },
      { cafeId: mayuri._id, name: 'Butter Naan', description: 'Fluffy tandoor-baked naan finished with rich butter and coriander', category: 'Roti', price: 45, image: IMGS.roti, isVeg: true },
      { cafeId: mayuri._id, name: 'Butter Kulchha', description: 'Soft kulchha bread baked in tandoor and coated in butter', category: 'Roti', price: 50, image: IMGS.roti, isVeg: true },
      { cafeId: mayuri._id, name: 'Stuffed Kulchha', description: 'Kulchha stuffed with spiced potato and onion filling, baked in tandoor', category: 'Roti', price: 50, image: IMGS.roti, isVeg: true },
      { cafeId: mayuri._id, name: 'Garlic Naan', description: 'Buttery naan topped with freshly chopped garlic and coriander', category: 'Roti', price: 50, image: IMGS.roti, isVeg: true },

      // Roll / Wrap
      { cafeId: mayuri._id, name: 'Soya Protein Roll', description: 'High-protein soya chunks wrapped in a soft roti with veggies and chutney', category: 'Roll/Wrap', price: 100, image: IMGS.roll, isVeg: true },
      { cafeId: mayuri._id, name: 'Mexican Roll', description: 'Spicy Mexican-style filling with beans, cheese and salsa in a soft wrap', category: 'Roll/Wrap', price: 140, image: IMGS.roll, isVeg: true },
      { cafeId: mayuri._id, name: 'Paneer Makhani Roll', description: 'Paneer coated in rich makhani sauce wrapped in a fresh hot roti', category: 'Roll/Wrap', price: 140, image: IMGS.roll, isVeg: true },

      // Burger / Hotdog
      { cafeId: mayuri._id, name: 'Veg Classic Burger', description: 'Crispy veg patty with fresh lettuce, tomato and special sauce in a bun', category: 'Burger/Hotdog', price: 80, image: IMGS.burger, isVeg: true },
      { cafeId: mayuri._id, name: 'Barbeque Paneer Burger', description: 'Smoky BBQ grilled paneer patty with cheese and crunchy coleslaw', category: 'Burger/Hotdog', price: 120, image: IMGS.burger, isVeg: true },
      { cafeId: mayuri._id, name: 'Hotdog', description: 'Warm hotdog bun with a veg sausage, mustard and ketchup', category: 'Burger/Hotdog', price: 100, image: IMGS.hotdog, isVeg: true },
      { cafeId: mayuri._id, name: 'Paneer Cheese Hotdog', description: 'Hotdog bun stuffed with spiced paneer and melted cheese', category: 'Burger/Hotdog', price: 120, image: IMGS.hotdog, isVeg: true },
      { cafeId: mayuri._id, name: 'UB Burger', description: 'Mayuri special stacked burger with double patty, cheese and fresh toppings', category: 'Burger/Hotdog', price: 130, image: IMGS.burger, isVeg: true },

      // Shake
      { cafeId: mayuri._id, name: 'Kitkat Shake', description: 'Thick creamy milkshake blended with Kit Kat chocolate wafers', category: 'Shake', price: 90, image: IMGS.shake, isVeg: true },
      { cafeId: mayuri._id, name: 'Cold Coffee', description: 'Classic chilled coffee blended with ice cream and milk', category: 'Shake', price: 80, image: IMGS.coldcoffee, isVeg: true },
      { cafeId: mayuri._id, name: 'Cold Coffee With Ice Cream', description: 'Rich cold coffee served with a generous scoop of vanilla ice cream', category: 'Shake', price: 90, image: IMGS.coldcoffee, isVeg: true },
      { cafeId: mayuri._id, name: 'Iced Cold Coffee', description: 'Smooth cold coffee served over crushed ice — refreshing and bold', category: 'Shake', price: 90, image: IMGS.coldcoffee, isVeg: true },
      { cafeId: mayuri._id, name: 'Black Current Shake', description: 'Creamy milkshake with bold black currant flavor and crushed ice', category: 'Shake', price: 70, image: IMGS.shake, isVeg: true },
      { cafeId: mayuri._id, name: 'Rose Shake', description: 'Refreshing chilled milkshake infused with rose syrup and cold milk', category: 'Shake', price: 70, image: IMGS.shake, isVeg: true },
      { cafeId: mayuri._id, name: 'Oreo Milk Shake', description: 'Thick creamy shake blended with Oreo cookies and vanilla ice cream', category: 'Shake', price: 100, image: IMGS.shake, isVeg: true },
      { cafeId: mayuri._id, name: 'Peanut Butter Shake', description: 'Rich and nutty peanut butter blended with banana and cold milk', category: 'Shake', price: 100, image: IMGS.shake, isVeg: true },
      { cafeId: mayuri._id, name: 'Hazelnut Chocolate Shake', description: 'Creamy hazelnut and chocolate milkshake with a swirl of chocolate sauce', category: 'Shake', price: 120, image: IMGS.shake, isVeg: true },
      { cafeId: mayuri._id, name: 'Belgian Chocolate Shake', description: 'Indulgent thick shake made with premium Belgian chocolate and ice cream', category: 'Shake', price: 120, image: IMGS.shake, isVeg: true },

      // Momos
      { cafeId: mayuri._id, name: 'Veg Momo', description: 'Steamed dumplings stuffed with spiced vegetables and served with chili sauce', category: 'Momos', price: 100, image: IMGS.momo, isVeg: true },
      { cafeId: mayuri._id, name: 'Paneer Momo', description: 'Steamed dumplings filled with spiced crumbled paneer', category: 'Momos', price: 120, image: IMGS.momo, isVeg: true },
      { cafeId: mayuri._id, name: 'Veg Kurkure Momo', description: 'Crispy fried momos coated in a crunchy batter with spicy dip', category: 'Momos', price: 150, image: IMGS.momo, isVeg: true },
      { cafeId: mayuri._id, name: 'Veg Fried Momo', description: 'Pan-fried vegetable dumplings with a golden crispy bottom', category: 'Momos', price: 120, image: IMGS.momo, isVeg: true },
      { cafeId: mayuri._id, name: 'Paneer Fried Momo', description: 'Pan-fried paneer stuffed dumplings with a golden crispy crust', category: 'Momos', price: 130, image: IMGS.momo, isVeg: true },

      // Mocktail
      { cafeId: mayuri._id, name: 'Cold Drink', description: 'Chilled bottled cold drink — Pepsi, 7Up or Mirinda (subject to availability)', category: 'Mocktail', price: 35, image: IMGS.mocktail, isVeg: true },
      { cafeId: mayuri._id, name: 'Mint Mojito', description: 'Refreshing classic mocktail with fresh mint, lime and sparkling soda', category: 'Mocktail', price: 70, image: IMGS.mocktail, isVeg: true },
      { cafeId: mayuri._id, name: 'Blue Curacao', description: 'Vibrant blue citrus mocktail with lemonade, soda and blue curacao syrup', category: 'Mocktail', price: 70, image: IMGS.mocktail, isVeg: true },
      { cafeId: mayuri._id, name: 'Pink Panther', description: 'Pretty pink mocktail with strawberry, lychee and rose syrup over ice', category: 'Mocktail', price: 90, image: IMGS.mocktail, isVeg: true },
      { cafeId: mayuri._id, name: 'Bali Beach', description: 'Tropical blend of passion fruit, mango and coconut cream over crushed ice', category: 'Mocktail', price: 90, image: IMGS.mocktail, isVeg: true },

      // Special Beverages
      { cafeId: mayuri._id, name: 'Basil Fusion Drink', description: 'Unique refreshing drink with fresh basil seeds, lime and chilled water', category: 'Special Beverages', price: 150, image: IMGS.specialbev, isVeg: true },
      { cafeId: mayuri._id, name: 'Bubble Tea', description: 'Creamy milk tea with chewy tapioca pearls — choose your flavor', category: 'Special Beverages', price: 150, image: IMGS.specialbev, isVeg: true },

      // Hot Beverages
      { cafeId: mayuri._id, name: 'Cappuccino', description: 'Classic Italian coffee with espresso, steamed milk and thick foam', category: 'Hot Beverages', price: 70, image: IMGS.hotbev, isVeg: true },
      { cafeId: mayuri._id, name: 'Expresso', description: 'Strong bold shot of freshly brewed espresso coffee', category: 'Hot Beverages', price: 70, image: IMGS.hotbev, isVeg: true },
      { cafeId: mayuri._id, name: 'Cafe Latte', description: 'Smooth espresso combined with generous steamed milk and light foam', category: 'Hot Beverages', price: 70, image: IMGS.hotbev, isVeg: true },

      // Chaat
      { cafeId: mayuri._id, name: 'Paneer Samosa Chaat', description: 'Crispy samosa topped with paneer, chutneys, yogurt and sev', category: 'Chaat', price: 40, image: IMGS.chaat, isVeg: true },
      { cafeId: mayuri._id, name: 'Aloo Mater Tikki', description: 'Golden potato tikki with green peas, topped with sweet and spicy chutneys', category: 'Chaat', price: 80, image: IMGS.chaat, isVeg: true },
      { cafeId: mayuri._id, name: 'Dahi Bhalla', description: 'Soft lentil dumplings soaked in chilled yogurt with tangy chutneys', category: 'Chaat', price: 80, image: IMGS.chaat, isVeg: true },
      { cafeId: mayuri._id, name: 'Jodhpuri Kachori', description: 'Flaky deep-fried kachori stuffed with spiced lentils — Jodhpur style', category: 'Chaat', price: 50, image: IMGS.chaat, isVeg: true },

      // Rice
      { cafeId: mayuri._id, name: 'Jeera Rice', description: 'Fragrant basmati rice tempered with cumin and ghee', category: 'Rice', price: 90, image: IMGS.rice, isVeg: true },
      { cafeId: mayuri._id, name: 'Mutter Rice', description: 'Light basmati rice cooked with green peas and mild spices', category: 'Rice', price: 110, image: IMGS.rice, isVeg: true },
      { cafeId: mayuri._id, name: 'Veg Pulao', description: 'Aromatic basmati rice cooked with mixed vegetables and whole spices', category: 'Rice', price: 130, image: IMGS.rice, isVeg: true },
      { cafeId: mayuri._id, name: 'Veg Biryani', description: 'Layered basmati rice with spiced vegetables, saffron and fried onions', category: 'Rice', price: 130, image: IMGS.rice, isVeg: true },
      { cafeId: mayuri._id, name: 'Plain Rice', description: 'Steamed fluffy plain basmati rice — the perfect accompaniment', category: 'Rice', price: 70, image: IMGS.rice, isVeg: true },

      // Combo
      { cafeId: mayuri._id, name: 'Chola + Kulchha', description: 'Spicy Amritsari chole served with two soft butter kulchhas', category: 'Combo', price: 180, image: IMGS.combo, isVeg: true },
      { cafeId: mayuri._id, name: 'Paratha + Curd', description: 'Soft whole wheat paratha served with fresh chilled curd', category: 'Combo', price: 120, image: IMGS.combo, isVeg: true },
      { cafeId: mayuri._id, name: 'Chola + Bhatura', description: 'Classic Punjabi chole with two puffed deep-fried bhaturas', category: 'Combo', price: 160, image: IMGS.combo, isVeg: true },
      { cafeId: mayuri._id, name: 'Chola + Rice', description: 'Hearty chole curry served with steamed plain rice', category: 'Combo', price: 120, image: IMGS.combo, isVeg: true },
      { cafeId: mayuri._id, name: 'Paneer + Kulchha', description: 'Rich paneer curry served with freshly baked kulchha bread', category: 'Combo', price: 200, image: IMGS.combo, isVeg: true },
      { cafeId: mayuri._id, name: 'Butter Khichdi', description: 'Comforting rice and lentil khichdi cooked with butter and mild spices', category: 'Combo', price: 120, image: IMGS.rice, isVeg: true },
      { cafeId: mayuri._id, name: 'Masala Butter Khichdi', description: 'Flavourful spiced khichdi with butter, vegetables and aromatic masala', category: 'Combo', price: 150, image: IMGS.rice, isVeg: true },

      // MRP Items (price = 0, isMRP = true — cannot add to cart)
      { cafeId: mayuri._id, name: 'Ice Cream', description: 'Assorted flavors of chilled ice cream cups — at MRP', category: 'MRP Items', price: 0, isMRP: true, image: IMGS.icecream, isVeg: true, isAvailable: true },
      { cafeId: mayuri._id, name: 'Bakery Product', description: 'Freshly sourced bakery biscuits and snack packs — at MRP', category: 'MRP Items', price: 0, isMRP: true, image: IMGS.bakery, isVeg: true, isAvailable: true },
      { cafeId: mayuri._id, name: 'Water Bottle', description: '1L / 500ml chilled mineral water bottles — at MRP', category: 'MRP Items', price: 0, isMRP: true, image: IMGS.water, isVeg: true, isAvailable: true },
      { cafeId: mayuri._id, name: 'Curd', description: 'Fresh chilled curd cup — at MRP', category: 'MRP Items', price: 0, isMRP: true, image: IMGS.combo, isVeg: true, isAvailable: true },

      // ════════════════════════════════════════════════════
      //  BISTRO — Full Real Menu
      // ════════════════════════════════════════════════════

      // Pizza
      { cafeId: bistro._id, name: 'Margherita Pizza', description: 'Classic thin-crust pizza with rich tomato sauce and melted mozzarella cheese', category: 'Pizza', price: 110, image: IMGS.pizza, isVeg: true },
      { cafeId: bistro._id, name: 'Onion Pizza', description: 'Thin-crust pizza loaded with caramelized onions and mozzarella cheese', category: 'Pizza', price: 130, image: IMGS.pizza, isVeg: true },
      { cafeId: bistro._id, name: 'Corn And Cheese Pizza', description: 'Sweet corn and double cheese on a crispy tomato base', category: 'Pizza', price: 130, image: IMGS.pizza, isVeg: true },
      { cafeId: bistro._id, name: 'Jalapeno Cheese Pizza', description: 'Spicy jalapeno slices with extra cheese on a zesty tomato base', category: 'Pizza', price: 145, image: IMGS.pizza, isVeg: true },
      { cafeId: bistro._id, name: 'Three Cheese Pizza', description: 'Triple cheese blend of mozzarella, cheddar and parmesan on a thin crust', category: 'Pizza', price: 155, image: IMGS.pizza, isVeg: true },
      { cafeId: bistro._id, name: 'Paneer Makhani Pizza', description: 'Creamy makhani sauce base with paneer tikka chunks and bell peppers', category: 'Pizza', price: 175, image: IMGS.pizza, isVeg: true },
      { cafeId: bistro._id, name: 'Farm To Table Pizza', description: 'Fresh seasonal vegetables on a herbed tomato base with mozzarella', category: 'Pizza', price: 165, image: IMGS.pizza, isVeg: true },
      { cafeId: bistro._id, name: 'Chicken Makhani Pizza', description: 'Tender chicken in rich makhani sauce with capsicum and cheese', category: 'Pizza', price: 175, image: IMGS.pizza, isVeg: false },
      { cafeId: bistro._id, name: 'Chicken Pepperoni Pizza', description: 'Sliced pepperoni with mozzarella and spicy tomato sauce on thin crust', category: 'Pizza', price: 180, image: IMGS.pizza, isVeg: false },
      { cafeId: bistro._id, name: 'Hot N Spicy Seekh Pizza', description: 'Spiced seekh kebab crumbles with onions and peppers on a hot sauce base', category: 'Pizza', price: 180, image: IMGS.pizza, isVeg: false },
      { cafeId: bistro._id, name: 'Chicken Sausage Pizza', description: 'Sliced chicken sausage with mushrooms and cheese on a tomato base', category: 'Pizza', price: 180, image: IMGS.pizza, isVeg: false },
      { cafeId: bistro._id, name: 'Chicken Loaded Pizza', description: 'Fully loaded pizza with double chicken, veggies and three cheese blend', category: 'Pizza', price: 205, image: IMGS.pizza, isVeg: false },

      // Pasta
      { cafeId: bistro._id, name: 'Chipotle Mac N Cheese (Veg)', description: 'Smoky chipotle flavored mac and cheese with mixed vegetables', category: 'Pasta', price: 150, image: IMGS.pasta, isVeg: true },
      { cafeId: bistro._id, name: 'Makhni Mac N Cheese (Veg)', description: 'Rich makhani sauce mac and cheese with paneer chunks', category: 'Pasta', price: 150, image: IMGS.pasta, isVeg: true },
      { cafeId: bistro._id, name: 'Tandoori Mac N Cheese (Veg)', description: 'Tandoori spiced mac and cheese with grilled vegetables', category: 'Pasta', price: 150, image: IMGS.pasta, isVeg: true },
      { cafeId: bistro._id, name: 'Alfredo Penne/Spaghetti (Veg)', description: 'Classic creamy white Alfredo sauce with penne pasta and fresh herbs', category: 'Pasta', price: 150, image: IMGS.pasta, isVeg: true },
      { cafeId: bistro._id, name: 'Arrabbiata Penne/Spaghetti (Veg)', description: 'Spicy Italian red sauce penne with garlic and chili flakes', category: 'Pasta', price: 150, image: IMGS.pasta, isVeg: true },
      { cafeId: bistro._id, name: 'Tandoori Mac N Cheese (Chicken)', description: 'Tandoori spiced mac and cheese with grilled chicken pieces', category: 'Pasta', price: 180, image: IMGS.pasta, isVeg: false },
      { cafeId: bistro._id, name: 'Makhni Mac N Cheese (Chicken)', description: 'Mac and cheese in a rich makhani sauce with tender chicken', category: 'Pasta', price: 180, image: IMGS.pasta, isVeg: false },
      { cafeId: bistro._id, name: 'Chipotle Mac N Cheese (Chicken)', description: 'Smoky chipotle mac and cheese loaded with seasoned chicken', category: 'Pasta', price: 180, image: IMGS.pasta, isVeg: false },
      { cafeId: bistro._id, name: 'Alfredo Penne/Spaghetti (Chicken)', description: 'Creamy Alfredo pasta with tender grilled chicken and parmesan', category: 'Pasta', price: 180, image: IMGS.pasta, isVeg: false },
      { cafeId: bistro._id, name: 'Arrabbiata Penne/Spaghetti (Chicken)', description: 'Spicy red sauce pasta with succulent chicken pieces', category: 'Pasta', price: 180, image: IMGS.pasta, isVeg: false },

      // Chinese
      { cafeId: bistro._id, name: 'Veg Noodles (Veg)', description: 'Stir-fried noodles with fresh crunchy vegetables in a light soy sauce', category: 'Chinese', price: 110, image: IMGS.noodles, isVeg: true },
      { cafeId: bistro._id, name: 'Hakka Noodles (Veg)', description: 'Classic Hakka noodles tossed with mixed vegetables and soy sauce', category: 'Chinese', price: 110, image: IMGS.noodles, isVeg: true },
      { cafeId: bistro._id, name: 'Chilli Garlic Noodles (Veg)', description: 'Fiery noodles stir-fried with garlic, chili and fresh spring onions', category: 'Chinese', price: 125, image: IMGS.noodles, isVeg: true },
      { cafeId: bistro._id, name: 'Schezwan Noodles (Veg)', description: 'Bold Schezwan sauce tossed noodles with crunchy veggies', category: 'Chinese', price: 125, image: IMGS.noodles, isVeg: true },
      { cafeId: bistro._id, name: 'Veg Momo', description: 'Steamed vegetable dumplings served with tangy chili dipping sauce', category: 'Chinese', price: 130, image: IMGS.momo, isVeg: true },
      { cafeId: bistro._id, name: 'Crispy Corn', description: 'Golden crispy corn kernels tossed with chili, salt and herbs', category: 'Chinese', price: 130, image: IMGS.chaat, isVeg: true },
      { cafeId: bistro._id, name: 'Honey Chilli Potato', description: 'Crispy potato fingers tossed in a sweet and spicy honey chili sauce', category: 'Chinese', price: 140, image: IMGS.chaat, isVeg: true },
      { cafeId: bistro._id, name: 'Paneer Momo', description: 'Steamed paneer filled dumplings served with chili sauce', category: 'Chinese', price: 140, image: IMGS.momo, isVeg: true },
      { cafeId: bistro._id, name: 'Paneer Fried Rice', description: 'Fragrant fried rice with paneer cubes, veggies and soy sauce', category: 'Chinese', price: 150, image: IMGS.rice, isVeg: true },
      { cafeId: bistro._id, name: 'Chilli Paneer/Mushroom', description: 'Crispy paneer or mushroom tossed in Indo-Chinese chili garlic sauce', category: 'Chinese', price: 160, image: IMGS.noodles, isVeg: true },
      { cafeId: bistro._id, name: 'Veg Fried Rice', description: 'Wok-tossed basmati rice with mixed vegetables and light soy seasoning', category: 'Chinese', price: 110, image: IMGS.rice, isVeg: true },
      { cafeId: bistro._id, name: 'Veg Noodles (Non-Veg)', description: 'Stir-fried noodles with vegetables and egg in a savory sauce', category: 'Chinese', price: 150, image: IMGS.noodles, isVeg: false },
      { cafeId: bistro._id, name: 'Hakka Noodles (Non-Veg)', description: 'Classic Hakka noodles with chicken and mixed vegetables', category: 'Chinese', price: 150, image: IMGS.noodles, isVeg: false },
      { cafeId: bistro._id, name: 'Chicken Momo', description: 'Steamed chicken dumplings served with spicy chili dipping sauce', category: 'Chinese', price: 140, image: IMGS.momo, isVeg: false },
      { cafeId: bistro._id, name: 'Chilli Garlic Noodles (Non-Veg)', description: 'Fiery garlic chili noodles tossed with chicken strips', category: 'Chinese', price: 170, image: IMGS.noodles, isVeg: false },
      { cafeId: bistro._id, name: 'Schezwan Noodles (Non-Veg)', description: 'Bold Schezwan noodles with chicken and egg', category: 'Chinese', price: 170, image: IMGS.noodles, isVeg: false },
      { cafeId: bistro._id, name: 'Chilli Chicken', description: 'Crispy chicken pieces tossed in a spicy Indo-Chinese chili sauce', category: 'Chinese', price: 180, image: IMGS.noodles, isVeg: false },
      { cafeId: bistro._id, name: 'Chicken 65', description: 'Deep-fried spiced chicken tossed with curry leaves and green chilies', category: 'Chinese', price: 180, image: IMGS.noodles, isVeg: false },
      { cafeId: bistro._id, name: 'Chicken Fried Rice', description: 'Wok-tossed fried rice loaded with chicken, egg and vegetables', category: 'Chinese', price: 160, image: IMGS.rice, isVeg: false },

      // Wraps & Rolls
      { cafeId: bistro._id, name: 'Veg Potato Frankie', description: 'Spiced mashed potato filling rolled in a soft roti with chutneys', category: 'Wraps & Rolls', price: 120, image: IMGS.roll, isVeg: true },
      { cafeId: bistro._id, name: 'Aloo Frankie', description: 'Classic aloo masala wrapped in a fresh roti with onions and sauce', category: 'Wraps & Rolls', price: 120, image: IMGS.roll, isVeg: true },
      { cafeId: bistro._id, name: 'Aloo Schezwan Frankie', description: 'Spicy Schezwan aloo filling in a soft roti wrap', category: 'Wraps & Rolls', price: 120, image: IMGS.roll, isVeg: true },
      { cafeId: bistro._id, name: 'Paneer Roll', description: 'Grilled spiced paneer wrapped in a fresh roti with veggies and chutney', category: 'Wraps & Rolls', price: 125, image: IMGS.roll, isVeg: true },
      { cafeId: bistro._id, name: 'Paneer Chilli Frankie', description: 'Chilli paneer stuffed wrap with fresh veggies and tangy sauce', category: 'Wraps & Rolls', price: 135, image: IMGS.roll, isVeg: true },
      { cafeId: bistro._id, name: 'Paneer Shezwan Frankie', description: 'Schezwan marinated paneer wrapped in a soft roti', category: 'Wraps & Rolls', price: 135, image: IMGS.roll, isVeg: true },
      { cafeId: bistro._id, name: 'Paneer Makhani Wrap', description: 'Paneer in rich makhani sauce wrapped in a butter roti with salad', category: 'Wraps & Rolls', price: 170, image: IMGS.roll, isVeg: true },
      { cafeId: bistro._id, name: 'Egg Frankie', description: 'Scrambled egg masala wrapped in a soft fresh roti with sauce', category: 'Wraps & Rolls', price: 120, image: IMGS.roll, isVeg: false },
      { cafeId: bistro._id, name: 'Chicken Chilli Frankie', description: 'Spicy chilli chicken wrapped in a roti with onions and mint sauce', category: 'Wraps & Rolls', price: 140, image: IMGS.roll, isVeg: false },
      { cafeId: bistro._id, name: 'Chicken Shezwan Frankie', description: 'Schezwan chicken wrapped in a soft roti with fresh veggies', category: 'Wraps & Rolls', price: 140, image: IMGS.roll, isVeg: false },
      { cafeId: bistro._id, name: 'Chicken Roll', description: 'Grilled chicken strips wrapped in a fresh roti with salad and sauce', category: 'Wraps & Rolls', price: 160, image: IMGS.roll, isVeg: false },
      { cafeId: bistro._id, name: 'Chicken Seekh Wrap', description: 'Juicy seekh kebab wrapped in a butter roti with salad and raita', category: 'Wraps & Rolls', price: 180, image: IMGS.roll, isVeg: false },
      { cafeId: bistro._id, name: 'Fried Chicken Twister', description: 'Crispy fried chicken strip in a tortilla wrap with coleslaw', category: 'Wraps & Rolls', price: 185, image: IMGS.roll, isVeg: false },

      // Banjos
      { cafeId: bistro._id, name: 'Veg Banjo', description: 'Soft burger bun filled with a spiced veg patty and fresh toppings', category: 'Banjos', price: 80, image: IMGS.burger, isVeg: true },
      { cafeId: bistro._id, name: 'Egg Banjo', description: 'Simple soft bun with a fried egg and ketchup — a Bistro classic', category: 'Banjos', price: 90, image: IMGS.burger, isVeg: false },
      { cafeId: bistro._id, name: 'Egg Cheese Banjo', description: 'Fried egg with a melted cheese slice in a soft burger bun', category: 'Banjos', price: 110, image: IMGS.burger, isVeg: false },

      // Sandwiches & Burgers
      { cafeId: bistro._id, name: 'Classic Veg Burger', description: 'Crispy veg patty with fresh lettuce, tomato and special burger sauce', category: 'Sandwiches & Burgers', price: 110, image: IMGS.burger, isVeg: true },
      { cafeId: bistro._id, name: 'Grilled Veg Sandwich', description: 'Fresh vegetable grilled sandwich with cheese and green chutney', category: 'Sandwiches & Burgers', price: 130, image: IMGS.sandwich, isVeg: true },
      { cafeId: bistro._id, name: 'Veg Burger With Cheese', description: 'Crispy veg patty topped with a gooey melted cheese slice', category: 'Sandwiches & Burgers', price: 130, image: IMGS.burger, isVeg: true },
      { cafeId: bistro._id, name: 'Paneer Makhani Sandwich', description: 'Paneer in rich makhani sauce grilled between toasted bread slices', category: 'Sandwiches & Burgers', price: 140, image: IMGS.sandwich, isVeg: true },
      { cafeId: bistro._id, name: 'Paneer Schezwan Cheese Sandwich', description: 'Paneer with schezwan sauce and cheese grilled to perfection', category: 'Sandwiches & Burgers', price: 150, image: IMGS.sandwich, isVeg: true },
      { cafeId: bistro._id, name: 'Classic Chicken Burger', description: 'Crispy fried chicken patty with lettuce, tomato and mayo in a bun', category: 'Sandwiches & Burgers', price: 150, image: IMGS.burger, isVeg: false },
      { cafeId: bistro._id, name: 'Chicken Makhani Sandwich', description: 'Tender chicken in creamy makhani sauce sandwiched in toasted bread', category: 'Sandwiches & Burgers', price: 160, image: IMGS.sandwich, isVeg: false },
      { cafeId: bistro._id, name: 'Chicken Schezwan Cheese Sandwich', description: 'Schezwan chicken with cheese melted between toasted bread slices', category: 'Sandwiches & Burgers', price: 160, image: IMGS.sandwich, isVeg: false },
      { cafeId: bistro._id, name: 'Chicken Burger With Cheese', description: 'Juicy grilled chicken patty with melted cheese and fresh toppings', category: 'Sandwiches & Burgers', price: 170, image: IMGS.burger, isVeg: false },

      // Sides
      { cafeId: bistro._id, name: 'Classic French Fries', description: 'Golden crispy salted fries served with ketchup', category: 'Sides', price: 105, image: IMGS.fries, isVeg: true },
      { cafeId: bistro._id, name: 'Potato Wedges', description: 'Thick-cut seasoned potato wedges baked to a golden crisp', category: 'Sides', price: 110, image: IMGS.fries, isVeg: true },
      { cafeId: bistro._id, name: 'Peri Peri French Fries', description: 'Crispy fries tossed in bold peri peri spice blend', category: 'Sides', price: 119, image: IMGS.fries, isVeg: true },
      { cafeId: bistro._id, name: 'Loaded Fries', description: 'Fries loaded with cheese sauce, jalapenos and sour cream', category: 'Sides', price: 129, image: IMGS.fries, isVeg: true },
      { cafeId: bistro._id, name: 'Jalapeno Cheese Poppers (150g)', description: 'Crispy golden poppers filled with creamy cheese and pickled jalapenos', category: 'Sides', price: 190, image: IMGS.chaat, isVeg: true },
      { cafeId: bistro._id, name: 'Chicken Popcorn (150g)', description: 'Bite-sized crispy seasoned chicken popcorn pieces — addictively good', category: 'Sides', price: 190, image: IMGS.fries, isVeg: false },

      // Breads
      { cafeId: bistro._id, name: 'Masala Bread', description: 'Toasted bread with spiced butter and fresh coriander masala spread', category: 'Breads', price: 70, image: IMGS.roti, isVeg: true },
      { cafeId: bistro._id, name: 'Garlic Bread Cheese', description: 'Crusty garlic bread topped with melted mozzarella cheese', category: 'Breads', price: 150, image: IMGS.roti, isVeg: true },
      { cafeId: bistro._id, name: 'Cheese Stuffed Garlic Bread', description: 'Pull-apart garlic bread stuffed with gooey melted cheese', category: 'Breads', price: 160, image: IMGS.roti, isVeg: true },
      { cafeId: bistro._id, name: 'Paneer Tandoori Stuffed Garlic Bread', description: 'Garlic bread stuffed with tandoori spiced paneer and cheese', category: 'Breads', price: 180, image: IMGS.roti, isVeg: true },
      { cafeId: bistro._id, name: 'Paneer Makhani Stuffed Garlic Bread', description: 'Makhani paneer stuffed inside crusty pull-apart garlic bread', category: 'Breads', price: 180, image: IMGS.roti, isVeg: true },
      { cafeId: bistro._id, name: 'Chicken Makhani Stuffed Garlic Bread', description: 'Pull-apart garlic bread filled with rich makhani chicken', category: 'Breads', price: 180, image: IMGS.roti, isVeg: false },
      { cafeId: bistro._id, name: 'Chicken Tandoori Stuffed Garlic Bread', description: 'Garlic bread stuffed with juicy tandoori chicken chunks', category: 'Breads', price: 180, image: IMGS.roti, isVeg: false },

      // Hot Coffee
      { cafeId: bistro._id, name: 'Espresso', description: 'A strong concentrated shot of freshly brewed coffee', category: 'Hot Coffee', price: 55, image: IMGS.hotbev, isVeg: true },
      { cafeId: bistro._id, name: 'Americano', description: 'Espresso diluted with hot water for a smooth bold cup', category: 'Hot Coffee', price: 65, image: IMGS.hotbev, isVeg: true },
      { cafeId: bistro._id, name: 'Cappuccino', description: 'Espresso with equal parts steamed milk and thick milk foam', category: 'Hot Coffee', price: 75, image: IMGS.hotbev, isVeg: true },
      { cafeId: bistro._id, name: 'Cafe Latte', description: 'Smooth espresso combined with generous steamed milk', category: 'Hot Coffee', price: 80, image: IMGS.hotbev, isVeg: true },
      { cafeId: bistro._id, name: 'Affogato', description: 'A shot of hot espresso poured over a scoop of vanilla ice cream', category: 'Hot Coffee', price: 85, image: IMGS.hotbev, isVeg: true },
      { cafeId: bistro._id, name: 'Hot Chocolate', description: 'Rich velvety hot chocolate made with premium cocoa powder', category: 'Hot Coffee', price: 95, image: IMGS.hotbev, isVeg: true },
      { cafeId: bistro._id, name: 'Cafe Mocha', description: 'Espresso blended with chocolate and steamed milk, topped with foam', category: 'Hot Coffee', price: 110, image: IMGS.hotbev, isVeg: true },

      // Cold Coffee
      { cafeId: bistro._id, name: 'Iced Americano', description: 'Bold espresso over ice with chilled water — clean and refreshing', category: 'Cold Coffee', price: 80, image: IMGS.coldcoffee, isVeg: true },
      { cafeId: bistro._id, name: 'Iced Latte', description: 'Smooth espresso with cold milk poured over a glass of ice', category: 'Cold Coffee', price: 85, image: IMGS.coldcoffee, isVeg: true },
      { cafeId: bistro._id, name: 'Vanilla Latte', description: 'Creamy iced latte sweetened with rich vanilla syrup', category: 'Cold Coffee', price: 125, image: IMGS.coldcoffee, isVeg: true },
      { cafeId: bistro._id, name: 'Iced Mocha', description: 'Chilled espresso with chocolate sauce and cold milk over ice', category: 'Cold Coffee', price: 125, image: IMGS.coldcoffee, isVeg: true },
      { cafeId: bistro._id, name: 'Classic Cold Coffee', description: 'Blended cold coffee with milk and sugar — the Bistro favourite', category: 'Cold Coffee', price: 160, image: IMGS.coldcoffee, isVeg: true },
      { cafeId: bistro._id, name: 'Cold Coffee With Ice Cream', description: 'Thick blended cold coffee served with a scoop of vanilla ice cream', category: 'Cold Coffee', price: 190, image: IMGS.coldcoffee, isVeg: true },

      // Shakes & Frappes
      { cafeId: bistro._id, name: 'Caramel Frappe', description: 'Blended coffee frappe with buttery caramel sauce and whipped cream', category: 'Shakes & Frappes', price: 150, image: IMGS.shake, isVeg: true },
      { cafeId: bistro._id, name: 'Oreo Shake', description: 'Thick creamy milkshake blended with Oreo cookies and vanilla', category: 'Shakes & Frappes', price: 150, image: IMGS.shake, isVeg: true },
      { cafeId: bistro._id, name: 'Kit Kat Shake', description: 'Creamy milkshake blended with Kit Kat chocolate wafer bars', category: 'Shakes & Frappes', price: 150, image: IMGS.shake, isVeg: true },
      { cafeId: bistro._id, name: 'Mango Shake', description: 'Thick chilled milkshake made with ripe Alphonso mango pulp', category: 'Shakes & Frappes', price: 150, image: IMGS.shake, isVeg: true },
      { cafeId: bistro._id, name: 'Strawberry Shake', description: 'Fresh strawberry blended with chilled milk and a scoop of ice cream', category: 'Shakes & Frappes', price: 150, image: IMGS.shake, isVeg: true },
      { cafeId: bistro._id, name: 'Pineapple Shake', description: 'Refreshing pineapple milkshake with a hint of vanilla', category: 'Shakes & Frappes', price: 150, image: IMGS.shake, isVeg: true },
      { cafeId: bistro._id, name: 'Kitkat Frappe', description: 'Frozen blended Kit Kat frappe with espresso and whipped cream', category: 'Shakes & Frappes', price: 160, image: IMGS.shake, isVeg: true },

      // Mocktails
      { cafeId: bistro._id, name: 'Fresh Lime (Water/Soda)', description: 'Freshly squeezed lime with water or soda — sweet or salted', category: 'Mocktails', price: 70, image: IMGS.mocktail, isVeg: true },
      { cafeId: bistro._id, name: 'Mint Mojito', description: 'Classic mocktail with fresh mint, lime, sugar and sparkling soda', category: 'Mocktails', price: 80, image: IMGS.mocktail, isVeg: true },
      { cafeId: bistro._id, name: 'Iced Tea (Lemon/Peach)', description: 'Chilled brewed tea with your choice of lemon or peach flavor', category: 'Mocktails', price: 95, image: IMGS.mocktail, isVeg: true },
      { cafeId: bistro._id, name: 'Masala Lemonade', description: 'Tangy fresh lime with black salt, cumin and chilled sparkling water', category: 'Mocktails', price: 95, image: IMGS.mocktail, isVeg: true },
      { cafeId: bistro._id, name: 'Orange Banta Soda', description: 'Fizzy orange banta soda served ice cold in a sealed bottle', category: 'Mocktails', price: 100, image: IMGS.mocktail, isVeg: true },
      { cafeId: bistro._id, name: 'Pink Lemonade', description: 'Chilled blush pink lemonade with strawberry syrup and fresh lime', category: 'Mocktails', price: 105, image: IMGS.mocktail, isVeg: true },

      // Dessert
      { cafeId: bistro._id, name: 'Blueberry Muffin', description: 'Soft freshly baked muffin packed with juicy blueberries', category: 'Dessert', price: 70, image: IMGS.bakery, isVeg: true },
      { cafeId: bistro._id, name: 'Choco Chip Muffin', description: 'Moist chocolate chip muffin baked with premium cocoa and chips', category: 'Dessert', price: 70, image: IMGS.bakery, isVeg: true },
      { cafeId: bistro._id, name: 'Pudding', description: 'Creamy chilled pudding dessert — smooth and lightly sweetened', category: 'Dessert', price: 70, image: IMGS.icecream, isVeg: true },
      { cafeId: bistro._id, name: 'Choco Lava Cake', description: 'Warm chocolate cake with a gooey molten chocolate center', category: 'Dessert', price: 80, image: IMGS.bakery, isVeg: true },
      { cafeId: bistro._id, name: 'Pastry (Per Slice)', description: 'Freshly made layered pastry slice — flavors may vary daily', category: 'Dessert', price: 90, image: IMGS.bakery, isVeg: true },
      { cafeId: bistro._id, name: 'Waffle (Maple/Chocolate Syrup)', description: 'Crispy golden waffle served with your choice of maple or chocolate syrup', category: 'Dessert', price: 120, image: IMGS.bakery, isVeg: true },
      { cafeId: bistro._id, name: 'Brownie With Ice Cream', description: 'Warm fudgy brownie topped with a scoop of vanilla ice cream', category: 'Dessert', price: 150, image: IMGS.icecream, isVeg: true },
      { cafeId: bistro._id, name: 'New York Cheesecake (Slice)', description: 'Classic dense and creamy New York style baked cheesecake slice', category: 'Dessert', price: 170, image: IMGS.bakery, isVeg: true },

      // Others
      { cafeId: bistro._id, name: 'Cold Drinks', description: 'Assorted chilled cold drink cans and bottles — at MRP', category: 'Others', price: 0, isMRP: true, image: IMGS.water, isVeg: true, isAvailable: true },

      // ════════════════════════════════════════════════════
      //  AB DAKSHIN — Full Menu
      // ════════════════════════════════════════════════════

      // Chicken
      { cafeId: abDakshin._id, name: 'Tawa Chicken', description: 'Succulent chicken pieces cooked with spices on a flat tawa', category: 'Chicken', price: 230, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Tandoori Chicken 1/2', description: 'Half tandoori chicken marinated in yoghurt and spices, roasted in clay oven', category: 'Chicken', price: 310, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Tandoori Chicken 1/4', description: 'Quarter portion of tandoori roasted chicken', category: 'Chicken', price: 160, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Tandoori Chicken Full', description: 'Full whole tandoori chicken roasted in clay oven', category: 'Chicken', price: 650, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Chicken 65', description: 'Deep fried spiced chicken chunks with curry leaves and green chilies', category: 'Chicken', price: 210, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Chicken Manchurian', description: 'Stir-fried chicken balls in a sweet, tangy and spicy gravy', category: 'Chicken', price: 210, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Butter Chicken Masala', description: 'Tender chicken cooked in rich, creamy tomato-butter sauce', category: 'Chicken', price: 210, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Kadai Chicken', description: 'Chicken cooked with bell peppers, tomatoes and freshly ground kadai spices', category: 'Chicken', price: 210, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Pepper Chicken', description: 'Spicy chicken fry seasoned heavily with fresh black pepper and curry leaves', category: 'Chicken', price: 210, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Chicken Tikka Masala', description: 'Grilled chicken tikka pieces in a spicy onion-tomato gravy', category: 'Chicken', price: 210, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Dragon Chicken', description: 'Crispy fried chicken strips tossed in spicy sweet chili sauce with cashews', category: 'Chicken', price: 210, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Chicken Chettinad', description: 'Chettinad style chicken cooked with roasted coconut and fresh spices', category: 'Chicken', price: 210, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Chicken Tikka', description: 'Yoghurt and spice marinated chicken breast cubes grilled in tandoor', category: 'Chicken', price: 230, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Chicken Chintamani', description: 'Spicy South Indian chicken fry made with lots of dry red chilies', category: 'Chicken', price: 200, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Chicken Palipalyam', description: 'Authentic Kongunadu chicken dish made with minimal spices and lots of shallots', category: 'Chicken', price: 200, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Boiled Chicken 250gm', description: 'Healthy boiled chicken cubes seasoned with black pepper and salt', category: 'Chicken', price: 180, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Plain Omelet', description: 'Fresh pan-fried double egg omelette with green chilies and onions', category: 'Chicken', price: 50, image: IMGS.tandoor, isVeg: false },

      // Chinese
      { cafeId: abDakshin._id, name: 'Chilli Paneer', description: 'Batter-fried paneer cubes tossed in a sweet-spicy soy-chili sauce', category: 'Chinese', price: 150, image: IMGS.noodles, isVeg: true },
      { cafeId: abDakshin._id, name: 'Paneer Manchurian', description: 'Fried paneer chunks in a tangy, spicy Chinese gravy', category: 'Chinese', price: 160, image: IMGS.noodles, isVeg: true },
      { cafeId: abDakshin._id, name: 'Chilli Chicken', description: 'Crispy chicken pieces tossed with capsicum, onion and soy-chili sauce', category: 'Chinese', price: 190, image: IMGS.noodles, isVeg: false },
      { cafeId: abDakshin._id, name: 'French Fries', description: 'Classic salted potato finger chips fried till crisp and golden', category: 'Chinese', price: 120, image: IMGS.noodles, isVeg: true },

      // Samosa Chaat
      { cafeId: abDakshin._id, name: 'Plain Samosa', description: 'Deep fried crispy pastry filled with spiced potato and peas mash', category: 'Samosa Chaat', price: 20, image: IMGS.chaat, isVeg: true },
      { cafeId: abDakshin._id, name: 'Samosa Chaat', description: 'Crushed samosas topped with spicy chickpea ragada, sweet and green chutneys', category: 'Samosa Chaat', price: 60, image: IMGS.chaat, isVeg: true },
      { cafeId: abDakshin._id, name: 'Ragada Chaat', description: 'Classic hot chickpea gravy chaat garnished with sev, onion and chutneys', category: 'Samosa Chaat', price: 60, image: IMGS.chaat, isVeg: true },
      { cafeId: abDakshin._id, name: 'Dal Pakwan Chaat', description: 'Crispy deep fried pakwan flatbread served with tempered chana dal and chutneys', category: 'Samosa Chaat', price: 65, image: IMGS.chaat, isVeg: true },
      { cafeId: abDakshin._id, name: 'Papdi Chaat', description: 'Crispy papdi wafers topped with boiled potatoes, curd, sev and sweet chutneys', category: 'Samosa Chaat', price: 70, image: IMGS.chaat, isVeg: true },
      { cafeId: abDakshin._id, name: 'Fruit Chaat', description: 'A refreshing mix of fresh seasonal fruits tossed in chat masala and lime', category: 'Samosa Chaat', price: 140, image: IMGS.chaat, isVeg: true },
      { cafeId: abDakshin._id, name: 'Bread Pakoda', description: 'Golden batter-fried bread sandwich stuffed with spiced potato filling', category: 'Samosa Chaat', price: 70, image: IMGS.chaat, isVeg: true },
      { cafeId: abDakshin._id, name: 'Mirchi Pakoda', description: 'Big green chilies stuffed with potato mash, coated in gram flour batter and fried', category: 'Samosa Chaat', price: 70, image: IMGS.chaat, isVeg: true },

      // Juice
      { cafeId: abDakshin._id, name: 'Watermelon Juice', description: 'Freshly pressed watermelon juice served chilled', category: 'Juice', price: 90, image: IMGS.juice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Mosambi Juice', description: 'Fresh sweet lime juice rich in vitamin C', category: 'Juice', price: 110, image: IMGS.juice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Lemon Juice', description: 'Sweetened fresh lemon cooler served in a tall glass', category: 'Juice', price: 60, image: IMGS.juice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Orange Juice', description: 'Fresh sweet orange juice served chilled', category: 'Juice', price: 100, image: IMGS.juice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Apple Juice', description: 'Fresh apple juice blended to perfection', category: 'Juice', price: 120, image: IMGS.juice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Mango Juice', description: 'Delicious thick mango pulp juice served chilled', category: 'Juice', price: 110, image: IMGS.juice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Grape Juice', description: 'Freshly pressed black grapes juice, sweet and tangy', category: 'Juice', price: 110, image: IMGS.juice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Papaya Juice', description: 'Smooth papaya fruit juice, highly nutritious', category: 'Juice', price: 80, image: IMGS.juice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Pineapple Juice', description: 'Chilled freshly pressed pineapple juice with a hint of salt', category: 'Juice', price: 110, image: IMGS.juice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Butter Fruit Juice', description: 'Creamy avocado pulp juice blended sweet with milk', category: 'Juice', price: 120, image: IMGS.juice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Carrot Juice', description: 'Fresh sweet carrot juice, clean and healthy', category: 'Juice', price: 90, image: IMGS.juice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Fig Juice', description: 'Rich fig pulp juice blended sweet', category: 'Juice', price: 100, image: IMGS.juice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Mixed Fruit Juice', description: 'A mix of banana, apple, orange, papaya and grapes', category: 'Juice', price: 140, image: IMGS.juice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Muskmelon Juice', description: 'Cool and sweet muskmelon juice, perfect for hot days', category: 'Juice', price: 115, image: IMGS.juice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Pomegranate Juice', description: 'Sweet freshly pressed red pomegranate juice', category: 'Juice', price: 130, image: IMGS.juice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Guava Juice', description: 'Sweet pink guava juice served chilled', category: 'Juice', price: 120, image: IMGS.juice, isVeg: true },

      // Paneer
      { cafeId: abDakshin._id, name: 'Paneer Tikka Masala', description: 'Grilled paneer cubes cooked in rich onion-tomato and bell pepper gravy', category: 'Paneer', price: 200, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: abDakshin._id, name: 'Paneer 65', description: 'Crispy batter-fried paneer chunks tossed with curry leaves and green chilies', category: 'Paneer', price: 160, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: abDakshin._id, name: 'Butter Paneer', description: 'Soft paneer in rich, creamy tomato butter curry', category: 'Paneer', price: 200, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: abDakshin._id, name: 'Palak Paneer', description: 'Cottage cheese chunks in a thick smooth pureed spinach gravy', category: 'Paneer', price: 200, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: abDakshin._id, name: 'Kadai Paneer', description: 'Paneer cubes cooked with capsicum and fresh kadai masala', category: 'Paneer', price: 200, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: abDakshin._id, name: 'Shahi Paneer', description: 'Rich royal paneer gravy cooked with cashews, cream and mild spices', category: 'Paneer', price: 200, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: abDakshin._id, name: 'Kadai Veg', description: 'Mixed vegetables cooked with capsicum and fresh ground spices', category: 'Paneer', price: 185, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: abDakshin._id, name: 'Paneer Bhurji', description: 'Spiced scrambled cottage cheese with onions, tomatoes and green chilies', category: 'Paneer', price: 130, image: IMGS.paneerCurry, isVeg: true },

      // Rice
      { cafeId: abDakshin._id, name: 'Chicken Fried Rice', description: 'Fragrant basmati rice tossed with eggs, chicken bits and light soy', category: 'Rice', price: 160, image: IMGS.rice, isVeg: false },
      { cafeId: abDakshin._id, name: 'Veg Fried Rice', description: 'Stir-fried basmati rice with finely chopped fresh vegetables', category: 'Rice', price: 110, image: IMGS.rice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Veg Schezwan Fried Rice', description: 'Spicy Schezwan sauce tossed rice with mixed vegetables', category: 'Rice', price: 120, image: IMGS.rice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Sambar Rice', description: 'Traditional piping hot lentil-vegetable rice topped with pure ghee', category: 'Rice', price: 70, image: IMGS.rice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Curd Rice', description: 'Soft rice mixed with chilled curd and tempered with mustard seeds and curry leaves', category: 'Rice', price: 60, image: IMGS.rice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Egg Fried Rice', description: 'Basmati rice tossed with scrambled egg and spring onion', category: 'Rice', price: 130, image: IMGS.rice, isVeg: false },
      { cafeId: abDakshin._id, name: 'Egg Schezwan Fried Rice', description: 'Spicy Schezwan sauce tossed fried rice with egg', category: 'Rice', price: 140, image: IMGS.rice, isVeg: false },
      { cafeId: abDakshin._id, name: 'Chicken Schezwan Fried Rice', description: 'Spicy fried rice loaded with egg, chicken and vegetables', category: 'Rice', price: 170, image: IMGS.rice, isVeg: false },

      // Noodles
      { cafeId: abDakshin._id, name: 'Egg Noodles', description: 'Stir-fried noodles with egg, spring onions and savory sauce', category: 'Noodles', price: 135, image: IMGS.noodles, isVeg: false },
      { cafeId: abDakshin._id, name: 'Veg Fried Noodles', description: 'Crispy fried noodles served with a savory vegetable gravy', category: 'Noodles', price: 110, image: IMGS.noodles, isVeg: true },
      { cafeId: abDakshin._id, name: 'Veg Schezwan Noodles', description: 'Spicy Schezwan sauce tossed stir-fried noodles with vegetables', category: 'Noodles', price: 130, image: IMGS.noodles, isVeg: true },
      { cafeId: abDakshin._id, name: 'Chicken Fried Noodles', description: 'Stir fried noodles tossed with seasoned chicken chunks and egg', category: 'Noodles', price: 160, image: IMGS.noodles, isVeg: false },
      { cafeId: abDakshin._id, name: 'Egg Schezwan Fried Noodles', description: 'Spicy Schezwan sauce stir-fried noodles with scrambled egg', category: 'Noodles', price: 140, image: IMGS.noodles, isVeg: false },
      { cafeId: abDakshin._id, name: 'Chicken Schezwan Fried Noodles', description: 'Spicy Schezwan noodles loaded with chicken pieces and egg', category: 'Noodles', price: 170, image: IMGS.noodles, isVeg: false },

      // Parotta
      { cafeId: abDakshin._id, name: 'Paneer Stuffed Parotta', description: 'Layered parotta stuffed with spiced cottage cheese mash, served with raita', category: 'Parotta', price: 150, image: IMGS.roti, isVeg: true },
      { cafeId: abDakshin._id, name: 'Chicken Stuffed Parotta', description: 'Layered parotta stuffed with minced chicken masala, served with salna', category: 'Parotta', price: 160, image: IMGS.roti, isVeg: false },
      { cafeId: abDakshin._id, name: 'Aloo Stuffed Parotta', description: 'Layered parotta stuffed with delicious potato masala', category: 'Parotta', price: 150, image: IMGS.roti, isVeg: true },
      { cafeId: abDakshin._id, name: 'Chicken Chilli Parotta', description: 'Parotta pieces tossed with capsicum, onion and spicy chicken chili sauce', category: 'Parotta', price: 140, image: IMGS.roti, isVeg: false },
      { cafeId: abDakshin._id, name: 'Chicken Kothu Parotta', description: 'Shredded parotta scrambled with egg, chicken and spicy salna gravy', category: 'Parotta', price: 160, image: IMGS.roti, isVeg: false },
      { cafeId: abDakshin._id, name: 'Plain Parotta (2 pcs)', description: 'Classic layered flaky South Indian flatbread served with salna', category: 'Parotta', price: 80, image: IMGS.roti, isVeg: true },
      { cafeId: abDakshin._id, name: 'Veg Kothu Parotta', description: 'Shredded parotta scrambled with onion, tomato and mixed vegetables', category: 'Parotta', price: 130, image: IMGS.roti, isVeg: true },
      { cafeId: abDakshin._id, name: 'Egg Kothu Parotta', description: 'Shredded parotta scrambled with eggs, green chilies and mild spices', category: 'Parotta', price: 130, image: IMGS.roti, isVeg: false },

      // Biryani
      { cafeId: abDakshin._id, name: 'Chicken Biryani', description: 'Flavourful layered basmati rice with chicken, cooked in dum style', category: 'Biryani', price: 200, image: IMGS.rice, isVeg: false },
      { cafeId: abDakshin._id, name: 'Veg Biryani', description: 'Fragrant basmati rice cooked with mixed vegetables and direct spices', category: 'Biryani', price: 100, image: IMGS.rice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Mushroom Biryani', description: 'Flavourful dum style biryani cooked with fresh button mushrooms', category: 'Biryani', price: 130, image: IMGS.rice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Egg Biryani', description: 'Aromatic biryani rice served with two boiled eggs', category: 'Biryani', price: 100, image: IMGS.rice, isVeg: false },
      { cafeId: abDakshin._id, name: 'Egg Chicken Biryani', description: 'Double delight biryani containing both chicken pieces and a boiled egg', category: 'Biryani', price: 200, image: IMGS.rice, isVeg: false },

      // Tikka
      { cafeId: abDakshin._id, name: 'Dragon Paneer', description: 'Spicy paneer fingers tossed in red chili, honey and cashews', category: 'Tikka', price: 180, image: IMGS.tandoor, isVeg: true },
      { cafeId: abDakshin._id, name: 'Paneer Tikka', description: 'Cottage cheese chunks marinated in spiced yoghurt and grilled in tandoor', category: 'Tikka', price: 180, image: IMGS.tandoor, isVeg: true },
      { cafeId: abDakshin._id, name: 'Paneer Malai Tikka', description: 'Paneer cubes marinated in cream, cashews and mild spices, grilled', category: 'Tikka', price: 160, image: IMGS.tandoor, isVeg: true },
      { cafeId: abDakshin._id, name: 'Paneer Hariyali Tikka', description: 'Paneer cubes marinated in a mint and coriander green paste, grilled', category: 'Tikka', price: 150, image: IMGS.tandoor, isVeg: true },
      { cafeId: abDakshin._id, name: 'Spicy Paneer Tikka', description: 'Fiery tandoori grilled paneer cubes for spice lovers', category: 'Tikka', price: 160, image: IMGS.tandoor, isVeg: true },
      { cafeId: abDakshin._id, name: 'Gobi Manchurian', description: 'Crispy fried cauliflower florets tossed in sweet and tangy Chinese sauce', category: 'Tikka', price: 140, image: IMGS.tandoor, isVeg: true },
      { cafeId: abDakshin._id, name: 'Chicken Malai Tikka', description: 'Chicken breast chunks marinated in cashew cream and grilled in clay oven', category: 'Tikka', price: 210, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Chicken Hariyali Tikka', description: 'Mint and herb paste marinated chicken grilled in tandoor', category: 'Tikka', price: 210, image: IMGS.tandoor, isVeg: false },
      { cafeId: abDakshin._id, name: 'Spicy Tikka', description: 'Fiery red tandoori grilled chicken tikka cubes', category: 'Tikka', price: 210, image: IMGS.tandoor, isVeg: false },

      // Dosa
      { cafeId: abDakshin._id, name: 'Mysore Roast', description: 'Crispy dosa spread with spicy red Mysore chutney', category: 'Dosa', price: 130, image: IMGS.dosa, isVeg: true },
      { cafeId: abDakshin._id, name: 'Masala Roast', description: 'Crispy roast dosa served with potato masala on the side', category: 'Dosa', price: 130, image: IMGS.dosa, isVeg: true },
      { cafeId: abDakshin._id, name: 'Kal Dosa', description: 'Soft, spongy home-style dosa cooked with ghee', category: 'Dosa', price: 70, image: IMGS.dosa, isVeg: true },
      { cafeId: abDakshin._id, name: 'Chicken Curry Dosa', description: 'Roast dosa stuffed with delicious minced chicken curry', category: 'Dosa', price: 140, image: IMGS.dosa, isVeg: false },
      { cafeId: abDakshin._id, name: 'Egg Dosa', description: 'Dosa cooked with a layer of whisked eggs and pepper', category: 'Dosa', price: 130, image: IMGS.dosa, isVeg: false },
      { cafeId: abDakshin._id, name: 'Ghee Roast', description: 'Paper thin super crispy dosa roasted with pure ghee', category: 'Dosa', price: 130, image: IMGS.dosa, isVeg: true },
      { cafeId: abDakshin._id, name: 'Onion Roast', description: 'Roast dosa topped with fine chopped raw onions and coriander', category: 'Dosa', price: 130, image: IMGS.dosa, isVeg: true },
      { cafeId: abDakshin._id, name: 'Paneer Roast', description: 'Roast dosa stuffed with delicious spiced crumbled cottage cheese', category: 'Dosa', price: 140, image: IMGS.dosa, isVeg: true },
      { cafeId: abDakshin._id, name: 'Gobi Roast', description: 'Dosa stuffed with dry spiced cauliflower fry', category: 'Dosa', price: 145, image: IMGS.dosa, isVeg: true },
      { cafeId: abDakshin._id, name: 'Plain Roast', description: 'Crispy paper thin plain roast crepe made with fermented rice batter', category: 'Dosa', price: 100, image: IMGS.dosa, isVeg: true },

      // Idly
      { cafeId: abDakshin._id, name: 'Idly', description: 'Super soft steamed rice-lentil cakes served with sambar and coconut chutney', category: 'Idly', price: 70, image: IMGS.idli, isVeg: true },
      { cafeId: abDakshin._id, name: 'Mini Idly', description: 'Platter of tiny bite-sized steamed idlis floating in sambar', category: 'Idly', price: 70, image: IMGS.idli, isVeg: true },
      { cafeId: abDakshin._id, name: 'Sambar Idly', description: 'Steamed idlis completely dipped in piping hot flavorful lentil sambar', category: 'Idly', price: 70, image: IMGS.idli, isVeg: true },
      { cafeId: abDakshin._id, name: 'Thatte Idly', description: 'Flat plate-sized spongy thick idli served with butter and podi powder', category: 'Idly', price: 70, image: IMGS.idli, isVeg: true },
      { cafeId: abDakshin._id, name: 'Podi Idly', description: 'Steamed idlis tossed in gun powder (podi) and pure ghee', category: 'Idly', price: 70, image: IMGS.idli, isVeg: true },
      { cafeId: abDakshin._id, name: 'Fried Idly', description: 'Crispy deep-fried idli cubes seasoned with spice powder', category: 'Idly', price: 70, image: IMGS.idli, isVeg: true },
      { cafeId: abDakshin._id, name: 'Manchurian Idly', description: 'Fried idli pieces tossed in a sweet and sour Chinese manchurian sauce', category: 'Idly', price: 70, image: IMGS.idli, isVeg: true },

      // Bhel
      { cafeId: abDakshin._id, name: 'Peanut Masala Bhel', description: 'Crunchy puffed rice bhel mixed with spiced masala peanuts, onion and lime', category: 'Bhel', price: 70, image: IMGS.chaat, isVeg: true },
      { cafeId: abDakshin._id, name: 'Masala Bhel', description: 'Classic spiced dry bhel mixture with tomatoes, onions and sev', category: 'Bhel', price: 70, image: IMGS.chaat, isVeg: true },

      // Kulcha
      { cafeId: abDakshin._id, name: 'Paneer Kulcha', description: 'Soft leavened flatbread stuffed with spiced cottage cheese', category: 'Kulcha', price: 100, image: IMGS.roti, isVeg: true },
      { cafeId: abDakshin._id, name: 'Mutter Kulcha', description: 'White peas dry masala curry served with hot buttered kulcha bread', category: 'Kulcha', price: 100, image: IMGS.roti, isVeg: true },
      { cafeId: abDakshin._id, name: 'Veggie Kulcha', description: 'Soft kulcha flatbread stuffed with spiced mixed vegetables', category: 'Kulcha', price: 90, image: IMGS.roti, isVeg: true },

      // Daal Bafla
      { cafeId: abDakshin._id, name: 'Daal Bafla', description: 'Traditional baked wheat balls dipped in ghee, served with thick spicy dal', category: 'Daal Bafla', price: 240, image: IMGS.combo, isVeg: true },

      // Spring Roll
      { cafeId: abDakshin._id, name: 'Veg Spring Roll', description: 'Crispy fried wrappers filled with stir-fried Chinese vegetables', category: 'Spring Roll', price: 80, image: IMGS.roll, isVeg: true },
      { cafeId: abDakshin._id, name: 'Paneer Spring Roll', description: 'Crispy spring rolls stuffed with seasoned crumbled paneer and veggies', category: 'Spring Roll', price: 90, image: IMGS.roll, isVeg: true },
      { cafeId: abDakshin._id, name: 'Chicken Spring Roll', description: 'Deep fried crispy spring rolls stuffed with spiced minced chicken', category: 'Spring Roll', price: 120, image: IMGS.roll, isVeg: false },

      // Roti
      { cafeId: abDakshin._id, name: 'Plain Tandoori Roti', description: 'Whole wheat flatbread baked fresh in tandoor clay oven', category: 'Roti', price: 40, image: IMGS.roti, isVeg: true },
      { cafeId: abDakshin._id, name: 'Butter Tandoori Roti', description: 'Whole wheat tandoori flatbread brushed with butter', category: 'Roti', price: 50, image: IMGS.roti, isVeg: true },
      { cafeId: abDakshin._id, name: 'Plain Kulcha', description: 'Fluffy tandoor-baked flatbread', category: 'Roti', price: 70, image: IMGS.roti, isVeg: true },
      { cafeId: abDakshin._id, name: 'Butter Plain Kulcha', description: 'Soft kulcha bread brushed with delicious butter', category: 'Roti', price: 90, image: IMGS.roti, isVeg: true },
      { cafeId: abDakshin._id, name: 'Plain Naan', description: 'Soft leavened refined flour bread baked in tandoor', category: 'Roti', price: 40, image: IMGS.roti, isVeg: true },
      { cafeId: abDakshin._id, name: 'Butter Naan', description: 'Naan flatbread brushed with rich melted butter', category: 'Roti', price: 55, image: IMGS.roti, isVeg: true },

      // Drinks
      { cafeId: abDakshin._id, name: 'Plain Tea', description: 'Warm brewed black tea with milk', category: 'Drinks', price: 20, image: IMGS.filtercoffee, isVeg: true },
      { cafeId: abDakshin._id, name: 'Masala Tea', description: 'Indian chai brewed with aromatic milk and spices', category: 'Drinks', price: 25, image: IMGS.filtercoffee, isVeg: true },
      { cafeId: abDakshin._id, name: 'Ginger Tea', description: 'Chai brewed with crushed fresh ginger root', category: 'Drinks', price: 25, image: IMGS.filtercoffee, isVeg: true },
      { cafeId: abDakshin._id, name: 'Cardamom Tea', description: 'Chai brewed with fragrant cardamom pods', category: 'Drinks', price: 25, image: IMGS.filtercoffee, isVeg: true },
      { cafeId: abDakshin._id, name: 'Coffee', description: 'Hot blended instant coffee with milk', category: 'Drinks', price: 25, image: IMGS.filtercoffee, isVeg: true },
      { cafeId: abDakshin._id, name: 'Milk', description: 'Warm glass of fresh milk', category: 'Drinks', price: 115, image: IMGS.filtercoffee, isVeg: true },
      { cafeId: abDakshin._id, name: 'Kesar Milk', description: 'Warm sweet milk flavored with saffron strands', category: 'Drinks', price: 35, image: IMGS.filtercoffee, isVeg: true },
      { cafeId: abDakshin._id, name: 'Mysor Pak', description: 'Traditional ghee based sweet fudge from South India', category: 'Drinks', price: 100, image: IMGS.filtercoffee, isVeg: true },

      // Uthappam
      { cafeId: abDakshin._id, name: 'Ghee Uthappam', description: 'Thick soft rice-lentil pancake cooked with plenty of ghee', category: 'Uthappam', price: 90, image: IMGS.dosa, isVeg: true },
      { cafeId: abDakshin._id, name: 'Onion Uthappam', description: 'Thick uthappam topped with caramelized chopped onions', category: 'Uthappam', price: 90, image: IMGS.dosa, isVeg: true },
      { cafeId: abDakshin._id, name: 'Veg Uthappam', description: 'Thick uthappam topped with mixed vegetables and fresh coriander', category: 'Uthappam', price: 90, image: IMGS.dosa, isVeg: true },

      // Lassi
      { cafeId: abDakshin._id, name: 'Curd Lassi', description: 'Traditional sweetened churned yoghurt drink', category: 'Lassi', price: 80, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Banana Lassi', description: 'Churned sweet yoghurt blended with fresh ripe bananas', category: 'Lassi', price: 90, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Watermelon Lassi', description: 'Thick sweet churned lassi blended with watermelon extract', category: 'Lassi', price: 80, image: IMGS.shake, isVeg: true },

      // Shake
      { cafeId: abDakshin._id, name: 'Banana Shake', description: 'Banana blended with milk and sugar', category: 'Shake', price: 110, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Vanilla Shake', description: 'Classic thick shake flavored with sweet vanilla extract', category: 'Shake', price: 130, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Chocolate Shake', description: 'Milkshake blended with cocoa powder and chocolate sauce', category: 'Shake', price: 135, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Black Berry Shake', description: 'Sweet thick shake made with blackberry fruit pulp', category: 'Shake', price: 140, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Blue Berry Shake', description: 'Smooth thick shake made with blueberry fruit pulp', category: 'Shake', price: 140, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Strawberry Shake', description: 'Chilled milkshake flavored with strawberry extract', category: 'Shake', price: 140, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Kiwi Shake', description: 'Refreshing milkshake blended with kiwi pulp', category: 'Shake', price: 130, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Litchi Shake', description: 'Creamy sweet litchi flavored milkshake', category: 'Shake', price: 130, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Mango Shake', description: 'Thick sweet milkshake made with mango pulp', category: 'Shake', price: 140, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Carrot Shake', description: 'Healthy sweet carrot shake blended with cold milk', category: 'Shake', price: 120, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Butter Fruit Shake', description: 'Rich avocado milkshake, sweet and creamy', category: 'Shake', price: 130, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Fig Shake', description: 'Fig milk shake blended with dried figs and cold milk', category: 'Shake', price: 130, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Pista Shake', description: 'Rich shake flavored with pistachio syrup and chopped nuts', category: 'Shake', price: 140, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Butter Scotch Shake', description: 'Thick shake made with butterscotch ice cream and caramel', category: 'Shake', price: 140, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Apple Shake', description: 'Fresh apple shake blended sweet with milk', category: 'Shake', price: 130, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Guava Shake', description: 'Chilled sweet pink guava milkshake', category: 'Shake', price: 150, image: IMGS.shake, isVeg: true },
      { cafeId: abDakshin._id, name: 'Rosa Shake', description: 'Chilled milkshake infused with sweet rose syrup', category: 'Shake', price: 100, image: IMGS.shake, isVeg: true },

      // Paneer
      { cafeId: abDakshin._id, name: 'Butter Paneer', description: 'Paneer cubes cooked in a rich and creamy spiced gravy', category: 'Paneer', price: 200, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: abDakshin._id, name: 'Palak Paneer', description: 'Paneer cubes cooked in a spiced smooth spinach gravy', category: 'Paneer', price: 200, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: abDakshin._id, name: 'Kadai Paneer', description: 'Paneer cubes cooked with capsicum and fresh kadai masala', category: 'Paneer', price: 200, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: abDakshin._id, name: 'Shahi Paneer', description: 'Rich royal paneer gravy cooked with cream and mild spices', category: 'Paneer', price: 200, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: abDakshin._id, name: 'Kadai Veg', description: 'Mixed vegetables cooked with capsicum and fresh ground spices', category: 'Paneer', price: 185, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: abDakshin._id, name: 'Paneer Bhurji', description: 'Spiced scrambled cottage cheese with onions, tomatoes and green chilies', category: 'Paneer', price: 130, image: IMGS.paneerCurry, isVeg: true },

      // Pasta
      { cafeId: abDakshin._id, name: 'Cheese Pasta', description: 'Penne pasta in cream sauce loaded with melted cheddar cheese', category: 'Pasta', price: 140, image: IMGS.pasta, isVeg: true },
      { cafeId: abDakshin._id, name: 'Pasta In White Sauce', description: 'Penne pasta in a classic smooth bechamel sauce with vegetables', category: 'Pasta', price: 110, image: IMGS.pasta, isVeg: true },
      { cafeId: abDakshin._id, name: 'Pink Sauce Pasta', description: 'Penne pasta in a mix of creamy white and tomato red sauce', category: 'Pasta', price: 120, image: IMGS.pasta, isVeg: true },
      { cafeId: abDakshin._id, name: 'Red Sauce Pasta', description: 'Pasta tossed in spicy tomato marinara sauce', category: 'Pasta', price: 120, image: IMGS.pasta, isVeg: true },
      { cafeId: abDakshin._id, name: 'Chicken Pink Sauce Pasta', description: 'Pink sauce pasta loaded with seasoned chicken breast chunks', category: 'Pasta', price: 160, image: IMGS.pasta, isVeg: false },
      { cafeId: abDakshin._id, name: 'Chicken Red Sauce Pasta', description: 'Spicy red sauce pasta with tender chicken chunks', category: 'Pasta', price: 160, image: IMGS.pasta, isVeg: false },
      { cafeId: abDakshin._id, name: 'Chicken White Sauce Pasta', description: 'Creamy white sauce pasta loaded with seasoned chicken chunks', category: 'Pasta', price: 160, image: IMGS.pasta, isVeg: false },
      { cafeId: abDakshin._id, name: 'Chicken Cheese Pasta', description: 'Cheesy baked pasta loaded with chicken pieces', category: 'Pasta', price: 160, image: IMGS.pasta, isVeg: false },

      // Rice
      { cafeId: abDakshin._id, name: 'Sambar Rice', description: 'Traditional hot lentil-vegetable rice topped with pure ghee', category: 'Rice', price: 70, image: IMGS.rice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Curd Rice', description: 'Rice mixed with chilled curd and tempered with spices', category: 'Rice', price: 60, image: IMGS.rice, isVeg: true },
      { cafeId: abDakshin._id, name: 'Egg Fried Rice', description: 'Basmati rice tossed with scrambled egg and spring onion', category: 'Rice', price: 130, image: IMGS.rice, isVeg: false },
      { cafeId: abDakshin._id, name: 'Egg Schezwan Fried Rice', description: 'Spicy Schezwan sauce tossed fried rice with egg', category: 'Rice', price: 140, image: IMGS.rice, isVeg: false },
      { cafeId: abDakshin._id, name: 'Chicken Schezwan Fried Rice', description: 'Spicy fried rice loaded with egg and chicken pieces', category: 'Rice', price: 170, image: IMGS.rice, isVeg: false },

      // Noodles
      { cafeId: abDakshin._id, name: 'Egg Schezwan Fried Noodles', description: 'Spicy Schezwan sauce stir-fried noodles with egg', category: 'Noodles', price: 140, image: IMGS.noodles, isVeg: false },
      { cafeId: abDakshin._id, name: 'Chicken Schezwan Fried Noodles', description: 'Spicy Schezwan noodles loaded with chicken pieces and egg', category: 'Noodles', price: 170, image: IMGS.noodles, isVeg: false },

      // Main Course
      { cafeId: abDakshin._id, name: 'Veg Punjabi Masala', description: 'Spicy and rich North Indian style mixed vegetable curry', category: 'Main Course', price: 160, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: abDakshin._id, name: 'Green Peas Masala', description: 'Sweet green peas cooked in spiced onion tomato gravy', category: 'Main Course', price: 160, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: abDakshin._id, name: 'Aloo Gobi Masala', description: 'Dry spiced potatoes and cauliflower florets with Indian masalas', category: 'Main Course', price: 150, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: abDakshin._id, name: 'Gobi Masala', description: 'Cauliflower cooked in a thick spiced gravy', category: 'Main Course', price: 165, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: abDakshin._id, name: 'Gobi 65', description: 'Deep fried spicy battered cauliflower florets', category: 'Main Course', price: 100, image: IMGS.paneerCurry, isVeg: true },

      // Bakery
      { cafeId: abDakshin._id, name: 'Honey Bun', description: 'Sweet sticky bun glazed with honey syrup and sugar', category: 'Bakery', price: 65, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Veg Burger', description: 'Crispy veg patty with fresh lettuce and mayo in a bun', category: 'Bakery', price: 110, image: IMGS.burger, isVeg: true },
      { cafeId: abDakshin._id, name: 'Chicken Burger', description: 'Crispy fried chicken patty with lettuce and mayo in a bun', category: 'Bakery', price: 130, image: IMGS.burger, isVeg: false },
      { cafeId: abDakshin._id, name: 'Veg Hot Dog', description: 'Warm hot dog bun filled with a veg roll and sauces', category: 'Bakery', price: 50, image: IMGS.hotdog, isVeg: true },
      { cafeId: abDakshin._id, name: 'Paneer Hot Dog', description: 'Warm bun filled with paneer fingers and cheese sauce', category: 'Bakery', price: 50, image: IMGS.hotdog, isVeg: true },
      { cafeId: abDakshin._id, name: 'Chicken Hot Dog', description: 'Warm bun stuffed with a chicken sausage and sauces', category: 'Bakery', price: 60, image: IMGS.hotdog, isVeg: false },
      { cafeId: abDakshin._id, name: 'Egg Hot Dog', description: 'Warm bun stuffed with eggs and sauces', category: 'Bakery', price: 60, image: IMGS.hotdog, isVeg: false },
      { cafeId: abDakshin._id, name: 'American Chop Suey', description: 'Crispy noodles topped with sweet and sour vegetable sauce', category: 'Bakery', price: 150, image: IMGS.noodles, isVeg: true },
      { cafeId: abDakshin._id, name: 'Red Velvet Pastry', description: 'Delightful red velvet cake slice with cream cheese frosting', category: 'Bakery', price: 125, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Black Forest Pastry', description: 'Rich chocolate pastry slice layered with cherries and whipped cream', category: 'Bakery', price: 125, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'White Forest Pastry', description: 'White chocolate pastry slice layered with cream and cherries', category: 'Bakery', price: 125, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Donut', description: 'Ring donut glazed with dark chocolate', category: 'Bakery', price: 50, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Veg Sandwich', description: 'Fresh vegetable sandwich toasted in butter', category: 'Bakery', price: 60, image: IMGS.sandwich, isVeg: true },
      { cafeId: abDakshin._id, name: 'Brownie Cake', description: 'Rich fudgy chocolate brownie cake slice', category: 'Bakery', price: 110, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Cheese Cake', description: 'Slice of smooth baked cheesecake with biscuit base', category: 'Bakery', price: 150, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Apple Cake', description: 'Flavourful baked apple cake slice with cinnamon hint', category: 'Bakery', price: 60, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Banana Cake', description: 'Moist baked banana cake slice', category: 'Bakery', price: 80, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Chocolate Lava Cake', description: 'Gooey warm chocolate cake with molten core', category: 'Bakery', price: 80, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Chocolate Cake', description: 'Basic chocolate sponge cake slice', category: 'Bakery', price: 40, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Butter Scotch Cookies', description: 'Crunchy butterscotch flavored cookies', category: 'Bakery', price: 60, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Pineapple Cookies', description: 'Sweet cookies with pineapple jam center', category: 'Bakery', price: 50, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Chocolate Cookies', description: 'Crispy cookies loaded with rich chocolate chips', category: 'Bakery', price: 80, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Paneer Puff', description: 'Flaky baked puff pastry stuffed with spicy paneer filling', category: 'Bakery', price: 50, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Egg Puff', description: 'Crispy baked puff pastry containing egg half with masala', category: 'Bakery', price: 50, image: IMGS.bakery, isVeg: false },
      { cafeId: abDakshin._id, name: 'Veg Puff', description: 'Flaky puff stuffed with spiced potatoes, onions and peas', category: 'Bakery', price: 35, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Cream Bun', description: 'Soft sweet bun split and filled with vanilla cream', category: 'Bakery', price: 60, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Butter Chocolate Bun', description: 'Soft bun glazed with butter and chocolate spread', category: 'Bakery', price: 50, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Muffin', description: 'Soft plain muffin cake', category: 'Bakery', price: 20, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Bread Omelette', description: 'Classic campus snack of toasted bread sandwiching a egg omelette', category: 'Bakery', price: 70, image: IMGS.bakery, isVeg: false },
      { cafeId: abDakshin._id, name: 'Birthday Cake', description: '1kg customizable celebration cake', category: 'Bakery', price: 600, image: IMGS.bakery, isVeg: true },
      { cafeId: abDakshin._id, name: 'Mos Cup', description: 'Assorted baked dessert cup', category: 'Bakery', price: 60, image: IMGS.bakery, isVeg: true },

      // Others
      { cafeId: abDakshin._id, name: 'Cold Drinks', description: 'Assorted chilled cold drinks — at MRP', category: 'Others', price: 0, isMRP: true, image: IMGS.water, isVeg: true, isAvailable: true },

      // ════════════════════════════════════════════════════
      //  MAYURI (Near Academic Block 1) Menu
      // ════════════════════════════════════════════════════
      { cafeId: mayuriCafe._id, name: 'Kiwi Punch', description: 'Chilled refreshing kiwi punch mocktail with lime and soda', category: 'Mocktail', price: 120, image: IMGS.mocktail, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Cold Drinks', description: 'Assorted soft drinks and aerated beverages', category: 'Mocktail', price: 35, image: IMGS.mocktail, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Mint Mojito', description: 'Mint leaves, lime wedges, sugar syrup and soda over crushed ice', category: 'Mocktail', price: 100, image: IMGS.mocktail, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Green Apple Soda', description: 'Tart green apple syrup blended with soda and ice', category: 'Mocktail', price: 100, image: IMGS.mocktail, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Blue Berry', description: 'Chilled blueberry soda mocktail', category: 'Mocktail', price: 100, image: IMGS.mocktail, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Mandarin', description: 'Zesty orange mandarin citrus mocktail', category: 'Mocktail', price: 120, image: IMGS.mocktail, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Water Melon Mojito', description: 'Cool watermelon juice mixed with fresh mint and lime soda', category: 'Mocktail', price: 120, image: IMGS.mocktail, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Seasonal Fruit Juice', description: 'Freshly squeezed seasonal fruit juice served chilled', category: 'Mocktail', price: 100, image: IMGS.juice, isVeg: true },

      { cafeId: mayuriCafe._id, name: 'Chola With Samosa', description: 'Hot spicy chickpea chole curry served with a crushed potato samosa', category: 'Combos', price: 50, image: IMGS.combo, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Paneer With Kulcha', description: 'Paneer butter masala served with two soft kulcha breads', category: 'Combos', price: 120, image: IMGS.combo, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Chola Bhatura', description: 'Classic Punjabi chole with two puffed golden deep-fried bhaturas', category: 'Combos', price: 130, image: IMGS.combo, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Chole With Kulcha', description: 'Spicy chickpeas served with two warm soft kulchas', category: 'Combos', price: 130, image: IMGS.combo, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Chola Rice', description: 'Hearty chickpea chole curry served over hot steamed rice', category: 'Combos', price: 100, image: IMGS.combo, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Paneer Makhani Rice', description: 'Creamy rich paneer makhani served over hot basmati rice', category: 'Combos', price: 120, image: IMGS.combo, isVeg: true },

      { cafeId: mayuriCafe._id, name: 'Say Cheese Fries', description: 'Golden French fries topped with a warm melted cheddar cheese sauce', category: 'Fries', price: 100, image: IMGS.fries, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Just Fries', description: 'Classic salted French fries fried to a golden crisp', category: 'Fries', price: 80, image: IMGS.fries, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'China Town Fries', description: 'Chinese-style spiced fries tossed with garlic, onions and soy sauce', category: 'Fries', price: 100, image: IMGS.fries, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Punjabi Bhangra Fries', description: 'Fries seasoned with warm Indian tandoori spices and herbs', category: 'Fries', price: 110, image: IMGS.fries, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Tangy Tango Fries', description: 'Fries tossed in a tangy tomato-spice seasoning powder', category: 'Fries', price: 100, image: IMGS.fries, isVeg: true },

      { cafeId: mayuriCafe._id, name: 'Aloo Mutter Samosa', description: 'Crispy triangle pastry stuffed with seasoned potato and green peas', category: 'Samosa', price: 25, image: IMGS.chaat, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Poha', description: 'Light flattened rice cooked with onions, mustard seeds, turmeric and peanuts', category: 'Samosa', price: 25, image: IMGS.chaat, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Sahi Kachori', description: 'Flaky deep fried kachori stuffed with rich spiced lentils', category: 'Samosa', price: 30, image: IMGS.chaat, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Masala Paneer Samosa', description: 'Crispy samosa stuffed with spiced crumbled paneer and peas', category: 'Samosa', price: 40, image: IMGS.chaat, isVeg: true },

      { cafeId: mayuriCafe._id, name: 'Dahi Puri', description: 'Crispy puries filled with potatoes, sweetened curd, sev and sweet chutneys', category: 'Chaat', price: 50, image: IMGS.chaat, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Aloo Tikki', description: 'Two golden potato patties served with sweet and spicy chutneys', category: 'Chaat', price: 60, image: IMGS.chaat, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Papdi Chaat', description: 'Crispy papdi wafers topped with potatoes, sweetened yogurt and chutneys', category: 'Chaat', price: 60, image: IMGS.chaat, isVeg: true },

      { cafeId: mayuriCafe._id, name: 'Masala Tea', description: 'Brewed black tea with milk, ginger and green cardamom', category: 'Tea/Coffee', price: 25, image: IMGS.filtercoffee, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Regular Coffee', description: 'Hot blended instant coffee with milk', category: 'Tea/Coffee', price: 25, image: IMGS.filtercoffee, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Regular Tea', description: 'Hot brewed plain milk tea', category: 'Tea/Coffee', price: 20, image: IMGS.filtercoffee, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Lemon Ice Tea', description: 'Chilled black tea with fresh lemon juice and ice', category: 'Tea/Coffee', price: 70, image: IMGS.filtercoffee, isVeg: true },

      { cafeId: mayuriCafe._id, name: 'Loaded Sandwich', description: 'Grilled sandwich packed with fresh veggies, cheese and signature mayo', category: 'Bread Items', price: 90, image: IMGS.sandwich, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Veg Burger', description: 'Crispy vegetable patty with fresh lettuce and mayo in a bun', category: 'Bread Items', price: 80, image: IMGS.burger, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Veg Cheese Burger', description: 'Veg burger with a rich slice of melted cheese', category: 'Bread Items', price: 100, image: IMGS.burger, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Veg Paneer Cheese Burger', description: 'Burger with both a paneer patty and melted cheese slice', category: 'Bread Items', price: 120, image: IMGS.burger, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Veg Hot Dog', description: 'Warm hot dog bun filled with a vegetable roll and sauces', category: 'Bread Items', price: 80, image: IMGS.hotdog, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Paneer Hot Dog', description: 'Warm hot dog bun filled with seasoned paneer fingers and cheese sauce', category: 'Bread Items', price: 100, image: IMGS.hotdog, isVeg: true },
      { cafeId: abDakshin._id, name: 'Paneer Cheese Hot Dog', description: 'Hot dog bun stuffed with spiced paneer and melted cheese', category: 'Bread Items', price: 120, image: IMGS.hotdog, isVeg: true },

      { cafeId: mayuriCafe._id, name: 'Masala Dosa', description: 'Crispy rice crepe stuffed with spiced potato mash', category: 'South Indian', price: 120, image: IMGS.dosa, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Thatte Idli With Sambhar', description: 'Thick plate-sized spongy idli served with hot vegetable sambar', category: 'South Indian', price: 120, image: IMGS.idli, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Corn Cheese Dosa', description: 'Dosa loaded with sweet corn kernels and melted mozzarella cheese', category: 'South Indian', price: 140, image: IMGS.dosa, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Dosa Plain', description: 'Simple crispy plain roast rice crepe', category: 'South Indian', price: 90, image: IMGS.dosa, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Idli Sambar', description: 'Two steamed idlis served dipped in hot sambar', category: 'South Indian', price: 100, image: IMGS.idli, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Jini Dosa', description: 'Mumbai style street dosa rolled with cheese, butter and veggies', category: 'South Indian', price: 150, image: IMGS.dosa, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Thatte Idli', description: 'Thick flat plate idli served with coconut chutney and podi powder', category: 'South Indian', price: 100, image: IMGS.idli, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Paneer Masala Dosa', description: 'Crispy dosa stuffed with spiced paneer bhurji and potato mash', category: 'South Indian', price: 150, image: IMGS.dosa, isVeg: true },

      { cafeId: mayuriCafe._id, name: 'Chocolate Shake', description: 'Creamy thick shake blended with cocoa and milk', category: 'Shake', price: 70, image: IMGS.shake, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Oreo Milk Shake', description: 'Thick creamy milkshake blended with Oreo cookies', category: 'Shake', price: 90, image: IMGS.shake, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Kitkat Milk Shake', description: 'Thick milkshake blended with crispy Kit Kat bars', category: 'Shake', price: 90, image: IMGS.shake, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Cold Coffee', description: 'Classic blended iced coffee drink', category: 'Shake', price: 70, image: IMGS.coldcoffee, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Rose Shake', description: 'Refreshing milkshake flavored with sweet rose syrup', category: 'Shake', price: 90, image: IMGS.shake, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Mango Shake', description: 'Milkshake blended sweet with mango pulp', category: 'Shake', price: 90, image: IMGS.shake, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Strawberry Shake', description: 'Milkshake blended sweet with strawberry flavor', category: 'Shake', price: 100, image: IMGS.shake, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Black Current Shake', description: 'Thick shake made with black currant syrup and milk', category: 'Shake', price: 100, image: IMGS.shake, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Banana Shake', description: 'Fresh banana blended sweet with cold milk', category: 'Shake', price: 100, image: IMGS.shake, isVeg: true },

      { cafeId: mayuriCafe._id, name: 'Soya Protein Rolls', description: 'High protein soya chunks rolled in a soft wrap with mint sauce', category: 'Momos/Rolls', price: 100, image: IMGS.roll, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Paneer Steam Momos', description: 'Steamed dumplings filled with spiced crumbled cottage cheese', category: 'Momos/Rolls', price: 110, image: IMGS.momo, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Paneer Fry Momos', description: 'Pan fried paneer dumplings served with hot schezwan chutney', category: 'Momos/Rolls', price: 130, image: IMGS.momo, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Veg Steam Momos', description: 'Steamed vegetable filled dumplings with spicy dipping sauce', category: 'Momos/Rolls', price: 90, image: IMGS.momo, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Veg Kurkure Momos', description: 'Crispy fried momos coated in crunchy batter', category: 'Momos/Rolls', price: 150, image: IMGS.momo, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Veg Kathi Rolls', description: 'Mixed vegetables sautéed in spices and rolled in a soft wrap', category: 'Momos/Rolls', price: 100, image: IMGS.roll, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Veg Fried Momos', description: 'Golden fried vegetable dumplings', category: 'Momos/Rolls', price: 110, image: IMGS.momo, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Paneer Tikka Rolls', description: 'Tandoori paneer tikka chunks wrapped in a soft paratha roll', category: 'Momos/Rolls', price: 120, image: IMGS.roll, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Mexican Rolls', description: 'Wrap with kidney beans, cheese, salsa and raw vegetables', category: 'Momos/Rolls', price: 140, image: IMGS.roll, isVeg: true },

      { cafeId: mayuriCafe._id, name: 'Farm House Pizza', description: 'Pizza topped with capsicum, onions, tomatoes and mushrooms', category: 'Pizza', price: 160, image: IMGS.pizza, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Tandoori Paneer Pizza', description: 'Pizza topped with tandoori paneer chunks and mozzarella cheese', category: 'Pizza', price: 190, image: IMGS.pizza, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Cheese Corn Pizza', description: 'Double cheese pizza loaded with sweet corn kernels', category: 'Pizza', price: 170, image: IMGS.pizza, isVeg: true },

      { cafeId: mayuriCafe._id, name: 'Sweet Lassi', description: 'Churned yogurt sweet drink served chilled', category: 'Lassi', price: 80, image: IMGS.shake, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Mango Lassi', description: 'Churned yogurt drink flavored with mango pulp', category: 'Lassi', price: 100, image: IMGS.shake, isVeg: true },

      { cafeId: mayuriCafe._id, name: 'Gulab Jamun', description: 'Two soft deep-fried berry sized balls soaked in sugar syrup', category: 'Sweets', price: 80, image: IMGS.icecream, isVeg: true },
      { cafeId: mayuriCafe._id, name: 'Cake & Pastry', description: 'Fresh eggless pastry slice', category: 'Sweets', price: 100, image: IMGS.bakery, isVeg: true },

      { cafeId: mayuriCafe._id, name: 'Ice Cream', description: 'Assorted flavors of chilled ice cream cups — at MRP', category: 'MRP Items', price: 0, isMRP: true, image: IMGS.icecream, isVeg: true, isAvailable: true },
      { cafeId: mayuriCafe._id, name: 'Water Bottle', description: '1L chilled mineral water bottle — at MRP', category: 'MRP Items', price: 0, isMRP: true, image: IMGS.water, isVeg: true, isAvailable: true },

      // ════════════════════════════════════════════════════
      //  UNDERBELLY Menu
      // ════════════════════════════════════════════════════
      { cafeId: underbelly._id, name: 'Classic Salted Fries', description: 'Golden French fries tossed in sea salt', category: 'Fries', price: 75, image: IMGS.fries, isVeg: true },
      { cafeId: underbelly._id, name: 'Chilly Flakes Fries', description: 'Fries seasoned with salt and hot red chili flakes', category: 'Fries', price: 95, image: IMGS.fries, isVeg: true },
      { cafeId: underbelly._id, name: 'Peri Peri Fries', description: 'Golden French fries tossed in a spicy peri peri dry rub', category: 'Fries', price: 100, image: IMGS.fries, isVeg: true },
      { cafeId: underbelly._id, name: 'Lemon Masala Fries', description: 'French fries tossed with a lemon-herb masala spice mix', category: 'Fries', price: 100, image: IMGS.fries, isVeg: true },
      { cafeId: underbelly._id, name: 'Cheese Fries', description: 'Crispy French fries smothered with melted cheese sauce', category: 'Fries', price: 130, image: IMGS.fries, isVeg: true },

      { cafeId: underbelly._id, name: 'Chicken Tikka Sandwich', description: 'Spiced chicken tikka cubes grilled inside bread slices with cheese', category: 'Sandwich/Burger/Wrap', price: 140, image: IMGS.sandwich, isVeg: false },
      { cafeId: underbelly._id, name: 'Veg Cheese Burger', description: 'Veg burger loaded with a slice of melted processed cheese', category: 'Sandwich/Burger/Wrap', price: 90, image: IMGS.burger, isVeg: true },
      { cafeId: underbelly._id, name: 'Veg Burger', description: 'Crispy vegetable patty burger with fresh onion, tomato and mayo', category: 'Sandwich/Burger/Wrap', price: 75, image: IMGS.burger, isVeg: true },
      { cafeId: underbelly._id, name: 'Bombay Grilled Sandwich', description: 'Double decker sandwich stuffed with potatoes, cucumber, tomato and mint chutney', category: 'Sandwich/Burger/Wrap', price: 80, image: IMGS.sandwich, isVeg: true },
      { cafeId: underbelly._id, name: 'Chilli Cheese Sandwich', description: 'Spicy green chilies and loaded cheese toasted inside bread', category: 'Sandwich/Burger/Wrap', price: 80, image: IMGS.sandwich, isVeg: true },
      { cafeId: underbelly._id, name: 'Chutney Cheese Sandwich', description: 'Toasted bread with a thick layer of mint chutney and melted cheese', category: 'Sandwich/Burger/Wrap', price: 80, image: IMGS.sandwich, isVeg: true },
      { cafeId: underbelly._id, name: 'Double Cheese Sandwich', description: 'Toasted sandwich loaded with both mozzarella and processed cheddar slices', category: 'Sandwich/Burger/Wrap', price: 90, image: IMGS.sandwich, isVeg: true },
      { cafeId: underbelly._id, name: 'Masala Sandwich', description: 'Sandwich with spiced potato bhaji and vegetable slices', category: 'Sandwich/Burger/Wrap', price: 90, image: IMGS.sandwich, isVeg: true },
      { cafeId: underbelly._id, name: 'Sweet Corn Sandwich', description: 'Toasted sandwich filled with sweet corn kernels and cheese mayo', category: 'Sandwich/Burger/Wrap', price: 90, image: IMGS.sandwich, isVeg: true },
      { cafeId: underbelly._id, name: 'Veg Wrap', description: 'Mixed vegetables wrapped in a soft flatbread with garlic mayo', category: 'Sandwich/Burger/Wrap', price: 95, image: IMGS.roll, isVeg: true },
      { cafeId: underbelly._id, name: 'Mint Mayo Cheese Wrap', description: 'Veg wrap loaded with mint mayonnaise and melted cheese', category: 'Sandwich/Burger/Wrap', price: 100, image: IMGS.roll, isVeg: true },
      { cafeId: underbelly._id, name: 'Chicken Burger', description: 'Crispy chicken patty with lettuce and mayo in a soft bun', category: 'Sandwich/Burger/Wrap', price: 110, image: IMGS.burger, isVeg: false },
      { cafeId: underbelly._id, name: 'Veg Cheese Wrap', description: 'Soft wrap loaded with vegetables, cheese sauce and processed cheese', category: 'Sandwich/Burger/Wrap', price: 110, image: IMGS.roll, isVeg: true },
      { cafeId: underbelly._id, name: 'Paneer Cheese Burger', description: 'Cottage cheese patty burger loaded with a cheese slice', category: 'Sandwich/Burger/Wrap', price: 120, image: IMGS.burger, isVeg: true },
      { cafeId: underbelly._id, name: 'Paneer Cheese Wrap', description: 'Spiced paneer chunks wrapped with cheese sauce in a tortilla', category: 'Sandwich/Burger/Wrap', price: 120, image: IMGS.roll, isVeg: true },
      { cafeId: underbelly._id, name: 'Paneer Junglie Sandwich', description: 'Spicy crumbled paneer sandwich loaded with green chilies and onions', category: 'Sandwich/Burger/Wrap', price: 120, image: IMGS.sandwich, isVeg: true },
      { cafeId: underbelly._id, name: 'Paneer Tikka Sandwich', description: 'Spiced paneer tikka chunks grilled with mint mayo and cheese', category: 'Sandwich/Burger/Wrap', price: 120, image: IMGS.sandwich, isVeg: true },
      { cafeId: underbelly._id, name: 'Chicken Cheese Burger', description: 'Crispy chicken burger topped with a melted cheddar cheese slice', category: 'Sandwich/Burger/Wrap', price: 130, image: IMGS.burger, isVeg: false },
      { cafeId: underbelly._id, name: 'Mushroom Cheese Sandwich', description: 'Toasted sandwich loaded with sautéed mushrooms and cheese', category: 'Sandwich/Burger/Wrap', price: 130, image: IMGS.sandwich, isVeg: true },
      { cafeId: underbelly._id, name: 'Mushroom Cheese Wrap', description: 'Mushroom chunks with cheese sauce wrapped in a tortilla roll', category: 'Sandwich/Burger/Wrap', price: 130, image: IMGS.roll, isVeg: true },
      { cafeId: underbelly._id, name: 'Cheese Mayo Grilled Chicken Sandwich', description: 'Toasted sandwich packed with grilled chicken and cheese mayo', category: 'Sandwich/Burger/Wrap', price: 140, image: IMGS.sandwich, isVeg: false },
      { cafeId: underbelly._id, name: 'Chicken Cheese Mayo Wrap', description: 'Chicken strips wrapped with cheese mayo in a soft flatbread roll', category: 'Sandwich/Burger/Wrap', price: 140, image: IMGS.roll, isVeg: false },
      { cafeId: underbelly._id, name: 'Chicken Salami Sandwich', description: 'Sliced chicken salami with lettuce, tomato and cheese in bread', category: 'Sandwich/Burger/Wrap', price: 140, image: IMGS.sandwich, isVeg: false },
      { cafeId: underbelly._id, name: 'Chicken Tikka Wrap', description: 'Tender chicken tikka chunks wrapped in a paratha roll with mint sauce', category: 'Sandwich/Burger/Wrap', price: 140, image: IMGS.roll, isVeg: false },
      { cafeId: underbelly._id, name: 'Chicken Wrap', description: 'Seasoned shredded chicken breast wrapped in flatbread with salad', category: 'Sandwich/Burger/Wrap', price: 140, image: IMGS.roll, isVeg: false },
      { cafeId: underbelly._id, name: 'UB Special Club Sandwich', description: 'Triple decker sandwich packed with vegetables, cheese, potato and mayo', category: 'Sandwich/Burger/Wrap', price: 140, image: IMGS.sandwich, isVeg: true },
      { cafeId: underbelly._id, name: 'Classic Chicken Club Sandwich', description: 'Triple decker toast with chicken salami, fried egg, lettuce and cheese', category: 'Sandwich/Burger/Wrap', price: 150, image: IMGS.sandwich, isVeg: false },
      { cafeId: underbelly._id, name: 'UB Special Chicken Sandwich', description: 'Signature double layered toasted sandwich packed with chicken and special sauces', category: 'Sandwich/Burger/Wrap', price: 150, image: IMGS.sandwich, isVeg: false },

      { cafeId: underbelly._id, name: 'Masala Omelette', description: 'Double egg omelette cooked with chopped onions, green chilies and spices', category: 'Egg Varieties', price: 50, image: IMGS.tandoor, isVeg: false },
      { cafeId: underbelly._id, name: 'Egg Bhurji', description: 'Scrambled eggs cooked with onions, tomatoes and green chilies', category: 'Egg Varieties', price: 50, image: IMGS.tandoor, isVeg: false },
      { cafeId: underbelly._id, name: 'Bread Omelette', description: 'Spiced omelette sandwiched between butter-toasted bread slices', category: 'Egg Varieties', price: 70, image: IMGS.tandoor, isVeg: false },
      { cafeId: underbelly._id, name: 'Cheese Omelette', description: 'Masala omelette topped with a generous layer of grated cheese', category: 'Egg Varieties', price: 70, image: IMGS.tandoor, isVeg: false },

      { cafeId: underbelly._id, name: 'Chicken Nachos', description: 'Crispy corn tortilla chips topped with cheese sauce and chicken bits', category: 'Nachos', price: 120, image: IMGS.chaat, isVeg: false },
      { cafeId: underbelly._id, name: 'Veg Mixed Nachos', description: 'Tortilla chips topped with cheese, beans, salsa and sour cream', category: 'Nachos', price: 100, image: IMGS.chaat, isVeg: true },

      { cafeId: underbelly._id, name: 'Kitkat Milkshake', description: 'Thick creamy milkshake blended with crunchy Kit Kat bars', category: 'Cold Beverages', price: 70, image: IMGS.shake, isVeg: true },
      { cafeId: underbelly._id, name: 'Cold Coffee', description: 'Chilled blended milk and coffee served ice cold', category: 'Cold Beverages', price: 60, image: IMGS.coldcoffee, isVeg: true },
      { cafeId: underbelly._id, name: 'Chocolate Milkshake', description: 'Thick shake made with rich chocolate syrup and cold milk', category: 'Cold Beverages', price: 60, image: IMGS.shake, isVeg: true },
      { cafeId: underbelly._id, name: 'Oreo Milkshake', description: 'Milkshake blended with vanilla ice cream and Oreo cookies', category: 'Cold Beverages', price: 70, image: IMGS.shake, isVeg: true },
      { cafeId: underbelly._id, name: 'Butterscotch Milkshake', description: 'Thick shake flavored with sweet butterscotch syrup', category: 'Cold Beverages', price: 60, image: IMGS.shake, isVeg: true },
      { cafeId: underbelly._id, name: 'Strawberry Milkshake', description: 'Smooth milkshake blended with strawberry syrup', category: 'Cold Beverages', price: 60, image: IMGS.shake, isVeg: true },
      { cafeId: underbelly._id, name: 'Vanilla Milkshake', description: 'Classic thick shake flavored with vanilla extract', category: 'Cold Beverages', price: 60, image: IMGS.shake, isVeg: true },
      { cafeId: underbelly._id, name: 'Mango Shake', description: 'Sweet milkshake blended with ripe mango pulp', category: 'Cold Beverages', price: 60, image: IMGS.shake, isVeg: true },
      { cafeId: underbelly._id, name: 'Lemon Ice Tea', description: 'Chilled brewed tea flavored with fresh lemon juice', category: 'Cold Beverages', price: 60, image: IMGS.filtercoffee, isVeg: true },
      { cafeId: underbelly._id, name: 'Nutella Milkshake', description: 'Thick rich shake blended with premium Nutella chocolate spread', category: 'Cold Beverages', price: 120, image: IMGS.shake, isVeg: true },

      { cafeId: underbelly._id, name: 'Classic Margherita Pizza', description: 'Simplistic pizza with rich tomato sauce and melted mozzarella', category: 'Pizza', price: 180, image: IMGS.pizza, isVeg: true },
      { cafeId: underbelly._id, name: 'Paneer Tikka Pizza', description: 'Tandoori paneer tikka cubes topped on a thin crust pizza', category: 'Pizza', price: 200, image: IMGS.pizza, isVeg: true },
      { cafeId: underbelly._id, name: 'Garlic Bread', description: 'French loaf slices brushed with herb-garlic butter and baked', category: 'Pizza', price: 110, image: IMGS.pizza, isVeg: true },
      { cafeId: underbelly._id, name: 'Cheese Garlic Bread', description: 'Garlic bread slices topped with melted mozzarella cheese', category: 'Pizza', price: 130, image: IMGS.pizza, isVeg: true },
      { cafeId: underbelly._id, name: 'Paneer Garlic Bread', description: 'Garlic bread topped with cheese and spiced paneer chunks', category: 'Pizza', price: 150, image: IMGS.pizza, isVeg: true },
      { cafeId: underbelly._id, name: 'Sweet Corn Pizza', description: 'Pizza topped with sweet corn kernels and mozzarella cheese', category: 'Pizza', price: 180, image: IMGS.pizza, isVeg: true },
      { cafeId: underbelly._id, name: 'UB Special Pizza', description: 'Signature pizza loaded with three cheeses and assorted vegetables', category: 'Pizza', price: 180, image: IMGS.pizza, isVeg: true },
      { cafeId: underbelly._id, name: 'Veg Supreme Pizza', description: 'Pizza topped with capsicum, onion, tomato, olives and jalapenos', category: 'Pizza', price: 180, image: IMGS.pizza, isVeg: true },
      { cafeId: underbelly._id, name: 'Mushroom Cheese Pizza', description: 'Pizza loaded with fresh button mushrooms and double cheese', category: 'Pizza', price: 200, image: IMGS.pizza, isVeg: true },

      { cafeId: underbelly._id, name: 'Paneer Butter Masala', description: 'Cottage cheese cubes cooked in rich, creamy tomato butter gravy', category: 'Indian Gravy', price: 190, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: underbelly._id, name: 'Kadai Paneer Masala', description: 'Paneer cooked with bell peppers and fresh ground kadai spices', category: 'Indian Gravy', price: 190, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: underbelly._id, name: 'Paneer Lababdar', description: 'Paneer cooked in a creamy tomato-onion gravy with grated cheese', category: 'Indian Gravy', price: 190, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: underbelly._id, name: 'Dal Tadka', description: 'Yellow lentils tempered with cumin, garlic and fresh red chilies', category: 'Indian Gravy', price: 150, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: underbelly._id, name: 'Dal Makhani', description: 'Slow cooked black lentils with cream and butter', category: 'Indian Gravy', price: 160, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: underbelly._id, name: 'Kadai Sabzi', description: 'Mixed vegetables cooked with capsicum in a spicy gravy', category: 'Indian Gravy', price: 160, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: underbelly._id, name: 'Kadai Mushroom', description: 'Fresh button mushrooms cooked with capsicum in Kadai style', category: 'Indian Gravy', price: 170, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: underbelly._id, name: 'Paneer Tikka Masala', description: 'Grilled paneer cubes cooked in a spiced tomato gravy', category: 'Indian Gravy', price: 190, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: underbelly._id, name: 'Shahi Paneer Masala', description: 'Royal paneer curry made with cashews, cream and aromatic spices', category: 'Indian Gravy', price: 190, image: IMGS.paneerCurry, isVeg: true },
      { cafeId: underbelly._id, name: 'Chicken Tikka Masala', description: 'Grilled chicken chunks in a thick spiced onion tomato masala', category: 'Indian Gravy', price: 200, image: IMGS.paneerCurry, isVeg: false },
      { cafeId: underbelly._id, name: 'Schezwan Chicken Gravy', description: 'Spicy Schezwan sauce based chicken gravy cooked Chinese style', category: 'Indian Gravy', price: 200, image: IMGS.paneerCurry, isVeg: false },
      { cafeId: underbelly._id, name: 'Punjabi Chicken Masala', description: 'Spicy Punjabi style chicken gravy with whole spices', category: 'Indian Gravy', price: 200, image: IMGS.paneerCurry, isVeg: false },
      { cafeId: underbelly._id, name: 'Hyderabadi Chicken Masala', description: 'Rich chicken curry cooked in Hyderabadi style with mint and coconut', category: 'Indian Gravy', price: 200, image: IMGS.paneerCurry, isVeg: false },
      { cafeId: underbelly._id, name: 'Butter Chicken Masala', description: 'Tender chicken pieces cooked in a buttery creamy tomato gravy', category: 'Indian Gravy', price: 200, image: IMGS.paneerCurry, isVeg: false },
      { cafeId: underbelly._id, name: 'Chicken Lababdar', description: 'Tender chicken cooked in a rich onion tomato gravy finished with cream', category: 'Indian Gravy', price: 200, image: IMGS.paneerCurry, isVeg: false },
      { cafeId: underbelly._id, name: 'Dhanya Murga Adraki Masala', description: 'Flavorful chicken cooked with ginger and fresh coriander leaves', category: 'Indian Gravy', price: 200, image: IMGS.paneerCurry, isVeg: false },
      { cafeId: underbelly._id, name: 'Chicken Keema Masala', description: 'Minced chicken cooked with peas and traditional Indian spices', category: 'Indian Gravy', price: 200, image: IMGS.paneerCurry, isVeg: false },
      { cafeId: underbelly._id, name: 'Dahi Muruga', description: 'Chicken cooked in a smooth yogurt based gravy with mild spices', category: 'Indian Gravy', price: 200, image: IMGS.paneerCurry, isVeg: false },

      { cafeId: underbelly._id, name: 'Butter Naan', description: 'Tandoor baked refined flour flatbread brushed with butter', category: 'Tandoori', price: 40, image: IMGS.roti, isVeg: true },
      { cafeId: underbelly._id, name: 'Tandoori Roti', description: 'Whole wheat flatbread baked in clay oven', category: 'Tandoori', price: 20, image: IMGS.roti, isVeg: true },
      { cafeId: underbelly._id, name: 'Butter Tandoori Roti', description: 'Whole wheat tandoori flatbread brushed with butter', category: 'Tandoori', price: 25, image: IMGS.roti, isVeg: true },
      { cafeId: underbelly._id, name: 'Naan', description: 'Refined flour leavened flatbread', category: 'Tandoori', price: 35, image: IMGS.roti, isVeg: true },
      { cafeId: underbelly._id, name: 'Garlic Naan', description: 'Tandoori naan topped with chopped garlic and coriander', category: 'Tandoori', price: 45, image: IMGS.roti, isVeg: true },
      { cafeId: underbelly._id, name: 'Tandoori Lachha Paratha', description: 'Multi layered whole wheat flatbread baked in tandoor', category: 'Tandoori', price: 50, image: IMGS.roti, isVeg: true },
      { cafeId: underbelly._id, name: 'Cheese Garlic Naan', description: 'Garlic naan stuffed with mozzarella cheese', category: 'Tandoori', price: 55, image: IMGS.roti, isVeg: true },
      { cafeId: underbelly._id, name: 'Tandoori Aloo Paratha (2)', description: 'Two tandoor-baked flatbreads stuffed with potato masala', category: 'Tandoori', price: 90, image: IMGS.roti, isVeg: true },
      { cafeId: underbelly._id, name: 'Paneer Kulcha (2)', description: 'Two tandoor-baked kulchas stuffed with spiced paneer', category: 'Tandoori', price: 110, image: IMGS.roti, isVeg: true },

      { cafeId: underbelly._id, name: 'Veg Crispy Fingers', description: 'Golden batter fried mixed vegetable fingers served with dip', category: 'Veg Starters', price: 120, image: IMGS.chaat, isVeg: true },
      { cafeId: underbelly._id, name: 'Honey Chilly Potato', description: 'Crispy fried potato fingers tossed in a honey chili glaze', category: 'Veg Starters', price: 150, image: IMGS.chaat, isVeg: true },
      { cafeId: underbelly._id, name: 'Veg Manchurian Dry', description: 'Mixed vegetable balls tossed in sweet-sour Chinese sauce', category: 'Veg Starters', price: 160, image: IMGS.chaat, isVeg: true },
      { cafeId: underbelly._id, name: 'Veg Manchurian Gravy', description: 'Veg manchurian balls cooked in Chinese gravy', category: 'Veg Starters', price: 160, image: IMGS.chaat, isVeg: true },
      { cafeId: underbelly._id, name: 'Paneer Tikka', description: 'Cottage cheese blocks marinated in yogurt and tandoori spices, grilled', category: 'Veg Starters', price: 170, image: IMGS.tandoor, isVeg: true },
      { cafeId: underbelly._id, name: 'Mushroom Chilly Dry', description: 'Crispy button mushrooms tossed in dry chili garlic sauce', category: 'Veg Starters', price: 170, image: IMGS.tandoor, isVeg: true },
      { cafeId: underbelly._id, name: 'Mushroom Chilly Gravy', description: 'Mushroom chunks cooked in Chinese chili garlic gravy', category: 'Veg Starters', price: 170, image: IMGS.tandoor, isVeg: true },
      { cafeId: underbelly._id, name: 'Paneer 65', description: 'Deep fried spiced paneer chunks tossed with curry leaves', category: 'Veg Starters', price: 170, image: IMGS.tandoor, isVeg: true },
      { cafeId: underbelly._id, name: 'Chilly Paneer Dry (10 pcs)', description: 'Fried paneer chunks tossed with green chilies, onions and soy sauce', category: 'Veg Starters', price: 175, image: IMGS.tandoor, isVeg: true },
      { cafeId: underbelly._id, name: 'Paneer Malai Tikka', description: 'Paneer chunks marinated in cashew paste and grilled in tandoor', category: 'Veg Starters', price: 180, image: IMGS.tandoor, isVeg: true },
      { cafeId: underbelly._id, name: 'Chilly Paneer Gravy (8 pcs)', description: 'Paneer cubes cooked in rich chili soy gravy', category: 'Veg Starters', price: 185, image: IMGS.tandoor, isVeg: true },
      { cafeId: underbelly._id, name: 'Paneer Manchurian Gravy', description: 'Paneer cubes cooked in Chinese Manchurian gravy', category: 'Veg Starters', price: 190, image: IMGS.tandoor, isVeg: true },

      { cafeId: underbelly._id, name: 'Veg Momos (8)', description: 'Steamed vegetable dumplings served with spicy momo chutney', category: 'Momos', price: 90, image: IMGS.momo, isVeg: true },
      { cafeId: underbelly._id, name: 'Chicken Momos (6)', description: 'Steamed chicken filled dumplings served with spicy dip', category: 'Momos', price: 120, image: IMGS.momo, isVeg: false },
      { cafeId: underbelly._id, name: 'Paneer Momos (8)', description: 'Steamed cottage cheese filled dumplings', category: 'Momos', price: 130, image: IMGS.momo, isVeg: true },

      { cafeId: underbelly._id, name: 'Penne Alfredo Chicken Small', description: 'Creamy white sauce pasta with chicken pieces (small portion)', category: 'Non Veg Pasta', price: 150, image: IMGS.pasta, isVeg: false },
      { cafeId: underbelly._id, name: 'Penne Arrabiata Chicken Small', description: 'Spicy red tomato sauce pasta with chicken (small portion)', category: 'Non Veg Pasta', price: 150, image: IMGS.pasta, isVeg: false },
      { cafeId: underbelly._id, name: 'Pink Sauce Chicken Pasta Small', description: 'Mixed pink sauce chicken pasta (small portion)', category: 'Non Veg Pasta', price: 150, image: IMGS.pasta, isVeg: false },
      { cafeId: underbelly._id, name: 'Basil Sauce Chicken Pasta Small', description: 'Herbed green basil pesto sauce chicken pasta (small portion)', category: 'Non Veg Pasta', price: 150, image: IMGS.pasta, isVeg: false },
      { cafeId: underbelly._id, name: 'Penne Alfredo Chicken Large', description: 'Large portion of creamy white sauce chicken pasta', category: 'Non Veg Pasta', price: 195, image: IMGS.pasta, isVeg: false },
      { cafeId: underbelly._id, name: 'Penne Arrabiata Chicken Large', description: 'Large portion of spicy red sauce chicken pasta', category: 'Non Veg Pasta', price: 195, image: IMGS.pasta, isVeg: false },
      { cafeId: underbelly._id, name: 'Pink Sauce Chicken Pasta Large', description: 'Large portion of mixed pink sauce chicken pasta', category: 'Non Veg Pasta', price: 195, image: IMGS.pasta, isVeg: false },
      { cafeId: underbelly._id, name: 'Basil Sauce Chicken Pasta Large', description: 'Large portion of green basil pesto chicken pasta', category: 'Non Veg Pasta', price: 200, image: IMGS.pasta, isVeg: false },

      { cafeId: underbelly._id, name: 'Schezwan Egg Fried Rice', description: 'Spicy Schezwan rice tossed with eggs and spring onions', category: 'Chinese', price: 160, image: IMGS.rice, isVeg: false },
      { cafeId: underbelly._id, name: 'Veg Noodle', description: 'Classic stir-fried vegetable noodles', category: 'Chinese', price: 130, image: IMGS.noodles, isVeg: true },
      { cafeId: underbelly._id, name: 'Veg Fried Rice', description: 'Classic wok-tossed vegetable fried rice', category: 'Chinese', price: 130, image: IMGS.rice, isVeg: true },
      { cafeId: underbelly._id, name: 'Schezwan Veg Noodle', description: 'Spicy Schezwan sauce tossed vegetable noodles', category: 'Chinese', price: 140, image: IMGS.noodles, isVeg: true },
      { cafeId: underbelly._id, name: 'Egg Noodle', description: 'Stir-fried noodles with eggs and spring onions', category: 'Chinese', price: 140, image: IMGS.noodles, isVeg: false },
      { cafeId: underbelly._id, name: 'Schezwan Veg Fried Rice', description: 'Spicy Schezwan tossed vegetable fried rice', category: 'Chinese', price: 140, image: IMGS.rice, isVeg: true },
      { cafeId: underbelly._id, name: 'Schezwan Egg Noodle', description: 'Spicy Schezwan sauce tossed egg noodles', category: 'Chinese', price: 150, image: IMGS.noodles, isVeg: false },
      { cafeId: underbelly._id, name: 'Chicken Noodle', description: 'Stir-fried noodles with chicken breast strips and egg', category: 'Chinese', price: 150, image: IMGS.noodles, isVeg: false },
      { cafeId: underbelly._id, name: 'Egg Fried Rice', description: 'Wok tossed fried rice with scrambled egg', category: 'Chinese', price: 150, image: IMGS.rice, isVeg: false },
      { cafeId: underbelly._id, name: 'Paneer Noodle', description: 'Stir fried noodles topped with seasoned paneer cubes', category: 'Chinese', price: 160, image: IMGS.noodles, isVeg: true },
      { cafeId: underbelly._id, name: 'Paneer Fried Rice', description: 'Vegetable fried rice containing seasoned paneer blocks', category: 'Chinese', price: 160, image: IMGS.rice, isVeg: true },
      { cafeId: underbelly._id, name: 'Schezwan Paneer Noodle', description: 'Spicy Schezwan noodles with cottage cheese blocks', category: 'Chinese', price: 165, image: IMGS.noodles, isVeg: true },
      { cafeId: underbelly._id, name: 'Schezwan Chicken Noodle', description: 'Spicy Schezwan noodles tossed with chicken and egg', category: 'Chinese', price: 170, image: IMGS.noodles, isVeg: false },
      { cafeId: underbelly._id, name: 'Schezwan Paneer Fried Rice', description: 'Spicy Schezwan fried rice with paneer cubes', category: 'Chinese', price: 170, image: IMGS.rice, isVeg: true },

      { cafeId: underbelly._id, name: 'Ghee Sambar Idly (3)', description: 'Three soft steamed idlis served completely dipped in ghee and sambar', category: 'South Indian', price: 70, image: IMGS.idli, isVeg: true },
      { cafeId: underbelly._id, name: 'Plain Dosa', description: 'Crispy plain South Indian rice crepe', category: 'South Indian', price: 80, image: IMGS.dosa, isVeg: true },
      { cafeId: underbelly._id, name: 'Masala Dosa', description: 'Crispy roast dosa with potato masala filling inside', category: 'South Indian', price: 120, image: IMGS.dosa, isVeg: true },
      { cafeId: underbelly._id, name: 'Butter Masala Dosa', description: 'Masala dosa cooked with a generous spread of butter', category: 'South Indian', price: 130, image: IMGS.dosa, isVeg: true },
      { cafeId: underbelly._id, name: 'Ghee Masala Dosa', description: 'Masala dosa roasted with premium ghee', category: 'South Indian', price: 130, image: IMGS.dosa, isVeg: true },
      { cafeId: underbelly._id, name: 'Chilly Cheese Masala Dosa', description: 'Spicy green chili and cheese filled masala dosa', category: 'South Indian', price: 150, image: IMGS.dosa, isVeg: true },
      { cafeId: underbelly._id, name: 'Cheese Masala Dosa', description: 'Masala dosa topped with lots of melted cheese', category: 'South Indian', price: 150, image: IMGS.dosa, isVeg: true },
      { cafeId: underbelly._id, name: 'Paneer Kheema Dosa', description: 'Crispy dosa stuffed with spiced paneer kheema', category: 'South Indian', price: 160, image: IMGS.dosa, isVeg: true },
      { cafeId: underbelly._id, name: 'Onion Cheese Masala Dosa', description: 'Dosa loaded with cheese, onions and potato masala', category: 'South Indian', price: 180, image: IMGS.dosa, isVeg: true },

      { cafeId: underbelly._id, name: 'Dal Rice', description: 'Comfort food of boiled plain rice with thick tempered dal fry', category: 'Combo', price: 150, image: IMGS.rice, isVeg: true },
      { cafeId: underbelly._id, name: 'Butter Khichdi', description: 'Piping hot ghee khichdi served with pickle', category: 'Combo', price: 140, image: IMGS.rice, isVeg: true },
      { cafeId: underbelly._id, name: 'Schezwan Khichdi', description: 'Spicy fusion Schezwan style butter khichdi', category: 'Combo', price: 160, image: IMGS.rice, isVeg: true },
      { cafeId: underbelly._id, name: 'Chinese Veg Combo', description: 'Veg fried rice or noodles with veg manchurian gravy', category: 'Combo', price: 200, image: IMGS.combo, isVeg: true },
      { cafeId: underbelly._id, name: 'Indian Combo', description: 'Dal, subji, dry item, rice and two rotis', category: 'Combo', price: 180, image: IMGS.combo, isVeg: true },
      { cafeId: underbelly._id, name: 'Non Veg Combo', description: 'Chicken gravy, egg curry, dry item, rice and two rotis', category: 'Combo', price: 200, image: IMGS.combo, isVeg: false },
      { cafeId: underbelly._id, name: 'Chinese Non Veg Combo', description: 'Chicken fried rice or noodles served with chicken manchurian gravy', category: 'Combo', price: 225, image: IMGS.combo, isVeg: false },

      { cafeId: underbelly._id, name: 'Chicken Nuggets (8)', description: 'Eight crispy deep-fried battered minced chicken nuggets', category: 'Non Veg Starters', price: 160, image: IMGS.tandoor, isVeg: false },
      { cafeId: underbelly._id, name: 'Chicken 65', description: 'Deep fried spicy chicken chunks tossed with curry leaves', category: 'Non Veg Starters', price: 170, image: IMGS.tandoor, isVeg: false },
      { cafeId: underbelly._id, name: 'Chicken Wings (4 pcs)', description: 'Four crispy glazed chicken wings', category: 'Non Veg Starters', price: 185, image: IMGS.tandoor, isVeg: false },
      { cafeId: underbelly._id, name: 'Chicken Tikka', description: 'Yogurt and spice marinated chicken breast cubes grilled on skewers', category: 'Non Veg Starters', price: 185, image: IMGS.tandoor, isVeg: false },
      { cafeId: underbelly._id, name: 'Chilly Chicken Dry', description: 'Wok tossed dry chicken with bell peppers and green chilies', category: 'Non Veg Starters', price: 185, image: IMGS.tandoor, isVeg: false },
      { cafeId: underbelly._id, name: 'Dragon Chicken', description: 'Fried chicken strips tossed in sweet and spicy chili sauce', category: 'Non Veg Starters', price: 185, image: IMGS.tandoor, isVeg: false },
      { cafeId: underbelly._id, name: 'Chicken Malai Tikka', description: 'Mild cardamom and cream marinated chicken tikka grilled in tandoor', category: 'Non Veg Starters', price: 195, image: IMGS.tandoor, isVeg: false },
      { cafeId: underbelly._id, name: 'Chilly Chicken Gravy', description: 'Succulent chicken cubes in Chinese chili gravy', category: 'Non Veg Starters', price: 195, image: IMGS.tandoor, isVeg: false },
      { cafeId: underbelly._id, name: 'Tandoori Chicken Half', description: 'Half clay-oven roasted chicken marinated in spices', category: 'Non Veg Starters', price: 230, image: IMGS.tandoor, isVeg: false },
      { cafeId: underbelly._id, name: 'Tandoori Chicken Full', description: 'Full clay-oven roasted chicken marinated in spices', category: 'Non Veg Starters', price: 420, image: IMGS.tandoor, isVeg: false },

      { cafeId: underbelly._id, name: 'Tandoori Soya Chaap', description: 'Soya chaap marinated in tandoori spices and grilled in clay oven', category: 'Soya Chaap', price: 160, image: IMGS.roll, isVeg: true },
      { cafeId: underbelly._id, name: 'Achari Soya Chaap', description: 'Soya chaap marinated in pickling spice paste and grilled', category: 'Soya Chaap', price: 160, image: IMGS.roll, isVeg: true },
      { cafeId: underbelly._id, name: 'Malai Soya Chaap', description: 'Soya chaap marinated in rich cashew cream paste and grilled', category: 'Soya Chaap', price: 170, image: IMGS.roll, isVeg: true },

      { cafeId: underbelly._id, name: 'Penne Alfredo Pasta Small', description: 'Creamy white pasta with vegetables (small portion)', category: 'Veg Pasta', price: 120, image: IMGS.pasta, isVeg: true },
      { cafeId: underbelly._id, name: 'Penne Arrabiata Pasta Small', description: 'Spicy red tomato sauce pasta (small portion)', category: 'Veg Pasta', price: 120, image: IMGS.pasta, isVeg: true },
      { cafeId: underbelly._id, name: 'Pink Sauce Pasta Small', description: 'Mixed white & red sauce pasta (small portion)', category: 'Veg Pasta', price: 120, image: IMGS.pasta, isVeg: true },
      { cafeId: underbelly._id, name: 'Basil Sauce Pasta Small', description: 'Basil pesto sauce pasta (small portion)', category: 'Veg Pasta', price: 130, image: IMGS.pasta, isVeg: true },
      { cafeId: underbelly._id, name: 'Penne Alfredo Pasta Large', description: 'Large portion of creamy white sauce pasta', category: 'Veg Pasta', price: 180, image: IMGS.pasta, isVeg: true },
      { cafeId: underbelly._id, name: 'Penne Arrabiata Pasta Large', description: 'Large portion of spicy red sauce pasta', category: 'Veg Pasta', price: 180, image: IMGS.pasta, isVeg: true },
      { cafeId: underbelly._id, name: 'Pink Sauce Pasta Large', description: 'Large portion of mixed pink sauce pasta', category: 'Veg Pasta', price: 180, image: IMGS.pasta, isVeg: true },
      { cafeId: underbelly._id, name: 'Basil Sauce Pasta Large', description: 'Large portion of green basil pesto pasta', category: 'Veg Pasta', price: 190, image: IMGS.pasta, isVeg: true },

      { cafeId: underbelly._id, name: 'Choco Doughnut', description: 'Fried ring donut glazed with chocolate syrup', category: 'Pastry', price: 50, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Oreo Pastry', description: 'Pastry layered with Oreo cookie crumbs and white cream', category: 'Pastry', price: 70, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Kitkat Pastry', description: 'Pastry slice containing crispy Kit Kat wafers and chocolate fudge', category: 'Pastry', price: 70, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Choco Truffle Pastry', description: 'Rich Dutch chocolate pastry slice layered with ganache', category: 'Pastry', price: 70, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Blue Berry Pastry', description: 'Vanilla sponge pastry slice layered with blueberry compote', category: 'Pastry', price: 70, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Swiss Roll', description: 'Spongy rolled cake filled with sweet jam or cream', category: 'Pastry', price: 80, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Walnut Brownie', description: 'Fudgy chocolate brownie loaded with toasted walnut pieces', category: 'Pastry', price: 80, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Walnut Brownie With Ice Cream', description: 'Warm walnut brownie served with vanilla ice cream scoop', category: 'Pastry', price: 120, image: IMGS.bakery, isVeg: true },

      { cafeId: underbelly._id, name: 'Choco Truffle Cake 500 gm', description: 'Rich chocolate celebration cake (500g)', category: 'Birthday Cake', price: 500, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Chocolate Cake 500 gm', description: 'Chocolate cream cake (500g)', category: 'Birthday Cake', price: 500, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Butterscotch Cake 500 gm', description: 'Butterscotch cream cake with praline crunch (500g)', category: 'Birthday Cake', price: 500, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Strawberry Cake 500 gm', description: 'Strawberry cream cake (500g)', category: 'Birthday Cake', price: 500, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Pineapple Cake 500 gm', description: 'Pineapple cream cake with cherry toppings (500g)', category: 'Birthday Cake', price: 500, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Kitkat Cake 500 gm', description: 'Chocolate cake loaded with Kit Kat bars (500g)', category: 'Birthday Cake', price: 550, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Oreo Cake 500 gm', description: 'Cream cake loaded with Oreo cookies (500g)', category: 'Birthday Cake', price: 550, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Pineapple Cake 1 kg', description: 'Pineapple celebration cake (1kg)', category: 'Birthday Cake', price: 900, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Strawberry Cake 1 kg', description: 'Strawberry celebration cake (1kg)', category: 'Birthday Cake', price: 900, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Chocolate Cake 1 kg', description: 'Chocolate sponge celebration cake (1kg)', category: 'Birthday Cake', price: 900, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Butterscotch Cake 1 kg', description: 'Butterscotch celebration cake (1kg)', category: 'Birthday Cake', price: 900, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Choco Truffle Cake 1 kg', description: 'Premium choco truffle celebration cake (1kg)', category: 'Birthday Cake', price: 950, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Kitkat Cake 1 kg', description: 'Kitkat chocolate celebration cake (1kg)', category: 'Birthday Cake', price: 1000, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Oreo Cake 1 kg', description: 'Oreo cream celebration cake (1kg)', category: 'Birthday Cake', price: 1000, image: IMGS.bakery, isVeg: true },

      { cafeId: underbelly._id, name: 'Ginger Tea', description: 'Hot brewed tea with ginger milk (small cup)', category: 'Hot Beverages', price: 15, image: IMGS.filtercoffee, isVeg: true },
      { cafeId: underbelly._id, name: 'Coffee', description: 'Hot blended instant coffee with milk (small cup)', category: 'Hot Beverages', price: 20, image: IMGS.filtercoffee, isVeg: true },
      { cafeId: underbelly._id, name: 'Double Ginger Tea', description: 'Ginger milk tea served in a larger cup', category: 'Hot Beverages', price: 25, image: IMGS.filtercoffee, isVeg: true },
      { cafeId: underbelly._id, name: 'Black Coffee', description: 'Hot water diluted strong espresso shot', category: 'Hot Beverages', price: 30, image: IMGS.filtercoffee, isVeg: true },
      { cafeId: underbelly._id, name: 'Double Coffee', description: 'Coffee with double milk and espresso serving', category: 'Hot Beverages', price: 30, image: IMGS.filtercoffee, isVeg: true },
      { cafeId: underbelly._id, name: 'Hot Chocolate', description: 'Rich chocolate beverage served hot', category: 'Hot Beverages', price: 50, image: IMGS.filtercoffee, isVeg: true },

      { cafeId: underbelly._id, name: 'Veg Turnover', description: 'Crispy baked turnover stuffed with spiced potatoes', category: 'Bakery', price: 40, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Veg Plait', description: 'Braided bread roll baked with mixed vegetable fillings', category: 'Bakery', price: 50, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Veg Sub Roll', description: 'Subway style bun with vegetables and mayo', category: 'Bakery', price: 50, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Paneer Pizza Bun', description: 'Bun topped with pizza sauce, paneer cubes and melted cheese', category: 'Bakery', price: 50, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Veg Crispy Roll', description: 'Fried vegetable roll with crunchy batter coating', category: 'Bakery', price: 50, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Chilly Cheese Plait', description: 'Braided bread with chili and cheese baked fresh', category: 'Bakery', price: 60, image: IMGS.bakery, isVeg: true },
      { cafeId: underbelly._id, name: 'Chicken Turnover', description: 'Crispy baked pastry stuffed with minced chicken masala', category: 'Bakery', price: 60, image: IMGS.bakery, isVeg: false },
      { cafeId: underbelly._id, name: 'Chicken Pizza Bun', description: 'Bun topped with pizza sauce, chicken breast pieces and cheese', category: 'Bakery', price: 60, image: IMGS.bakery, isVeg: false },
      { cafeId: underbelly._id, name: 'Chicken Sub Roll', description: 'Subway style bun stuffed with chicken bits and cheese mayo', category: 'Bakery', price: 60, image: IMGS.bakery, isVeg: false },

      { cafeId: underbelly._id, name: 'Lime Mint Cooler Small', description: 'Fresh lime mint cooler (small portion)', category: 'Fresh Juice', price: 50, image: IMGS.mocktail, isVeg: true },
      { cafeId: underbelly._id, name: 'Watermelon Juice', description: 'Freshly pressed watermelon juice served chilled', category: 'Fresh Juice', price: 65, image: IMGS.juice, isVeg: true },
      { cafeId: underbelly._id, name: 'Lime Mint Cooler Large', description: 'Fresh lime mint cooler (large portion)', category: 'Fresh Juice', price: 70, image: IMGS.mocktail, isVeg: true },
      { cafeId: underbelly._id, name: 'Orange Juice', description: 'Fresh orange juice', category: 'Fresh Juice', price: 75, image: IMGS.juice, isVeg: true },
      { cafeId: underbelly._id, name: 'Sweet Lime Juice', description: 'Fresh sweet lime (mosambi) juice', category: 'Fresh Juice', price: 75, image: IMGS.juice, isVeg: true },
      { cafeId: underbelly._id, name: 'Pineapple Juice', description: 'Fresh pineapple juice served chilled', category: 'Fresh Juice', price: 75, image: IMGS.juice, isVeg: true }
    ];

    const seededItems = await MenuItem.create(menuItems);
    console.log(`Seeded ${seededItems.length} menu items (${seededItems.filter(i => i.cafeId.equals(mayuri._id)).length} Mayuri Special Block, ${seededItems.filter(i => i.cafeId.equals(bistro._id)).length} Bistro, ${seededItems.filter(i => i.cafeId.equals(abDakshin._id)).length} AB Dakshin, ${seededItems.filter(i => i.cafeId.equals(mayuriCafe._id)).length} Mayuri AB1, ${seededItems.filter(i => i.cafeId.equals(underbelly._id)).length} Underbelly).`);

    // ── 3. Seed Users ────────────────────────────────────────────────────────
    console.log('Seeding Users...');

    await User.create({ name: 'Campus Admin', email: 'admin@bites.edu', phone: '9999999999', password: 'admin123', role: 'admin' });
    const student = await User.create({ name: 'Rahul Sharma', email: 'student@bites.edu', phone: '8888888888', password: 'student123', role: 'student' });
    await User.create({ name: 'Mayuri Manager', email: 'mayuri@bites.edu', phone: '7777777771', password: 'staff123', role: 'cafe_staff', cafeId: mayuri._id });
    await User.create({ name: 'Bistro Manager', email: 'bistro@bites.edu', phone: '7777777772', password: 'staff123', role: 'cafe_staff', cafeId: bistro._id });
    await User.create({ name: 'Dakshin Manager', email: 'dakshin@bites.edu', phone: '7777777773', password: 'staff123', role: 'cafe_staff', cafeId: abDakshin._id });
    await User.create({ name: 'Mayuri AB1 Manager', email: 'mayuri_ab1@bites.edu', phone: '7777777774', password: 'staff123', role: 'cafe_staff', cafeId: mayuriCafe._id });
    await User.create({ name: 'Underbelly Manager', email: 'underbelly@bites.edu', phone: '7777777775', password: 'staff123', role: 'cafe_staff', cafeId: underbelly._id });

    console.log('Seeded 7 User accounts (Admin, Student, 5 Staff).');

    // ── 4. Seed Mock Orders & Payments (to populate dashboard metrics) ────────
    console.log('Seeding Mock Orders and Payments...');

    const itemMayuri = seededItems.find(i => i.cafeId.equals(mayuri._id));
    const itemBistro = seededItems.find(i => i.cafeId.equals(bistro._id));

    const order1 = await Order.create({
      orderNumber: 'MY-4821',
      userId: student._id,
      studentName: student.name,
      studentPhone: student.phone,
      studentEmail: student.email,
      cafeId: mayuri._id,
      items: [
        {
          menuItemId: itemMayuri ? itemMayuri._id : new mongoose.Types.ObjectId(),
          name: itemMayuri ? itemMayuri.name : 'Soya Malai Tikka',
          price: itemMayuri ? itemMayuri.price : 160,
          quantity: 2
        }
      ],
      orderType: 'Dine In',
      subtotal: 320,
      tax: 16,
      totalAmount: 336,
      paymentStatus: 'paid',
      orderStatus: 'COMPLETED'
    });

    await Payment.create({
      orderId: order1._id,
      userId: student._id,
      amount: 336,
      provider: 'razorpay',
      transactionId: 'pay_mock123456781',
      status: 'captured'
    });

    const order2 = await Order.create({
      orderNumber: 'BI-7392',
      userId: student._id,
      studentName: student.name,
      studentPhone: student.phone,
      studentEmail: student.email,
      cafeId: bistro._id,
      items: [
        {
          menuItemId: itemBistro ? itemBistro._id : new mongoose.Types.ObjectId(),
          name: itemBistro ? itemBistro.name : 'Onion Pizza',
          price: itemBistro ? itemBistro.price : 130,
          quantity: 1
        }
      ],
      orderType: 'Parcel',
      subtotal: 130,
      tax: 7,
      totalAmount: 137,
      paymentStatus: 'paid',
      orderStatus: 'COMPLETED'
    });

    await Payment.create({
      orderId: order2._id,
      userId: student._id,
      amount: 137,
      provider: 'razorpay',
      transactionId: 'pay_mock123456782',
      status: 'captured'
    });

    console.log('Seeded mock orders & payments successfully.');
    console.log('\n✅ Database Seeding Complete!\n');
    console.log('Login credentials:');
    console.log('  Student → student@bites.edu / student123');
    console.log('  Mayuri - Special Block Staff → mayuri@bites.edu / staff123');
    console.log('  Bistro Staff → bistro@bites.edu / staff123');
    console.log('  Dakshin Staff → dakshin@bites.edu / staff123');
    console.log('  Mayuri AB1 Staff → mayuri_ab1@bites.edu / staff123');
    console.log('  Underbelly Staff → underbelly@bites.edu / staff123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
