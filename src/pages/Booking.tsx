import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { bikes } from "@/data/bikes";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";

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

const Booking = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bike: "",
    type: "",
    date: "",
    time: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const booking: Booking = {
      id: Date.now().toString(),
      ...formData,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const existingBookings = localStorage.getItem("bookings");
    const bookings = existingBookings ? JSON.parse(existingBookings) : [];
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    toast({
      title: "Booking submitted!",
      description: "We'll contact you shortly to confirm your appointment.",
    });

    setFormData({
      name: "",
      phone: "",
      bike: "",
      type: "",
      date: "",
      time: "",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <Calendar className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="neon-text-cyan">Book </span>
            <span className="neon-text-green">Appointment</span>
          </h1>
          <p className="text-foreground/70 text-lg">
            Schedule a test ride, rental, or purchase consultation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-strong rounded-2xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                className="glass mt-2"
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
                className="glass mt-2"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <Label htmlFor="bike">Select Bike</Label>
              <Select value={formData.bike} onValueChange={(val) => handleChange("bike", val)}>
                <SelectTrigger className="glass mt-2">
                  <SelectValue placeholder="Choose a bike" />
                </SelectTrigger>
                <SelectContent>
                  {bikes.map((bike) => (
                    <SelectItem key={bike.slug} value={bike.slug}>
                      {bike.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Appointment Type</Label>
              <Select value={formData.type} onValueChange={(val) => handleChange("type", val)}>
                <SelectTrigger className="glass mt-2">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="test-ride">Test Ride</SelectItem>
                  <SelectItem value="rental">Rental Inquiry</SelectItem>
                  <SelectItem value="purchase">Purchase Consultation</SelectItem>
                  <SelectItem value="service">Service Appointment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date">Preferred Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                  className="glass mt-2"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <Label htmlFor="time">Preferred Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  required
                  className="glass mt-2"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-secondary text-background"
            >
              Submit Booking
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;
