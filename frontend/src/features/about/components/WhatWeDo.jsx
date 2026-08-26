import { FlaskConical, Wrench, BookOpen, Users, Trophy, Share2 } from 'lucide-react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

const activities = [
  {
    id: '01',
    title: 'Research',
    description: 'Investigating technical and scientific problems using AI and Signal Processing.',
    icon: FlaskConical,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    strip: 'bg-blue-500',
    align: 'left'
  },
  {
    id: '02',
    title: 'Build',
    description: 'Developing practical systems, software, hardware, and innovative prototypes.',
    icon: Wrench,
    color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    strip: 'bg-emerald-500',
    align: 'right'
  },
  {
    id: '03',
    title: 'Learn',
    description: 'Helping students develop advanced technical and research skills.',
    icon: BookOpen,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    strip: 'bg-amber-500',
    align: 'left'
  },
  {
    id: '04',
    title: 'Collaborate',
    description: 'Connecting students, researchers, institutions, and external partners.',
    icon: Users,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    strip: 'bg-purple-500',
    align: 'right'
  },
  {
    id: '05',
    title: 'Compete',
    description: 'Participating in technical competitions, hackathons, and conferences.',
    icon: Trophy,
    color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
    strip: 'bg-rose-500',
    align: 'left'
  },
  {
    id: '06',
    title: 'Share',
    description: 'Publishing research, projects, tutorials, resources, and technical knowledge.',
    icon: Share2,
    color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
    strip: 'bg-cyan-500',
    align: 'right'
  }
];

export function WhatWeDo() {
  return (
    <section className="py-24 bg-white dark:bg-surface-dark overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="text-center mb-20">
          <ScrollReveal animation="fade-up">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-navy dark:text-white mb-6">
              What We Do
            </h2>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our mission translates into practical, continuous action. The Hub is a place where we combine Learning, Research, Building, Collaboration, and Impact.
            </p>
          </ScrollReveal>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Central dashed line for desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-gray-200 dark:border-gray-800 -translate-x-1/2"></div>

          <div className="flex flex-col gap-12 md:gap-0">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              const isEven = index % 2 === 0; // left side for even, right side for odd

              return (
                <ScrollReveal 
                  key={activity.id}
                  animation={isEven ? "slide-right" : "slide-left"}
                  className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:justify-start' : 'md:justify-end'} md:-my-6 group`}
                >
                  
                  {/* Timeline Node (dot) */}
                  <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white dark:bg-surface-dark border-4 border-gray-200 dark:border-gray-700 z-10 group-hover:border-amber dark:group-hover:border-amber transition-colors duration-300"></div>

                  {/* Connecting Line (Horizontal Dashed) */}
                  <div className={`hidden md:block absolute top-1/2 w-[15%] border-t-2 border-dashed border-gray-200 dark:border-gray-800 ${isEven ? 'left-[35%]' : 'right-[35%]'}`}></div>

                  {/* Card */}
                  <div className="w-full md:w-[45%] relative bg-gray-50 dark:bg-[#0b172a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-shadow duration-300 flex overflow-hidden group-hover:-translate-y-1 transform transition-transform">
                    {/* Left Color Strip */}
                    <div className={`w-3 ${activity.strip} flex-shrink-0`}></div>
                    
                    <div className="p-6 md:p-8 flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activity.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-wider">STEP {activity.id}</span>
                          <h3 className="text-xl font-bold text-navy dark:text-white">{activity.title}</h3>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {activity.description}
                      </p>
                    </div>
                  </div>

                </ScrollReveal>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
