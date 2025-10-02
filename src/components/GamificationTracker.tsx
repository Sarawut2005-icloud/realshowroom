import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award } from "lucide-react";
import { bikes } from "@/data/bikes";
import { useTranslation } from "react-i18next";
import { achievements, Achievement } from "@/data/achievements"; // ปรับ path ตามที่เก็บไฟล์
import Confetti from 'react-confetti';
import { useWindowSize } from '@uidotdev/usehooks';

// --- ✨ NEW: Toast Notification Component ---
const AchievementToast = ({ achievement, onEnd }: { achievement: Achievement; onEnd: () => void }) => {
  const { t } = useTranslation();
  const { width, height } = useWindowSize();

  useEffect(() => {
    const timer = setTimeout(onEnd, 5000); // Toast หายไปใน 5 วินาที
    return () => clearTimeout(timer);
  }, [onEnd]);
  
  const achievementName = t(achievement.nameKey, { brand: bikes.find(b => achievement.id.startsWith(b.brand.toLowerCase()))?.brand || '' });

  return (
    <>
      <Confetti width={width || 0} height={height || 0} numberOfPieces={200} recycle={false} onConfettiComplete={onEnd} />
      <motion.div
        className="fixed top-24 right-6 z-50 flex items-center gap-4 p-4 rounded-lg shadow-lg bg-gradient-to-br from-background/70 via-secondary/80 to-background/70 backdrop-blur-md border border-primary/50"
        layoutId={`achievement-${achievement.id}`}
        initial={{ opacity: 0, y: 50, scale: 0.3 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      >
        <achievement.icon className="w-10 h-10 text-primary animate-pulse" />
        <div>
          <p className="font-bold text-primary">{t('gamification.unlocked')}</p>
          <p className="text-sm text-foreground">{achievementName}</p>
        </div>
      </motion.div>
    </>
  );
};


const GamificationTracker = () => {
  const [viewedBikes, setViewedBikes] = useState<string[]>([]);
  const [unlocked, setUnlocked] = useState<Achievement[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement | null>(null);
  const { t } = useTranslation();

  const checkAchievements = useCallback((currentViewed: string[]) => {
    const alreadyUnlockedIds = new Set(unlocked.map(a => a.id));
    
    for (const achievement of achievements) {
      if (!alreadyUnlockedIds.has(achievement.id)) {
        if (achievement.condition(currentViewed, bikes)) {
          setNewlyUnlocked(achievement); // ตั้งค่าเพื่อแสดง Toast
          setUnlocked(prev => [...prev, achievement]);
          break; // แสดงทีละ 1 achievement เพื่อไม่ให้รก
        }
      }
    }
  }, [unlocked]);

  // --- ✨ REAL-TIME UPDATE LOGIC ---
  useEffect(() => {
    // โหลดข้อมูลครั้งแรก
    const initialViewed = JSON.parse(localStorage.getItem('viewedBikes') || '[]');
    setViewedBikes(initialViewed);

    // คำนวณ achievements ที่มีอยู่แล้วตอนโหลด
    const alreadyUnlocked = achievements.filter(ach => ach.condition(initialViewed, bikes));
    setUnlocked(alreadyUnlocked);

    // สร้าง Listener เพื่อรอรับสัญญาณ 'bikeViewed'
    const handleBikeViewed = (event: Event) => {
      const customEvent = event as CustomEvent;
      const newViewedList = customEvent.detail.newViewedList;
      setViewedBikes(newViewedList);
      checkAchievements(newViewedList);
    };

    window.addEventListener('bikeViewed', handleBikeViewed);

    // Cleanup listener เมื่อ component ถูก unmount
    return () => {
      window.removeEventListener('bikeViewed', handleBikeViewed);
    };
  }, [checkAchievements]);


  if (viewedBikes.length === 0) return null;

  const progress = (viewedBikes.length / bikes.length) * 100;

  return (
    <>
      <AnimatePresence>
        {newlyUnlocked && (
          <AchievementToast
            achievement={newlyUnlocked}
            onEnd={() => setNewlyUnlocked(null)}
          />
        )}
      </AnimatePresence>

      <motion.div
        className="fixed top-6 right-6 z-40 w-64 bg-background/50 backdrop-blur-lg rounded-lg p-4 border border-white/10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <p className="text-sm font-bold text-foreground">{t('gamification.progress')}</p>
          </div>
          <p className="text-sm font-mono text-primary">{Math.round(progress)}%</p>
        </div>

        <div className="w-full bg-muted/50 rounded-full h-2.5 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        
        {unlocked.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10">
             <p className="text-xs text-muted-foreground mb-2">{t('gamification.achievements')}:</p>
             <div className="flex flex-wrap gap-2">
                {unlocked.map(ach => (
                    <div key={ach.id} className="p-1.5 bg-secondary/50 rounded-full" title={t(ach.nameKey, { brand: bikes.find(b => ach.id.startsWith(b.brand.toLowerCase()))?.brand || '' })}>
                        <ach.icon className="w-4 h-4 text-primary/80"/>
                    </div>
                ))}
             </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default GamificationTracker;