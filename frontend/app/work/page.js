import { COMPANY } from '@/lib/data';
import { WorkClient } from '@/components/site/work-client';

export const metadata = {
  title: 'Our Work — Projects by PyTech Digital',
  description: 'Explore projects delivered by PyTech Digital across web, mobile, custom software, branding, marketing and AI automation — with real delivery timelines and the challenges we solved.',
  alternates: { canonical: '/work' },
  openGraph: {
    title: 'Our Work — PyTech Digital',
    description: 'Projects we\u2019ve shipped across Build, Brand, Market & Automate.',
    url: `${COMPANY.url}/work`,
    type: 'website',
  },
};

export default function WorkPage() {
  return <WorkClient />;
}
