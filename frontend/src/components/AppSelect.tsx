import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface AppSelectProps<T extends string = string> {
  id?: string;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  contentClassName?: string;
  disabled?: boolean;
  size?: "sm" | "default";
  variant?: "default" | "form" | "badge";
  badgeClass?: string;
  "aria-label"?: string;
}

export function AppSelect<T extends string = string>({
  id,
  value,
  options,
  onChange,
  placeholder,
  className,
  contentClassName,
  disabled = false,
  size = "default",
  variant = "default",
  badgeClass = "",
  "aria-label": ariaLabel,
}: AppSelectProps<T>) {
  const selectedOption = options.find((opt) => opt.value === value);
  const SelectedIcon = selectedOption?.icon;

  let baseTriggerClass = "";
  if (variant === "form") {
    baseTriggerClass = "w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md shadow-xs focus-visible:ring-2 focus-visible:ring-ring cursor-pointer";
  } else if (variant === "badge") {
    baseTriggerClass = cn(
      "h-7 rounded-full text-xs font-medium border px-2.5 py-0.5 gap-1.5 cursor-pointer shadow-none transition-opacity hover:opacity-90",
      badgeClass
    );
  } else {
    baseTriggerClass = "h-9 min-w-[140px] px-3 py-1.5 text-sm bg-background border border-input rounded-md shadow-xs cursor-pointer";
  }

  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as T)}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        size={variant === "badge" ? "sm" : size}
        aria-label={ariaLabel}
        className={cn(baseTriggerClass, className)}
      >
        <span className="flex items-center gap-1.5 truncate">
          {SelectedIcon && (
            <SelectedIcon className="size-3.5 shrink-0 text-muted-foreground" />
          )}
          <SelectValue placeholder={placeholder}>
            {selectedOption?.label}
          </SelectValue>
        </span>
      </SelectTrigger>
      <SelectContent
        position="popper"
        align="start"
        sideOffset={4}
        className={cn("min-w-[150px] shadow-lg", contentClassName)}
      >
        {options.map((opt) => {
          const OptionIcon = opt.icon;
          return (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="cursor-pointer py-1.5"
            >
              <div className="flex items-center gap-2">
                {OptionIcon && (
                  <OptionIcon className="size-3.5 shrink-0 text-muted-foreground" />
                )}
                <span>{opt.label}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
