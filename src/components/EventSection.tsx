import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';

export default function EventSection() {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-background via-background/95 to-accent/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Event Image */}
          <div className="relative">
            <img
              src="/lovable-uploads/96efc671-3608-45ca-99b7-cdec0949cc4b.png"
              alt="PDX.Foundation Showcase Event"
              className="w-full rounded-2xl shadow-elegant"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-background/20 to-transparent"></div>
          </div>

          {/* Event Details */}
          <div className="space-y-6">
            <Badge className="gradient-accent text-accent-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Upcoming Event
            </Badge>

            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="text-gradient-primary">PDX.Foundation</span>
              <span className="text-foreground"> Showcase</span>
            </h2>

            <p className="text-xl text-muted-foreground leading-relaxed">
              Join us for an unforgettable evening celebrating Portland's vibrant music scene. 
              Experience live performances from our talented collective of artists.
            </p>

            {/* Event Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-foreground">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-semibold">Tuesday, September 30th, 2025</span>
              </div>
              
              <div className="flex items-center gap-3 text-foreground">
                <Clock className="w-5 h-5 text-accent" />
                <span className="font-semibold">4:00 PM - 10:00 PM</span>
              </div>
              
              <div className="flex items-center gap-3 text-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold">Covert Café</div>
                  <div className="text-muted-foreground">803 SE 82nd Ave, Portland, OR 97216</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-foreground">
                <Ticket className="w-5 h-5 text-accent" />
                <span className="font-semibold text-accent">Free Admission</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="hero" size="lg" asChild>
                <a 
                  href="https://www.google.com/maps/dir//Covert+Caf%C3%A9,+803+SE+82nd+Ave,+Portland,+OR+97216/@45.5168084,-122.620532,13z/data=!4m9!4m8!1m0!1m5!1m1!1s0x5495a1a9fda3d12b:0x69e910d10ba4a5c!2m2!1d-122.5791431!2d45.5167612!3e0?entry=ttu&g_ep=EgoyMDI1MDkwOS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Get Directions
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-24 h-24 rounded-full bg-primary/10 blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-accent/10 blur-xl animate-pulse delay-500"></div>
    </section>
  );
}