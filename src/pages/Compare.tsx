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

type Bike = ReturnType<typeof getBikeBySlug>;

const Compare = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedBikes, setSelectedBikes] = useState<string[]>([]);

  useEffect(() => {
    const bikesParam = searchParams.get("bikes");
    if (bikesParam) {
      const initialBikes = bikesParam.split(",").filter(Boolean).slice(0, 2);
      setSelectedBikes(initialBikes);
    }
  }, []);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (selectedBikes.length > 0) {
      newSearchParams.set("bikes", selectedBikes.join(","));
    } else {
      newSearchParams.delete("bikes");
    }
    setSearchParams(newSearchParams, { replace: true });
  }, [selectedBikes, setSearchParams]);

  const handleBikeSelect = (index: number, slug: string) => {
    const newSelection = [...selectedBikes];
    newSelection[index] = slug;
    setSelectedBikes(newSelection);
  };

  const removeBike = (index: number) => {
    const newSelection = selectedBikes.filter((_, i) => i !== index);
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
    { label: "ความเร็วสูงสุด (กม./ชม.)", key: "topSpeed" },
    { label: "0-100 กม./ชม. (วินาที)", key: "zeroToHundred" },
    { label: "ราคา (บาท)", key: "price" },
  ];

  const getBetterValue = (key: string, val1: any, val2: any) => {
    if (val1 === undefined || val1 === null || val2 === undefined || val2 === null) return null;

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
            เลือกรถมอเตอร์ไซค์ 2 คันที่คุณต้องการเปรียบเทียบ
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[0, 1].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="glass-strong rounded-2xl p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">คันที่ {index + 1}</h3>
                {selectedBikes[index] && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBike(index)}
                    aria-label={`ลบรถคันที่ ${index + 1}`}
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
                  <SelectValue placeholder="-- เลือกรถมอเตอร์ไซค์ --" />
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
                <div className="mt-4 flex-grow flex items-center justify-center">
                  <img
                    src={(index === 0 ? bike1 : bike2)?.image}
                    alt={(index === 0 ? bike1 : bike2)?.fullName}
                    className="w-full h-48 object-contain rounded-lg"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {bike1 && bike2 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-strong rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-left font-semibold text-foreground/60 w-1/3">คุณสมบัติ</th>
                    <th className="p-4 text-center font-semibold neon-text-cyan w-1/3">{bike1.fullName}</th>
                    <th className="p-4 text-center font-semibold neon-text-green w-1/3">{bike2.fullName}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonSpecs.map((spec) => {
                    const val1 = bike1[spec.key as keyof Bike];
                    const val2 = bike2[spec.key as keyof Bike];
                    const better = getBetterValue(spec.key, val1, val2);

                    const formatValue = (value: any, key: string) => {
                      if (value === null || value === undefined) return "-";
                      if (typeof value === "number" && key === "price") {
                        return `${value.toLocaleString("th-TH")} ฿`;
                      }
                      if (typeof value === "number") {
                        return value.toLocaleString("th-TH");
                      }
                      return value;
                    };

                    return (
                      <tr key={spec.key} className="border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
                        <td className="p-4 font-medium">{spec.label}</td>
                        <td className={`p-4 text-center ${better === 1 ? "font-bold neon-text-cyan" : ""}`}>
                          {formatValue(val1, spec.key)}
                        </td>
                        <td className={`p-4 text-center ${better === 2 ? "font-bold neon-text-green" : ""}`}>
                          {formatValue(val2, spec.key)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-16 text-foreground/60">
            <p className="text-lg">กรุณาเลือกรถมอเตอร์ไซค์ 2 คันเพื่อเริ่มการเปรียบเทียบ</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;
