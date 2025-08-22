import Hero from '@/components/Hero';
import ArtistGrid from '@/components/ArtistGrid';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />
      
      {/* Artists Section */}
      <div id="artists">
        <ArtistGrid />
      </div>
      
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
