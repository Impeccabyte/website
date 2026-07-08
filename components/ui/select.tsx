import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  required?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, required, id, ...props }, ref) => {
    const autoId = React.useId();
    const selectId = id ?? autoId;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-semibold text-ink-800">
            {label}
            {required && <span className="text-brick-500"> *</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            required={required}
            className={cn(
              "w-full appearance-none rounded-md border-[1.5px] border-ink-200 bg-white text-ink-900",
              "h-11 pl-3.5 pr-10 text-[15px] transition-[border-color,box-shadow] duration-[140ms] ease-out",
              "focus:outline-none focus:border-clay-400 focus:shadow-[0_0_0_3px_rgba(209,124,86,0.16)]",
              className
            )}
            {...props}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown size={17} className="pointer-events-none absolute right-3.5 text-ink-400" />
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";
