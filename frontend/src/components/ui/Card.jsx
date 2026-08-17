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
            ? "bg-ai-gradient-subtle border border-[#D9CFC7] dark:border-[rgba(217,207,199,0.15)]"
            : glass
              ? "glass"
              : "bg-[#EFE9E3] border border-[#D9CFC7] shadow-card dark:bg-[#262422] dark:border-[rgba(217,207,199,0.15)]",
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
      "text-xl font-semibold leading-tight tracking-tight text-[#000000] dark:text-white",
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
    className={cn("text-sm text-[#555555] dark:text-[#A1A1A1]", className)}
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
