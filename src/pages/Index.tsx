import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Hero from '@/components/Hero';
import EventSection from '@/components/EventSection';
import DonationSection from '@/components/DonationSection';

const Index = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <Link to="/artists">
          <Button variant="outline" size="sm">
            Artists
          </Button>
        </Link>
        <Link to="/events">
          <Button variant="outline" size="sm">
            Events
          </Button>
        </Link>
        {isAdmin && (
          <Link to="/admin">
            <Button variant="outline" size="sm">
              Admin Panel
            </Button>
          </Link>
        )}
      </nav>
      
      {/* Hero Section */}
      <Hero />
      
      {/* Event Section */}
      <EventSection />
      
      {/* Donation Section */}
      <DonationSection />
      
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
