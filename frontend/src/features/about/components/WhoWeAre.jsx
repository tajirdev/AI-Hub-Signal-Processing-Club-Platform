import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function WhoWeAre() {
  return (
    <section className="py-20 md:py-32 bg-white dark:bg-surface-dark relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <ScrollReveal animation="slide-right">
              <h2 className="text-3xl md:text-5xl font-heading font-black text-navy dark:text-white mb-6">
                Who We Are
              </h2>
              <div className="w-20 h-1.5 bg-amber dark:bg-amber mb-8 rounded-full"></div>
            </ScrollReveal>
            
            <div className="space-y-6 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              <ScrollReveal animation="fade-up" delay={100}>
                <p>
                  The SigniAI is a pioneering student-led technical organization 
                  at <strong>Mbeya University of Science and Technology (MUST)</strong>. 
                </p>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={200}>
                <p>
                  Operating within the Department of Electronics and Telecommunication Engineering and the 
                  Faculty of Computing and Information Technology, the Hub brings together driven students 
                  and researchers.
                </p>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={300}>
                <p>
                  We are a community where members do more than just learn technology. We investigate, 
                  build, research, collaborate, and contribute to solving real-world challenges through 
                  Artificial Intelligence, Signal Processing, and Software Engineering.
                </p>
              </ScrollReveal>
            </div>
          </div>
          
          <div className="relative">
            {/* Minimal architectural/technical card composition */}
            <ScrollReveal animation="scale-up" delay={200}>
              <div className="aspect-square md:aspect-[4/3] rounded-3xl bg-gray-50 dark:bg-[#0b172a] border border-gray-100 dark:border-gray-800 p-8 relative overflow-hidden flex flex-col justify-between hover:shadow-xl transition-shadow duration-500 group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 dark:bg-amber/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-700"></div>
                
                <div className="relative z-10">
                  <div className="text-4xl font-black text-navy dark:text-white opacity-20 font-mono mb-4">01</div>
                  <h3 className="text-xl font-bold text-navy dark:text-white mb-2">Our Core Identity</h3>
                  <ul className="space-y-3 mt-8">
                    {['Student-led Innovation', 'Research-Oriented', 'Real-world Problem Solving', 'Cross-disciplinary Collaboration'].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-gray-600 dark:text-gray-300 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber dark:bg-amber"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
