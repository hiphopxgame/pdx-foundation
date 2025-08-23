import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Upload, Trash2, Star, Image as ImageIcon } from 'lucide-react';

interface ArtistProfile {
  id: string;
  name: string;
  bio?: string;
  email?: string;
  avatar_url?: string;
  is_featured: boolean;
  is_public: boolean;
  display_order: number;
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

interface ArtistPhoto {
  id: string;
  artist_id: string;
  image_url: string;
  caption?: string;
  display_order: number;
  is_featured: boolean;
}

const Admin = () => {
  const [artists, setArtists] = useState<ArtistProfile[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<ArtistProfile | null>(null);
  const [artistPhotos, setArtistPhotos] = useState<ArtistPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<ArtistProfile>>({
    name: '',
    bio: '',
    email: '',
    is_featured: false,
    is_public: true,
    display_order: 0,
    website_url: '',
    instagram_url: '',
    youtube_url: '',
    spotify_url: '',
    bandcamp_url: '',
    apple_music_url: '',
    soundcloud_url: '',
    tiktok_url: '',
    facebook_url: '',
    twitter_url: '',
  });

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      const { data, error } = await supabase
        .from('artist_profiles')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setArtists(data || []);
    } catch (error) {
      console.error('Error loading artists:', error);
      toast({
        title: "Error",
        description: "Failed to load artist profiles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadArtistPhotos = async (artistId: string) => {
    try {
      const { data, error } = await supabase
        .from('artist_photos')
        .select('*')
        .eq('artist_id', artistId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setArtistPhotos(data || []);
    } catch (error) {
      console.error('Error loading photos:', error);
      toast({
        title: "Error",
        description: "Failed to load artist photos",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedArtist) {
        // Update existing artist
        const { error } = await supabase
          .from('artist_profiles')
          .update(formData)
          .eq('id', selectedArtist.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Artist profile updated successfully",
        });
      } else {
        // Create new artist
        const { error } = await supabase
          .from('artist_profiles')
          .insert([{ ...formData, name: formData.name! }]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Artist profile created successfully",
        });
      }

      setIsDialogOpen(false);
      setSelectedArtist(null);
      resetForm();
      loadArtists();
    } catch (error) {
      console.error('Error saving artist:', error);
      toast({
        title: "Error",
        description: "Failed to save artist profile",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'photo') => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = type === 'avatar' ? `avatars/${fileName}` : `artist-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (type === 'avatar') {
        setFormData(prev => ({ ...prev, avatar_url: publicUrl }));
      } else if (selectedArtist) {
        // Add photo to artist_photos table
        const { error } = await supabase
          .from('artist_photos')
          .insert([{
            artist_id: selectedArtist.id,
            image_url: publicUrl,
            display_order: artistPhotos.length,
            is_featured: false,
          }]);

        if (error) throw error;
        
        loadArtistPhotos(selectedArtist.id);
        toast({
          title: "Success",
          description: "Photo uploaded successfully",
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const deletePhoto = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('artist_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      if (selectedArtist) {
        loadArtistPhotos(selectedArtist.id);
      }
      
      toast({
        title: "Success",
        description: "Photo deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Error",
        description: "Failed to delete photo",
        variant: "destructive",
      });
    }
  };

  const editArtist = (artist: ArtistProfile) => {
    setSelectedArtist(artist);
    setFormData(artist);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      bio: '',
      email: '',
      is_featured: false,
      is_public: true,
      display_order: 0,
      website_url: '',
      instagram_url: '',
      youtube_url: '',
      spotify_url: '',
      bandcamp_url: '',
      apple_music_url: '',
      soundcloud_url: '',
      tiktok_url: '',
      facebook_url: '',
      twitter_url: '',
    });
  };

  const managePhotos = (artist: ArtistProfile) => {
    setSelectedArtist(artist);
    loadArtistPhotos(artist.id);
    setIsPhotoDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading artists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            Artist Management
          </h1>
          <p className="text-muted-foreground">
            Manage PDX.Foundation artist profiles and galleries
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm">
              {artists.length} Total Artists
            </Badge>
            <Badge variant="secondary" className="text-sm">
              {artists.filter(a => a.is_featured).length} Featured
            </Badge>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {resetForm(); setSelectedArtist(null);}}>
                <Plus className="w-4 h-4 mr-2" />
                Add Artist
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {selectedArtist ? 'Edit Artist' : 'Add New Artist'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="social">Social Links</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Artist Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="avatar">Avatar Image</Label>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'avatar')}
                        disabled={uploadingFile}
                      />
                      {formData.avatar_url && (
                        <div className="mt-2">
                          <img
                            src={formData.avatar_url}
                            alt="Avatar preview"
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="display_order">Display Order</Label>
                        <Input
                          id="display_order"
                          type="number"
                          value={formData.display_order}
                          onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_featured"
                          checked={formData.is_featured}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                        />
                        <Label htmlFor="is_featured">Featured</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="is_public"
                          checked={formData.is_public}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
                        />
                        <Label htmlFor="is_public">Public</Label>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="social" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="website_url">Website</Label>
                        <Input
                          id="website_url"
                          value={formData.website_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                          placeholder="https://"
                        />
                      </div>
                      <div>
                        <Label htmlFor="instagram_url">Instagram</Label>
                        <Input
                          id="instagram_url"
                          value={formData.instagram_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                          placeholder="https://instagram.com/"
                        />
                      </div>
                      <div>
                        <Label htmlFor="youtube_url">YouTube</Label>
                        <Input
                          id="youtube_url"
                          value={formData.youtube_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                          placeholder="https://youtube.com/"
                        />
                      </div>
                      <div>
                        <Label htmlFor="spotify_url">Spotify</Label>
                        <Input
                          id="spotify_url"
                          value={formData.spotify_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, spotify_url: e.target.value }))}
                          placeholder="https://open.spotify.com/"
                        />
                      </div>
                      <div>
                        <Label htmlFor="bandcamp_url">Bandcamp</Label>
                        <Input
                          id="bandcamp_url"
                          value={formData.bandcamp_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, bandcamp_url: e.target.value }))}
                          placeholder="https://.bandcamp.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="apple_music_url">Apple Music</Label>
                        <Input
                          id="apple_music_url"
                          value={formData.apple_music_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, apple_music_url: e.target.value }))}
                          placeholder="https://music.apple.com/"
                        />
                      </div>
                      <div>
                        <Label htmlFor="soundcloud_url">SoundCloud</Label>
                        <Input
                          id="soundcloud_url"
                          value={formData.soundcloud_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, soundcloud_url: e.target.value }))}
                          placeholder="https://soundcloud.com/"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tiktok_url">TikTok</Label>
                        <Input
                          id="tiktok_url"
                          value={formData.tiktok_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, tiktok_url: e.target.value }))}
                          placeholder="https://tiktok.com/"
                        />
                      </div>
                      <div>
                        <Label htmlFor="facebook_url">Facebook</Label>
                        <Input
                          id="facebook_url"
                          value={formData.facebook_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))}
                          placeholder="https://facebook.com/"
                        />
                      </div>
                      <div>
                        <Label htmlFor="twitter_url">Twitter</Label>
                        <Input
                          id="twitter_url"
                          value={formData.twitter_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, twitter_url: e.target.value }))}
                          placeholder="https://twitter.com/"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {selectedArtist ? 'Update' : 'Create'} Artist
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <Card key={artist.id} className="gradient-card border-border overflow-hidden">
              <div className="relative h-32 bg-gradient-hero">
                {artist.avatar_url ? (
                  <img
                    src={artist.avatar_url}
                    alt={artist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                )}
                
                <div className="absolute top-2 right-2 flex gap-1">
                  {artist.is_featured && (
                    <Badge className="gradient-accent text-accent-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {!artist.is_public && (
                    <Badge variant="secondary">Private</Badge>
                  )}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-gradient-primary">{artist.name}</h3>
                  {artist.bio && (
                    <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                      {artist.bio}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => editArtist(artist)}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="hero"
                    size="sm"
                    onClick={() => managePhotos(artist)}
                    className="flex-1"
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Photos
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Photo Management Dialog */}
        <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Manage Photos - {selectedArtist?.name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="photo-upload">Upload New Photo</Label>
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'photo')}
                  disabled={uploadingFile}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {artistPhotos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.image_url}
                      alt={photo.caption || ''}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deletePhoto(photo.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {photo.is_featured && (
                      <Badge className="absolute top-2 left-2 gradient-accent">
                        Featured
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Admin;