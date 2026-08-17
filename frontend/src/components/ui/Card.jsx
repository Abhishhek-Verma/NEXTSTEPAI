import React from 'react';
import { cn } from '../../utils/cn';

const Card = React.forwardRef(({ 
  className, 
  children, 
  hover = false,
  gradient = false,
  glass = false,
  pastel = null,
  ...props 
}, ref) => {
  const pastelClasses = {
    blue: 'card-pastel-blue',
    mint: 'card-pastel-mint',
    yellow: 'card-pastel-yellow',
    pink: 'card-pastel-pink',
    purple: 'card-pastel-purple',
  };

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl overflow-hidden transition-all duration-300",
        hover && "card-hover cursor-pointer",
        pastel && pastelClasses[pastel]
          ? pastelClasses[pastel]
          : gradient
            ? "bg-ai-gradient-subtle border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)]"
            : glass
              ? "glass"
              : "bg-white border border-[#E8E5DF] shadow-card dark:bg-[#1F2023] dark:border-[rgba(255,255,255,0.08)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl font-semibold leading-tight tracking-tight text-[#111111] dark:text-white",
      className
    )}
    {...props}
  >
    {children}
  </h3>
));

CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-[#6B6B6B] dark:text-[#A1A1A1]", className)}
    {...props}
  >
    {children}
  </p>
));

CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props}>
    {children}
  </div>
));

CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
export default Card;
