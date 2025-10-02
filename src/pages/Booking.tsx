import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom"; // เพิ่ม useSearchParams
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

// Interface สำหรับข้อมูลการจอง
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
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bike: "",
    type: "",
    date: "",
    time: "",
  });

  // ✅ Improvement: Pre-select bike from URL parameter
  useEffect(() => {
    const bikeSlug = searchParams.get("bike");
    if (bikeSlug && bikes.some(b => b.slug === bikeSlug)) {
      setFormData(prev => ({ ...prev, bike: bikeSlug }));
    }
  }, [searchParams]);

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

    // แปลข้อความ Toast Notification
    toast({
      title: "ส่งข้อมูลการจองแล้ว!",
      description: "เราจะติดต่อกลับเพื่อยืนยันนัดหมายของคุณในเร็วๆ นี้",
    });

    // Reset form
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
  
  // สร้างวันที่ปัจจุบันสำหรับ input date (ป้องกันการเลือกวันในอดีต)
  const today = new Date().toISOString().split("T")[0];

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
            <span className="neon-text-cyan">จอง</span>
            <span className="neon-text-green">นัดหมาย</span>
          </h1>
          <p className="text-foreground/70 text-lg">
            กรุณากรอกข้อมูลเพื่อทดลองขับ, สอบถาม หรือนัดหมายเข้ารับบริการ
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
              <Label htmlFor="name">ชื่อ-นามสกุล</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                className="glass mt-2"
                placeholder="สมชาย ใจดี"
              />
            </div>

            <div>
              <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
                className="glass mt-2"
                placeholder="0812345678"
                pattern="[0-9]{10}" // ✅ Improvement: Basic phone validation
                title="กรุณากรอกเบอร์โทรศัพท์ 10 หลัก"
              />
            </div>

            <div>
              <Label htmlFor="bike">เลือกรุ่นมอเตอร์ไซค์</Label>
              <Select value={formData.bike} onValueChange={(val) => handleChange("bike", val)} required>
                <SelectTrigger className="glass mt-2">
                  <SelectValue placeholder="-- เลือกรุ่นมอเตอร์ไซค์ --" />
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
              <Label htmlFor="type">ประเภทการนัดหมาย</Label>
              <Select value={formData.type} onValueChange={(val) => handleChange("type", val)} required>
                <SelectTrigger className="glass mt-2">
                  <SelectValue placeholder="-- เลือกประเภทการนัดหมาย --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="test-ride">ทดลองขับ (Test Ride)</SelectItem>
                  <SelectItem value="purchase">ปรึกษาการซื้อ</SelectItem>
                  <SelectItem value="service">นัดหมายเข้ารับบริการ (Service)</SelectItem>
                  <SelectItem value="rental">สอบถามเรื่องเช่า</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date">วันที่สะดวก</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  required
                  className="glass mt-2"
                  min={today} // ป้องกันการเลือกวันที่ผ่านมาแล้ว
                />
              </div>

              <div>
                <Label htmlFor="time">เวลาที่สะดวก</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  required
                  className="glass mt-2"
                  min="09:00" // ✅ Improvement: Set business hours
                  max="18:00" // ✅ Improvement: Set business hours
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-primary to-secondary text-background"
            >
              ยืนยันการจอง
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Booking;