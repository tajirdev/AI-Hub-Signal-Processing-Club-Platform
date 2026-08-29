import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Label = forwardRef(({ className, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5",
      className
    )}
    {...props}
  >
    {children}
  </label>
));
Label.displayName = "Label";

export const Input = forwardRef(({ className, error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <input
        ref={ref}
        className={cn(
          "w-full px-4 py-3 rounded-xl border bg-white dark:bg-surface-darkAlt text-gray-900 dark:text-white outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm",
          error 
            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20" 
            : "border-gray-200 dark:border-gray-800 focus:border-[#0a2472] dark:focus:border-[#ffba08] focus:ring-2 focus:ring-[#0a2472]/10 dark:focus:ring-[#ffba08]/10",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
});
Input.displayName = "Input";

export const PasswordInput = forwardRef(({ className, error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={cn(
            "w-full px-4 py-3 pr-12 rounded-xl border bg-white dark:bg-surface-darkAlt text-gray-900 dark:text-white outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm",
            error 
              ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20" 
              : "border-gray-200 dark:border-gray-800 focus:border-[#0a2472] dark:focus:border-[#ffba08] focus:ring-2 focus:ring-[#0a2472]/10 dark:focus:ring-[#ffba08]/10",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
          tabIndex="-1"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export const Textarea = forwardRef(({ className, error, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <textarea
        ref={ref}
        className={cn(
          "w-full px-4 py-3 rounded-xl border bg-white dark:bg-surface-darkAlt text-gray-900 dark:text-white outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-sm resize-y min-h-[120px]",
          error 
            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20" 
            : "border-gray-200 dark:border-gray-800 focus:border-[#0a2472] dark:focus:border-[#ffba08] focus:ring-2 focus:ring-[#0a2472]/10 dark:focus:ring-[#ffba08]/10",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
});
Textarea.displayName = "Textarea";

export const Select = forwardRef(({ className, error, children, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <select
        ref={ref}
        className={cn(
          "w-full px-4 py-3 rounded-xl border bg-white dark:bg-surface-darkAlt text-gray-900 dark:text-white outline-none transition-all duration-200 text-sm appearance-none",
          error 
            ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/20" 
            : "border-gray-200 dark:border-gray-800 focus:border-[#0a2472] dark:focus:border-[#ffba08] focus:ring-2 focus:ring-[#0a2472]/10 dark:focus:ring-[#ffba08]/10",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {/* Custom dropdown arrow */}
      <div className="absolute right-4 top-[14px] pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
});
Select.displayName = "Select";
