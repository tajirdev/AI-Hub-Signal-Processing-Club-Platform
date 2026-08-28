import { JoinHero } from './components/JoinHero';
import { WhyJoin } from './components/WhyJoin';
import { WhoCanJoin } from './components/WhoCanJoin';
import { Benefits } from './components/Benefits';
import { HowMembershipWorks } from './components/HowMembershipWorks';
import { ApplicationForm } from './components/ApplicationForm';
import { JoinFAQ } from './components/JoinFAQ';
import { JoinCTA } from './components/JoinCTA';

export function JoinPage() {
  return (
    <div className="flex flex-col w-full">
      <JoinHero />
      <WhyJoin />
      <WhoCanJoin />
      <Benefits />
      <HowMembershipWorks />
      <ApplicationForm />
      <JoinFAQ />
      <JoinCTA />
    </div>
  );
}
