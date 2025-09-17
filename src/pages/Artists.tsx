import React from 'react';
import ArtistGrid from '@/components/ArtistGrid';
import Navigation from '@/components/Navigation';

const Artists = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        <ArtistGrid />
      </main>
      
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

export default Artists;