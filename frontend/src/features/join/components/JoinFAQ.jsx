import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function JoinFAQ() {
  const faqs = [
    {
      q: "Do I need to know how to code to join?",
      a: "No! While coding is a big part of what we do, we also need people interested in research, documentation, design, and project management. As long as you are willing to learn, you are welcome."
    },
    {
      q: "Is there a membership fee?",
      a: "Currently, joining the core technical subgroups is free. However, specific premium workshops or hackathons might require a small contribution."
    },
    {
      q: "Can first-year students join?",
      a: "Absolutely. We encourage first-year students to join early so they can build a strong foundation over their university years."
    },
    {
      q: "What is the time commitment?",
      a: "We expect active members to dedicate at least 3-5 hours a week to their subgroup projects, learning materials, and meetings."
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#071225] border-y border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-navy dark:text-white mb-6">
              Common Questions
            </h2>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <ScrollReveal key={idx} animation="fade-up" delay={idx * 100}>
              <FAQItem faq={faq} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-surface-dark overflow-hidden transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <h3 className="font-bold text-navy dark:text-white text-lg pr-8">{faq.q}</h3>
        <div className="flex-shrink-0 text-amber">
          {isOpen ? <Minus className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
        </div>
      </button>
      
      <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
          {faq.a}
        </p>
      </div>
    </div>
  );
}
