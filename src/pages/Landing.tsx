import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <motion.div
            className="mb-8 inline-block"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[0_0_50px_rgba(0,229,255,0.5)]">
              <img
                src="/bigbike.png"           
                alt="BigBike Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-6xl md:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="neon-text-cyan">Big</span>
            <span className="neon-text-green">Bike</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            ร้านขายบิ๊กไบค์อันดับ 1
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link to="/showroom">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary text-background hover:opacity-90 shadow-[0_0_30px_rgba(0,229,255,0.4)] text-lg px-8 py-6 group"
              >
                เข้าโชว์รูม
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/collections">
              <Button
                size="lg"
                variant="outline"
                className="glass neon-border-cyan text-lg px-8 py-6 hover:bg-primary/10"
              >
                ดูคอลเลกชัน
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <div className="glass rounded-xl p-4">
              <div className="text-3xl font-bold neon-text-cyan">10</div>
              <div className="text-sm text-foreground/60">คัน</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="text-3xl font-bold neon-text-green">5</div>
              <div className="text-sm text-foreground/60">แบรนด์</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="text-3xl font-bold neon-text-cyan">3D</div>
              <div className="text-sm text-foreground/60">รับชมแบบ</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default Landing;
