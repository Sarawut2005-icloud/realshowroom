import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getBikeBySlug } from "@/data/bikes";
import { Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  name: string;
  phone: string;
  bike: string;
  type: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

const History = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("bookings");
    if (saved) {
      setBookings(JSON.parse(saved));
    }
  }, []);

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status } : b
    );
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
    
    toast({
      title: `Booking ${status}`,
      description: "Status updated successfully",
    });
  };

  const getStatusIcon = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return "text-green-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-yellow-500";
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
          <Calendar className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="neon-text-cyan">Booking </span>
            <span className="neon-text-green">History</span>
          </h1>
          <p className="text-foreground/70 text-lg">
            {bookings.length} appointment{bookings.length !== 1 ? "s" : ""} booked
          </p>
        </motion.div>

        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-24 h-24 mx-auto mb-6 text-foreground/20" />
            <h2 className="text-2xl font-bold mb-4">No bookings yet</h2>
            <p className="text-foreground/60 mb-8">
              Book your first appointment to see your history here
            </p>
            <a href="/booking">
              <Button className="bg-gradient-to-r from-primary to-secondary text-background">
                Book Now
              </Button>
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((booking, index) => {
                const bike = getBikeBySlug(booking.bike);
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-strong rounded-2xl p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        {bike && (
                          <img
                            src={bike.image}
                            alt={bike.fullName}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(booking.status)}
                            <span className={`font-semibold capitalize ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-1">{bike?.fullName}</h3>
                          <p className="text-sm text-foreground/60 mb-2">
                            {booking.type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
                            <div>
                              <span className="text-foreground/50">Date:</span> {booking.date}
                            </div>
                            <div>
                              <span className="text-foreground/50">Time:</span> {booking.time}
                            </div>
                            <div>
                              <span className="text-foreground/50">Contact:</span> {booking.phone}
                            </div>
                          </div>
                        </div>
                      </div>

                      {booking.status === "pending" && (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, "cancelled")}
                            className="glass"
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
