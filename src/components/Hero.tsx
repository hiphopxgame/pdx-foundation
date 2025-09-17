import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Music, Users, MapPin, ArrowDown } from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';

export default function Hero() {
  const [artistCount, setArtistCount] = useState<number>(0);

  useEffect(() => {
    const fetchArtistCount = async () => {
      const { count } = await supabase
        .from('artist_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_public', true)
        .eq('is_archived', false);
      
      setArtistCount(count || 0);
    };

    fetchArtistCount();
  }, []);

  const scrollToArtists = () => {
    const artistsSection = document.querySelector('#artists');
    artistsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/botanical-roses-hero.jpg"
          alt="PDX Foundation Botanical Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 gradient-botanical opacity-85"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        {/* Badge */}
        <Badge className="gradient-accent text-accent-foreground mb-6 text-sm font-semibold px-4 py-2">
          <Music className="w-4 h-4 mr-2" />
          Portland Music Collective
        </Badge>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="text-gradient-primary">PDX</span>
          <span className="text-foreground">.</span>
          <span className="text-gradient-accent">Foundation</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Amplifying Portland's diverse musical voices. A collective showcasing 
          the innovative artists shaping our city's sound.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
          <div className="flex items-center gap-2 bg-background/10 backdrop-blur-sm rounded-full px-4 py-2 border border-border/20">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-foreground font-semibold">{artistCount} Artists</span>
          </div>
          <div className="flex items-center gap-2 bg-background/10 backdrop-blur-sm rounded-full px-4 py-2 border border-border/20">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-foreground font-semibold">Portland, OR</span>
          </div>
          <div className="flex items-center gap-2 bg-background/10 backdrop-blur-sm rounded-full px-4 py-2 border border-border/20">
            <Music className="w-4 h-4 text-primary" />
            <span className="text-foreground font-semibold">Multi-Genre</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center mb-12">
          <Link to="/artists">
            <Button 
              variant="hero" 
              size="hero" 
              className="text-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              Discover Artists
            </Button>
          </Link>
        </div>

        {/* Scroll Indicator */}
        <button 
          onClick={scrollToArtists}
          className="animate-bounce text-muted-foreground hover:text-foreground transition-smooth"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary/20 blur-2xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-accent/30 blur-xl animate-pulse delay-700"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 rounded-full bg-primary/15 blur-lg animate-pulse delay-1000"></div>
    </section>
  );
}