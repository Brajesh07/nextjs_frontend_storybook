import { ButtonHTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      icon: Icon,
      iconPosition = "left",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
      "focus:outline-none focus:ring-2 focus:ring-offset-2",
      "disabled:opacity-50 disabled:cursor-not-allowed",
    ];

    const variants = {
      primary: [
        "bg-gradient-to-r from-primary-600 to-primary-700",
        "text-white shadow-md hover:shadow-lg",
        "hover:from-primary-700 hover:to-primary-800",
        "focus:ring-primary-500",
        "active:scale-[0.98]",
      ],
      secondary: [
        "bg-gradient-to-r from-secondary-500 to-secondary-600",
        "text-white shadow-md hover:shadow-lg",
        "hover:from-secondary-600 hover:to-secondary-700",
        "focus:ring-secondary-500",
        "active:scale-[0.98]",
      ],
      outline: [
        "border-2 border-primary-300 bg-white text-primary-700",
        "hover:bg-primary-50 hover:border-primary-400",
        "focus:ring-primary-500",
      ],
      ghost: ["text-gray-700 hover:bg-gray-100", "focus:ring-gray-500"],
      destructive: [
        "bg-red-600 text-white hover:bg-red-700",
        "focus:ring-red-500",
      ],
    };

    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-6 text-base",
      lg: "h-13 px-8 text-lg",
    };

    const classes = clsx(
      baseClasses,
      variants[variant],
      sizes[size],
      loading && "cursor-wait",
      className
    );

    return (
      <button
        className={classes}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading ? (
          <div className="loading-spinner mr-2" />
        ) : Icon && iconPosition === "left" ? (
          <Icon className="mr-2 h-4 w-4" />
        ) : null}

        {children}

        {!loading && Icon && iconPosition === "right" && (
          <Icon className="ml-2 h-4 w-4" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
