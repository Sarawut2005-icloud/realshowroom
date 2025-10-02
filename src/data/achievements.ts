import { Bike } from '@/data/bikes'; // ตรวจสอบว่ามีการ export type 'Bike'
import { Trophy, Star, Crown, Rocket, Gem } from 'lucide-react';

export interface Achievement {
  id: string;
  nameKey: string; // Key สำหรับ i18next
  descriptionKey: string; // Key สำหรับ i18next
  icon: React.ElementType;
  condition: (viewedSlugs: string[], allBikes: Bike[]) => boolean;
}

export const achievements: Achievement[] = [
  // Milestone Achievements
  {
    id: 'firstLook',
    nameKey: 'achievements.firstLook.name',
    descriptionKey: 'achievements.firstLook.desc',
    icon: Star,
    condition: (viewed) => viewed.length >= 1,
  },
  {
    id: 'enthusiast',
    nameKey: 'achievements.enthusiast.name',
    descriptionKey: 'achievements.enthusiast.desc',
    icon: Trophy,
    condition: (viewed) => viewed.length >= 10,
  },
  {
    id: 'collector',
    nameKey: 'achievements.collector.name',
    descriptionKey: 'achievements.collector.desc',
    icon: Gem,
    condition: (viewed, all) => viewed.length >= all.length / 2,
  },
  {
    id: 'masterExplorer',
    nameKey: 'achievements.masterExplorer.name',
    descriptionKey: 'achievements.masterExplorer.desc',
    icon: Crown,
    condition: (viewed, all) => viewed.length === all.length,
  },
  // Brand Fan Achievements
  ...['Yamaha', 'Kawasaki', 'Ducati', 'Honda', 'BMW'].map(brand => ({
    id: `${brand.toLowerCase()}Fan`,
    nameKey: `achievements.brandFan.name`,
    descriptionKey: `achievements.brandFan.desc`,
    icon: Rocket,
    condition: (viewed: string[], allBikes: Bike[]) => {
      const brandBikes = allBikes.filter(b => b.brand === brand);
      if (brandBikes.length === 0) return false;
      return brandBikes.every(b => viewed.includes(b.slug));
    },
  }) as Achievement),
];