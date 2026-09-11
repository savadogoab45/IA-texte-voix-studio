import { BarChart3, CreditCard, History, Home, Settings, Sparkles } from "lucide-react";

export const marketingNavigation = [
  { label: "Accueil", href: "/" },
  { label: "Tarifs", href: "/#pricing" },
  { label: "Connexion", href: "/auth/sign-in" }
];

export const dashboardNavigation = [
  { label: "Vue d'ensemble", href: "/dashboard", icon: Home },
  { label: "Generation", href: "/dashboard", icon: Sparkles },
  { label: "Historique", href: "/dashboard/history", icon: History },
  { label: "Facturation", href: "/dashboard/billing", icon: CreditCard },
  { label: "Statistiques", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Parametres", href: "/dashboard/settings", icon: Settings }
];
