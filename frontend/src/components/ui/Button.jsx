import React from 'react';
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../utils/cn";
import Icon from '../AppIcon';

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9B59C]/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-[#C9B59C] text-[#000000] rounded-full hover:bg-[#B8A388] hover:-translate-y-0.5 hover:shadow-md dark:bg-[#C9B59C] dark:text-[#000000] dark:hover:bg-[#B8A388]",
                destructive: "bg-[#C9B59C] text-[#000000] rounded-full hover:bg-[#B8A388]",
                outline: "border border-[#D9CFC7] bg-[#F9F8F6] text-[#000000] rounded-full hover:bg-[#EFE9E3] hover:-translate-y-0.5 hover:shadow-soft dark:bg-[#262422] dark:text-[#F9F8F6] dark:border-[rgba(217,207,199,0.15)] dark:hover:bg-[#33302D]",
                secondary: "bg-[#EFE9E3] text-[#000000] border border-[#D9CFC7] rounded-full hover:bg-[#D9CFC7] dark:bg-[#262422] dark:text-[#F9F8F6]",
                ghost: "rounded-xl text-[#000000] hover:bg-[#EFE9E3] dark:text-[#F9F8F6] dark:hover:bg-[#262422]",
                link: "text-[#000000] underline-offset-4 hover:underline dark:text-[#F9F8F6]",
                success: "bg-[#C9B59C] text-[#000000] rounded-full hover:bg-[#B8A388]",
                warning: "bg-[#C9B59C] text-[#000000] rounded-full hover:bg-[#B8A388]",
                danger: "bg-[#C9B59C] text-[#000000] rounded-full hover:bg-[#B8A388]",
            },
            size: {
                default: "h-11 px-6 py-2.5 text-sm",
                sm: "h-9 px-4 text-sm",
                lg: "h-12 px-8 text-base",
                icon: "h-10 w-10",
                xs: "h-8 px-3 text-xs",
                xl: "h-14 px-10 text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const Button = React.forwardRef(({
    className,
    variant,
    size,
    asChild = false,
    children,
    loading = false,
    iconName = null,
    iconPosition = 'left',
    iconSize = null,
    fullWidth = false,
    disabled = false,
    ...props
}, ref) => {
    const Comp = asChild ? Slot : "button";

    // Icon size mapping based on button size
    const iconSizeMap = {
        xs: 12,
        sm: 14,
        default: 16,
        lg: 18,
        xl: 20,
        icon: 16,
    };

    const calculatedIconSize = iconSize || iconSizeMap?.[size] || 16;

    // Loading spinner
    const LoadingSpinner = () => (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );

    const renderIcon = () => {
        if (!iconName) return null;
        try {
            return (
                <Icon
                    name={iconName}
                    size={calculatedIconSize}
                    className={cn(
                        children && iconPosition === 'left' && "mr-2",
                        children && iconPosition === 'right' && "ml-2"
                    )}
                />
            );
        } catch {
            return null;
        }
    };

    const renderFallbackButton = () => (
        <button
            className={cn(
                buttonVariants({ variant, size, className }),
                fullWidth && "w-full"
            )}
            ref={ref}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <LoadingSpinner />}
            {iconName && iconPosition === 'left' && renderIcon()}
            {children}
            {iconName && iconPosition === 'right' && renderIcon()}
        </button>
    );

    // When asChild is true, merge icons into the child element
    if (asChild) {
        try {
            if (!children || React.Children?.count(children) !== 1) {
                return renderFallbackButton();
            }

            const child = React.Children?.only(children);

            if (!React.isValidElement(child)) {
                return renderFallbackButton();
            }
            const content = (
                <>
                    {loading && <LoadingSpinner />}
                    {iconName && iconPosition === 'left' && renderIcon()}
                    {child?.props?.children}
                    {iconName && iconPosition === 'right' && renderIcon()}
                </>
            );

            const clonedChild = React.cloneElement(child, {
                className: cn(
                    buttonVariants({ variant, size, className }),
                    fullWidth && "w-full",
                    child?.props?.className
                ),
                disabled: disabled || loading || child?.props?.disabled,
                children: content,
            });

            return <Comp ref={ref} {...props}>{clonedChild}</Comp>;
        } catch {
            return renderFallbackButton();
        }
    }

    return (
        <Comp
            className={cn(
                buttonVariants({ variant, size, className }),
                fullWidth && "w-full"
            )}
            ref={ref}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <LoadingSpinner />}
            {iconName && iconPosition === 'left' && renderIcon()}
            {children}
            {iconName && iconPosition === 'right' && renderIcon()}
        </Comp>
    );
});

Button.displayName = "Button";
export default Button;