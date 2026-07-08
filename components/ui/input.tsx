import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  prefix?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, prefix, required, id, ...props }, ref) => {
    const autoId = React.useId();
    const inputId = id ?? autoId;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-ink-800">
            {label}
            {required && <span className="text-brick-500"> *</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="pointer-events-none absolute left-3.5 text-ink-400 font-medium">{prefix}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            required={required}
            className={cn(
              "w-full rounded-md border-[1.5px] border-ink-200 bg-white text-ink-900 placeholder:text-ink-400",
              "h-11 px-3.5 text-[15px] transition-[border-color,box-shadow] duration-[140ms] ease-out",
              "focus:outline-none focus:border-clay-400 focus:shadow-[0_0_0_3px_rgba(209,124,86,0.16)]",
              prefix && "pl-7",
              className
            )}
            {...props}
          />
        </div>
        {hint && <span className="text-xs text-ink-500">{hint}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
