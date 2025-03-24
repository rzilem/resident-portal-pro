
import React from 'react';
import FeatureCard from './FeatureCard';
import TextReveal from './TextReveal';
import { Calendar, CreditCard, FileText, Mail, MessageSquare, Settings, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: CreditCard,
      title: 'Financial Management',
      description: 'Comprehensive tools for dues collection, budget tracking, and financial reporting with real-time insights.'
    },
    {
      icon: MessageSquare,
      title: 'Communication Hub',
      description: 'Multi-channel platform for announcements, notifications, and private messaging between residents and management.'
    },
    {
      icon: Calendar,
      title: 'Workflow Automation',
      description: 'Automate routine tasks like maintenance requests, violation tracking, and work order management.'
    },
    {
      icon: Users,
      title: 'Resident Engagement',
      description: 'Build community with interactive event scheduling, amenity bookings, and resident directories.'
    },
    {
      icon: Mail,
      title: 'Document Management',
      description: 'Centralized storage for governing documents, meeting minutes, and form templates with easy access control.'
    },
    {
      icon: FileText,
      title: 'Smart Compliance',
      description: 'Stay ahead of regulatory requirements with automated reminders and compliance tracking features.'
    },
  ];

  return (
    <section id="features" className="py-20 md:py-32 bg-accent/50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <TextReveal
            text="Features"
            className="text-primary font-semibold mb-3"
          />
          <TextReveal
            text="Everything you need to manage your community"
            className="text-3xl md:text-4xl font-bold mb-6"
            delay={100}
          />
          <TextReveal
            text="Our comprehensive platform streamlines operations, enhances communication, and empowers both management and residents with powerful tools."
            className="text-muted-foreground text-lg"
            delay={200}
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
