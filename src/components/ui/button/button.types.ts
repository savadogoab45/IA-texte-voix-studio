// les interface de button et le role de chaque button

import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  "primary" | "secondary" | "outline" | "ghost" | "danger" | "link";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Contenu du bouton.
   */
  children: ReactNode;

  /**
   * Variante visuelle.
   * @default "primary"
   */
  variant?: ButtonVariant;

  /**
   * Taille du bouton.
   * @default "md"
   */
  size?: ButtonSize;

  /**
   * Affiche un spinner et désactive le bouton.
   */
  loading?: boolean;

  /**
   * Icône affichée à gauche.
   */
  leftIcon?: ReactNode;

  /**
   * Icône affichée à droite.
   */
  rightIcon?: ReactNode;
}
