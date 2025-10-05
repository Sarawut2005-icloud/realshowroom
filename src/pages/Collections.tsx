import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { bikes, brands } from "@/data/bikes";
import { Heart, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Collections = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name-asc");
  const { toast } = useToast();

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage", error);
      return [];
    }
  });

  const toggleWishlist = (slug: string) => {
    const isWishlisted = wishlist.includes(slug);
    const newWishlist = isWishlisted
      ? wishlist.filter((s) => s !== slug)
      : [...wishlist, slug];
    
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    
    toast({
      title: isWishlisted ? "ลบออกจากรายการโปรดแล้ว" : "เพิ่มในรายการโปรดแล้ว",
      description: bikes.find(b => b.slug === slug)?.fullName,
    });
  };

  const filteredAndSortedBikes = useMemo(() => {
    let filtered = bikes.filter((bike) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        bike.fullName.toLowerCase().includes(searchLower) ||
        bike.brand.toLowerCase().includes(searchLower);
      const matchesBrand = selectedBrand === "all" || bike.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "hp-desc":
          return b.horsepower - a.horsepower;
        case "cc-desc":
          return b.cc - a.cc;
        case "price-desc":
          return b.price - a.price;
        case "price-asc":
          return a.price - b.price;
        case "name-asc":
          return a.fullName.localeCompare(b.fullName);
        case "name-desc":
            return b.fullName.localeCompare(a.fullName);
        default:
          return a.fullName.localeCompare(b.fullName);
      }
    });
  }, [searchQuery, selectedBrand, sortBy]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="neon-text-cyan">คอลเลกชัน</span>
            <span className="neon-text-green">มอเตอร์ไซค์</span>
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            ค้นพบสุดยอดซูเปอร์ไบค์ที่เราคัดสรรมาเพื่อคุณโดยเฉพาะ
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
              <Input
                placeholder="ค้นหามอเตอร์ไซค์..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass"
              />
            </div>

            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-full md:w-48 glass">
                <SelectValue placeholder="เลือกยี่ห้อ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกยี่ห้อ</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 glass">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="จัดเรียงตาม" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">ชื่อ (ก-ฮ)</SelectItem>
                <SelectItem value="name-desc">ชื่อ (ฮ-ก)</SelectItem>
                <SelectItem value="hp-desc">แรงม้า (มากไปน้อย)</SelectItem>
                <SelectItem value="cc-desc">ขนาดเครื่องยนต์ (มากไปน้อย)</SelectItem>
                <SelectItem value="price-asc">ราคา (น้อยไปมาก)</SelectItem>
                <SelectItem value="price-desc">ราคา (มากไปน้อย)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        <div className="mb-6 text-foreground/60">
          พบ {filteredAndSortedBikes.length} คัน
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedBikes.map((bike, index) => (
            <motion.div
              key={bike.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="glass-strong rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 group"
            >
              <div className="relative">
                <Link to={`/bike/${bike.slug}`} className="block">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={bike.image}
                      alt={bike.fullName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-4">
                      <div className="text-sm text-foreground/60">{bike.brand}</div>
                      <div className="text-xl font-bold">{bike.model}</div>
                    </div>
                  </div>
                </Link>
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleWishlist(bike.slug)}
                    aria-label="เพิ่มในรายการโปรด"
                    className={`glass rounded-full ${wishlist.includes(bike.slug) ? "text-red-500" : ""}`}
                  >
                    <Heart className={wishlist.includes(bike.slug) ? "fill-current" : ""} />
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2 mb-4 text-sm text-center">
                  <div>
                    <div className="text-foreground/60">แรงม้า</div>
                    <div className="font-semibold neon-text-cyan">{bike.horsepower}</div>
                  </div>
                  <div>
                    <div className="text-foreground/60">CC</div>
                    <div className="font-semibold neon-text-green">{bike.cc}</div>
                  </div>
                  <div>
                    <div className="text-foreground/60">ท็อปสปีด</div>
                    <div className="font-semibold">{bike.topSpeed} กม./ชม.</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="text-xl font-bold neon-text-cyan">
                    {bike.price.toLocaleString('th-TH')} ฿
                  </div>
                  <Link to={`/bike/${bike.slug}`}>
                    <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-background">
                      ดูรายละเอียด
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAndSortedBikes.length === 0 && (
          <div className="text-center py-16 text-foreground/60">
            <p className="text-lg">ไม่พบมอเตอร์ไซค์ที่ตรงกับเงื่อนไขของคุณ</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
