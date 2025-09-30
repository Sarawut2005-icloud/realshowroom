import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { bikes } from "@/data/bikes";
import { useTranslation } from "react-i18next";

const GamificationTracker = () => {
  const [viewedBikes, setViewedBikes] = useState<string[]>([]);
  const [badge, setBadge] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem('viewedBikes') || '[]');
    setViewedBikes(viewed);

    // Check for brand badges
    const brands = ['Yamaha', 'Kawasaki', 'Ducati', 'Honda', 'BMW'];
    for (const brand of brands) {
      const brandBikes = bikes.filter(b => b.brand === brand);
      const viewedBrandBikes = brandBikes.filter(b => viewed.includes(b.slug));
      if (viewedBrandBikes.length === brandBikes.length) {
        setBadge(`${brand.toLowerCase()}Fan`);
        break;
      }
    }
  }, []);

  if (viewedBikes.length === 0) return null;

  return (
    <motion.div
      className="fixed top-20 right-6 z-40 glass-strong rounded-lg p-4 space-y-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5 text-secondary" />
        <span className="text-sm">
          {t('gamification.viewed', { count: viewedBikes.length, total: bikes.length })}
        </span>
      </div>

      {badge && (
        <div className="text-xs neon-text-cyan">
          {t('gamification.badge', { name: t(`gamification.${badge}`) })}
        </div>
      )}

      <div className="w-full bg-muted rounded-full h-2">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(viewedBikes.length / bikes.length) * 100}%` }}
        />
      </div>
    </motion.div>
  );
};

export default GamificationTracker;
