import React, { useState, useEffect, useCallback } from 'react';
import { fetchProjects } from '../../services/endpoints';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { LoadingState, EmptyState, ErrorState } from '../../components/ui/States';
import { Search } from 'lucide-react';
import { Pagination } from '../../components/ui/Pagination';

export function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProjects({ 
        page, 
        limit: 9,
        search: debouncedSearch || undefined
      });
      setProjects(data.projects || []);
      setTotalPages(data.total_pages || 1);
      setTotalItems(data.total_projects || 0);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError("Failed to load projects. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Projects Hero */}
      <section className="bg-white py-20 px-6 border-b border-gray-100">
        <div className="max-w-7xl mx-auto max-w-[1200px] text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0a2472] mb-6 tracking-tight">
            Our Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Projects turning research and technology into real-world solutions. Discover the work our members are building.
          </p>
        </div>
      </section>

      {/* Projects Directory */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto max-w-[1200px]">
          
          {/* Search Bar */}
          <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-[400px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search projects by title, description, or tech..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0a2472]/20 focus:border-[#0a2472] transition-all bg-white"
              />
            </div>
            
            <div className="text-sm text-gray-500 font-medium">
              Showing {projects.length} of {totalItems} project{totalItems !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <LoadingState message="Loading projects..." />
          ) : error ? (
            <ErrorState message={error} onRetry={loadProjects} />
          ) : projects.length === 0 ? (
            <EmptyState 
              title="No projects found" 
              message={debouncedSearch ? "No projects match your current search." : "No projects have been published yet."} 
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
              
              <div className="flex justify-center">
                <Pagination 
                  currentPage={page} 
                  totalPages={totalPages} 
                  onPageChange={setPage} 
                />
              </div>
            </>
          )}

        </div>
      </section>
    </main>
  );
}
