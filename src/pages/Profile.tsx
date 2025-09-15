import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Lock, LogOut, Settings } from 'lucide-react';

interface UserProfile {
  id: string;
  display_name: string;
  username: string;
  email: string;
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

const Profile = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    display_name: '',
    username: '',
    website_url: '',
    instagram_url: '',
    youtube_url: '',
    spotify_url: '',
    bandcamp_url: '',
    apple_music_url: '', // Not in DB but kept for UI
    soundcloud_url: '',
    tiktok_url: '', // Not in DB but kept for UI  
    facebook_url: '',
    twitter_url: '',
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (isAdmin) {
        navigate('/admin');
      } else {
        loadProfile();
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('por_eve_profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error) throw error;

      const profileData = {
        ...data,
        email: user!.email || data.email,
      };

      setProfile(profileData);
      setFormData({
        display_name: data.display_name || '',
        username: data.username || '',
        website_url: data.website_url || '',
        instagram_url: data.instagram_url || '',
        youtube_url: data.youtube_url || '',
        spotify_url: data.spotify_url || '',
        bandcamp_url: data.bandcamp_url || '',
        apple_music_url: '',
        soundcloud_url: data.soundcloud_url || '',
        tiktok_url: '',
        facebook_url: data.facebook_url || '',
        twitter_url: data.twitter_url || '',
      });
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Only send fields that exist in the database
      const updateData = {
        display_name: formData.display_name,
        username: formData.username,
        website_url: formData.website_url,
        instagram_url: formData.instagram_url,
        youtube_url: formData.youtube_url,
        spotify_url: formData.spotify_url,
        bandcamp_url: formData.bandcamp_url,
        soundcloud_url: formData.soundcloud_url,
        facebook_url: formData.facebook_url,
        twitter_url: formData.twitter_url,
      };

      const { error } = await supabase
        .from('por_eve_profiles')
        .update(updateData)
        .eq('id', user!.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, ...updateData } : null);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient-primary">My Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your account settings</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Profile Information
                </CardTitle>
                <CardDescription>
                  Update your public profile information and social links.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="display_name">Display Name</Label>
                        <Input
                          id="display_name"
                          value={formData.display_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={profile?.email || ''} disabled />
                      <p className="text-xs text-muted-foreground mt-1">
                        Contact an admin to change your email address
                      </p>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Social Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  </div>

                  <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Changes
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Update your password and security settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;