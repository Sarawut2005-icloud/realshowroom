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
  price: number; // ราคาเป็นหน่วยบาท (THB)
  image: string;
  imageLite: string;
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
    price: 899000, // ปรับราคาเป็น THB
    image: "/images/yamaha-r1.jpg",
    imageLite: "/images/yamaha-r1-lite.jpg",
    model3d: "/models/yamaha-r1.glb",
    category: "Superbike",
    description: "DNA จากสนามแข่ง MotoGP ถ่ายทอดสู่รถสปอร์ตที่วิ่งบนถนนได้อย่างถูกกฎหมาย (กระเบน)"
  },
  {
    slug: "yamaha-r15m",
    brand: "Yamaha",
    model: "R15M", // แก้ไข Model ให้ตรงกับ FullName
    fullName: "Yamaha YZF-R15M",
    cc: 155,
    horsepower: 18.6,
    torque: 14.1,
    weight: 142,
    topSpeed: 136,
    zeroToHundred: 8.5,
    price: 135000, // ปรับราคาเป็น THB
    image: "/images/yamaha-r15.jpg",
    imageLite: "/images/yamaha-r15-lite.jpg",
    model3d: "/models/yamaha-r15.glb",
    category: "Sport",
    description: "ซูเปอร์สปอร์ตน้ำหนักเบาพร้อมสไตล์ที่ดุดันและการควบคุมที่คล่องแคล่ว (155 ทำแอ็ค)"
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
    price: 915000, // ปรับราคาเป็น THB
    image: "/images/kawasaki-zx10r.jpg",
    imageLite: "/images/kawasaki-zx10r-lite.jpg",
    model3d: "/models/kawasaki-zx10r.glb",
    category: "Superbike",
    description: "ซูเปอร์ไบค์ดีกรีแชมป์โลก พร้อมเทคโนโลยีช่วยเหลือผู้ขับขี่และขุมพลังสุดโหด"
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
    price: 225000, // ปรับราคาเป็น THB
    image: "/images/kawasaki-ninja-400.jpg",
    imageLite: "/images/kawasaki-ninja-400-lite.jpg",
    model3d: "/models/kawasaki-ninja-400.glb",
    category: "Sport",
    description: "การผสมผสานที่ลงตัวระหว่างสมรรถนะและการเข้าถึงง่าย สำหรับการขับขี่ที่สนุกเร้าใจ"
  },
  {
    slug: "kawasaki-h2",
    brand: "Kawasaki",
    model: "Ninja H2", // แก้ไข Model ให้ตรงกับ FullName
    fullName: "Kawasaki Ninja H2",
    cc: 998,
    horsepower: 228,
    torque: 141.7,
    weight: 238,
    topSpeed: 337,
    zeroToHundred: 2.6,
    price: 1680000, // ปรับราคาเป็น THB
    image: "/images/kawasaki-h2.jpg",
    imageLite: "/images/kawasaki-h2-lite.jpg",
    model3d: "/models/kawasaki-h2.glb",
    category: "Hyperbike",
    description: "ไฮเปอร์ไบค์ระบบซูเปอร์ชาร์จที่ก้าวข้ามขีดจำกัดของสมรรถนะบนท้องถนน"
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
    price: 1055000, // ปรับราคาเป็น THB
    image: "/images/bmw-s1000rr.jpg",
    imageLite: "/images/bmw-s1000rr-lite.jpg",
    model3d: "/models/bmw-s1000rr.glb",
    category: "Superbike",
    description: "สุดยอดวิศวกรรมความแม่นยำจากเยอรมนี ผสานกับสมรรถนะที่มุ่งเน้นในสนามแข่ง (ฉลาม)"
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
    price: 324300, // ปรับราคาเป็น THB
    image: "/images/honda-cbr650r.jpg",
    imageLite: "/images/honda-cbr650r-lite.jpg",
    model3d: "/models/honda-cbr650r.glb",
    category: "Sport",
    description: "เครื่องยนต์สี่สูบเรียงที่นุ่มนวล พร้อมการใช้งานที่คล่องตัวในทุกวันและคาแรคเตอร์แบบสปอร์ต (สี่สูบเอื้ออาทร)"
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
    price: 859000, // ปรับราคาเป็น THB
    image: "/images/honda-cbr1000rr.jpg",
    imageLite: "/images/honda-cbr1000rr-lite.jpg",
    model3d: "/models/honda-cbr1000rr.glb",
    category: "Superbike",
    description: "ตำนาน Fireblade ที่มาพร้อมเทคโนโลยี Total Control เพื่อการควบคุมและสมรรถนะขั้นสูงสุด"
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
    price: 1299000, // ปรับราคาเป็น THB
    image: "/images/ducati-panigale-v4.jpg",
    imageLite: "/images/ducati-panigale-v4-lite.jpg",
    model3d: "/models/ducati-panigale-v4.glb",
    category: "Superbike",
    description: "ผลงานชิ้นเอกสัญชาติอิตาลี พร้อมเครื่องยนต์ V4 ที่ถ่ายทอดจาก MotoGP และดีไซน์อันน่าทึ่ง (เพนกวิน)"
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
    price: 799000, // ปรับราคาเป็น THB
    image: "/images/ducati-panigale-v2.jpg",
    imageLite: "/images/ducati-panigale-v2-lite.jpg",
    model3d: "/models/ducati-panigale-v2.glb",
    category: "Superbike",
    description: "ความสมดุลที่สมบูรณ์แบบระหว่างพละกำลังและการควบคุม พร้อมจิตวิญญาณแห่ง Ducati"
  }
];

export const getBikeBySlug = (slug: string): Bike | undefined => {
  return bikes.find(bike => bike.slug === slug);
};

export const getBikesByBrand = (brand: string): Bike[] => {
  return bikes.filter(bike => bike.brand === brand);
};

export const brands = Array.from(new Set(bikes.map(bike => bike.brand)));