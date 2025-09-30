import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getBikeBySlug } from "@/data/bikes";
import BikeViewer3D from "@/components/BikeViewer3D";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Share2, Gauge, Zap, Weight, TrendingUp, DollarSign, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const BikeDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const bike = getBikeBySlug(slug || "");

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  if (!bike) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Bike Not Found</h1>
          <Link to="/collections">
            <Button>Back to Collections</Button>
          </Link>
        </div>
      </div>
    );
  }

  const toggleWishlist = () => {
    const newWishlist = wishlist.includes(bike.slug)
      ? wishlist.filter((s) => s !== bike.slug)
      : [...wishlist, bike.slug];
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    
    toast({
      title: wishlist.includes(bike.slug) ? "Removed from wishlist" : "Added to wishlist",
      description: bike.fullName,
    });
  };

  const specs = [
    { label: "Engine", value: `${bike.cc}cc`, icon: Gauge },
    { label: "Horsepower", value: `${bike.horsepower} HP`, icon: Zap },
    { label: "Torque", value: `${bike.torque} Nm`, icon: TrendingUp },
    { label: "Weight", value: `${bike.weight} kg`, icon: Weight },
    { label: "Top Speed", value: `${bike.topSpeed} km/h`, icon: TrendingUp },
    { label: "0-100 km/h", value: `${bike.zeroToHundred}s`, icon: Timer },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="glass"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-sm text-foreground/60 mb-2">{bike.brand}</div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="neon-text-cyan">{bike.model}</span>
              </h1>
              <p className="text-lg text-foreground/70 max-w-2xl">{bike.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleWishlist}
                className={`glass ${wishlist.includes(bike.slug) ? "text-red-500" : ""}`}
              >
                <Heart className={wishlist.includes(bike.slug) ? "fill-current" : ""} />
              </Button>
              <Button variant="outline" size="icon" className="glass">
                <Share2 />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* 3D Viewer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 glass-strong rounded-2xl overflow-hidden"
        >
          <BikeViewer3D modelPath={bike.model3d} className="w-full h-[60vh]" />
        </motion.div>

        {/* Specs Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold mb-6 neon-text-green">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specs.map((spec, index) => {
              const Icon = spec.icon;
              return (
                <div key={index} className="glass-strong rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <Icon className="w-5 h-5 text-background" />
                    </div>
                    <div className="text-sm text-foreground/60">{spec.label}</div>
                  </div>
                  <div className="text-2xl font-bold neon-text-cyan">{spec.value}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Price & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-strong rounded-2xl p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-sm text-foreground/60 mb-2">Starting Price</div>
              <div className="text-5xl font-bold neon-text-cyan flex items-center">
                <DollarSign className="w-10 h-10" />
                {bike.price.toLocaleString()}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={`/compare?bikes=${bike.slug}`}>
                <Button variant="outline" size="lg" className="glass w-full sm:w-auto">
                  Compare
                </Button>
              </Link>
              <Link to="/booking">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-background w-full sm:w-auto">
                  Book Test Ride
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BikeDetail;
