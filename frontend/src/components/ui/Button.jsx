import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export const Button = forwardRef(({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  asChild = false,
  as: Component = 'button',
  children,
  disabled,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-heading font-bold uppercase tracking-wider rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-amber text-gray-900 hover:bg-amber-hover shadow-[0_4px_20px_rgba(255,186,8,0.25)] hover:shadow-[0_6px_24px_rgba(255,186,8,0.35)] focus:ring-amber-hover',
    secondary: 'bg-transparent border-2 border-navy text-navy hover:bg-navy hover:text-white focus:ring-navy',
    ghost: 'bg-white/10 border border-white/20 text-white hover:bg-white/20 focus:ring-white/50',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
  };
  
  const sizes = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-7 py-3',
    lg: 'text-base px-8 py-4'
  };

  const Comp = asChild ? children.type : Component;
  const compProps = asChild ? { ...props, ...children.props } : props;
  const childContent = asChild ? children.props.children : children;

  return (
    <Comp
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className, asChild ? children.props.className : '')}
      disabled={disabled || isLoading}
      {...compProps}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {childContent}
    </Comp>
  );
});

Button.displayName = 'Button';
