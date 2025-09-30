import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { bikes, getBikeBySlug } from "@/data/bikes";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

const Compare = () => {
  const [searchParams] = useSearchParams();
  const [selectedBikes, setSelectedBikes] = useState<string[]>([]);

  useEffect(() => {
    const bikesParam = searchParams.get("bikes");
    if (bikesParam) {
      setSelectedBikes(bikesParam.split(",").slice(0, 2));
    }
  }, [searchParams]);

  const handleBikeSelect = (index: number, slug: string) => {
    const newSelection = [...selectedBikes];
    newSelection[index] = slug;
    setSelectedBikes(newSelection);
  };

  const removeBike = (index: number) => {
    const newSelection = [...selectedBikes];
    newSelection.splice(index, 1);
    setSelectedBikes(newSelection);
  };

  const bike1 = selectedBikes[0] ? getBikeBySlug(selectedBikes[0]) : null;
  const bike2 = selectedBikes[1] ? getBikeBySlug(selectedBikes[1]) : null;

  const comparisonSpecs = [
    { label: "แบรนด์", key: "brand" },
    { label: "โมเดล", key: "model" },
    { label: "ประเภท", key: "category" },
    { label: "เครื่องยนต์ (cc)", key: "cc" },
    { label: "แรงม้า (HP)", key: "horsepower" },
    { label: "แรงบิด (นิวตันเมตร)", key: "torque" },
    { label: "น้ำหนัก (กิโลกรัม)", key: "weight" },
    { label: "ความเร็วสูงสุด (กิโลเมตร/ชั่วโมง)", key: "topSpeed" },
    { label: "0-100 km/h (วินาที)", key: "zeroToHundred" },
    { label: "Price (฿)", key: "price" },
  ];

  const getBetterValue = (key: string, val1: any, val2: any) => {
    if (!val1 || !val2) return null;
    
    const higherIsBetter = ["horsepower", "torque", "topSpeed", "cc"];
    const lowerIsBetter = ["weight", "zeroToHundred", "price"];
    
    if (higherIsBetter.includes(key)) {
      return val1 > val2 ? 1 : val1 < val2 ? 2 : null;
    }
    if (lowerIsBetter.includes(key)) {
      return val1 < val2 ? 1 : val1 > val2 ? 2 : null;
    }
    return null;
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="neon-text-cyan">เปรียบเทียบ</span>
            <span className="neon-text-green">มอเตอร์ไซค์</span>
          </h1>
          <p className="text-foreground/70 text-lg">
            เลือกรถมอเตอร์ไซค์ที่คุณต้องการเปรียบเทียบ
          </p>
        </motion.div>

        {/* Bike Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[0, 1].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="glass-strong rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">คันที่ {index + 1}</h3>
                {selectedBikes[index] && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBike(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <Select
                value={selectedBikes[index] || ""}
                onValueChange={(value) => handleBikeSelect(index, value)}
              >
                <SelectTrigger className="glass">
                  <SelectValue placeholder="Select a bike" />
                </SelectTrigger>
                <SelectContent>
                  {bikes
                    .filter((b) => !selectedBikes.includes(b.slug) || b.slug === selectedBikes[index])
                    .map((bike) => (
                      <SelectItem key={bike.slug} value={bike.slug}>
                        {bike.fullName}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {selectedBikes[index] && (
                <div className="mt-4">
                  <img
                    src={(index === 0 ? bike1 : bike2)?.image}
                    alt={(index === 0 ? bike1 : bike2)?.fullName}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        {bike1 && bike2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-strong rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-left text-foreground/60">Specification</th>
                    <th className="p-4 text-center neon-text-cyan">{bike1.fullName}</th>
                    <th className="p-4 text-center neon-text-green">{bike2.fullName}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonSpecs.map((spec) => {
                    const val1 = bike1[spec.key as keyof typeof bike1];
                    const val2 = bike2[spec.key as keyof typeof bike2];
                    const better = getBetterValue(spec.key, val1, val2);

                    return (
                      <tr key={spec.key} className="border-b border-white/5 hover:bg-white/5">
                        <td className="p-4 font-medium">{spec.label}</td>
                        <td
                          className={`p-4 text-center ${
                            better === 1 ? "font-bold neon-text-cyan" : ""
                          }`}
                        >
                          {typeof val1 === "number" && spec.key === "price"
                            ? `$${val1.toLocaleString()}`
                            : val1}
                        </td>
                        <td
                          className={`p-4 text-center ${
                            better === 2 ? "font-bold neon-text-green" : ""
                          }`}
                        >
                          {typeof val2 === "number" && spec.key === "price"
                            ? `$${val2.toLocaleString()}`
                            : val2}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {(!bike1 || !bike2) && (
          <div className="text-center py-16 text-foreground/60">
            Select two bikes to start comparing
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
