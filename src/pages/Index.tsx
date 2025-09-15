import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Hero from '@/components/Hero';
import EventSection from '@/components/EventSection';
import ArtistGrid from '@/components/ArtistGrid';
import DonationSection from '@/components/DonationSection';
import { LogIn } from 'lucide-react';

const Index = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 right-4 z-10">
        {user ? (
          <div className="flex items-center gap-2">
            <Link to="/admin">
              <Button variant="outline" size="sm">
                Admin Panel
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        ) : (
          <Link to="/auth">
            <Button variant="outline" size="sm">
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </Link>
        )}
      </div>
      
      {/* Hero Section */}
      <Hero />
      
      {/* Event Section */}
      <EventSection />
      
      {/* Artists Section */}
      <div id="artists">
        <ArtistGrid />
      </div>
      
      {/* Donation Section */}
      <DonationSection />
      
      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gradient-primary mb-4">
            PDX.Foundation
          </h3>
          <p className="text-muted-foreground mb-6">
            Amplifying Portland's musical voices since 2024
          </p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <span>© 2024 PDX.Foundation</span>
            <span>•</span>
            <span>Portland, Oregon</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
