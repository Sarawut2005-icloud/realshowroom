import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const navLinks = [
    { name: t('nav.home'), path: "/" },
    { name: t('nav.showroom'), path: "/showroom" },
    { name: t('nav.collections'), path: "/collections" },
    { name: t('nav.map'), path: "/map" },
    { name: t('nav.history'), path: "/history" },
  ];

  const languages = [
    { code: 'th', name: 'ไทย' },
    { code: 'en', name: 'English' },
    { code: 'ja', name: '日本語' },
    { code: 'zh', name: '中文' },
    { code: 'ko', name: '한국어' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(187,100%,50%)] to-[hsl(158,100%,50%)] flex items-center justify-center">
              <span className="text-background font-bold text-xl">BB</span>
            </div>
            <span className="text-xl font-bold neon-text-cyan hidden sm:inline">BigBike</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive(link.path)
                    ? "text-primary font-medium bg-primary/10"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Select value={i18n.language} onValueChange={(lang) => i18n.changeLanguage(lang)}>
              <SelectTrigger className="w-[120px] glass">
                <Globe className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Link to="/wishlist">
              <Button variant="ghost" className="text-foreground/80 hover:text-primary">
                {t('nav.wishlist')}
              </Button>
            </Link>
            <Link to="/booking">
              <Button className="bg-gradient-to-r from-primary to-secondary text-background hover:opacity-90 shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                {t('nav.bookNow')}
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg glass"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-white/10"
          >
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActive(link.path)
                      ? "text-primary font-medium bg-primary/10 neon-border-cyan"
                      : "text-foreground/80 hover:bg-primary/5"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    {t('nav.wishlist')}
                  </Button>
                </Link>
                <Link to="/booking" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-primary to-secondary text-background">
                    {t('nav.bookNow')}
                  </Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
