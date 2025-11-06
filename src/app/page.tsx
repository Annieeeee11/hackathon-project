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
import { Section } from "@/components/common/Section";
import { PageHero } from "@/components/common/PageHero";
import { StatsGrid } from "@/components/common/StatsGrid";
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

      <Section padding="xl" maxWidth="4xl">
        <PageHero
          icon={<IconRocket />}
          title={
            <span className="text-5xl font-bold">
              {APP_CONFIG.tagline}
            </span>
          }
          description={`${APP_CONFIG.description}. Start your coding journey today!`}
          actions={
            <Link href={ROUTES.auth}>
              <Button size="lg" className="w-full sm:w-auto">
                Start Learning Free
                <IconArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          }
        />
      </Section>

      <Section padding="lg" background="muted">
        <StatsGrid stats={STATS} columns={4} />
      </Section>

      <Section padding="xl">
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
      </Section>

      <Section padding="xl" background="muted">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            What Our Learners Say
          </h2>
          <p className="text-muted-foreground">
            Join thousands of successful learners who have transformed their careers with our platform.
          </p>
        </div>
        <InfiniteMovingCardsDemo />
      </Section>

      <Section padding="xl" maxWidth="4xl">
        <div className="text-center">
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
      </Section>

      <footer className="py-12 px-6 border-t bg-muted/50">
        <Section maxWidth="6xl" padding="sm" className="!py-0">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <IconBrain className="w-6 h-6 text-primary" />
              <span className="font-semibold">{APP_CONFIG.name}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {APP_CONFIG.copyright}
            </div>
          </div>
        </Section>
      </footer>
    </div>
  );
}