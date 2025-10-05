import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const locations = [
  {
    id: 1,
    name: "BigBike สาขาสยามพารากอน",
    address: "991 ถนนพระรามที่ ๑ แขวงปทุมวัน เขตปทุมวัน กรุงเทพมหานคร 10330",
    lat: 13.7461,
    lng: 100.5347,
    phone: "02-123-4567",
  },
  {
    id: 2,
    name: "BigBike สาขาเซ็นทรัลเวิลด์",
    address: "999/9 ถนนพระรามที่ ๑ แขวงปทุมวัน เขตปทุมวัน กรุงเทพมหานคร 10330",
    lat: 13.7468,
    lng: 100.5398,
    phone: "02-234-5678",
  },
  {
    id: 3,
    name: "BigBike สาขาไอคอนสยาม",
    address: "299 ถนนเจริญนคร แขวงคลองต้นไทร เขตคลองสาน กรุงเทพมหานคร 10600",
    lat: 13.7265,
    lng: 100.5108,
    phone: "02-345-6789",
  },
];

type LocationStatus = 'idle' | 'fetching' | 'success' | 'error';

const MapPage = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearestBranch, setNearestBranch] = useState<typeof locations[0] | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');

  useEffect(() => {
    if (navigator.geolocation) {
      setLocationStatus('fetching');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          findNearestBranch(coords);
          setLocationStatus('success');
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationStatus('error');
        }
      );
    } else {
      setLocationStatus('error');
    }
  }, []);

  const findNearestBranch = (userCoords: [number, number]) => {
    let nearest = locations[0];
    let minDistance = calculateDistance(userCoords, [nearest.lat, nearest.lng]);

    locations.slice(1).forEach((location) => {
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

  const renderStatusMessage = () => {
    switch (locationStatus) {
      case 'fetching':
        return <p className="text-foreground/70 text-sm flex items-center justify-center gap-2"><Loader2 className="animate-spin w-4 h-4" /> กำลังค้นหาตำแหน่งของคุณ...</p>;
      case 'success':
        return <p className="text-green-500 text-sm">พบสาขาที่ใกล้คุณที่สุดแล้ว!</p>;
      case 'error':
        return <p className="text-red-500 text-sm">ไม่สามารถเข้าถึงตำแหน่งของคุณได้ กรุณาเปิด GPS หรืออนุญาตให้เบราว์เซอร์เข้าถึงตำแหน่ง</p>;
      default:
        return null;
    }
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
            <span className="neon-text-cyan">ค้นหา</span>
            <span className="neon-text-green">สาขา</span>
          </h1>
          <p className="text-foreground/70 text-lg mb-4">
            เยี่ยมชมโชว์รูมของเราเพื่อสัมผัสประสบการณ์บิ๊กไบค์ตัวจริง
          </p>
          {renderStatusMessage()}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`glass-strong rounded-2xl p-6 flex flex-col ${
                nearestBranch?.id === location.id ? "neon-border-cyan" : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold">{location.name}</h3>
                {nearestBranch?.id === location.id && (
                  <div className="flex-shrink-0 flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                    <Navigation className="w-3 h-3" />
                    <span>ใกล้ที่สุด</span>
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <p className="text-sm text-foreground/70 mb-2">{location.address}</p>
                <p className="text-sm text-foreground/60 mb-4">โทร: {location.phone}</p>
              </div>
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
                <Navigation className="w-4 h-4 mr-2" />
                นำทาง
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MapPage;
