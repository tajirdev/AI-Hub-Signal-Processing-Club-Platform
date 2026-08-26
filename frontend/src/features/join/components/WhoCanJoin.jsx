import { ScrollReveal } from '../../../components/ui/ScrollReveal';
import { CheckCircle2 } from 'lucide-react';
import MentorshipImg from '../../../assets/mentorship.jpg';

export function WhoCanJoin() {
  const criteria = [
    "Currently enrolled at Mbeya University of Science and Technology (MUST)",
    "Passionate about technology, engineering, or research",
    "Willing to dedicate time to collaborative projects",
    "Open to students from all departments (not just engineering)"
  ];

  return (
    <section className="py-24 bg-white dark:bg-surface-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <ScrollReveal animation="slide-right">
              <h2 className="text-3xl md:text-5xl font-heading font-black text-navy dark:text-white mb-6">
                Who Can Join?
              </h2>
              <div className="w-20 h-1.5 bg-amber dark:bg-amber mb-8 rounded-full"></div>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={100}>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                You do not need to be an AI expert to join. We are looking for curiosity, dedication, and a willingness to learn. Whether you are a first-year student or finalizing your degree, there is a place for you here.
              </p>
            </ScrollReveal>

            <ul className="space-y-4">
              {criteria.map((item, idx) => (
                <ScrollReveal key={idx} animation="fade-up" delay={200 + (idx * 100)}>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-amber flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{item}</span>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
          </div>

          <div className="lg:w-1/2 w-full">
            <ScrollReveal animation="scale-up" delay={300}>
              <div className="relative aspect-square md:aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl group">
                <img src={MentorshipImg} alt="Students collaborating and mentoring" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-tr from-navy/60 to-transparent"></div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
