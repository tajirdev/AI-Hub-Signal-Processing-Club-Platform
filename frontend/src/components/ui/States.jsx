import { Loader2, AlertCircle, Inbox } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export function LoadingState({ message = "Loading...", className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400", className)}>
      <Loader2 className="w-8 h-8 animate-spin text-amber mb-4" />
      <p className="font-medium">{message}</p>
    </div>
  );
}

export function EmptyState({ 
  icon: Icon = Inbox, 
  title = "No data found", 
  message = "Check back later for updates.", 
  actionText, 
  onAction,
  className 
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center px-4 bg-white/50 dark:bg-surface-dark/50 rounded-2xl border border-gray-100 dark:border-gray-800", className)}>
      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-gray-400">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-heading font-bold text-navy dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">{message}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

export function ErrorState({ 
  title = "Something went wrong", 
  message = "Failed to load data from the server.", 
  onRetry,
  className 
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center px-4 bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30", className)}>
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4 text-red-500">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-heading font-bold text-red-800 dark:text-red-400 mb-2">{title}</h3>
      <p className="text-red-600/80 dark:text-red-400/80 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}
