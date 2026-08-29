import { ContactHero } from './components/ContactHero';
import { ContactInfo } from './components/ContactInfo';
import { ContactForm } from './components/ContactForm';
import { ContactFAQ } from './components/ContactFAQ';

export function ContactPage() {
  return (
    <div className="flex flex-col w-full bg-white dark:bg-surface-dark">
      <ContactHero />
      
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-5">
              <ContactInfo />
            </div>
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <ContactFAQ />
    </div>
  );
}
