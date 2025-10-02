import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { bikes } from "../data/bikes";
import BikeViewer3D from "../components/BikeViewer3D";
import { Heart, Gauge, Zap, Weight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";

const BikeSection = ({ bike, liteMode, wishlist, toggleWishlist, onVisible }) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      onVisible();
    }
  }, [inView, onVisible]);

  return (
    <section
      ref={ref}
      id={bike.slug}
      className="h-screen relative flex flex-col snap-start"
    >
      <div className="h-1/2 relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${bike.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ scale: 1.15 }}
          whileInView={{ scale: 1 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90 flex items-end justify-center pb-8">
          <motion.h2
            className="text-5xl md:text-7xl lg:text-8xl font-bold neon-text-cyan text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.5 }}
            transition={{ delay: 0.3 }}
          >
            {bike.fullName}
          </motion.h2>
        </div>
      </div>

      <div className="h-1/2 relative">
        {liteMode ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${bike.imageLite})` }}
          />
        ) : (
          <BikeViewer3D modelPath={bike.model3d} className="w-full h-full" />
        )}

        <motion.div
          className="absolute bottom-4 left-4 md:bottom-8 md:left-8 glass-strong rounded-2xl p-4 md:p-6 max-w-sm md:max-w-md w-[calc(100%-2rem)]"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-foreground/60">{bike.brand}</div>
              <div className="text-2xl font-bold">{bike.model}</div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleWishlist(bike.slug)}
              className={wishlist.includes(bike.slug) ? "text-red-500" : ""}
            >
              <Heart
                className={wishlist.includes(bike.slug) ? "fill-current" : ""}
              />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <Stat icon={Gauge} label="เครื่องยนต์" value={`${bike.cc.toLocaleString('th-TH')} cc`} />
            <Stat icon={Zap} label="แรงม้า" value={`${bike.horsepower.toLocaleString('th-TH')} HP`} />
            <Stat icon={Weight} label="น้ำหนัก" value={`${bike.weight} กก.`} />
            <Stat icon={TrendingUp} label="ความเร็วสูงสุด" value={`${bike.topSpeed} กม./ชม.`} />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="text-2xl font-bold neon-text-cyan">
              {bike.price.toLocaleString('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 })}
            </div>
            <Link to={`/bike/${bike.slug}`}>
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-secondary text-background"
              >
                รายละเอียด
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Showroom = () => {
  const [activeBikeIndex, setActiveBikeIndex] = useState(0);
  const [liteMode, setLiteMode] = useState(false);
  const { toast } = useToast();

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleWishlist = (slug: string) => {
    const newWishlist = wishlist.includes(slug)
      ? wishlist.filter((s) => s !== slug)
      : [...wishlist, slug];
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    
    toast({
      title: wishlist.includes(slug) ? "ลบออกจากรายการโปรด" : "เพิ่มในรายการโปรด",
      description: bikes.find(b => b.slug === slug)?.fullName,
    });
  };

  return (
    <div className="relative h-screen overflow-y-scroll snap-y snap-mandatory">
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col space-y-3">
        {bikes.map((bike, index) => (
          <button
            key={bike.slug}
            onClick={() => {
              document.getElementById(bike.slug)?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative flex items-center justify-center"
            aria-label={`ไปที่ ${bike.fullName}`}
          >
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeBikeIndex
                  ? "bg-primary shadow-[0_0_10px_rgba(0,229,255,0.6)] scale-125"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <div className="glass px-3 py-1 rounded-lg text-sm">
                {bike.fullName}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="fixed top-20 left-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLiteMode(!liteMode)}
          className="glass"
        >
          {liteMode ? "โหมดเต็มรูปแบบ" : "โหมดประหยัด"}
        </Button>
      </div>

      {bikes.map((bike, index) => (
        <BikeSection
            key={bike.slug}
            bike={bike}
            liteMode={liteMode}
            wishlist={wishlist}
            toggleWishlist={toggleWishlist}
            onVisible={() => setActiveBikeIndex(index)}
        />
      ))}
    </div>
  );
};

const Stat = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number }) => (
    <div className="flex items-center space-x-2">
      <Icon className="w-4 h-4 text-primary" />
      <div>
        <div className="text-xs text-foreground/60">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  );

export default Showroom;

