
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "5 Ways to Improve HOA Communication",
      excerpt: "Effective communication is the foundation of a well-run community. Learn how to enhance your HOA's communication strategy.",
      image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      date: "April 2, 2025",
      author: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop"
      },
      category: "Communication",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Understanding HOA Financial Statements: A Guide for Board Members",
      excerpt: "Many board members come from non-financial backgrounds. This guide breaks down key financial statements every HOA board member should understand.",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      date: "March 28, 2025",
      author: {
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&auto=format&fit=crop"
      },
      category: "Finances",
      readTime: "8 min read"
    },
    {
      id: 3,
      title: "The Complete Guide to HOA Document Management",
      excerpt: "Proper document management is crucial for community associations. Learn best practices for organizing, storing, and sharing important documents.",
      image: "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      date: "March 21, 2025",
      author: {
        name: "Amanda Lewis",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&auto=format&fit=crop"
      },
      category: "Management",
      readTime: "7 min read"
    },
    {
      id: 4,
      title: "How to Handle Difficult Homeowners: Tips for Board Members",
      excerpt: "Every community has challenging residents. These strategies will help board members navigate conflicts and maintain a positive community atmosphere.",
      image: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      date: "March 15, 2025",
      author: {
        name: "David Rodriguez",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&auto=format&fit=crop"
      },
      category: "Community Relations",
      readTime: "6 min read"
    },
    {
      id: 5,
      title: "The Ultimate Guide to HOA Reserve Studies",
      excerpt: "Reserve studies are vital for community financial planning. Learn why they matter and how to conduct them effectively.",
      image: "https://images.unsplash.com/photo-1434626881859-194d67b2b86f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      date: "March 10, 2025",
      author: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop"
      },
      category: "Planning",
      readTime: "9 min read"
    },
    {
      id: 6,
      title: "Technology Trends Reshaping HOA Management in 2025",
      excerpt: "From AI to mobile apps, technology is transforming how communities are managed. Discover the latest innovations every association should consider.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80",
      date: "March 5, 2025",
      author: {
        name: "Michael Chen",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&auto=format&fit=crop"
      },
      category: "Technology",
      readTime: "6 min read"
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Subscribed successfully!', {
      description: 'You\'ll receive our latest blog posts in your inbox.',
    });
  };

  const handleReadMore = (postId: number) => {
    toast.info(`Opening blog post #${postId}`, {
      description: 'Full blog post would open here.',
    });
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-20 pt-32">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Insights, tips, and best practices for community management
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="order-2 md:order-1 p-6 md:p-8 flex flex-col justify-center">
                <div className="mb-2">
                  <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                </div>
                <CardTitle className="text-2xl md:text-3xl mb-4">
                  The Future of Community Living: Trends to Watch in 2025
                </CardTitle>
                <CardDescription className="text-base mb-6">
                  From smart home integration to sustainable practices, discover how technology and changing resident expectations are reshaping community living.
                </CardDescription>
                <div className="flex items-center mb-6">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&auto=format&fit=crop" alt="Author" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Jessica Davis</p>
                    <p className="text-xs text-muted-foreground">April 4, 2025 • 10 min read</p>
                  </div>
                </div>
                <Button 
                  className="w-fit" 
                  onClick={() => handleReadMore(0)}
                >
                  Read Article
                </Button>
              </div>
              <div className="order-1 md:order-2">
                <img 
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80" 
                  alt="Modern building" 
                  className="h-64 md:h-full w-full object-cover"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Blog Post Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative h-48">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 bg-primary/90 text-white px-3 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </span>
              </div>
              <CardHeader className="flex-grow">
                <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                <CardDescription className="text-base">{post.excerpt}</CardDescription>
              </CardHeader>
              <CardFooter className="flex flex-col items-start border-t pt-4">
                <div className="flex items-center w-full justify-between mb-4">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback>{post.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{post.author.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{post.date} • {post.readTime}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleReadMore(post.id)}
                >
                  Read More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-primary/5 rounded-lg p-8 text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h2>
          <p className="text-muted-foreground mb-6">
            Get the latest articles, resources, and community management tips delivered to your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow" 
              required 
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
