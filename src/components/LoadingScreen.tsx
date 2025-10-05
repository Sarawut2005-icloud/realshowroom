import { useEffect, useState } from "react";
import { motion, AnimatePresence, useSpring, animate } from "framer-motion";
import { useTranslation } from "react-i18next";

const AnimatedCounter = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 0.5,
      ease: "easeOut",
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      }
    });
    return () => controls.stop();
  }, [value]);

  return <>{displayValue}</>;
};

const SystemLog = ({ t }: { t: Function }) => {
  const logs = [
    "Initializing render core...",
    "Compiling shaders...",
    "Decompressing textures...",
    "Calibrating bike physics...",
    "Loading environment maps...",
    "Establishing neural link...",
    "Finalizing boot sequence...",
    t('loading.polishing'),
    t('loading.preparing'),
    t('loading.loading')
  ];
  const [currentLog, setCurrentLog] = useState(logs[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLog(logs[Math.floor(Math.random() * logs.length)]);
    }, 700);
    return () => clearInterval(interval);
  }, [logs]);

  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={currentLog}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
        className="font-mono text-xs text-primary/50"
      >
        {currentLog}
      </motion.p>
    </AnimatePresence>
  );
};


const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(
    () => sessionStorage.getItem('hasLoadedInSession') === 'true'
  );
  const { t } = useTranslation();

  useEffect(() => {
    if (loadingComplete) return;

    let currentProgress = 0;
    const updateProgress = () => {
      if (currentProgress >= 100) {
        setProgress(100);
        
        sessionStorage.setItem('hasLoadedInSession', 'true');
        
        setTimeout(() => setLoadingComplete(true), 500);
        return;
      }
      
      let increment = Math.random() * 2;
      if (currentProgress < 20) increment = Math.random() * 5;
      if (currentProgress > 85) increment = Math.random() * 0.5;
      
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);

      const nextUpdate = Math.random() * 100 + 50;
      setTimeout(updateProgress, nextUpdate);
    };
    
    setTimeout(updateProgress, 100);

  }, [loadingComplete]);

  const svgPathLength = useSpring(progress / 100, {
    stiffness: 400,
    damping: 90,
  });

  return (
    <AnimatePresence>
      {!loadingComplete && (
        <motion.div
            className="fixed inset-0 z-[200] bg-background flex items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.5 } }}
        >
            <motion.div 
                className="absolute inset-0"
                initial="initial"
                animate="animate"
                exit="exit"
                variants={{
                    initial: { opacity: 0 },
                    animate: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
                    exit: { opacity: 0, transition: { staggerChildren: 0.1, staggerDirection: -1 } }
                }}
            >
                <motion.div variants={itemVariant} className="absolute top-8 left-8 font-mono text-xs text-primary/50">STATUS: ONLINE</motion.div>
                <motion.div variants={itemVariant} className="absolute top-8 right-8 font-mono text-xs text-primary/50 text-right">
                    <p>SESSION START</p>
                    <p>{new Date().toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'medium' })}</p>
                </motion.div>
                <motion.div variants={itemVariant} className="absolute bottom-8 left-8">
                    <SystemLog t={t} />
                </motion.div>
                <motion.div variants={itemVariant} className="absolute bottom-8 right-8 text-right">
                    <p className="font-mono text-sm text-primary">BIGBIKE SHOWROOM</p>
                    <p className="font-mono text-xs text-primary/50">VERSION 2.0.25</p>
                </motion.div>
            </motion.div>
            <div className="relative w-48 h-48 flex items-center justify-center">
                <motion.svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ rotate: -90 }}>
                    <circle cx="50" cy="50" r="45" stroke="hsl(var(--primary) / 0.1)" strokeWidth="4" fill="transparent" />
                    <motion.circle cx="50" cy="50" r="45" stroke="hsl(var(--primary))" strokeWidth="4" fill="transparent" strokeDasharray="283" strokeDashoffset={283} style={{ pathLength: svgPathLength }} />
                </motion.svg>
                <div className="text-5xl font-mono font-bold neon-text-cyan">
                    <AnimatedCounter value={progress} />%
                </div>
            </div>
            <AnimatePresence>
                {progress >= 100 && (
                    <motion.div className="absolute text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1, transition: { delay: 0.2 } }}>
                        <p className="font-mono text-2xl text-primary tracking-widest">{t('loading.complete')}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const itemVariant = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export default LoadingScreen;
