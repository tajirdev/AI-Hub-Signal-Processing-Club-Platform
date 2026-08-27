import React, { useState, useEffect } from 'react';
import { fetchSubgroups } from '../../services/endpoints';
import { SubgroupCard } from '../../components/cards/SubgroupCard';
import { LoadingState, EmptyState, ErrorState } from '../../components/ui/States';
import { ScrollReveal } from '../../components/ui/ScrollReveal';
import { Activity } from 'lucide-react';

export function SubgroupsPage() {
  const [subgroups, setSubgroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'AI & Signal Processing Hub | Subgroups';
    
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchSubgroups();
        setSubgroups(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load subgroups:", err);
        setError("Failed to load subgroups. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071225] flex flex-col">
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden text-center border-b border-gray-100 dark:border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <ScrollReveal animation="fade-up" delay={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy/5 dark:bg-white/5 border border-navy/10 dark:border-white/10 text-sm font-semibold tracking-wide text-navy dark:text-gray-300 mb-8">
              <Activity className="w-4 h-4 text-amber dark:text-amber" />
              <span>COMMUNITIES OF PRACTICE</span>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-navy dark:text-white leading-tight tracking-tight mb-6">
              Technical <span className="text-amber">Subgroups</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 font-medium leading-relaxed max-w-2xl mx-auto">
              Discover our specialized communities. Each subgroup focuses on a unique area of research, development, and learning within the AI and Signal Processing ecosystem.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Grid */}
      <section className="flex-1 py-20 px-6 relative z-10">
        <div className="max-w-[1280px] mx-auto">
          {loading ? (
            <LoadingState message="Loading subgroups..." />
          ) : error ? (
            <ErrorState message={error} />
          ) : subgroups.length === 0 ? (
            <EmptyState title="No subgroups found" message="There are currently no active subgroups." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {subgroups.map((subgroup, index) => (
                <ScrollReveal key={subgroup.id} animation="fade-up" delay={index * 100}>
                  <SubgroupCard subgroup={subgroup} />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
