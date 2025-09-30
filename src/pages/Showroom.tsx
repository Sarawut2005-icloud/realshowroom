import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { bikes } from "@/data/bikes";
import BikeViewer3D from "@/components/BikeViewer3D";
import { Heart, Gauge, Zap, Weight, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Showroom = () => {
  const [activeBikeIndex, setActiveBikeIndex] = useState(0);
  const [liteMode, setLiteMode] = useState(false);
  const { scrollYProgress } = useScroll();
  const { toast } = useToast();

  // Load wishlist from localStorage
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
      title: wishlist.includes(slug) ? "Removed from wishlist" : "Added to wishlist",
      description: bikes.find(b => b.slug === slug)?.fullName,
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const index = Math.floor(scrollPosition / windowHeight);
      setActiveBikeIndex(Math.min(index, bikes.length - 1));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative">
      {/* Navigation Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 space-y-4">
        {bikes.map((bike, index) => (
          <button
            key={bike.slug}
            onClick={() => {
              window.scrollTo({ top: index * window.innerHeight, behavior: "smooth" });
            }}
            className="group relative"
          >
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeBikeIndex
                  ? "bg-primary shadow-[0_0_10px_rgba(0,229,255,0.6)] scale-125"
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <div className="glass px-3 py-1 rounded-lg text-sm">
                {bike.fullName}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lite Mode Toggle */}
      <div className="fixed top-20 left-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLiteMode(!liteMode)}
          className="glass"
        >
          {liteMode ? "Full Mode" : "Lite Mode"}
        </Button>
      </div>

      {/* Bike Sections */}
      {bikes.map((bike, index) => (
        <section
          key={bike.slug}
          className="h-screen relative flex flex-col"
          style={{ scrollSnapAlign: "start" }}
        >
          {/* Hero Image - Top Half */}
          <div className="h-1/2 relative overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${bike.image}) `,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              initial={{ scale: 1.1 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 1.5 }}
            />
            
            {/* Title Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90 flex items-end justify-center pb-8">
              <motion.h2
                className="text-6xl md:text-8xl font-bold neon-text-cyan"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {bike.fullName}
              </motion.h2>
            </div>
          </div>

          {/* 3D Viewer - Bottom Half */}
          <div className="h-1/2 relative">
            {liteMode ? (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${bike.image})` }}
              />
            ) : (
              <BikeViewer3D modelPath={bike.model3d} className="w-full h-full" />
            )}

            {/* Info Card */}
            <motion.div
              className="absolute bottom-8 left-8 glass-strong rounded-2xl p-6 max-w-md space-y-4"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
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

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Gauge className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-xs text-foreground/60">CC</div>
                    <div className="font-semibold">{bike.cc}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-secondary" />
                  <div>
                    <div className="text-xs text-foreground/60">HP</div>
                    <div className="font-semibold">{bike.horsepower}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Weight className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-xs text-foreground/60">Weight</div>
                    <div className="font-semibold">{bike.weight}kg</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-secondary" />
                  <div>
                    <div className="text-xs text-foreground/60">Top Speed</div>
                    <div className="font-semibold">{bike.topSpeed}km/h</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-2xl font-bold neon-text-cyan">
                    ${bike.price.toLocaleString()}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-secondary text-background"
                >
                  Details
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Showroom;
