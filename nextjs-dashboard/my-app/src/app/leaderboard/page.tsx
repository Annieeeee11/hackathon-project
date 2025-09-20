"use client";

import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/modeToggle";
import { Button } from "@/components/ui/button";
import { 
  IconBook, 
  IconBrain, 
  IconDashboard, 
  IconMessageCircle, 
  IconTrophy,
  IconCrown,
  IconMedal,
  IconAward,
  IconTrendingUp,
  IconUsers,
  IconTarget
} from "@tabler/icons-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: <IconDashboard className="w-5 h-5" /> },
  { label: "Generate Course", href: "/", icon: <IconBrain className="w-5 h-5" /> },
  { label: "My Courses", href: "/courses", icon: <IconBook className="w-5 h-5" /> },
  { label: "Assessments", href: "/assessments", icon: <IconBook className="w-5 h-5" /> },
  { label: "Chat with AI", href: "/chat", icon: <IconMessageCircle className="w-5 h-5" /> },
  { label: "Leaderboard", href: "/leaderboard", icon: <IconTrophy className="w-5 h-5" /> },
];

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  score: number;
  coursesCompleted: number;
  streak: number;
  rank: number;
  badges: string[];
}

const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: "1",
    name: "Alex Chen",
    avatar: "👨‍💻",
    score: 2850,
    coursesCompleted: 12,
    streak: 15,
    rank: 1,
    badges: ["Early Bird", "Speed Learner", "Code Master"]
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "👩‍💻",
    score: 2720,
    coursesCompleted: 11,
    streak: 12,
    rank: 2,
    badges: ["Consistent Learner", "Problem Solver"]
  },
  {
    id: "3",
    name: "Mike Rodriguez",
    avatar: "👨‍🎓",
    score: 2580,
    coursesCompleted: 10,
    streak: 8,
    rank: 3,
    badges: ["Quick Learner", "Team Player"]
  },
  {
    id: "4",
    name: "Emily Davis",
    avatar: "👩‍🎓",
    score: 2450,
    coursesCompleted: 9,
    streak: 20,
    rank: 4,
    badges: ["Streak Master", "Detail Oriented"]
  },
  {
    id: "5",
    name: "David Kim",
    avatar: "👨‍💼",
    score: 2320,
    coursesCompleted: 8,
    streak: 6,
    rank: 5,
    badges: ["Focused Learner"]
  }
];

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState("all");

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <IconCrown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <IconMedal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <IconAward className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      default:
        return "bg-card border";
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar>
        <SidebarBody className="flex flex-col gap-2 p-4">
          {sidebarLinks.map((link) => (
            <SidebarLink key={link.href} link={link} />
          ))}
        </SidebarBody>
      </Sidebar>

      <main className="flex-1 overflow-y-auto">
        <header className="flex justify-between items-center p-6 border-b">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
            <p className="text-muted-foreground mt-1">See how you rank among fellow learners</p>
          </div>
          <ModeToggle />
        </header>

        <div className="p-6 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Learners</p>
                  <p className="text-2xl font-bold text-foreground">1,247</p>
                </div>
                <IconUsers className="w-8 h-8 text-primary" />
              </div>
            </div>
            
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Rank</p>
                  <p className="text-2xl font-bold text-foreground">#42</p>
                </div>
                <IconTrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </div>
            
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Score</p>
                  <p className="text-2xl font-bold text-foreground">1,850</p>
                </div>
                <IconTarget className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Timeframe Filter */}
          <div className="flex gap-2">
            {["all", "week", "month"].map((period) => (
              <Button
                key={period}
                variant={timeframe === period ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeframe(period)}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Button>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="bg-card rounded-lg border overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <IconTrophy className="w-5 h-5 text-yellow-500" />
                Top Learners
              </h2>
            </div>
            
            <div className="divide-y">
              {mockLeaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`p-6 flex items-center gap-4 ${getRankColor(entry.rank)}`}
                >
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(entry.rank)}
                  </div>
                  
                  <div className="flex-1 flex items-center gap-4">
                    <div className="text-2xl">{entry.avatar}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{entry.name}</h3>
                      <div className="flex items-center gap-4 text-sm opacity-80">
                        <span>{entry.coursesCompleted} courses</span>
                        <span>{entry.streak} day streak</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold">{entry.score.toLocaleString()}</div>
                    <div className="text-sm opacity-80">points</div>
                  </div>
                  
                  <div className="flex gap-1">
                    {entry.badges.slice(0, 2).map((badge, badgeIndex) => (
                      <span
                        key={badgeIndex}
                        className="px-2 py-1 bg-white/20 rounded-full text-xs"
                      >
                        {badge}
                      </span>
                    ))}
                    {entry.badges.length > 2 && (
                      <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                        +{entry.badges.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Progress */}
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">8</div>
                <div className="text-sm text-muted-foreground">Courses Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">12</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">1,850</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">5</div>
                <div className="text-sm text-muted-foreground">Badges Earned</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
