import React from 'react';
import ArtistGrid from '@/components/ArtistGrid';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const Artists = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 left-4 z-10">
        <Link to="/">
          <Button variant="outline" size="sm">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
      </div>
      
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