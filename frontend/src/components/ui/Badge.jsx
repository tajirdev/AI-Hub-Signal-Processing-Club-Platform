import { cn } from '../../utils/cn';

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-navy-soft/10 text-navy dark:bg-navy-soft/20 dark:text-amber-soft',
    amber: 'bg-amber-soft text-amber-hover dark:bg-amber-hover/20 dark:text-amber',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    outline: 'border border-gray-300 text-gray-700 dark:border-gray-700 dark:text-gray-300'
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
