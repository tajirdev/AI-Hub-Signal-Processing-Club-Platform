import { useEffect } from 'react';
import { AboutHero } from './components/AboutHero';
import { WhoWeAre } from './components/WhoWeAre';
import { MissionVision } from './components/MissionVision';
import { WhatWeDo } from './components/WhatWeDo';
import { FocusAreas } from './components/FocusAreas';
import { ResearchInnovation } from './components/ResearchInnovation';
import { Collaboration } from './components/Collaboration';
import { Impact } from './components/Impact';
import { SubgroupsPreview } from './components/SubgroupsPreview';
import { AboutCTA } from './components/AboutCTA';

export function AboutPage() {
  useEffect(() => {
    document.title = 'AI & Signal Processing Hub | About Us';
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Learn about the AI & Signal Processing Hub at Mbeya University of Science and Technology, our mission, vision, research, innovation and commitment to solving real-world challenges.';

    // Cleanup on unmount (optional, but good practice if not using a library)
    return () => {
      document.title = 'AI & Signal Processing Hub'; // Or whatever default is
      metaDescription.content = 'AI & Signal Processing Hub at MUST.'; // Default description
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <AboutHero />
      <WhoWeAre />
      <MissionVision />
      <WhatWeDo />
      <FocusAreas />
      <ResearchInnovation />
      <Collaboration />
      <Impact />
      <SubgroupsPreview />
      <AboutCTA />
    </div>
  );
}
