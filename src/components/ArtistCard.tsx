import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Instagram, 
  Youtube, 
  Music, 
  Twitter, 
  Facebook,
  Play,
  ExternalLink
} from 'lucide-react';

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

interface ArtistProfile {
  id: string;
  name: string;
  bio?: string;
  email?: string;
  avatar_url?: string;
  is_featured: boolean;
  social_links: SocialLinks;
}

interface ArtistCardProps {
  artist: ArtistProfile;
  showPhotos?: boolean;
  showVideos?: boolean;
}

const SocialIcon = ({ platform, url }: { platform: string; url: string }) => {
  const getIcon = () => {
    switch (platform.toLowerCase()) {
      case 'website': return <Globe className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'spotify': return <Music className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-accent transition-smooth group"
    >
      <span className="text-muted-foreground group-hover:text-accent-foreground transition-smooth">
        {getIcon()}
      </span>
    </a>
  );
};

export default function ArtistCard({ artist, showPhotos = false, showVideos = false }: ArtistCardProps) {
  const socialLinks = Object.entries(artist.social_links)
    .filter(([_, url]) => url && url.trim() !== '')
    .map(([platform, url]) => ({
      platform: platform.replace('_url', ''),
      url: url as string
    }));

  return (
    <Card className="gradient-card border-border overflow-hidden group hover:shadow-card transition-smooth">
      {/* Artist Avatar/Header */}
      <div className="relative h-48 bg-gradient-hero overflow-hidden">
        {artist.avatar_url ? (
          <img
            src={artist.avatar_url}
            alt={artist.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
              <Music className="w-12 h-12 text-primary" />
            </div>
          </div>
        )}
        
        {artist.is_featured && (
          <Badge className="absolute top-3 right-3 gradient-accent text-accent-foreground">
            Featured
          </Badge>
        )}
      </div>

      {/* Artist Info */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-gradient-primary mb-2">
            {artist.name}
          </h3>
          {artist.bio && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
              {artist.bio}
            </p>
          )}
        </div>

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Connect</h4>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ platform, url }) => (
                <SocialIcon key={platform} platform={platform} url={url} />
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="hero" size="sm" className="flex-1">
            <Play className="w-4 h-4" />
            View Profile
          </Button>
          {artist.email && (
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4" />
              Contact
            </Button>
          )}
        </div>
      </div>

      {/* Future: Photos/Videos sections */}
      {(showPhotos || showVideos) && (
        <div className="border-t border-border p-4">
          <div className="text-xs text-muted-foreground text-center">
            Media content coming soon...
          </div>
        </div>
      )}
    </Card>
  );
}