"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
}

interface SelectValueProps {
  placeholder?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  onSelect?: (value: string) => void;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(value || "");

  const handleSelect = (itemValue: string) => {
    setSelectedValue(itemValue);
    onValueChange?.(itemValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === SelectTrigger) {
            return React.cloneElement(child, {
              ...child.props,
              onClick: () => setIsOpen(!isOpen),
            });
          }
          if (child.type === SelectContent) {
            return React.cloneElement(child, {
              ...child.props,
              isOpen,
              onSelect: handleSelect,
              selectedValue,
            });
          }
        }
        return child;
      })}
    </div>
  );
}

export function SelectTrigger({
  children,
  className,
  onClick,
}: SelectTriggerProps & { onClick?: () => void }) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={onClick}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

export function SelectValue({ placeholder }: SelectValueProps) {
  return <span className="text-gray-400">{placeholder}</span>;
}

export function SelectContent({
  children,
  isOpen,
  onSelect,
  selectedValue,
}: SelectContentProps & {
  isOpen?: boolean;
  onSelect?: (value: string) => void;
  selectedValue?: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          return React.cloneElement(child, {
            ...child.props,
            onSelect,
            isSelected: child.props.value === selectedValue,
          });
        }
        return child;
      })}
    </div>
  );
}

export function SelectItem({
  value,
  children,
  onSelect,
  isSelected,
}: SelectItemProps & { isSelected?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        isSelected && "bg-purple-100 text-purple-900"
      )}
      onClick={() => onSelect?.(value)}
    >
      {children}
    </div>
  );
}
