import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSubgroupBySlug, fetchMembers, fetchProjects, fetchResearch } from '../../services/endpoints';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';
import { CompactMemberCard } from '../../components/cards/CompactMemberCard';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { ResearchCard } from '../../components/cards/ResearchCard';
import { getImageUrl } from '../../services/api';
import { ArrowLeft, Users, Briefcase, BookOpen } from 'lucide-react';
import { ScrollReveal } from '../../components/ui/ScrollReveal';

export function SubgroupDetailsPage() {
  const { slug } = useParams();
  const [subgroup, setSubgroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [research, setResearch] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const sgData = await fetchSubgroupBySlug(slug);
        setSubgroup(sgData);
        
        const [mRes, pRes, rRes] = await Promise.all([
          fetchMembers({ subgroup_id: sgData.id, limit: 100 }),
          fetchProjects({ subgroup_id: sgData.id, limit: 10 }),
          fetchResearch({ subgroup_id: sgData.id, limit: 10 })
        ]);

        setMembers(Array.isArray(mRes) ? mRes : (mRes.results || mRes.items || []));
        setProjects(pRes.projects || []);
        setResearch(Array.isArray(rRes) ? rRes : (rRes.items || []));
        
      } catch (err) {
        console.error("Failed to load subgroup details:", err);
        setError("Subgroup not found or failed to load.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><LoadingState message="Loading subgroup details..." /></main>;
  if (error) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><ErrorState message={error} /></main>;
  if (!subgroup) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><EmptyState title="Subgroup Not Found" /></main>;

  const coverUrl = subgroup.cover_image_url ? getImageUrl(subgroup.cover_image_url) : null;
  const iconUrl = subgroup.icon_url ? getImageUrl(subgroup.icon_url) : null;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071225] pt-20 md:pt-24">
      {/* Cover Image Header */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden bg-navy dark:bg-black">
        {coverUrl ? (
          <>
            <img src={coverUrl} alt="Cover" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#071225] to-transparent"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        )}
        
        <div className="absolute top-8 left-6 md:left-12 z-20">
          <Link to="/sub-groups" className="inline-flex items-center text-sm font-medium text-white hover:text-amber bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Subgroups
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-6 relative z-10 -mt-24 mb-20">
        
        {/* Header Section */}
        <ScrollReveal animation="fade-up">
          <div className="bg-white dark:bg-[#0a1628] rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 dark:border-white/10 flex flex-col md:flex-row gap-8 items-start mb-16">
            {iconUrl ? (
              <img src={iconUrl} alt={subgroup.name} className="w-32 h-32 rounded-2xl object-cover border-4 border-white dark:border-[#0a1628] shadow-md bg-white shrink-0" />
            ) : (
              <div className="w-32 h-32 rounded-2xl border-4 border-white dark:border-[#0a1628] shadow-md bg-gray-100 dark:bg-navy flex items-center justify-center shrink-0">
                <Users className="w-12 h-12 text-gray-400 dark:text-gray-500" />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-heading font-black text-navy dark:text-white mb-4 leading-tight">{subgroup.name}</h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">{subgroup.description}</p>
              
              <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/10 flex flex-wrap items-center gap-6">
                <Link to="/join" className="inline-flex items-center px-6 py-3 bg-amber text-navy font-bold rounded-full hover:bg-amber-hover transition-colors shadow-lg shadow-amber/20 shrink-0">
                  Apply to Join this Subgroup
                </Link>

                {subgroup.leader && (
                  <div className="flex items-center gap-3 md:pl-4 md:border-l border-gray-200 dark:border-gray-800">
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-700 overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
                      {subgroup.leader.avatar_url ? (
                        <img src={getImageUrl(subgroup.leader.avatar_url)} alt={subgroup.leader.first_name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-gray-400">
                          {subgroup.leader.first_name ? subgroup.leader.first_name[0] : <Users className="w-5 h-5" />}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Subgroup Leader</p>
                      <p className="text-sm font-bold text-navy dark:text-white">
                        {subgroup.leader.first_name} {subgroup.leader.last_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Projects */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-4">
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-navy dark:text-white">Subgroup Projects</h2>
              </div>
              
              {projects.length === 0 ? (
                <EmptyState title="No projects yet" message="This subgroup hasn't published any projects." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map(proj => <ProjectCard key={proj.id} project={proj} />)}
                </div>
              )}
            </ScrollReveal>

            {/* Research */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-navy dark:text-white">Research & Papers</h2>
              </div>
              
              {research.length === 0 ? (
                <EmptyState title="No research yet" message="This subgroup hasn't published any research." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {research.map(item => <ResearchCard key={item.id} research={item} />)}
                </div>
              )}
            </ScrollReveal>
          </div>
          
          {/* Sidebar / Members */}
          <aside className="space-y-8">
            <ScrollReveal animation="fade-left" delay={300}>
              <div className="bg-white dark:bg-[#0a1628] rounded-2xl p-6 border border-gray-100 dark:border-white/10 shadow-xl">
                <h3 className="text-xl font-heading font-bold text-navy dark:text-white mb-6 flex items-center pb-4 border-b border-gray-100 dark:border-white/10">
                  <Users className="w-5 h-5 mr-3 text-amber" />
                  Members ({members.length})
                </h3>
                
                {members.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No public members found.</p>
                ) : (
                  <div className="space-y-4">
                    {members.map(member => (
                      <CompactMemberCard key={member.id} member={member} />
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </aside>
          
        </div>
      </div>
    </main>
  );
}
