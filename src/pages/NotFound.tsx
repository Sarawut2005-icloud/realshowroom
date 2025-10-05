import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      `404 Error: Path not found -> ${location.pathname}`
    );
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-4">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center glass-strong rounded-2xl p-8 md:p-12 max-w-lg w-full"
      >
        <AlertTriangle className="mx-auto h-16 w-16 text-yellow-400 mb-6" />

        <h1 className="mb-4 text-8xl font-black neon-text-cyan tracking-tighter">
          404
        </h1>

        <p className="mb-4 text-2xl font-bold text-foreground">
          ขออภัย, ไม่พบหน้าที่คุณต้องการ
        </p>

        <p className="mb-8 text-sm text-foreground/60">
          คุณพยายามเข้าถึง:{" "}
          <code className="bg-white/10 px-2 py-1 rounded-md text-red-400">
            {location.pathname}
          </code>
        </p>

        <Link to="/">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary text-background"
          >
            กลับสู่หน้าหลัก
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
