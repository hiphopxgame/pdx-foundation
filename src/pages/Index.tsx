import { useAuth } from '@/hooks/useAuth';
import Hero from '@/components/Hero';
import EventSection from '@/components/EventSection';
import DonationSection from '@/components/DonationSection';
import Navigation from '@/components/Navigation';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">{/* Add padding-top to account for fixed nav */}
        {/* Hero Section */}
        <Hero />
        
        {/* Event Section */}
        <EventSection />
        
        {/* Donation Section */}
        <DonationSection />
      </main>
      
      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gradient-primary mb-4">
            PDX.Foundation
          </h3>
          <p className="text-muted-foreground mb-6">
            Amplifying Portland, Oregon's since 2025.
          </p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <span>© 2025 PDX.Foundation</span>
            <span>•</span>
            <span>Portland, Oregon</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
