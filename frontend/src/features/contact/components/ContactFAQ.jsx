import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { ScrollReveal } from '../../../components/ui/ScrollReveal';

export function ContactFAQ() {
  const faqs = [
    {
      q: "Where is the AI Hub located?",
      a: "We are currently situated within the Department of Electronics & Telecommunication Engineering at Mbeya University of Science and Technology (MUST)."
    },
    {
      q: "How can my company partner with the Hub?",
      a: "We are always open to industry partnerships, sponsorships, and collaborative research. Please use the contact form above and choose 'Partnership' as your subject."
    },
    {
      q: "I am a student. How do I join?",
      a: "Students can apply through our Join Us page. We open applications for new cohorts at the beginning of each semester."
    },
    {
      q: "Who should I contact for media inquiries?",
      a: "For press and media, please email us directly at hello@mustaihub.ac.tz with 'Media Inquiry' in the subject line."
    }
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-[#071225] border-t border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-navy dark:text-white mb-6">
              Quick Answers
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Find fast answers to our most common inquiries below.
            </p>
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
    <div className="border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-[#0b172a] overflow-hidden transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
      >
        <h3 className="font-bold text-navy dark:text-white text-lg pr-8">{faq.q}</h3>
        <div className="flex-shrink-0 text-blue-500 dark:text-amber">
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
