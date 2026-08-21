import cappuccinoImg from "@/assets/cappuccino-item.jpg";
import caramelLatteImg from "@/assets/caramel-latte-item.jpg";
import chocolateFrappeImg from "@/assets/chocolate-frappe-item.jpg";
import berryPancakeImg from "@/assets/berry-pancake-item.jpg";

export const CAFE = {
  name: "Bad Moon Cafe",
  tagline: "CAFE & COFFEE",
  area: "Borough",
  address: {
    line1: "159a Great Dover Street",
    line2: "Borough",
    city: "London",
    postcode: "SE1 4GZ",
    country: "United Kingdom",
  },
  phone: "+91 56743 21867",
  phoneRaw: "+915674321867",
  email: "duifgdha@gmail.com",
  plusCode: "GRH7+WM London, United Kingdom",
  priceRange: "£1–10",
  rating: 4.9,
  reviewCount: 582,
  services: ["Dine-in", "Takeaway", "Cozy Workspace", "Drive-through"],
  /** Google Maps directions to the café. */
  directionsUrl: "https://maps.app.goo.gl/pqYKyB31iF6Equeu6",
  mapEmbedUrl:
    "https://www.google.com/maps?q=Bad+Moon+Cafe,+159a+Great+Dover+Street,+London+SE1+4GZ&output=embed",
  /** No verified public Google reviews URL supplied yet. */
  reviewsUrl: "https://maps.app.goo.gl/pqYKyB31iF6Equeu6" as string | null,
  socials: {
    instagram: {
      handle: "@akash_d7631",
      url: "https://instagram.com/akash_d7631",
    },
    facebook: {
      handle: "facebook.com",
      url: "https://facebook.com",
    },
  },
} as const;

export const HOURS: { day: string; short: string; open: string; close: string }[] = [
  { day: "Monday", short: "Mon", open: "08:00", close: "22:00" },
  { day: "Tuesday", short: "Tue", open: "08:00", close: "22:00" },
  { day: "Wednesday", short: "Wed", open: "08:00", close: "22:00" },
  { day: "Thursday", short: "Thu", open: "08:00", close: "22:00" },
  { day: "Friday", short: "Fri", open: "08:00", close: "22:00" },
  { day: "Saturday", short: "Sat", open: "08:00", close: "22:00" },
  { day: "Sunday", short: "Sun", open: "08:00", close: "22:00" },
];

export type MenuItem = { name: string; description?: string; price?: string; image?: string; isPopular?: boolean };
export type MenuCategory = { title: string; note?: string; items: MenuItem[] };

export const POPULAR_PICKS: MenuItem[] = [
  {
    name: "Cappuccino",
    price: "$4.50",
    description: "Rich espresso with steamed milk and a layer of foam.",
    image: cappuccinoImg,
    isPopular: true,
  },
  {
    name: "Caramel Latte",
    price: "$4.80",
    description: "Smooth latte with caramel flavor and a hint of sweetness.",
    image: caramelLatteImg,
    isPopular: true,
  },
  {
    name: "Chocolate Frappe",
    price: "$5.20",
    description: "Iced blended coffee with chocolate and whipped cream.",
    image: chocolateFrappeImg,
    isPopular: true,
  },
  {
    name: "Berry Pancake",
    price: "$6.50",
    description: "Fluffy pancakes topped with fresh berries and syrup.",
    image: berryPancakeImg,
    isPopular: true,
  },
];

export const MENU: MenuCategory[] = [
  {
    title: "Coffee & Espresso",
    note: "Crafted with passion, fresh every cup.",
    items: [
      { name: "Espresso", price: "$3.20", description: "Rich, concentrated shot brewed from freshly ground beans." },
      { name: "Cappuccino", price: "$4.50", description: "Espresso with steamed milk and dense velvety foam." },
      { name: "Caramel Latte", price: "$4.80", description: "Smooth espresso, velvety milk, artisan caramel drizzle." },
      { name: "Flat White", price: "$4.20", description: "Double shot espresso with silky micro-foamed milk." },
      { name: "Americano", price: "$3.50", description: "Espresso shots topped with hot water for full body flavor." },
      { name: "Mocha", price: "$4.90", description: "Espresso combined with bittersweet chocolate and steamed milk." },
    ],
  },
  {
    title: "Cold Drinks & Frappes",
    note: "Chilled and refreshing all day.",
    items: [
      { name: "Chocolate Frappe", price: "$5.20", description: "Iced blended mocha with whipped cream and drizzle." },
      { name: "Iced Vanilla Latte", price: "$4.90", description: "Espresso over chilled milk and organic vanilla syrup." },
      { name: "Cold Brew Coffee", price: "$4.40", description: "Steeped for 18 hours for maximum smoothness and low acidity." },
      { name: "Caramel Frappuccino", price: "$5.40", description: "Blended coffee with rich buttery caramel and crunch." },
    ],
  },
  {
    title: "Fresh Bakery & Pancakes",
    note: "Freshly baked every morning.",
    items: [
      { name: "Berry Pancake", price: "$6.50", description: "Fluffy golden stack topped with berries and maple syrup." },
      { name: "Bombolone Doughnut", price: "$3.80", description: "Italian sugar-dusted doughnut filled with vanilla custard." },
      { name: "Almond Croissant", price: "$4.10", description: "Twice-baked butter croissant filled with rich almond frangipane." },
      { name: "Chocolate Brioche", price: "$3.90", description: "Tender golden brioche stuffed with melted Belgian dark chocolate." },
    ],
  },
  {
    title: "Desserts & Treats",
    note: "Decadent pairings for your coffee.",
    items: [
      { name: "Fudge Chocolate Cake", price: "$5.80", description: "Decadent triple layer fudge cake with dark chocolate ganache." },
      { name: "Classic Tiramisu", price: "$5.50", description: "Espresso-soaked ladyfingers layered with mascarpone cream." },
      { name: "New York Cheesecake", price: "$5.20", description: "Creamy baked cheesecake with a buttery graham cracker crust." },
    ],
  },
];

export type ReviewItem = {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  comment: string;
  avatarBg: string;
  likes: number;
};

export const REVIEWS: ReviewItem[] = [
  {
    id: "1",
    author: "Elena Rostova",
    role: "Local Guide • 42 reviews",
    rating: 5,
    date: "3 days ago",
    comment:
      "Bad Moon Cafe is hands-down my favorite coffee sanctuary in London. The artisan caramel latte and freshly baked berry pancakes are out of this world! Cozy, welcoming lighting and wonderful staff.",
    avatarBg: "from-amber-600 to-amber-800",
    likes: 18,
  },
  {
    id: "2",
    author: "Marcus Chen",
    role: "Verified Guest",
    rating: 5,
    date: "1 week ago",
    comment:
      "Incredible atmosphere for remote work or catching up with friends. The espresso has an immaculate crema and rich flavor profile. You can tell they put true love into every single brew.",
    avatarBg: "from-amber-700 to-stone-800",
    likes: 24,
  },
  {
    id: "3",
    author: "Sophie Taylor",
    role: "Food & Coffee Critic",
    rating: 5,
    date: "2 weeks ago",
    comment:
      "Top-tier vibes, delicious fudge cake, and barista craftsmanship at its finest. The dark aesthetic and ambient playlist make it an absolute London gem. Cannot recommend enough!",
    avatarBg: "from-yellow-700 to-amber-900",
    likes: 31,
  },
];

export const PRICE_PLACEHOLDER = "$4.50";
export const DESCRIPTION_PLACEHOLDER = "Handcrafted with premium ingredients.";

export function timeLabel(value: string) {
  const h = Number(value.slice(0, 2));
  const m = Number(value.slice(3, 5));
  const suffix = h < 12 ? "AM" : "PM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Open/closed state computed from the supplied hours. */
export function getOpenState(now: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekday = get("weekday");
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  const index = HOURS.findIndex((h) => h.short === weekday);
  const today = index === -1 ? undefined : HOURS[index];
  if (!today) return { open: false, label: "See opening hours", today: null };

  const toMin = (v: string) => Number(v.slice(0, 2)) * 60 + Number(v.slice(3, 5));

  if (minutes >= toMin(today.open) && minutes < toMin(today.close)) {
    return { open: true, label: `Open now until ${timeLabel(today.close)}`, today };
  }
  const next = minutes < toMin(today.open) ? today : (HOURS[(index + 1) % 7] ?? today);
  return {
    open: false,
    label: `Closed — opens at ${timeLabel(next.open)}`,
    today,
  };
}
