import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getBikeBySlug } from "@/data/bikes";
import { Clock, CheckCircle, XCircle, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

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

  const translateStatus = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return "ยืนยันแล้ว";
      case "cancelled":
        return "ยกเลิกแล้ว";
      default:
        return "รอดำเนินการ";
    }
  };

  const translateBookingType = (type: string) => {
    switch (type) {
        case "test-ride":
            return "ทดลองขับ";
        case "rental":
            return "สอบถามเรื่องเช่า";
        case "purchase":
            return "ปรึกษาการซื้อ";
        case "service":
            return "นัดหมายบริการ";
        default:
            return type;
    }
  }

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status } : b
    );
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
    
    toast({
      title: `การจองถูก${status === 'cancelled' ? 'ยกเลิก' : 'ยืนยัน'}แล้ว`,
      description: "อัปเดตสถานะเรียบร้อยแล้ว",
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
            <span className="neon-text-cyan">ประวัติ</span>
            <span className="neon-text-green">การจอง</span>
          </h1>
          <p className="text-foreground/70 text-lg">
            มีนัดหมายทั้งหมด {bookings.length} รายการ
          </p>
        </motion.div>

        {bookings.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-24 h-24 mx-auto mb-6 text-foreground/20" />
            <h2 className="text-2xl font-bold mb-4">ยังไม่มีรายการจอง</h2>
            <p className="text-foreground/60 mb-8">
              ทำการจองครั้งแรกของคุณเพื่อดูประวัติที่นี่
            </p>
            <Link to="/booking">
              <Button className="bg-gradient-to-r from-primary to-secondary text-background">
                จองเลยตอนนี้
              </Button>
            </Link>
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
                              {translateStatus(booking.status)}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-1">{bike?.fullName}</h3>
                          <p className="text-sm text-foreground/60 mb-2">
                            {translateBookingType(booking.type)}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm text-foreground/70">
                            <div>
                              <span className="text-foreground/50">วันที่:</span> {booking.date}
                            </div>
                            <div>
                              <span className="text-foreground/50">เวลา:</span> {booking.time}
                            </div>
                            <div>
                              <span className="text-foreground/50">ติดต่อ:</span> {booking.phone}
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
                            ยกเลิก
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
