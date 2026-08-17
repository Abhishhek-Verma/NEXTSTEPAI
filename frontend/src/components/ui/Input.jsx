import React from "react";
import { cn } from "../../utils/cn";

const Input = React.forwardRef(({
    className,
    type = "text",
    label,
    description,
    error,
    required = false,
    id,
    ...props
}, ref) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random()?.toString(36)?.substr(2, 9)}`;

    // Base input classes - premium design
    const baseInputClasses = "flex h-11 w-full rounded-xl border border-[#E8E5DF] bg-white px-4 py-2.5 text-[15px] text-[#111111] ring-offset-white placeholder:text-[#909090] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/10 focus-visible:border-[#111111]/30 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 dark:bg-[#1F2023] dark:border-[rgba(255,255,255,0.1)] dark:text-white dark:placeholder:text-[#666] dark:ring-offset-[#0C0D0E] dark:focus-visible:ring-white/10 dark:focus-visible:border-white/30";

    // Checkbox-specific styles
    if (type === "checkbox") {
        return (
            <input
                type="checkbox"
                className={cn(
                    "h-4 w-4 rounded border border-[#E8E5DF] bg-white text-[#111111] focus:ring-2 focus:ring-[#111111]/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#1F2023] dark:border-[rgba(255,255,255,0.1)]",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    // Radio button-specific styles
    if (type === "radio") {
        return (
            <input
                type="radio"
                className={cn(
                    "h-4 w-4 rounded-full border border-[#E8E5DF] bg-white text-[#111111] focus:ring-2 focus:ring-[#111111]/20 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#1F2023] dark:border-[rgba(255,255,255,0.1)]",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    // For regular inputs with wrapper structure
    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={inputId}
                    className={cn(
                        "text-sm font-medium leading-none",
                        error ? "text-[#EF4444]" : "text-[#404040] dark:text-[#A1A1A1]"
                    )}
                >
                    {label}
                    {required && <span className="text-[#EF4444] ml-1">*</span>}
                </label>
            )}

            <input
                type={type}
                className={cn(
                    baseInputClasses,
                    error && "border-[#EF4444] focus-visible:ring-[#EF4444]/20 focus-visible:border-[#EF4444]",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />

            {description && !error && (
                <p className="text-sm text-[#909090] dark:text-[#666]">
                    {description}
                </p>
            )}

            {error && (
                <p className="text-sm text-[#EF4444]">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;