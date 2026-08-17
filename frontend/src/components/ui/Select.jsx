// components/ui/Select.jsx - Shadcn style Select
import React, { useState } from "react";
import { ChevronDown, Check, Search, X } from "lucide-react";
import { cn } from "../../utils/cn";
import Button from "./Button";
import Input from "./Input";

const Select = React.forwardRef(({
    className,
    options = [],
    value,
    defaultValue,
    placeholder = "Select an option",
    multiple = false,
    disabled = false,
    required = false,
    label,
    description,
    error,
    searchable = false,
    clearable = false,
    loading = false,
    id,
    name,
    onChange,
    onOpenChange,
    ...props
}, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // Generate unique ID if not provided
    const selectId = id || `select-${Math.random()?.toString(36)?.substr(2, 9)}`;

    // Filter options based on search
    const filteredOptions = searchable && searchTerm
        ? options?.filter(option =>
            option?.label?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
            (option?.value && option?.value?.toString()?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
        )
        : options;

    // Get selected option(s) for display
    const getSelectedDisplay = () => {
        if (!value) return placeholder;

        if (multiple) {
            const selectedOptions = options?.filter(opt => value?.includes(opt?.value));
            if (selectedOptions?.length === 0) return placeholder;
            if (selectedOptions?.length === 1) return selectedOptions?.[0]?.label;
            return `${selectedOptions?.length} items selected`;
        }

        const selectedOption = options?.find(opt => opt?.value === value);
        return selectedOption ? selectedOption?.label : placeholder;
    };

    const handleToggle = () => {
        if (!disabled) {
            const newIsOpen = !isOpen;
            setIsOpen(newIsOpen);
            onOpenChange?.(newIsOpen);
            if (!newIsOpen) {
                setSearchTerm("");
            }
        }
    };

    const handleOptionSelect = (option) => {
        if (multiple) {
            const newValue = value || [];
            const updatedValue = newValue?.includes(option?.value)
                ? newValue?.filter(v => v !== option?.value)
                : [...newValue, option?.value];
            onChange?.(updatedValue);
        } else {
            onChange?.(option?.value);
            setIsOpen(false);
            onOpenChange?.(false);
        }
    };

    const handleClear = (e) => {
        e?.stopPropagation();
        onChange?.(multiple ? [] : '');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e?.target?.value);
    };

    const isSelected = (optionValue) => {
        if (multiple) {
            return value?.includes(optionValue) || false;
        }
        return value === optionValue;
    };

    const hasValue = multiple ? value?.length > 0 : value !== undefined && value !== '';

    return (
        <div className={cn("relative", className)}>
            {label && (
                <label
                    htmlFor={selectId}
                    className={cn(
                        "text-sm font-medium text-[#404040] dark:text-[#A1A1A1] mb-2 block",
                        error && "text-[#EF4444]"
                    )}
                >
                    {label}
                    {required && <span className="text-[#EF4444] ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                <button
                    ref={ref}
                    id={selectId}
                    type="button"
                    className={cn(
                        "flex h-11 w-full items-center justify-between rounded-xl border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.1)] bg-white dark:bg-[#1F2023] text-[#111111] dark:text-white px-4 py-2 text-sm placeholder:text-[#909090] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                        error && "border-[#EF4444] focus:ring-[#EF4444]/20",
                        !hasValue && "text-[#909090]"
                    )}
                    onClick={handleToggle}
                    disabled={disabled}
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    {...props}
                >
                    <span className="truncate">{getSelectedDisplay()}</span>

                    <div className="flex items-center gap-1">
                        {loading && (
                            <svg className="animate-spin h-4 w-4 text-[#909090]" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                        )}

                        {clearable && hasValue && !loading && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4"
                                onClick={handleClear}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}

                        <ChevronDown className={cn("h-4 w-4 text-[#909090] transition-transform", isOpen && "rotate-180")} />
                    </div>
                </button>

                {/* Hidden native select for form submission */}
                <select
                    name={name}
                    value={value || ''}
                    onChange={() => { }}
                    className="sr-only"
                    tabIndex={-1}
                    multiple={multiple}
                    required={required}
                >
                    <option value="">Select...</option>
                    {options?.map(option => (
                        <option key={option?.value} value={option?.value}>
                            {option?.label}
                        </option>
                    ))}
                </select>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#1F2023] text-[#111111] dark:text-white border border-[#E8E5DF] dark:border-[rgba(255,255,255,0.08)] rounded-2xl shadow-lift overflow-hidden">
                        {searchable && (
                            <div className="p-2 border-b border-[#E8E5DF] dark:border-[rgba(255,255,255,0.06)]">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-[#909090]" />
                                    <Input
                                        placeholder="Search options..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="py-2 max-h-60 overflow-auto">
                            {filteredOptions?.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-[#909090]">
                                    {searchTerm ? 'No options found' : 'No options available'}
                                </div>
                            ) : (
                                filteredOptions?.map((option) => (
                                    <div
                                        key={option?.value}
                                        className={cn(
                                            "relative flex cursor-pointer select-none items-center rounded-xl px-4 py-2.5 mx-1.5 text-sm transition-colors hover:bg-[#FAF9F6] dark:hover:bg-[#2a2b2e]",
                                            isSelected(option?.value) && "bg-[#111111] text-white dark:bg-white dark:text-[#111111]",
                                            option?.disabled && "pointer-events-none opacity-50"
                                        )}
                                        onClick={() => !option?.disabled && handleOptionSelect(option)}
                                    >
                                        <span className="flex-1 font-medium">{option?.label}</span>
                                        {multiple && isSelected(option?.value) && (
                                            <Check className="h-4 w-4" />
                                        )}
                                        {option?.description && (
                                            <span className="text-xs text-[#909090] ml-2">
                                                {option?.description}
                                            </span>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            {description && !error && (
                <p className="text-xs text-[#909090] mt-1.5">
                    {description}
                </p>
            )}
            {error && (
                <p className="text-xs text-[#EF4444] mt-1.5">
                    {error}
                </p>
            )}
        </div>
    );
});

Select.displayName = "Select";

export default Select;