import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const OnboardingOverlay = () => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-strong rounded-2xl p-8 max-w-md space-y-6"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold neon-text-cyan text-center">
              {t('onboarding.welcome')}
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <p className="text-sm">{t('onboarding.tip1')}</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-secondary font-bold">2</span>
                </div>
                <p className="text-sm">{t('onboarding.tip2')}</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">3</span>
                </div>
                <p className="text-sm">{t('onboarding.tip3')}</p>
              </div>
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-primary to-secondary text-background"
            >
              {t('onboarding.gotIt')}
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingOverlay;
