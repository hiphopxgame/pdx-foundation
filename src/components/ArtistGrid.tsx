import React from 'react';
import ArtistCard from './ArtistCard';

// Mock data for demonstration
const mockArtists = [
  {
    id: '1',
    name: 'Luna Rivers',
    bio: 'Electronic music producer blending ambient soundscapes with urban beats. Portland-based artist exploring the intersection of nature and technology through sound.',
    email: 'luna@pdxfoundation.com',
    avatar_url: '',
    is_featured: true,
    social_links: {
      website_url: 'https://lunarivers.com',
      instagram_url: 'https://instagram.com/lunariversmusic',
      youtube_url: 'https://youtube.com/lunariversofficialx',
      spotify_url: 'https://open.spotify.com/artist/lunarivers',
      soundcloud_url: 'https://soundcloud.com/lunarivers',
    }
  },
  {
    id: '2',
    name: 'The Urban Collective',
    bio: 'Hip-hop collective representing the diverse voices of Portland. Creating socially conscious music that speaks to the experiences of our community.',
    email: 'collective@pdxfoundation.com',
    avatar_url: '',
    is_featured: true,
    social_links: {
      instagram_url: 'https://instagram.com/urbancollectivepdx',
      youtube_url: 'https://youtube.com/urbancollectivepdx',
      spotify_url: 'https://open.spotify.com/artist/urbancollective',
      bandcamp_url: 'https://urbancollective.bandcamp.com',
      twitter_url: 'https://twitter.com/urbancollectivepdx',
    }
  },
  {
    id: '3',
    name: 'Echo Station',
    bio: 'Experimental rock band pushing the boundaries of sound. Combining traditional instruments with electronic elements to create immersive audio experiences.',
    email: 'echo@pdxfoundation.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      website_url: 'https://echostation.band',
      instagram_url: 'https://instagram.com/echostationband',
      youtube_url: 'https://youtube.com/echostationofficial',
      spotify_url: 'https://open.spotify.com/artist/echostation',
      apple_music_url: 'https://music.apple.com/artist/echostation',
      facebook_url: 'https://facebook.com/echostationband',
    }
  },
  {
    id: '4',
    name: 'Neon Dreams',
    bio: 'Synthwave artist creating nostalgic yet futuristic soundscapes. Drawing inspiration from 80s aesthetics and modern production techniques.',
    email: 'neon@pdxfoundation.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/neondreamsmusic',
      youtube_url: 'https://youtube.com/neondreamsofficial',
      spotify_url: 'https://open.spotify.com/artist/neondreams',
      soundcloud_url: 'https://soundcloud.com/neondreams',
      tiktok_url: 'https://tiktok.com/@neondreamsmusic',
    }
  }
];

export default function ArtistGrid() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gradient-primary mb-4">
            Our Artists
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover the diverse voices and innovative sounds that make up the PDX.Foundation collective.
            Each artist brings their unique perspective to Portland's vibrant music scene.
          </p>
        </div>

        {/* Featured Artists */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-accent rounded-full"></span>
            Featured Artists
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockArtists
              .filter(artist => artist.is_featured)
              .map(artist => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
          </div>
        </div>

        {/* All Artists */}
        <div>
          <h3 className="text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            All Members
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockArtists.map(artist => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}