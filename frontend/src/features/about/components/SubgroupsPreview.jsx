import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchSubgroups } from '../../../services/endpoints';
import { Component, ArrowRight } from 'lucide-react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function SubgroupsPreview() {
  const [subgroups, setSubgroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSubgroups = async () => {
      try {
        const data = await fetchSubgroups();
        setSubgroups(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (err) {
        console.error("Failed to load subgroups", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSubgroups();
  }, []);

  return (
    <section className="py-24 bg-gray-50 dark:bg-surface-dark border-t border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <ScrollReveal animation="fade-up">
              <h2 className="text-3xl md:text-5xl font-heading font-black text-navy dark:text-white mb-4">
                Technical Subgroups
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl text-lg">
                Our community is organized into specialized technical groups focusing on specific areas of research and engineering.
              </p>
            </ScrollReveal>
          </div>
          <ScrollReveal animation="fade-in" delay={200}>
            <Link to="/sub-groups" className="hidden md:inline-flex items-center gap-2 text-navy dark:text-white font-bold hover:text-amber dark:hover:text-amber transition-colors">
              View All Subgroups
              <ArrowRight className="w-5 h-5" />
            </Link>
          </ScrollReveal>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse bg-white dark:bg-[#0b172a] rounded-2xl p-6 h-48 border border-gray-100 dark:border-gray-800"></div>
            ))}
          </div>
        ) : subgroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subgroups.map((sg, idx) => (
              <ScrollReveal key={sg.id || sg.name} animation="slide-up" delay={idx * 100}>
                <div className="flex flex-col bg-white dark:bg-[#0b172a] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow group h-full">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4 text-navy dark:text-white group-hover:bg-amber group-hover:text-white transition-colors">
                    <Component className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-navy dark:text-white mb-2 line-clamp-1">{sg.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 flex-grow">
                    {sg.description || 'A dedicated technical subgroup within the Hub.'}
                  </p>
                  <Link to={`/sub-groups/${sg.slug}`} className="inline-flex items-center gap-1 text-sm font-bold text-amber dark:text-amber mt-auto">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        ) : (
          <ScrollReveal animation="fade-in">
            <div className="bg-white dark:bg-[#0b172a] rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-800">
              <p className="text-gray-500 dark:text-gray-400">Subgroups are currently being structured. Check back soon.</p>
            </div>
          </ScrollReveal>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link to="/sub-groups" className="inline-flex items-center gap-2 text-navy dark:text-white font-bold hover:text-amber dark:hover:text-amber transition-colors">
            View All Subgroups
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
