
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

const Testimonials = () => {
  // Sample testimonial data
  const testimonials = [
    {
      name: "Jennifer Smith",
      role: "HOA President, Oakwood Hills",
      content: "ResidentPro transformed how we manage our community. The financial tools alone saved our treasurer countless hours each month. The resident portal has dramatically improved communication with homeowners.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&auto=format&fit=crop"
    },
    {
      name: "Robert Johnson",
      role: "Property Manager, Lakeside Condos",
      content: "As a property manager overseeing multiple communities, I needed a solution that scales. ResidentPro delivers with its multi-community dashboard and customizable workflows. Support has been exceptional whenever we've needed assistance.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&auto=format&fit=crop"
    },
    {
      name: "Michelle Garcia",
      role: "Board Treasurer, Sunset Heights",
      content: "The accounting features in ResidentPro have made my job as treasurer so much easier. Tracking expenses, creating budgets, and generating financial reports is intuitive and comprehensive. Highly recommended!",
      rating: 4,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop"
    },
    {
      name: "David Patel",
      role: "Community Manager, Riverfront Estates",
      content: "We switched to ResidentPro after trying three other platforms. The onboarding process was smooth, and the software is much more user-friendly. Our residents particularly appreciate the mobile app for quick access to community information.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&auto=format&fit=crop"
    },
    {
      name: "Sarah Williams",
      role: "HOA Board Member, Pine Valley",
      content: "The violation tracking system has streamlined our compliance management. We can now easily document issues, send notifications, and track resolution - all with proper documentation. It's made a difficult part of HOA management much more manageable.",
      rating: 4,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&auto=format&fit=crop"
    },
    {
      name: "Thomas Rodriguez",
      role: "Property Manager, Highland Towers",
      content: "What sets ResidentPro apart is how they continue to improve the platform. Every few months, new features are rolled out that address real pain points in community management. Their team really listens to feedback.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&auto=format&fit=crop"
    }
  ];

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
      />
    ));
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-20 pt-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Client Testimonials</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. See what our clients have to say about ResidentPro.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                
                <blockquote className="text-lg mb-6 flex-grow">
                  "{testimonial.content}"
                </blockquote>
                
                <div className="flex items-center mt-auto">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-primary/5 rounded-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Customer Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn how we've helped communities like yours overcome challenges and achieve their goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Oakwood Hills HOA</h3>
                <p className="text-muted-foreground mb-4">250 single-family homes</p>
                <p className="mb-2">Challenge: Poor collection rates and outdated communication methods.</p>
                <p className="mb-4">Solution: Implemented online payments and a resident portal.</p>
                <p className="font-medium">Result: Increased collection rate from 76% to 94% within 6 months.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">Lakeside Condominiums</h3>
                <p className="text-muted-foreground mb-4">120 luxury units</p>
                <p className="mb-2">Challenge: Inefficient maintenance request handling.</p>
                <p className="mb-4">Solution: Deployed the maintenance tracking system with mobile app support.</p>
                <p className="font-medium">Result: Reduced average resolution time from 5 days to less than 2 days.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Testimonials;
