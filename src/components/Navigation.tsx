import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Users, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Navigation = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/artists', label: 'Artists', icon: Users },
    { path: '/events', label: 'Events', icon: Calendar },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border animate-fade-in">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-gradient-primary hover-scale">
            PDX.Foundation
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.path} to={item.path}>
                  <Button 
                    variant={isActive(item.path) ? "default" : "ghost"} 
                    size="sm"
                    className="flex items-center gap-2 transition-all duration-200"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
            
            {/* Admin Panel Link */}
            {isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="ml-2">
                  Admin Panel
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;