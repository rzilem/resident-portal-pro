
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Careers = () => {
  const jobOpenings = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Austin, TX (Hybrid)",
      type: "Full-time",
      description: "We're seeking an experienced full-stack developer to join our engineering team. You'll work on building new features and improving our platform's performance and reliability.",
      requirements: [
        "5+ years of experience in full-stack web development",
        "Strong proficiency in React, Node.js, and TypeScript",
        "Experience with cloud infrastructure (AWS or Azure)",
        "Knowledge of database design and optimization",
        "Excellent problem-solving and communication skills"
      ]
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote (US)",
      type: "Full-time",
      description: "We're looking for a product designer to create intuitive and beautiful user experiences for our platform. You'll collaborate with product managers and engineers to design features that delight our users.",
      requirements: [
        "3+ years of experience in product design",
        "Strong portfolio demonstrating UX/UI design skills",
        "Proficiency in Figma or similar design tools",
        "Experience designing for SaaS or enterprise products",
        "Strong communication and collaboration skills"
      ]
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Austin, TX or Remote",
      type: "Full-time",
      description: "Join our customer success team to help our clients get the most value from our platform. You'll be responsible for onboarding new clients, providing training, and ensuring high customer satisfaction.",
      requirements: [
        "3+ years of experience in customer success or account management",
        "Experience with SaaS products, preferably in property management",
        "Strong communication and presentation skills",
        "Problem-solving mindset and ability to work independently",
        "Bachelor's degree or equivalent experience"
      ]
    },
    {
      title: "Sales Development Representative",
      department: "Sales",
      location: "Austin, TX",
      type: "Full-time",
      description: "We're expanding our sales team and looking for energetic individuals to identify and qualify new business opportunities. You'll be the first point of contact for potential clients interested in our platform.",
      requirements: [
        "1+ years of sales experience, preferably in SaaS or B2B",
        "Strong communication and interpersonal skills",
        "Ability to understand client needs and communicate value propositions",
        "Self-motivated with a drive to exceed targets",
        "Bachelor's degree or equivalent experience"
      ]
    }
  ];
  
  const handleApply = (jobTitle: string) => {
    toast.success(`Application started for ${jobTitle}`, {
      description: "We'll redirect you to our application portal."
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-20 pt-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us transform the way communities are managed across the country
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Why Work With Us</h2>
            <p className="text-lg mb-6">
              At ResidentPro, we're on a mission to revolutionize community management through technology. We're looking for talented, passionate individuals who share our vision and want to make a meaningful impact.
            </p>
            <p className="text-lg mb-6">
              Our team is collaborative, innovative, and focused on solving real problems for our customers. We value diverse perspectives, continuous learning, and a healthy work-life balance.
            </p>
            <p className="text-lg">
              If you're excited about building products that help communities thrive, we'd love to hear from you!
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
              alt="Team collaborating" 
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Benefits & Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Health & Wellness</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Comprehensive health, dental & vision insurance</li>
                  <li>Mental health support services</li>
                  <li>Wellness stipend for gym memberships</li>
                  <li>Generous paid time off</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Professional Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Learning & development budget</li>
                  <li>Conference and certification opportunities</li>
                  <li>Mentorship program</li>
                  <li>Clear career advancement paths</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Life at ResidentPro</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Flexible work arrangements</li>
                  <li>Competitive compensation & equity</li>
                  <li>Regular team events and celebrations</li>
                  <li>Paid parental leave</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Open Positions</h2>
          
          <div className="space-y-6">
            {jobOpenings.map((job, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle>{job.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {job.department} • {job.location} • {job.type}
                      </CardDescription>
                    </div>
                    <Button 
                      className="mt-4 md:mt-0" 
                      onClick={() => handleApply(job.title)}
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">{job.description}</p>
                  <h4 className="font-medium mb-2">Requirements:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {job.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="bg-muted/40 flex justify-between">
                  <p className="text-sm text-muted-foreground">Posted 2 weeks ago</p>
                  <Button 
                    variant="link" 
                    className="p-0" 
                    onClick={() => handleApply(job.title)}
                  >
                    View Full Description
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center p-8 rounded-lg bg-primary/5 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">Don't see a perfect fit?</h3>
          <p className="text-lg mb-6">
            We're always looking for talented individuals to join our team. Send us your resume and tell us how you can contribute to ResidentPro.
          </p>
          <Button size="lg" onClick={() => toast.success("General application initiated")}>
            Submit General Application
          </Button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Careers;
