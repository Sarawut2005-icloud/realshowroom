import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Landing from "./pages/Landing";
import Showroom from "./pages/Showroom";
import Collections from "./pages/Collections";
import BikeDetail from "./pages/BikeDetail";
import Compare from "./pages/Compare";
import Wishlist from "./pages/Wishlist";
import Booking from "./pages/Booking";
import History from "./pages/History";
import MapPage from "./pages/MapPage";
import NotFound from "./pages/NotFound";
import AIChat from "./components/AIChat";
import OnboardingOverlay from "./components/OnboardingOverlay";
import GamificationTracker from "./components/GamificationTracker";
import LoadingScreen from "./components/LoadingScreen";
import { useEasterEgg } from "./hooks/useEasterEgg";

const queryClient = new QueryClient();

const App = () => {
  const easterEgg = useEasterEgg();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className={easterEgg ? "relative" : ""}>
            {easterEgg && (
              <div className="fixed inset-0 pointer-events-none z-[150] bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 animate-pulse" />
            )}
            <LoadingScreen />
            <OnboardingOverlay />
            <GamificationTracker />
            <AIChat />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route
                path="/*"
                element={
                  <>
                    <Header />
                    <Routes>
                      <Route path="/showroom" element={<Showroom />} />
                      <Route path="/collections" element={<Collections />} />
                      <Route path="/bike/:slug" element={<BikeDetail />} />
                      <Route path="/compare" element={<Compare />} />
                      <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/booking" element={<Booking />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/map" element={<MapPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </>
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
