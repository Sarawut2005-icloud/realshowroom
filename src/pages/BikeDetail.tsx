import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getBikeBySlug } from "@/data/bikes"; // สมมติว่า path นี้ถูกต้อง
import BikeViewer3D from "@/components/BikeViewer3D"; // สมมติว่า path นี้ถูกต้อง
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Share2, Gauge, Zap, TrendingUp, Weight, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast"; // สมมติว่า path นี้ถูกต้อง
import { useState, useEffect } from "react";

const BikeDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const bike = getBikeBySlug(slug || "");

  const [wishlist, setWishlist] = useState<string[]>([]);

  // ใช้ useEffect เพื่ออ่านค่าจาก localStorage เพียงครั้งเดียวเมื่อ component โหลด
  useEffect(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      setWishlist(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage", error);
      setWishlist([]);
    }
  }, []);

  // หน้าสำหรับกรณีที่ไม่พบข้อมูลมอเตอร์ไซค์
  if (!bike) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <h1 className="text-4xl font-bold mb-4">ไม่พบมอเตอร์ไซค์คันนี้</h1>
          <Link to="/collections">
            <Button>กลับไปที่คอลเลกชัน</Button>
          </Link>
        </div>
      </div>
    );
  }

  // ฟังก์ชันเพิ่ม/ลบ Wishlist
  const toggleWishlist = () => {
    const isWishlisted = wishlist.includes(bike.slug);
    const newWishlist = isWishlisted
      ? wishlist.filter((s) => s !== bike.slug)
      : [...wishlist, bike.slug];
    
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    
    toast({
      title: isWishlisted ? "ลบออกจากรายการโปรดแล้ว" : "เพิ่มในรายการโปรดแล้ว",
      description: bike.fullName,
    });
  };

  // ฟังก์ชันแชร์ (ปรับปรุงใหม่)
  const handleShare = async () => {
    const shareData = {
      title: bike.fullName,
      text: `ดูรายละเอียด ${bike.fullName} ได้ที่นี่!`,
      url: window.location.href,
    };
    // ใช้ Web Share API ถ้า browser รองรับ (สำหรับมือถือ)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: คัดลอกลิงก์สำหรับ Desktop
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "คัดลอกลิงก์แล้ว!",
        description: "คุณสามารถนำลิงก์ไปแชร์ต่อได้เลย",
      });
    }
  };

  // แปลข้อมูล Specs เป็นภาษาไทย
  const specs = [
    { label: "เครื่องยนต์", value: `${bike.cc.toLocaleString('th-TH')} cc`, icon: Gauge },
    { label: "แรงม้า", value: `${bike.horsepower.toLocaleString('th-TH')} HP`, icon: Zap },
    { label: "แรงบิด", value: `${bike.torque.toLocaleString('th-TH')} Nm`, icon: TrendingUp },
    { label: "น้ำหนัก", value: `${bike.weight.toLocaleString('th-TH')} กก.`, icon: Weight },
    { label: "ความเร็วสูงสุด", value: `${bike.topSpeed.toLocaleString('th-TH')} กม./ชม.`, icon: TrendingUp },
    { label: "อัตราเร่ง 0-100 กม./ชม.", value: `${bike.zeroToHundred} วินาที`, icon: Timer },
  ];

  const isBikeInWishlist = wishlist.includes(bike.slug);

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="glass">
            <ArrowLeft className="mr-2 w-4 h-4" />
            ย้อนกลับ
          </Button>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="text-sm text-foreground/60 mb-2">{bike.brand}</div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">
                <span className="neon-text-cyan">{bike.model}</span>
              </h1>
              <p className="text-lg text-foreground/70 max-w-2xl">{bike.description}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button variant="outline" size="icon" onClick={toggleWishlist} className={`glass ${isBikeInWishlist ? "text-red-500 border-red-500/50" : ""}`} aria-label="เพิ่มในรายการโปรด">
                <Heart className={isBikeInWishlist ? "fill-current" : ""} />
              </Button>
              <Button variant="outline" size="icon" className="glass" onClick={handleShare} aria-label="แชร์">
                <Share2 />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* 3D Viewer */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }} className="mb-12 glass-strong rounded-2xl overflow-hidden">
          <BikeViewer3D modelPath={bike.model3d} className="w-full h-[60vh]" />
        </motion.div>

        {/* Specs Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-3xl font-bold mb-6 neon-text-green">ข้อมูลจำเพาะ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specs.map((spec) => {
              const Icon = spec.icon;
              return (
                <div key={spec.label} className="glass-strong rounded-xl p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-background" />
                    </div>
                    <div className="text-sm text-foreground/60">{spec.label}</div>
                  </div>
                  <div className="text-2xl font-bold neon-text-cyan break-words">{spec.value}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Price & CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-strong rounded-2xl p-8 mt-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="text-sm text-foreground/60 mb-2">ราคาเริ่มต้น</div>
              <div className="text-4xl md:text-5xl font-bold neon-text-cyan flex items-center">
                {/* แก้ไขการแสดงผลราคาเป็นสกุลเงินบาท (฿) */}
                {bike.price.toLocaleString('th-TH')} ฿
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to={`/compare?bikes=${bike.slug}`}>
                <Button variant="outline" size="lg" className="glass w-full sm:w-auto">
                  เปรียบเทียบ
                </Button>
              </Link>
              <Link to="/booking">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-background w-full sm:w-auto">
                  จองทดลองขับ
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