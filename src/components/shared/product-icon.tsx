import { Briefcase, Building2, Car, CarFront, Cog, Coins, GraduationCap, Home, RefreshCw, Stethoscope, User, Wallet, type LucideProps } from "lucide-react";
import type { IconName } from "@/data/lite-types";

const icons = {
  user: User,
  home: Home,
  briefcase: Briefcase,
  building: Building2,
  car: Car,
  "car-used": CarFront,
  graduation: GraduationCap,
  coins: Coins,
  stethoscope: Stethoscope,
  refresh: RefreshCw,
  cog: Cog,
  wallet: Wallet,
} as const;

export function ProductIcon({ icon, ...props }: { icon: IconName } & LucideProps) {
  const Icon = icons[icon];
  return <Icon {...props} />;
}
