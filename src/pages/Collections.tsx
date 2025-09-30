import { useState } from "react";
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
  const [sortBy, setSortBy] = useState<string>("name");
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
      title: wishlist.includes(slug) ? "Removed from wishlist" : "Added to wishlist",
      description: bikes.find(b => b.slug === slug)?.fullName,
    });
  };

  // Filter and sort bikes
  let filteredBikes = bikes.filter((bike) => {
    const matchesSearch =
      bike.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bike.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === "all" || bike.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  // Sort bikes
  filteredBikes = [...filteredBikes].sort((a, b) => {
    switch (sortBy) {
      case "hp":
        return b.horsepower - a.horsepower;
      case "cc":
        return b.cc - a.cc;
      case "price":
        return b.price - a.price;
      default:
        return a.fullName.localeCompare(b.fullName);
    }
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="neon-text-cyan">Our </span>
            <span className="neon-text-green">Collection</span>
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Explore our curated selection of the world's finest superbikes
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
              <Input
                placeholder="Search bikes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass"
              />
            </div>

            {/* Brand Filter */}
            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger className="w-full md:w-48 glass">
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 glass">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="hp">Horsepower</SelectItem>
                <SelectItem value="cc">Engine CC</SelectItem>
                <SelectItem value="price">Price</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 text-foreground/60">
          Showing {filteredBikes.length} bike{filteredBikes.length !== 1 ? "s" : ""}
        </div>

        {/* Bikes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBikes.map((bike, index) => (
            <motion.div
              key={bike.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="glass-strong rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 group"
            >
              <Link to={`/bike/${bike.slug}`}>
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={bike.image}
                    alt={bike.fullName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(bike.slug);
                      }}
                      className={`glass ${wishlist.includes(bike.slug) ? "text-red-500" : ""}`}
                    >
                      <Heart
                        className={wishlist.includes(bike.slug) ? "fill-current" : ""}
                      />
                    </Button>
                  </div>
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

                <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                  <div className="text-center">
                    <div className="text-foreground/60">HP</div>
                    <div className="font-semibold neon-text-cyan">{bike.horsepower}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-foreground/60">CC</div>
                    <div className="font-semibold neon-text-green">{bike.cc}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-foreground/60">Top</div>
                    <div className="font-semibold">{bike.topSpeed}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div className="text-xl font-bold neon-text-cyan">
                    ${bike.price.toLocaleString()}
                  </div>
                  <Link to={`/bike/${bike.slug}`}>
                    <Button size="sm" className="bg-gradient-to-r from-primary to-secondary text-background">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredBikes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-foreground/60 text-lg">No bikes found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
