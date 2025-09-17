import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Ticket, Home } from 'lucide-react';

const Events = () => {
  // Sample upcoming events data
  const upcomingEvents = [
    {
      id: 1,
      title: 'PDX.Foundation Showcase',
      description: 'Join us for an unforgettable evening celebrating Portland\'s vibrant music scene. Experience live performances from our talented collective of artists.',
      date: 'Tuesday, September 30th, 2025',
      time: '4:00 PM - 10:00 PM',
      venue: 'Covert Café',
      address: '803 SE 82nd Ave, Portland, OR 97216',
      price: 'Free Admission',
      image: '/images/pdx-showcase-event.png',
      mapsUrl: 'https://www.google.com/maps/dir//Covert+Caf%C3%A9,+803+SE+82nd+Ave,+Portland,+OR+97216/@45.5168084,-122.620532,13z/data=!4m9!4m8!1m0!1m5!1m1!1s0x5495a1a9fda3d12b:0x69e910d10ba4a5c!2m2!1d-122.5791431!2d45.5167612!3e0?entry=ttu&g_ep=EgoyMDI1MDkwOS4wIKXMDSoASAFQAw%3D%3D'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-4 left-4 z-10">
        <Link to="/">
          <Button variant="outline" size="sm">
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </Link>
      </div>
      
      <main className="pt-16">
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-4">
                Upcoming Events
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join us at our upcoming events and be part of Portland's thriving artistic community.
                From showcases to workshops, there's something for everyone.
              </p>
            </div>

            {/* Events Grid */}
            <div className="space-y-8">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-card rounded-2xl shadow-elegant overflow-hidden border border-border">
                  <div className="grid lg:grid-cols-2 gap-8 p-8">
                    {/* Event Image */}
                    <div className="relative">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-64 lg:h-full object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-background/20 to-transparent"></div>
                    </div>

                    {/* Event Details */}
                    <div className="space-y-6">
                      <Badge className="gradient-accent text-accent-foreground w-fit">
                        <Calendar className="w-4 h-4 mr-2" />
                        Upcoming Event
                      </Badge>

                      <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                        {event.title}
                      </h2>

                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {event.description}
                      </p>

                      {/* Event Info */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-foreground">
                          <Calendar className="w-5 h-5 text-primary" />
                          <span className="font-semibold">{event.date}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-foreground">
                          <Clock className="w-5 h-5 text-accent" />
                          <span className="font-semibold">{event.time}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-foreground">
                          <MapPin className="w-5 h-5 text-primary" />
                          <div>
                            <div className="font-semibold">{event.venue}</div>
                            <div className="text-muted-foreground">{event.address}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-foreground">
                          <Ticket className="w-5 h-5 text-accent" />
                          <span className="font-semibold text-accent">{event.price}</span>
                        </div>
                      </div>

                      {/* CTA Buttons */}
                      {event.mapsUrl && (
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Button variant="hero" size="lg" asChild>
                            <a 
                              href={event.mapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MapPin className="w-5 h-5 mr-2" />
                              Get Directions
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
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

export default Events;