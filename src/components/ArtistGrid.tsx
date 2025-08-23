import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ArtistCard from './ArtistCard';

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
  bio: string;
  email: string;
  avatar_url: string;
  is_featured: boolean;
  social_links: SocialLinks;
}

// Real PDX Foundation Artists
const mockArtists = [
  {
    id: '1',
    name: 'Jessica Is Everywhere',
    bio: 'Jessica.Iseverywhere is a visual storyteller that captures the intimate electricity of live performance, moving with the artist and the music they make. I try to translate stage presence into emotion, rhythm, and raw human connection. Highlighting the heart of the PNW\'s underground scene and amplifying voices often unheard.',
    email: 'Pnwfieldtrips@gmail.com',
    avatar_url: '',
    is_featured: true,
    social_links: {
      instagram_url: 'https://instagram.com/jessica.iseverywhere',
      tiktok_url: 'https://www.tiktok.com/@jessica.iseverywhere?_t=ZP-8yQUGiyfxkM&_r=1',
      facebook_url: 'https://www.facebook.com/jessica.dimasponce',
    }
  },
  {
    id: '2',
    name: 'Mental Stamina',
    bio: '',
    email: 'Tyronenorris@gmail.com',
    avatar_url: '',
    is_featured: true,
    social_links: {
      instagram_url: 'https://instagram.com/1vsm',
    }
  },
  {
    id: '3',
    name: 'Zodi Zac',
    bio: 'After landing on earth, Zodi first touched the forbidden vinyl at the early age of 2 & has been addicted ever since. An eternal student/teacher, ready to listen, learn, & scratch. If you are seeing Z perform, the stars have aligned.',
    email: 'zodizac@protonmail.com',
    avatar_url: '',
    is_featured: true,
    social_links: {
      instagram_url: 'https://instagram.com/503zodi',
    }
  },
  {
    id: '4',
    name: 'Kaufman',
    bio: 'Kaufman is passed at Flappers in Burbank. He has worked the Icehouse in Pasadena & Alameda Comedy Club and appeared at Broadway Comedy Club in Manhattan.',
    email: 'barakanoel@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/barakanoel',
      youtube_url: 'https://www.youtube.com/barakanoel',
      bandcamp_url: 'https://citizensofsleep.bandcamp.com',
    }
  },
  {
    id: '5',
    name: 'Bex & the Bees',
    bio: '',
    email: '',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/bexandthebees',
    }
  },
  {
    id: '6',
    name: 'Shane Farnell',
    bio: 'Folk-punk singer-songwriter based out of Portland, Oregon.',
    email: 'Shanemichaelfarnell@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/shane_farnell_music',
      youtube_url: 'https://www.youtube.com/channel/UCCA34R-Bb4VRqSsZqtNyUVg',
      spotify_url: 'https://open.spotify.com/artist/4NKPvpO9pN7S4Fj0lUKfjI',
      facebook_url: 'https://www.facebook.com/profile.php?id=100088767189122',
    }
  },
  {
    id: '7',
    name: 'Scott Allen',
    bio: '',
    email: 'scottallencello@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/cellographic',
    }
  },
  {
    id: '8',
    name: 'Matt Varga',
    bio: 'Human/Alien Scientific/Spiritual Violinist/Guitarist Enjoying the walk home (RIP Ram Dass), let\'s walk together! Looking to be the change',
    email: 'matt.varga@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/xirdnehimij',
    }
  },
  {
    id: '9',
    name: 'Colton Herman',
    bio: 'Producer turned Vegan Activist touring the United States, living from his car.',
    email: 'cltnhrmn@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/cltnhrmn',
    }
  },
  {
    id: '10',
    name: 'Billions Under Millions',
    bio: '',
    email: 'polomolly23@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/4m_billions.under.millions',
    }
  },
  {
    id: '11',
    name: 'Diction Uno',
    bio: '',
    email: 'dictionuno@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/dictionuno',
      youtube_url: 'https://www.youtube.com/user/DictionOne',
      spotify_url: 'https://open.spotify.com/artist/1Ia2o89eFM3tzMS547f2oQ?si=wJfFKbFjQw2bt7G-WGEgUw&dl_branch=1',
      bandcamp_url: 'https://dictionuno.bandcamp.com/',
      apple_music_url: 'https://music.apple.com/us/artist/diction-uno/1459730992',
      tiktok_url: 'https://www.tiktok.com/@dictionuno',
      facebook_url: 'https://www.facebook.com/DictionUno503',
    }
  },
  {
    id: '12',
    name: 'G\'Odd',
    bio: 'G\'Odd is an experimental rapper, producer and multi media artist making extensive projects with album, movie, visual art and performance elements. These undertaking tend to focus on a crossroads of depravity and enlightenment.',
    email: '',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/goddmind',
      youtube_url: 'https://www.youtube.com/@electroshockandawe9152',
    }
  },
  {
    id: '13',
    name: 'Lemon Vice',
    bio: 'Live Sound Engineer, Artist, Song Writer, Musician, Producer, College Student 🍋',
    email: 'Lemonvic3@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/lemon.vice',
      youtube_url: 'https://www.youtube.com/channel/UC7i5JMc06qYXMfg1fN6eg7g',
      spotify_url: 'https://open.spotify.com/artist/5emGEX1UbVfNIhAIaJ5yYF?si=NuHYDb_OSGKP0TwRTb2cqQ&dl_branch=1&nd=1&dlsi=d38f6734027e47ed',
      apple_music_url: 'https://music.apple.com/us/artist/lemon-vice/1572114282',
      soundcloud_url: 'https://soundcloud.com/jason-lemon-514468621',
      tiktok_url: 'https://www.tiktok.com/@lemon.vice',
    }
  },
  {
    id: '14',
    name: 'Your Homie Kyle',
    bio: '',
    email: 'Yourhomiekyle@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/yourhomiekyle',
      soundcloud_url: 'https://soundcloud.com/yourhomie-kyle',
    }
  },
  {
    id: '15',
    name: 'Obbium',
    bio: 'OBBI is an experimental musician and producer behind the Obbium brand, blending raw emotion with genre-bending soundscapes. His music explores transformation, connection, and spiritual growth through layered beats and mindful frequencies. Inspired by holistic living and ancient wisdom, OBBI crafts songs that nourish both heart and mind. He invites listeners into a sonic journey of self-discovery and collective experience',
    email: 'obbiumbrand@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/obbium',
      soundcloud_url: 'https://soundcloud.com/user-980412170',
    }
  },
  {
    id: '16',
    name: 'The Oregonization',
    bio: 'The Oregonization is J Reid!! We have features from numerous artists which help make up The O. To see more, please visit theoregonization.com',
    email: '503oregonization@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      website_url: 'https://theoregonization.com',
      instagram_url: 'https://instagram.com/the_o503',
      youtube_url: 'https://www.youtube.com/@theoregonization7214',
    }
  },
  {
    id: '17',
    name: 'Magi Love',
    bio: '✨ Alchemist of the heart. Spread LOVE 🌀 Transmuting pain into power 📖 Author: The Discipline of Love 💛 A path to spiritual growth',
    email: 'Iamlove7272@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/magilove',
    }
  },
  {
    id: '18',
    name: 'Gift',
    bio: '',
    email: 'Giftsharp66@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/gofuckyourself2438',
    }
  },
  {
    id: '19',
    name: 'Dezifel',
    bio: '',
    email: 'desidesignsstuff2447@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/lil_casanova_',
    }
  },
  {
    id: '20',
    name: 'Alexx Skyy',
    bio: '',
    email: 'alexgrabofsky@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/_alexx_skyy',
    }
  },
  {
    id: '21',
    name: 'Escape The Smoke',
    bio: '',
    email: 'escapethesmok@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/escapethesmok',
      spotify_url: 'https://open.spotify.com/artist/4afhMrJ6qlDXYFM0eS4yPt',
    }
  },
  {
    id: '22',
    name: 'Michael P Toombs',
    bio: '',
    email: 'mptoombs4@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/michaelptoombs',
      spotify_url: 'https://open.spotify.com/artist/5PSJbKIyC6iD1QvE6NdfG2?si=ft6cDaC-RCaFJiOiD1AwjA&nd=1&dlsi=591a259e1807423e',
    }
  },
  {
    id: '23',
    name: 'Tata',
    bio: 'Your favorite rapper\'s favorite homie that raps Addicted to rhythm and open mics Local artist from tha 503 building a meta verse wit a pen and verse',
    email: 'Tata.503.htc@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/corneliusfinest503',
      youtube_url: 'https://www.youtube.com/@mr.brownvanilla',
    }
  },
  {
    id: '24',
    name: 'Bllack Cat',
    bio: '',
    email: '',
    avatar_url: '',
    is_featured: false,
    social_links: {
      instagram_url: 'https://instagram.com/bllackcat.m4a',
    }
  },
  {
    id: '25',
    name: 'Banshekid',
    bio: '',
    email: 'bansheekid23@gmail.com',
    avatar_url: '',
    is_featured: false,
    social_links: {}
  }
];

export default function ArtistGrid() {
  const [artists, setArtists] = useState<ArtistProfile[]>(mockArtists);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      const { data, error } = await supabase
        .from('artist_profiles')
        .select('*')
        .eq('is_public', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error loading artists:', error);
        // Fallback to mock data
        setArtists(mockArtists);
      } else if (data && data.length > 0) {
        // Transform database data to match expected format
        const transformedArtists: ArtistProfile[] = data.map(artist => ({
          id: artist.id,
          name: artist.name,
          bio: artist.bio || '',
          email: artist.email || '',
          avatar_url: artist.avatar_url || '',
          is_featured: artist.is_featured,
          social_links: {
            website_url: artist.website_url || undefined,
            instagram_url: artist.instagram_url || undefined,
            youtube_url: artist.youtube_url || undefined,
            spotify_url: artist.spotify_url || undefined,
            bandcamp_url: artist.bandcamp_url || undefined,
            apple_music_url: artist.apple_music_url || undefined,
            soundcloud_url: artist.soundcloud_url || undefined,
            tiktok_url: artist.tiktok_url || undefined,
            facebook_url: artist.facebook_url || undefined,
            twitter_url: artist.twitter_url || undefined,
          }
        }));
        setArtists(transformedArtists);
      } else {
        // No data in database, use mock data
        setArtists(mockArtists);
      }
    } catch (error) {
      console.error('Error loading artists:', error);
      setArtists(mockArtists);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading artists...</p>
        </div>
      </section>
    );
  }

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
            {artists
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
            {artists.map(artist => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}