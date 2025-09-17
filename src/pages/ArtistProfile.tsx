import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Globe, 
  Instagram, 
  Youtube, 
  Music, 
  Twitter, 
  Facebook,
  ExternalLink,
  Mail,
  Play
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialLinks {
  website_url?: string;
  instagram_url?: string;
  youtube_url?: string;
  spotify_url?: string;
  bandcamp_url?: string;
  apple_music_url?: string;
  soundcloud_url?: string;
  tiktok_url?: string;
  facebook_url?: string;
  twitter_url?: string;
}

interface ArtistData {
  id: string;
  name: string;
  bio?: string;
  email?: string;
  avatar_url?: string;
  is_featured: boolean;
  social_links: SocialLinks;
  photos: string[];
}

const SocialIcon = ({ platform, url, label }: { platform: string; url: string; label: string }) => {
  const getIcon = () => {
    switch (platform.toLowerCase()) {
      case 'website': return <Globe className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      case 'spotify': return <Music className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'bandcamp': return <Play className="w-5 h-5" />;
      case 'apple_music': return <Music className="w-5 h-5" />;
      case 'soundcloud': return <Play className="w-5 h-5" />;
      case 'tiktok': return <Play className="w-5 h-5" />;
      default: return <ExternalLink className="w-5 h-5" />;
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary transition-smooth group"
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted group-hover:bg-primary/10 transition-smooth">
        <span className="text-muted-foreground group-hover:text-primary transition-smooth">
          {getIcon()}
        </span>
      </div>
      <span className="font-medium text-foreground group-hover:text-primary transition-smooth">
        {label}
      </span>
      <ExternalLink className="w-4 h-4 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-smooth" />
    </a>
  );
};

const ArtistProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [artist, setArtist] = useState<ArtistData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      loadArtistProfile(id);
    }
  }, [id]);

  const loadArtistProfile = async (artistId: string) => {
    try {
      // Load artist profile
      const { data: artistData, error: artistError } = await supabase
        .from('artist_profiles')
        .select(`
          id,
          name,
          bio,
          avatar_url,
          is_featured,
          website_url,
          instagram_url,
          youtube_url,
          spotify_url,
          bandcamp_url,
          apple_music_url,
          soundcloud_url,
          tiktok_url,
          facebook_url,
          twitter_url
        `)
        .eq('id', artistId)
        .eq('is_public', true)
        .eq('is_archived', false)
        .maybeSingle();

      if (artistError) {
        console.error('Error loading artist:', artistError);
        toast({
          title: "Error",
          description: "Failed to load artist profile.",
          variant: "destructive",
        });
        return;
      }

      if (!artistData) {
        toast({
          title: "Artist Not Found",
          description: "The requested artist profile could not be found.",
          variant: "destructive",
        });
        return;
      }

      // Load artist photos
      const { data: photosData } = await supabase
        .from('artist_photos')
        .select('image_url')
        .eq('artist_id', artistId)
        .order('display_order', { ascending: true });

      const photos = photosData?.map(photo => photo.image_url) || [];
      
      // Use the first photo as avatar if no avatar_url is set
      const primaryImageUrl = artistData.avatar_url || photos[0] || '';

      setArtist({
        id: artistData.id,
        name: artistData.name,
        bio: artistData.bio || '',
        avatar_url: primaryImageUrl,
        is_featured: artistData.is_featured,
        social_links: {
          website_url: artistData.website_url || undefined,
          instagram_url: artistData.instagram_url || undefined,
          youtube_url: artistData.youtube_url || undefined,
          spotify_url: artistData.spotify_url || undefined,
          bandcamp_url: artistData.bandcamp_url || undefined,
          apple_music_url: artistData.apple_music_url || undefined,
          soundcloud_url: artistData.soundcloud_url || undefined,
          tiktok_url: artistData.tiktok_url || undefined,
          facebook_url: artistData.facebook_url || undefined,
          twitter_url: artistData.twitter_url || undefined,
        },
        photos: photos
      });
    } catch (error) {
      console.error('Error loading artist profile:', error);
      toast({
        title: "Error",
        description: "Failed to load artist profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSocialPlatformLabel = (platform: string) => {
    const labels: { [key: string]: string } = {
      website: 'Official Website',
      instagram: 'Instagram',
      youtube: 'YouTube',
      spotify: 'Spotify',
      bandcamp: 'Bandcamp',
      apple_music: 'Apple Music',
      soundcloud: 'SoundCloud',
      tiktok: 'TikTok',
      facebook: 'Facebook',
      twitter: 'Twitter/X'
    };
    return labels[platform] || platform;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-16">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading artist profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-16">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Artist Not Found</h1>
            <p className="text-muted-foreground mb-8">The requested artist profile could not be found.</p>
            <Link to="/artists">
              <Button variant="hero">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Artists
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const socialLinks = Object.entries(artist.social_links)
    .filter(([_, url]) => url && url.trim() !== '')
    .map(([platform, url]) => ({
      platform: platform.replace('_url', ''),
      url: url as string,
      label: getSocialPlatformLabel(platform.replace('_url', ''))
    }));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Back Button */}
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <Link to="/artists">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Artists
            </Button>
          </Link>
        </div>

        {/* Artist Profile Header */}
        <section className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Artist Image */}
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <div className="aspect-square relative">
                  {artist.avatar_url ? (
                    <img
                      src={artist.avatar_url}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-hero">
                      <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center">
                        <Music className="w-16 h-16 text-primary" />
                      </div>
                    </div>
                  )}
                  
                  {artist.is_featured && (
                    <Badge className="absolute top-4 right-4 gradient-accent text-accent-foreground">
                      Featured Artist
                    </Badge>
                  )}
                </div>
              </Card>
            </div>

            {/* Artist Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Name and Bio */}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-4">
                  {artist.name}
                </h1>
                {artist.bio && (
                  <div className="prose prose-lg max-w-none">
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {artist.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">Connect & Listen</h2>
                  <div className="grid gap-3 max-w-md">
                    {socialLinks.map(({ platform, url, label }) => (
                      <SocialIcon key={platform} platform={platform} url={url} label={label} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Photos */}
          {artist.photos.length > 1 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Photo Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {artist.photos.slice(1).map((photo, index) => (
                  <Card key={index} className="overflow-hidden group cursor-pointer">
                    <div className="aspect-square relative">
                      <img
                        src={photo}
                        alt={`${artist.name} photo ${index + 2}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </section>
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

export default ArtistProfile;