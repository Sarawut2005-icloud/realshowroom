import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bikes } from "@/data/bikes";
import { useTranslation } from "react-i18next";


const TypingIndicator = () => (
  <motion.div
    className="flex items-center space-x-1 p-3 rounded-lg bg-secondary/20 mr-auto max-w-[80%]"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      className="w-2 h-2 bg-muted-foreground rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div
      className="w-2 h-2 bg-muted-foreground rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
    />
    <motion.div
      className="w-2 h-2 bg-muted-foreground rounded-full"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
    />
  </motion.div>
);

const AssistantMessage = ({ msg, onSuggestionClick }: { msg: Message, onSuggestionClick: (text: string) => void }) => (
  <motion.div
    className="flex flex-col items-start space-y-2"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="p-3 rounded-lg bg-secondary/20 mr-auto max-w-[80%]">
      <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
    </div>
    {msg.suggestions && (
      <div className="flex flex-wrap gap-2">
        {msg.suggestions.map((s, i) => (
          <motion.button
            key={i}
            onClick={() => onSuggestionClick(s)}
            className="text-xs px-3 py-1 rounded-full border border-primary/50 text-primary/80 hover:bg-primary/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {s}
          </motion.button>
        ))}
      </div>
    )}
  </motion.div>
);


type Message = {
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
};

const getAIResponse = (input: string): Message => {
  const lowerInput = input.toLowerCase();

  const compareRegex = /เปรียบเทียบ|เทียบ|vs|versus|compare\s(.+?)\s(and|กับ)\s(.+)/i;
  const priceUnderRegex = /(ไม่เกิน|cheaper than|under)\s(\d+)/i;
  const hpOverRegex = /(แรงกว่า|แรงเกิน|hp over|more than)\s(\d+)\s*hp/i;

  const isComparing = compareRegex.test(lowerInput);
  const isAskingPriceUnder = priceUnderRegex.exec(lowerInput);
  const isAskingHpOver = hpOverRegex.exec(lowerInput);
  
  const mentionedBikes = bikes.filter(b => lowerInput.includes(b.brand.toLowerCase()) || lowerInput.includes(b.model.toLowerCase()));
  const wantsFastest = lowerInput.includes('เร็ว') || lowerInput.includes('fast');
  const wantsCheapest = lowerInput.includes('ถูก') || lowerInput.includes('cheap');
  const wantsMostPowerful = lowerInput.includes('แรง') || lowerInput.includes('power') || lowerInput.includes('hp');
  
  if (mentionedBikes.length === 0 && (wantsFastest || wantsCheapest || wantsMostPowerful)) {
    let sortedBikes = [...bikes];
    let responseText = "ผลการค้นหา:\n";
    
    if (wantsFastest) sortedBikes.sort((a, b) => b.topSpeed - a.topSpeed);
    if (wantsMostPowerful) sortedBikes.sort((a, b) => b.horsepower - a.horsepower);
    if (wantsCheapest) sortedBikes.sort((a, b) => a.price - b.price); // เงื่อนไขสุดท้ายจะมีผลที่สุด

    responseText += sortedBikes.slice(0, 3).map(b => `- ${b.fullName} (${b.price.toLocaleString('th-TH')} บาท, ${b.horsepower} HP, ${b.topSpeed} km/h)`).join('\n');
    return { role: 'assistant', content: responseText, suggestions: ["รุ่นไหนประหยัดน้ำมันที่สุด?", "เปรียบเทียบ 2 รุ่นแรก"] };
  }

  if (isComparing || mentionedBikes.length >= 2) {
    const bikesToCompare = mentionedBikes.length >= 2 ? mentionedBikes : bikes.filter(b => isComparing && (lowerInput.includes(b.brand.toLowerCase()) || lowerInput.includes(b.model.toLowerCase())));
    if (bikesToCompare.length >= 2) {
      let responseText = `เปรียบเทียบ ${bikesToCompare.map(b => b.fullName).join(' vs ')}:\n\n`;
      bikesToCompare.forEach(b => {
        responseText += `🔵 ${b.fullName}\n- ราคา: ${b.price.toLocaleString('th-TH')} บาท\n- แรงม้า: ${b.horsepower} HP\n- ความเร็วสูงสุด: ${b.topSpeed} km/h\n\n`;
      });
      return { role: 'assistant', content: responseText, suggestions: ["รุ่นไหนคุ้มค่ากว่า?", "มีสีอะไรบ้าง?"] };
    }
  }

  if (isAskingPriceUnder) {
    const maxPrice = parseInt(isAskingPriceUnder[2].replace(/,/g, ''), 10);
    const result = bikes.filter(b => b.price <= maxPrice).sort((a, b) => b.price - a.price);
    if (result.length > 0) {
      let responseText = `มอเตอร์ไซค์ราคาไม่เกิน ${maxPrice.toLocaleString('th-TH')} บาท:\n`;
      responseText += result.map(b => `- ${b.fullName} (${b.price.toLocaleString('th-TH')} บาท)`).join('\n');
      return { role: 'assistant', content: responseText, suggestions: [`รุ่นไหนแรงที่สุดในนี้?`, `ขอข้อมูล ${result[0].model}`] };
    }
  }
  if (isAskingHpOver) {
    const minHp = parseInt(isAskingHpOver[2], 10);
    const result = bikes.filter(b => b.horsepower >= minHp).sort((a, b) => b.horsepower - a.horsepower);
     if (result.length > 0) {
      let responseText = `มอเตอร์ไซค์ที่แรงเกิน ${minHp} HP:\n`;
      responseText += result.map(b => `- ${b.fullName} (${b.horsepower} HP)`).join('\n');
      return { role: 'assistant', content: responseText, suggestions: [`รุ่นไหนถูกที่สุดในนี้?`, `เปรียบเทียบ 2 รุ่นแรก`] };
    }
  }

  if (mentionedBikes.length === 1) {
    const bike = mentionedBikes[0];
    const responseText = `ข้อมูลสำหรับ ${bike.fullName}:\n- ราคา: ${bike.price.toLocaleString('th-TH')} บาท\n- แรงม้า: ${bike.horsepower} HP\n- ซีซี: ${bike.cc} CC\n- ความเร็วสูงสุด: ${bike.topSpeed} km/h\n- รายละเอียด: ${bike.description}`;
    return { role: 'assistant', content: responseText, suggestions: [`เปรียบเทียบกับรุ่นอื่น`, `มีโปรโมชั่นอะไรบ้าง?`] };
  }

  return {
    role: 'assistant',
    content: "สวัสดีครับ! ผมสามารถให้ข้อมูลเกี่ยวกับมอเตอร์ไซค์ได้ ลองถามได้เลยครับ เช่น:\n- 'แนะนำมอเตอร์ไซค์ที่เร็วที่สุด'\n- 'เปรียบเทียบ Yamaha R1 กับ Honda CBR1000RR'\n- 'มีรุ่นไหนราคาไม่เกิน 300,000 บ้าง?'",
    suggestions: ["รุ่นไหนแรงที่สุด?", "รุ่นไหนถูกที่สุด?"]
  };
};

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);


  const handleSend = (messageText = input) => {
    if (!messageText.trim()) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");

    setTimeout(() => {
      const response = getAIResponse(messageText);
      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 1200);
  };

  const handleSuggestionClick = (text: string) => {
    handleSend(text);
  };


  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-background/50 backdrop-blur-lg rounded-full shadow-lg neon-border-cyan"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1, rotate: isOpen ? '-15deg' : '15deg' }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isOpen ? 'x' : 'msg'}
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7 neon-text-cyan" />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-28 right-6 z-50 w-[90vw] max-w-md h-[60vh] max-h-[500px] bg-background/70 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-white/10"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div className="p-4 border-b border-white/10 flex items-center gap-2">
              <Sparkles className="w-5 h-5 neon-text-cyan" />
              <h3 className="font-bold neon-text-cyan">{t('chat.title') || "Bike Expert AI"}</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                msg.role === 'user' ? (
                  <motion.div
                    key={i}
                    className="p-3 rounded-lg bg-primary/20 ml-auto max-w-[80%] text-right"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="text-sm">{msg.content}</div>
                  </motion.div>
                ) : (
                  <AssistantMessage key={i} msg={msg} onSuggestionClick={handleSuggestionClick} />
                )
              ))}

              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('chat.placeholder') || "ถามได้เลย..."}
                className="flex-1 bg-secondary/30 border-white/20 focus:ring-cyan-500"
              />
              <Button onClick={() => handleSend()} size="icon" disabled={isLoading}>
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
