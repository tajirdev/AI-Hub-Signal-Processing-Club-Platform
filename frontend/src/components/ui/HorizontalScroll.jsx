import { cn } from '../../utils/cn';

export function HorizontalScroll({ children, className }) {
  return (
    <div className={cn(
      "flex overflow-x-auto snap-x snap-mandatory gap-6 pb-6 horizontal-scrollbar",
      // On medium screens and up, we can keep it as a grid or just let it scroll. 
      // User says "all subgroups should horizontally". Let's remove the grid to make it a true horizontal scroll on all devices, or at least keep it cleanly scrolling on mobile.
      "w-full max-w-full",
      className
    )}>
      {children}
    </div>
  );
}
