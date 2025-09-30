export interface Bike {
  slug: string;
  brand: string;
  model: string;
  fullName: string;
  cc: number;
  horsepower: number;
  torque: number;
  weight: number;
  topSpeed: number;
  zeroToHundred: number;
  price: number;
  image: string;
  imageLite: string;   // ✅ เพิ่ม field
  model3d: string;
  category: string;
  description: string;
}

export const bikes: Bike[] = [
  {
    slug: "yamaha-r1",
    brand: "Yamaha",
    model: "R1",
    fullName: "Yamaha YZF-R1",
    cc: 998,
    horsepower: 200,
    torque: 112.4,
    weight: 199,
    topSpeed: 299,
    zeroToHundred: 3.0,
    price: 17999,
    image: "/images/yamaha-r1.jpg",
    imageLite: "/images/yamaha-r1-lite.jpg",  // ✅ Lite
    model3d: "/models/yamaha-r1.glb",
    category: "Superbike",
    description: "DNA การแข่งรถแท้ๆ ในแพ็คเกจที่ถูกกฎหมายบนท้องถนนพร้อมเทคโนโลยีที่ได้มาจาก MotoGP"
  },
  {
    slug: "yamaha-r15M",
    brand: "Yamaha",
    model: "R15",
    fullName: "Yamaha YZF-R15M",
    cc: 155,
    horsepower: 18.6,
    torque: 14.1,
    weight: 142,
    topSpeed: 136,
    zeroToHundred: 8.5,
    price: 3299,
    image: "/images/yamaha-r15.jpg",
    imageLite: "/images/yamaha-r15-lite.jpg",
    model3d: "/models/yamaha-r15.glb",
    category: "Sport",
    description: "Lightweight supersport with aggressive styling and nimble handling."
  },
  {
    slug: "kawasaki-zx10r",
    brand: "Kawasaki",
    model: "ZX-10R",
    fullName: "Kawasaki Ninja ZX-10R",
    cc: 998,
    horsepower: 203,
    torque: 114.9,
    weight: 207,
    topSpeed: 299,
    zeroToHundred: 2.9,
    price: 16999,
    image: "/images/kawasaki-zx10r.jpg",
    imageLite: "/images/kawasaki-zx10r-lite.jpg",
    model3d: "/models/kawasaki-zx10r.glb",
    category: "Superbike",
    description: "Championship-winning superbike with electronic rider aids and brutal power."
  },
  {
    slug: "kawasaki-ninja-400",
    brand: "Kawasaki",
    model: "Ninja 400",
    fullName: "Kawasaki Ninja 400",
    cc: 399,
    horsepower: 45,
    torque: 38,
    weight: 168,
    topSpeed: 179,
    zeroToHundred: 4.9,
    price: 5299,
    image: "/images/kawasaki-ninja-400.jpg",
    imageLite: "/images/kawasaki-ninja-400-lite.jpg",
    model3d: "/models/kawasaki-ninja-400.glb",
    category: "Sport",
    description: "Perfect blend of performance and accessibility for spirited riding."
  },
  {
    slug: "kawasaki-h2",
    brand: "Kawasaki",
    model: "H2",
    fullName: "Kawasaki Ninja H2",
    cc: 998,
    horsepower: 228,
    torque: 141.7,
    weight: 238,
    topSpeed: 337,
    zeroToHundred: 2.6,
    price: 29000,
    image: "/images/kawasaki-h2.jpg",
    imageLite: "/images/kawasaki-h2-lite.jpg",
    model3d: "/models/kawasaki-h2.glb",
    category: "Hyperbike",
    description: "Supercharged hyperbike pushing the boundaries of street-legal performance."
  },
  {
    slug: "bmw-s1000rr",
    brand: "BMW",
    model: "S1000RR",
    fullName: "BMW S1000RR",
    cc: 999,
    horsepower: 205,
    torque: 113,
    weight: 197,
    topSpeed: 303,
    zeroToHundred: 3.1,
    price: 17995,
    image: "/images/bmw-s1000rr.jpg",
    imageLite: "/images/bmw-s1000rr-lite.jpg",
    model3d: "/models/bmw-s1000rr.glb",
    category: "Superbike",
    description: "German precision engineering meets track-focused performance."
  },
  {
    slug: "honda-cbr650r",
    brand: "Honda",
    model: "CBR650R",
    fullName: "Honda CBR650R",
    cc: 649,
    horsepower: 95,
    torque: 64,
    weight: 208,
    topSpeed: 220,
    zeroToHundred: 4.2,
    price: 9499,
    image: "/images/honda-cbr650r.jpg",
    imageLite: "/images/honda-cbr650r-lite.jpg",
    model3d: "/models/honda-cbr650r.glb",
    category: "Sport",
    description: "Refined inline-four engine with everyday usability and sporty character."
  },
  {
    slug: "honda-cbr1000rr",
    brand: "Honda",
    model: "CBR1000RR",
    fullName: "Honda CBR1000RR Fireblade",
    cc: 999,
    horsepower: 189,
    torque: 113,
    weight: 196,
    topSpeed: 299,
    zeroToHundred: 3.0,
    price: 16499,
    image: "/images/honda-cbr1000rr.jpg",
    imageLite: "/images/honda-cbr1000rr-lite.jpg",
    model3d: "/models/honda-cbr1000rr.glb",
    category: "Superbike",
    description: "Legendary Fireblade with Total Control technology for ultimate performance."
  },
  {
    slug: "ducati-panigale-v4",
    brand: "Ducati",
    model: "Panigale V4",
    fullName: "Ducati Panigale V4",
    cc: 1103,
    horsepower: 214,
    torque: 124,
    weight: 198,
    topSpeed: 305,
    zeroToHundred: 2.9,
    price: 28395,
    image: "/images/ducati-panigale-v4.jpg",
    imageLite: "/images/ducati-panigale-v4-lite.jpg",
    model3d: "/models/ducati-panigale-v4.glb",
    category: "Superbike",
    description: "Italian masterpiece with MotoGP-derived V4 engine and stunning design."
  },
  {
    slug: "ducati-panigale-v2",
    brand: "Ducati",
    model: "Panigale V2",
    fullName: "Ducati Panigale V2",
    cc: 955,
    horsepower: 155,
    torque: 104,
    weight: 200,
    topSpeed: 270,
    zeroToHundred: 3.4,
    price: 16495,
    image: "/images/ducati-panigale-v2.jpg",
    imageLite: "/images/ducati-panigale-v2-lite.jpg",
    model3d: "/models/ducati-panigale-v2.glb",
    category: "Superbike",
    description: "Perfect balance of power and handling with signature Ducati passion."
  }
];

export const getBikeBySlug = (slug: string): Bike | undefined => {
  return bikes.find(bike => bike.slug === slug);
};

export const getBikesByBrand = (brand: string): Bike[] => {
  return bikes.filter(bike => bike.brand === brand);
};

export const brands = Array.from(new Set(bikes.map(bike => bike.brand)));
