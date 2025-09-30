import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);
  const { t } = useTranslation();

  const messages = [
    t('loading.polishing'),
    t('loading.preparing'),
    t('loading.loading')
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setShow(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] bg-background flex items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center space-y-6">
            <motion.div
              className="text-6xl font-bold neon-text-cyan"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {progress}%
            </motion.div>

            <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <motion.p
              className="text-sm text-muted-foreground"
              key={Math.floor(progress / 33)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {messages[Math.floor(progress / 33) % messages.length]}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
