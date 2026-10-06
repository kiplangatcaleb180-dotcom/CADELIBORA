import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '../components/ui';
import { Briefcase, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Careers: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="blue" size="md">Join Our Mission</Badge>
        <h1 className="text-4xl font-black tracking-tight text-white font-mono">Careers at CADELIBORA</h1>
        <p className="text-slate-400 text-lg">
          Help us build the next generation of interconnected technology, AI reasoning systems, and open research platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hoverEffect>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Autonomous AI Research</CardTitle>
            <CardDescription>Zurich & San Francisco / Hybrid</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-300">
              Pioneer post-transformer neural architectures and multi-agent reasoning frameworks.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Role <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card hoverEffect>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Distributed Systems Engineer</CardTitle>
            <CardDescription>Seattle & Remote</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-300">
              Scale high-throughput microservices and real-time data streaming engines for global learners.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Role <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <Card hoverEffect>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Academy Curriculum Lead</CardTitle>
            <CardDescription>Austin, TX & Remote</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-300">
              Design cutting-edge software engineering and AI curriculum for future engineering fellows.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Role <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-900/20 via-slate-900 to-cyan-900/20 border border-slate-800 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Don't see an exact fit?</h3>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          We are always looking for exceptional scientists, engineers, educators, and creators. Send your CV and portfolio to our talent team.
        </p>
        <Button variant="primary">
          <Link to="/about/contact">Get in Touch</Link>
        </Button>
      </div>
    </div>
  );
};
