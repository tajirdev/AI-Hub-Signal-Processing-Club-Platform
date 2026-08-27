import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProjectById, fetchMembers } from '../../services/endpoints';
import { LoadingState, ErrorState, EmptyState } from '../../components/ui/States';
import { MemberCard } from '../../components/cards/MemberCard';
import { getImageUrl } from '../../services/api';
import { ArrowLeft, ExternalLink, GitBranch, Calendar } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

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

        // If project has a creator, maybe it's linked to a subgroup
        // We will fetch members of that subgroup by passing subgroup_id if we knew it
        // Wait, ProjectResponse doesn't have subgroup_id! But we can't easily know the subgroup_id here.
        // Wait, the API doesn't expose subgroup_id in ProjectResponse.
        // Let's just fetch all members and see if we can find the ones related, OR wait...
        // The instructions said "IF THE ONE HOW POESTED THE PROJECT IS LEADER OF SUB GROUP THEN DISPLAY ALL MEMBER OF THAT PARTICULAR GROUP".
        // To do this strictly from frontend without backend changes to ProjectResponse, we'd have to:
        // 1. Fetch all subgroups
        // 2. Find subgroup where lead_id === project.created_by
        // 3. Fetch members for that subgroup.
        
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
        // Fetch subgroups to find the one lead by this project's creator
        const { fetchSubgroups } = await import('../../services/endpoints');
        const subgroups = await fetchSubgroups();
        const matchingGroup = subgroups.find(sg => sg.lead_id === project.created_by);
        
        if (matchingGroup) {
          const membersData = await fetchMembers({ subgroup_id: matchingGroup.id, limit: 20 });
          setMembers(Array.isArray(membersData) ? membersData : (membersData.results || membersData.items || [])); // depending on pagination response
        }
      } catch (err) {
        console.error("Failed to load related members:", err);
      }
    }
    loadMembers();
  }, [project]);

  if (loading) return <main className="min-h-screen bg-[#F8FAFC] py-20"><LoadingState message="Loading project details..." /></main>;
  if (error) return <main className="min-h-screen bg-[#F8FAFC] py-20"><ErrorState message={error} /></main>;
  if (!project) return <main className="min-h-screen bg-[#F8FAFC] py-20"><EmptyState title="Project Not Found" message="The requested project could not be found." /></main>;

  const techStack = project.technology_stack ? project.technology_stack.split(',').map(t => t.trim()) : [];
  const imageUrl = project.thumbnail ? getImageUrl(project.thumbnail.path) : null;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      
      {/* Back button */}
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-6">
        <Link to="/projects" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#0a2472] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
      </div>

      {/* Hero / Header */}
      <article className="max-w-4xl mx-auto px-6 pb-20">
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="primary" className="bg-[#0a2472]/10 text-[#0a2472]">
              {project.status === 'active' ? 'Active Project' : 'Completed'}
            </Badge>
            {project.status === 'featured' && (
              <Badge variant="primary" className="bg-[#ffba08]/20 text-[#cc9506]">
                Featured
              </Badge>
            )}
            <span className="inline-flex items-center text-sm text-gray-500 ml-4">
              <Calendar className="w-4 h-4 mr-1.5" />
              {new Date(project.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap gap-4 mb-8">
            {project.repository_url && (
              <a href={project.repository_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm">
                <GitBranch className="w-4 h-4 mr-2 text-gray-500" />
                Source Code
              </a>
            )}
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-[#0a2472] border border-transparent rounded-lg text-sm font-medium text-white hover:bg-[#061539] transition-colors shadow-sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                Live Demo
              </a>
            )}
          </div>
        </header>

        {/* Image */}
        {imageUrl && (
          <figure className="mb-12 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
            <img src={imageUrl} alt={project.title} className="w-full h-auto max-h-[500px] object-cover" />
          </figure>
        )}

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Overview</h2>
          <div className="prose prose-lg text-gray-600 max-w-none whitespace-pre-wrap mb-10">
            {project.description}
          </div>

          {techStack.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {techStack.map(tech => (
                  <span key={tech} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Members */}
        {members.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Subgroup Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
