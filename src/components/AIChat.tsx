import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bikes } from "@/data/bikes";
import { useTranslation } from "react-i18next";

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState("");
  const { t } = useTranslation();

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);

    // Simple AI responses based on keywords
    const lowerInput = input.toLowerCase();
    let response = "I can help you with bike specifications. Try asking about HP, CC, price, or specific bike models!";

    // Search for bike names
    const foundBike = bikes.find(bike => 
      lowerInput.includes(bike.brand.toLowerCase()) || 
      lowerInput.includes(bike.model.toLowerCase())
    );

    if (foundBike) {
      response = `${foundBike.fullName}: ${foundBike.horsepower}HP, ${foundBike.cc}CC, $${foundBike.price.toLocaleString()}. ${foundBike.description}`;
    } else if (lowerInput.includes('hp') || lowerInput.includes('power')) {
      const sorted = [...bikes].sort((a, b) => b.horsepower - a.horsepower);
      response = `Most powerful bikes: ${sorted.slice(0, 3).map(b => `${b.fullName} (${b.horsepower}HP)`).join(', ')}`;
    } else if (lowerInput.includes('price') || lowerInput.includes('cheap') || lowerInput.includes('expensive')) {
      const sorted = [...bikes].sort((a, b) => a.price - b.price);
      response = `Price range: ${sorted[0].fullName} at $${sorted[0].price.toLocaleString()} (cheapest) to ${sorted[sorted.length-1].fullName} at $${sorted[sorted.length-1].price.toLocaleString()} (most expensive)`;
    } else if (lowerInput.includes('fast') || lowerInput.includes('speed')) {
      const sorted = [...bikes].sort((a, b) => b.topSpeed - a.topSpeed);
      response = `Fastest bikes: ${sorted.slice(0, 3).map(b => `${b.fullName} (${b.topSpeed}km/h)`).join(', ')}`;
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 500);

    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 glass-strong rounded-full p-4 neon-border-cyan"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6 neon-text-cyan" />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] glass-strong rounded-2xl overflow-hidden flex flex-col"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div className="p-4 border-b border-white/10">
              <h3 className="font-bold neon-text-cyan">{t('chat.title')}</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-sm text-muted-foreground text-center mt-8">
                  Ask me about bikes! Try: "Which bike has the most HP?" or "Tell me about the Yamaha R1"
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-primary/20 ml-auto max-w-[80%]' 
                      : 'bg-secondary/20 mr-auto max-w-[80%]'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="text-sm">{msg.content}</div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chat.placeholder')}
                className="flex-1"
              />
              <Button onClick={handleSend} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;
