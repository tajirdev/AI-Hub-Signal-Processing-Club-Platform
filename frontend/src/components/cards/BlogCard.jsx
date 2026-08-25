import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { getImageUrl } from '../../services/api';
import { cn } from '../../utils/cn';

export function BlogCard({ post, className }) {
  const date = post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  }) : 'Recent';

  return (
    <div className={cn(
      "snap-start shrink-0 w-[280px] sm:w-[320px] md:w-auto",
      "group flex flex-col bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-[18px] overflow-hidden transition-all duration-300 hover:shadow-[0_12px_40px_rgba(10,36,114,0.12)] dark:hover:shadow-none hover:-translate-y-1",
      className
    )}>
      <div className="relative h-48 bg-gray-100 dark:bg-surface-darkAlt overflow-hidden">
        {post.featured_image ? (
          <img 
            src={getImageUrl(post.featured_image)} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-navy/5 flex items-center justify-center text-navy/20 dark:bg-white/5 dark:text-white/20">
             Blog Post
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-grow p-6">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 font-medium mb-3">
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          {date}
        </div>
        <h3 className="font-heading font-bold text-xl text-navy dark:text-white mb-3 line-clamp-2 group-hover:text-amber transition-colors">
          <Link to={`/blog/${post.id}`}>
            <span className="absolute inset-0"></span>
            {post.title}
          </Link>
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
          {post.excerpt || post.content?.substring(0, 120)}
        </p>
      </div>
    </div>
  );
}
