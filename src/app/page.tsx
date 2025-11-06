"use client";

import { Button } from "@/components/ui/button";
import { 
  IconBrain, 
  IconArrowRight, 
  IconRocket,
  IconBook,
  IconTrophy,
  IconMessageCircle,
  IconCode,
  IconUsers
} from "@tabler/icons-react";
import Link from "next/link";
import { InfiniteMovingCardsDemo } from "@/components/moving-cards";
import { LandingNavbar } from "@/components/Navbar";
import { FeatureCard } from "@/components/common/FeatureCard";
import { FEATURES_DATA, STATS, APP_CONFIG, ROUTES } from "@/lib/constants";

const iconMap = {
  brain: IconBrain,
  book: IconBook,
  trophy: IconTrophy,
  message: IconMessageCircle,
  code: IconCode,
  users: IconUsers,
};

export default function LandingPage() {
  const features = FEATURES_DATA.map((feature) => {
    const IconComponent = iconMap[feature.iconName];
    return {
      ...feature,
      icon: <IconComponent className="w-6 h-6" />,
    };
  });

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar/>

      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <IconRocket className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-6">
            {APP_CONFIG.tagline}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {APP_CONFIG.description}. Start your coding journey today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ROUTES.auth}>
              <Button size="lg" className="w-full sm:w-auto">
                Start Learning Free
                <IconArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose {APP_CONFIG.name}?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI technology with proven learning methodologies 
              to deliver an unparalleled educational experience.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What Our Learners Say
            </h2>
            <p className="text-muted-foreground">
              Join thousands of successful learners who have transformed their careers with our platform.
            </p>
          </div>
          <InfiniteMovingCardsDemo />
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of learners and start building your coding skills with AI-powered education.
            It&apos;s free to get started!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={APP_CONFIG.githubUrl} target="_blank">
              <Button size="lg" className="w-full sm:w-auto">
                Contribute on Github
                <IconArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <IconBrain className="w-6 h-6 text-primary" />
              <span className="font-semibold">{APP_CONFIG.name}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {APP_CONFIG.copyright}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}