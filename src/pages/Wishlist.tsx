import { useState } from "react";
import { motion } from "framer-motion";
import { bikes } from "../data/bikes";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Wishlist = () => {
  const { toast } = useToast();
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const wishlistBikes = bikes.filter((bike) => wishlist.includes(bike.slug));

  const removeFromWishlist = (slug: string) => {
    const newWishlist = wishlist.filter((s) => s !== slug);
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    
    toast({
      title: "ลบออกจากรายการโปรดแล้ว",
      description: bikes.find(b => b.slug === slug)?.fullName,
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="neon-text-cyan">รายการ</span>
            <span className="neon-text-green">โปรด</span>
          </h1>
          <p className="text-foreground/70 text-lg">
            บันทึกไว้ {wishlistBikes.length} คัน
          </p>
        </motion.div>

        {wishlistBikes.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-24 h-24 mx-auto mb-6 text-foreground/20" />
            <h2 className="text-2xl font-bold mb-4">รายการโปรดของคุณว่างเปล่า</h2>
            <p className="text-foreground/60 mb-8">
              เริ่มเพิ่มรถที่คุณชื่นชอบเพื่อติดตามได้ที่นี่
            </p>
            <Link to="/collections">
              <Button className="bg-gradient-to-r from-primary to-secondary text-background">
                เลือกชมคอลเลกชัน
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistBikes.map((bike, index) => (
              <motion.div
                key={bike.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-strong rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                <Link to={`/bike/${bike.slug}`}>
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={bike.image}
                      alt={bike.fullName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent p-4">
                      <div className="text-sm text-foreground/60">{bike.brand}</div>
                      <div className="text-xl font-bold">{bike.model}</div>
                    </div>
                  </div>
                </Link>

                <div className="p-4">
                  <p className="text-sm text-foreground/70 mb-4 line-clamp-2">
                    {bike.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold neon-text-cyan">
                      {bike.price.toLocaleString('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 })}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromWishlist(bike.slug)}
                      className="text-red-500 hover:bg-red-500/10"
                      aria-label="ลบออกจากรายการโปรด"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

