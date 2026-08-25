import { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { StatsSection } from './components/StatsSection';
import { JoinCTASection } from './components/JoinCTASection';
import { SponsorsSection } from './components/SponsorsSection';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { HorizontalScroll } from '../../components/ui/HorizontalScroll';
import { LoadingState, EmptyState, ErrorState } from '../../components/ui/States';
import { SubgroupCard } from '../../components/cards/SubgroupCard';
import { ProjectCard } from '../../components/cards/ProjectCard';
import { EventCard } from '../../components/cards/EventCard';
import { ResearchCard } from '../../components/cards/ResearchCard';
import { 
  fetchSubgroups, 
  fetchProjects, 
  fetchEvents, 
  fetchResearch 
} from '../../services/endpoints';

import { ScrollReveal } from '../../components/ui/ScrollReveal';

function DataSection({ title, label, subtitle, ctaText, ctaLink, fetchFn, renderItem, maxItems = 4, layout = 'horizontal' }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchFn()
      .then(res => {
        // Assume API returns array or object with items
        const items = Array.isArray(res) ? res : (res?.projects || res?.results || res?.items || res?.data || Object.values(res).find(Array.isArray) || []);
        setData(maxItems ? items.slice(0, maxItems) : items); // Slice if maxItems is provided
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [fetchFn, maxItems]);

  return (
    <section className="py-16 md:py-24 max-w-[1280px] mx-auto px-6 md:px-8 border-b border-gray-100 dark:border-gray-800 last:border-0 overflow-hidden w-full">
      <ScrollReveal animation="fade-up">
        <SectionHeader 
          label={label}
          title={title}
          subtitle={subtitle}
          ctaText={ctaText}
          ctaLink={ctaLink}
        />
      </ScrollReveal>

      <ScrollReveal animation="fade-up" delay="delay-150">
        {loading ? (
          <LoadingState message={`Loading ${title.toLowerCase()}...`} />
        ) : error ? (
          <ErrorState />
        ) : data.length === 0 ? (
          <EmptyState title={`No ${title.toLowerCase()} found`} />
        ) : layout === 'responsive' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full place-items-center md:place-items-stretch">
            {data.map((item, index) => renderItem(item, index))}
          </div>
        ) : (
          <HorizontalScroll>
            {data.map((item, index) => renderItem(item, index))}
          </HorizontalScroll>
        )}
      </ScrollReveal>
    </section>
  );
}

export function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      
      <ScrollReveal animation="fade-up" delay="delay-100">
        <StatsSection />
      </ScrollReveal>
      
      <DataSection 
        label="Sub-Groups"
        title="Technical Domains"
        subtitle="Dive into specialized fields of technology with our dedicated subgroups."
        ctaText="View all subgroups"
        ctaLink="/sub-groups"
        fetchFn={fetchSubgroups}
        renderItem={(subgroup, idx) => <SubgroupCard key={subgroup.id || idx} subgroup={subgroup} />}
        maxItems={0}
      />

      <DataSection 
        label="Innovation"
        title="Featured Projects"
        subtitle="Explore the open-source software and hardware solutions built by our members."
        ctaText="View project archive"
        ctaLink="/projects"
        fetchFn={fetchProjects}
        renderItem={(project, idx) => <ProjectCard key={project.id || idx} project={project} />}
        maxItems={3}
        layout="responsive"
      />

      <DataSection 
        label="Community"
        title="Upcoming Events"
        subtitle="Join our workshops, hackathons, and guest speaker sessions."
        ctaText="See full calendar"
        ctaLink="/events"
        fetchFn={fetchEvents}
        renderItem={(event, idx) => <EventCard key={event.id || idx} event={event} />}
      />

      <ScrollReveal animation="fade-in">
        <SponsorsSection />
      </ScrollReveal>

      <DataSection 
        label="Academic"
        title="Recent Research"
        subtitle="Discover our latest publications and academic investigations."
        ctaText="Read our papers"
        ctaLink="/research"
        fetchFn={fetchResearch}
        renderItem={(research, idx) => <ResearchCard key={research.id || idx} research={research} />}
        maxItems={4}
      />

      <ScrollReveal animation="fade-up">
        <JoinCTASection />
      </ScrollReveal>
    </div>
  );
}
