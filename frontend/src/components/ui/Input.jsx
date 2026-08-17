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

    // Base input classes - premium design with new palette
    const baseInputClasses = "flex h-11 w-full rounded-xl border border-[#D9CFC7] bg-[#EFE9E3] px-4 py-2.5 text-[15px] text-[#000000] ring-offset-[#F9F8F6] placeholder:text-[#777777] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9B59C] focus-visible:border-[#C9B59C] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 dark:bg-[#262422] dark:border-[rgba(217,207,199,0.15)] dark:text-white dark:placeholder:text-[#888] dark:ring-offset-[#1C1B1A] dark:focus-visible:ring-[#C9B59C]";

    // Checkbox-specific styles
    if (type === "checkbox") {
        return (
            <input
                type="checkbox"
                className={cn(
                    "h-4 w-4 rounded border border-[#D9CFC7] bg-[#EFE9E3] text-[#C9B59C] focus:ring-2 focus:ring-[#C9B59C] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#262422] dark:border-[rgba(217,207,199,0.15)]",
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
                    "h-4 w-4 rounded-full border border-[#D9CFC7] bg-[#EFE9E3] text-[#C9B59C] focus:ring-2 focus:ring-[#C9B59C] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#262422] dark:border-[rgba(217,207,199,0.15)]",
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
                        error ? "text-[#C9B59C]" : "text-[#000000] dark:text-white"
                    )}
                >
                    {label}
                    {required && <span className="text-[#C9B59C] ml-1">*</span>}
                </label>
            )}

            <input
                type={type}
                className={cn(
                    baseInputClasses,
                    error && "border-[#C9B59C] focus-visible:ring-[#C9B59C] focus-visible:border-[#C9B59C]",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />

            {description && !error && (
                <p className="text-sm text-[#555555] dark:text-[#A1A1A1]">
                    {description}
                </p>
            )}

            {error && (
                <p className="text-sm text-[#C9B59C]">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;