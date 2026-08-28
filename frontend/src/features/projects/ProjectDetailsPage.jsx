import { ensureExternalUrl } from '../../utils/url';
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProjectById, fetchMembers } from '../../services/endpoints';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';
import { CompactMemberCard } from '../../components/cards/CompactMemberCard';
import { getImageUrl } from '../../services/api';
import { ArrowLeft, ExternalLink, GitBranch, Calendar, FolderGit2 } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { ScrollReveal } from '../../components/ui/ScrollReveal';

export function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const projData = await fetchProjectById(id);
        setProject(projData);
      } catch (err) {
        console.error("Failed to load project details:", err);
        setError("Project not found or failed to load.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  useEffect(() => {
    async function loadMembers() {
      if (!project) return;
      try {
        const { fetchSubgroups } = await import('../../services/endpoints');
        const subgroups = await fetchSubgroups();
        const matchingGroup = subgroups.find(sg => sg.lead_id === project.created_by);
        
        if (matchingGroup) {
          const membersData = await fetchMembers({ subgroup_id: matchingGroup.id, limit: 20 });
          setMembers(Array.isArray(membersData) ? membersData : (membersData.results || membersData.items || []));
        }
      } catch (err) {
        console.error("Failed to load related members:", err);
      }
    }
    loadMembers();
  }, [project]);

  if (loading) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><LoadingState message="Loading project details..." /></main>;
  if (error) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><ErrorState message={error} /></main>;
  if (!project) return <main className="min-h-screen bg-gray-50 dark:bg-[#071225] py-20"><EmptyState title="Project Not Found" message="The requested project could not be found." /></main>;

  const techStack = project.technology_stack ? project.technology_stack.split(',').map(t => t.trim()) : [];
  const imageUrl = project.thumbnail ? getImageUrl(project.thumbnail.path) : null;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#071225] pt-20 md:pt-24 flex flex-col">
      
      {/* Back button */}
      <div className="max-w-[1000px] mx-auto w-full px-6 pt-8 pb-4">
        <Link to="/projects" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-[#0a2472] dark:hover:text-amber transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
      </div>

      {/* Hero / Header */}
      <article className="max-w-[1000px] mx-auto w-full px-6 pb-20">
        <ScrollReveal animation="fade-up" delay={0}>
          <header className="mb-10">
            <div className="flex flex-wrap gap-3 mb-6 items-center">
              <Badge variant="primary" className="bg-[#0a2472]/10 dark:bg-white/10 text-[#0a2472] dark:text-gray-200 border-none">
                {project.status === 'active' ? 'Active Project' : 'Completed'}
              </Badge>
              {project.status === 'featured' && (
                <Badge variant="primary" className="bg-[#ffba08]/20 text-[#cc9506] border-none">
                  Featured
                </Badge>
              )}
              <span className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 ml-2">
                <Calendar className="w-4 h-4 mr-1.5" />
                {new Date(project.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-heading font-black text-navy dark:text-white leading-tight mb-6 break-words">
              {project.title}
            </h1>

            <div className="flex flex-wrap gap-4 mt-8">
              {project.repository_url && (
                <a href={ensureExternalUrl(project.repository_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-navy dark:bg-white text-white dark:text-navy font-bold rounded-full hover:opacity-90 transition-opacity">
                  <GitBranch className="w-4 h-4 mr-2" />
                  View Source
                </a>
              )}
              {project.demo_url && (
                <a href={ensureExternalUrl(project.demo_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-amber text-navy font-bold rounded-full hover:bg-amber-hover transition-colors shadow-lg shadow-amber/20">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </a>
              )}
            </div>
          </header>
        </ScrollReveal>

        {/* Image */}
        {imageUrl && (
          <ScrollReveal animation="fade-up" delay={100}>
            <figure className="mb-12 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-white/10 bg-white dark:bg-[#0a1628]">
              <img src={imageUrl} alt={project.title} className="w-full h-auto max-h-[500px] object-cover" />
            </figure>
          </ScrollReveal>
        )}

        {/* Content */}
        <ScrollReveal animation="fade-up" delay={150}>
          <div className="bg-white dark:bg-[#0a1628] rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 dark:border-white/10 mb-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <FolderGit2 className="w-48 h-48 text-navy dark:text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-navy dark:text-white mb-6 relative z-10">Project Overview</h2>
            <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300 max-w-none whitespace-pre-wrap mb-10 relative z-10 leading-relaxed">
              {project.description}
            </div>

            {techStack.length > 0 && (
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-navy dark:text-white mb-4">Technologies Used</h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.map(tech => (
                    <span key={tech} className="px-4 py-2 bg-gray-50 dark:bg-[#071225] border border-gray-100 dark:border-white/10 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Members */}
        {members.length > 0 && (
          <ScrollReveal animation="fade-up" delay={200}>
            <div>
              <h2 className="text-3xl font-heading font-black text-navy dark:text-white mb-8">Subgroup Members</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {members.map((member, idx) => (
                  <ScrollReveal key={member.id} animation="fade-up" delay={idx * 100}>
                    <CompactMemberCard member={member} />
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}
      </article>
    </main>
  );
}
