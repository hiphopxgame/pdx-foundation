import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Edit, Mail, Globe, Archive, Eye, EyeOff, Star, User } from 'lucide-react';

interface UserProfile {
  id: string;
  user_id?: string;
  name: string;
  bio?: string;
  email?: string;
  avatar_url?: string;
  is_featured: boolean;
  is_public: boolean;
  is_email_public: boolean;
  is_archived: boolean;
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
  created_at: string;
  updated_at: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: '',
    bio: '',
    email: '',
    is_featured: false,
    is_public: true,
    is_email_public: false,
    is_archived: false,
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
    loadUsers();
  }, [showArchived]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('artist_profiles')
        .select('*')
        .eq('is_archived', showArchived)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const editUser = (user: UserProfile) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      bio: user.bio || '',
      email: user.email || '',
      is_featured: user.is_featured,
      is_public: user.is_public,
      is_email_public: user.is_email_public,
      is_archived: user.is_archived,
      display_order: user.display_order,
      website_url: user.website_url || '',
      instagram_url: user.instagram_url || '',
      youtube_url: user.youtube_url || '',
      spotify_url: user.spotify_url || '',
      bandcamp_url: user.bandcamp_url || '',
      apple_music_url: user.apple_music_url || '',
      soundcloud_url: user.soundcloud_url || '',
      tiktok_url: user.tiktok_url || '',
      facebook_url: user.facebook_url || '',
      twitter_url: user.twitter_url || '',
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;

    try {
      const { error } = await supabase
        .from('artist_profiles')
        .update(formData)
        .eq('id', selectedUser.id);

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? { ...user, ...formData } : user
      ));

      setIsDialogOpen(false);
      setSelectedUser(null);
      
      toast({
        title: "Success",
        description: "User profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user profile",
        variant: "destructive",
      });
    }
  };

  const toggleUserStatus = async (userId: string, field: 'is_public' | 'is_featured' | 'is_archived' | 'is_email_public', currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('artist_profiles')
        .update({ [field]: !currentValue })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, [field]: !currentValue } : user
      ));

      toast({
        title: "Success",
        description: `User ${field.replace('is_', '')} updated successfully`,
      });

      // If archiving/unarchiving, reload to filter correctly
      if (field === 'is_archived') {
        loadUsers();
      }
    } catch (error) {
      console.error(`Error updating user ${field}:`, error);
      toast({
        title: "Error",
        description: `Failed to update user ${field.replace('is_', '')}`,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            {filteredUsers.length} Users
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {filteredUsers.filter(u => u.is_featured).length} Featured
          </Badge>
          <Badge variant="outline" className="text-sm">
            {filteredUsers.filter(u => u.is_public).length} Public
          </Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-archived"
              checked={showArchived}
              onCheckedChange={setShowArchived}
            />
            <Label htmlFor="show-archived">Show Archived</Label>
          </div>
          
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="gradient-card border-border overflow-hidden">
            <div className="relative h-24 bg-gradient-hero">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                </div>
              )}
              
              <div className="absolute top-2 right-2 flex gap-1">
                {user.is_featured && (
                  <Badge className="gradient-accent text-accent-foreground text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {!user.is_public && (
                  <Badge variant="secondary" className="text-xs">Private</Badge>
                )}
                {user.is_archived && (
                  <Badge variant="destructive" className="text-xs">Archived</Badge>
                )}
              </div>
            </div>

            <div className="p-3 space-y-2">
              <div>
                <h3 className="font-bold text-gradient-primary text-sm">{user.name}</h3>
                {user.email && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="w-3 h-3" />
                    <span className="truncate">{user.email}</span>
                    {user.is_email_public ? (
                      <Eye className="w-3 h-3 text-green-500" />
                    ) : (
                      <EyeOff className="w-3 h-3 text-red-500" />
                    )}
                  </div>
                )}
                {user.bio && (
                  <p className="text-muted-foreground text-xs line-clamp-2 mt-1">
                    {user.bio}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-1 text-xs">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleUserStatus(user.id, 'is_public', user.is_public)}
                  className="h-7"
                >
                  {user.is_public ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleUserStatus(user.id, 'is_featured', user.is_featured)}
                  className="h-7"
                >
                  <Star className={`w-3 h-3 ${user.is_featured ? 'text-yellow-500' : ''}`} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editUser(user)}
                  className="h-7"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant={user.is_archived ? "secondary" : "destructive"}
                  size="sm"
                  onClick={() => toggleUserStatus(user.id, 'is_archived', user.is_archived)}
                  className="h-7"
                >
                  <Archive className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No users found matching your criteria.</p>
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit User - {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Update user profile information and settings.
            </DialogDescription>
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
                    <Label htmlFor="name">Name *</Label>
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="display_order">Display Order</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_email_public"
                    checked={formData.is_email_public}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_email_public: checked }))}
                  />
                  <Label htmlFor="is_email_public">Email Public</Label>
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
                Update User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;