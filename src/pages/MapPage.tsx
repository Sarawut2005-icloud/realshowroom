import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const locations = [
  {
    id: 1,
    name: "BigBike Downtown Showroom",
    address: "123 Main Street, City Center",
    lat: 13.7563,
    lng: 100.5018,
    phone: "+1 (555) 123-4567",
  },
  {
    id: 2,
    name: "BigBike West Branch",
    address: "456 West Avenue, West District",
    lat: 13.7463,
    lng: 100.4918,
    phone: "+1 (555) 234-5678",
  },
  {
    id: 3,
    name: "BigBike East Outlet",
    address: "789 East Road, East Quarter",
    lat: 13.7663,
    lng: 100.5118,
    phone: "+1 (555) 345-6789",
  },
];

const MapPage = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearestBranch, setNearestBranch] = useState<typeof locations[0] | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          findNearestBranch(coords);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const findNearestBranch = (userCoords: [number, number]) => {
    let nearest = locations[0];
    let minDistance = calculateDistance(userCoords, [nearest.lat, nearest.lng]);

    locations.forEach((location) => {
      const distance = calculateDistance(userCoords, [location.lat, location.lng]);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = location;
      }
    });

    setNearestBranch(nearest);
  };

  const calculateDistance = (coords1: [number, number], coords2: [number, number]) => {
    const [lat1, lon1] = coords1;
    const [lat2, lon2] = coords2;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <MapPin className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="neon-text-cyan">Find </span>
            <span className="neon-text-green">Us</span>
          </h1>
          <p className="text-foreground/70 text-lg">
            Visit our showrooms to experience the bikes in person
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-strong rounded-2xl p-6 ${
                nearestBranch?.id === location.id ? "neon-border-cyan" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold">{location.name}</h3>
                {nearestBranch?.id === location.id && (
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <Navigation className="w-3 h-3" />
                    <span>Nearest</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-foreground/70 mb-2">{location.address}</p>
              <p className="text-sm text-foreground/60 mb-4">{location.phone}</p>
              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-primary to-secondary text-background"
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`,
                    "_blank"
                  );
                }}
              >
                Get Directions
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
