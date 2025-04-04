
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      bio: "Former HOA manager who saw the need for better technology in community management.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Software engineer with 15+ years experience building enterprise applications.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&auto=format&fit=crop"
    },
    {
      name: "David Rodriguez",
      role: "Head of Product",
      bio: "Product leader focused on creating intuitive user experiences for property managers.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop"
    },
    {
      name: "Amanda Lewis",
      role: "Customer Success Director",
      bio: "Former community manager dedicated to helping clients get the most from our platform.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&auto=format&fit=crop"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-20 pt-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to transform the way communities are managed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-lg mb-6">
              Founded in 2018, ResidentPro began with a simple idea: community management software should be powerful yet easy to use. Our founder, Sarah Johnson, experienced firsthand the challenges of managing residential communities with outdated tools.
            </p>
            <p className="text-lg mb-6">
              After years of frustration with existing solutions, Sarah assembled a team of technology experts and property management professionals to build something better. The result is our comprehensive platform that simplifies every aspect of community management.
            </p>
            <p className="text-lg">
              Today, we serve hundreds of HOAs and condominium associations across the country, helping them streamline operations, improve resident satisfaction, and reduce costs.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
              alt="Team meeting" 
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-4 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            <Card>
              <CardHeader>
                <CardTitle>Customer Success</CardTitle>
              </CardHeader>
              <CardContent>
                <p>We measure our success by the success of our customers. We're committed to providing not just great software, but the support and resources needed to succeed.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Continuous Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>We're never satisfied with the status quo. We continuously improve our platform based on customer feedback and emerging technologies.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Community First</CardTitle>
              </CardHeader>
              <CardContent>
                <p>We understand that behind every property is a community of people. Our solutions are designed to foster better communication and strengthen community bonds.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={member.image} alt={member.name} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
