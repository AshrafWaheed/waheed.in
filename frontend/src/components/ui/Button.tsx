"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

type Variant = "primary" | "outline" | "ghost";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** When provided, renders as a Next.js Link instead of a <button> */
  href?: string;
}

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-sm transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--green)] disabled:opacity-50 disabled:cursor-not-allowed";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-[var(--yellow)] text-[var(--text-dark)] hover:bg-[var(--yellow-soft)] font-semibold shadow-sm",
  outline: "border border-[var(--cream)] text-[var(--cream)] hover:bg-[var(--cream)] hover:text-[var(--text-dark)]",
  ghost:   "text-[var(--green)] hover:text-[var(--green-dark)] underline-offset-4 hover:underline",
};

const SIZES: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", href, children, ...props }, ref) => {
    const cls = [BASE, VARIANTS[variant], SIZES[size], className].join(" ");

    if (href) {
      return (
        <Link href={href} className={cls}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={cls} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
