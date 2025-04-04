
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Shield, Users, MessageSquare, CreditCard, FileText, BarChart, Calendar } from 'lucide-react';

const Features = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-20 pt-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Features</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools to streamline your HOA and Condo Management operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Community Management",
              description: "Manage properties, residents, and board members with ease.",
              icon: <Building2 className="h-10 w-10 text-primary" />
            },
            {
              title: "Financial Management",
              description: "Handle accounting, payments, invoices and budgeting in one place.",
              icon: <CreditCard className="h-10 w-10 text-primary" />
            },
            {
              title: "Document Storage",
              description: "Securely store and organize all community documents.",
              icon: <FileText className="h-10 w-10 text-primary" />
            },
            {
              title: "Communication Tools",
              description: "Seamlessly communicate with board members and residents.",
              icon: <MessageSquare className="h-10 w-10 text-primary" />
            },
            {
              title: "Analytics & Reporting",
              description: "Generate insightful reports and analyze community data.",
              icon: <BarChart className="h-10 w-10 text-primary" />
            },
            {
              title: "Events & Calendar",
              description: "Organize and schedule community events and meetings.",
              icon: <Calendar className="h-10 w-10 text-primary" />
            },
            {
              title: "Compliance Tracking",
              description: "Monitor and enforce community guidelines and regulations.",
              icon: <Shield className="h-10 w-10 text-primary" />
            },
            {
              title: "Resident Portal",
              description: "Provide a dedicated portal for residents to access information.",
              icon: <Users className="h-10 w-10 text-primary" />
            }
          ].map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="mb-4">
                  {feature.icon}
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="bg-muted rounded-lg p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Advanced Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Take your community management to the next level with our premium offerings
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>AI-Powered Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Leverage machine learning to predict maintenance needs, optimize budgets, and identify trends in your community data.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Integrated Payment Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Accept online payments with automatic reconciliation, recurring billing, and payment plan options.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Mobile App Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Give your residents and board members the ability to access information on the go with our dedicated mobile apps.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Workflow Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Streamline repetitive tasks with customizable workflows and automated approval processes.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Features;
