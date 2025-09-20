"use client";

import { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/modeToggle";
import { Button } from "@/components/ui/button";
import CourseCard from "@/components/dashboard/CourseCard";
import { 
  IconBook, 
  IconBrain, 
  IconDashboard, 
  IconMessageCircle, 
  IconTrophy,
  IconPlus,
  IconSearch,
  IconFilter
} from "@tabler/icons-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: <IconDashboard className="w-5 h-5" /> },
  { label: "Generate Course", href: "/", icon: <IconBrain className="w-5 h-5" /> },
  { label: "My Courses", href: "/courses", icon: <IconBook className="w-5 h-5" /> },
  { label: "Assessments", href: "/assessments", icon: <IconBook className="w-5 h-5" /> },
  { label: "Chat with AI", href: "/chat", icon: <IconMessageCircle className="w-5 h-5" /> },
  { label: "Leaderboard", href: "/leaderboard", icon: <IconTrophy className="w-5 h-5" /> },
];

const mockCourses = [
  { 
    id: 1, 
    title: "React.js Fundamentals", 
    progress: 70, 
    difficulty: "Intermediate",
    duration: "4 weeks",
    lessonsCompleted: 7,
    totalLessons: 10,
    lastAccessed: "2 hours ago"
  },
  { 
    id: 2, 
    title: "Data Structures & Algorithms", 
    progress: 40, 
    difficulty: "Advanced",
    duration: "6 weeks",
    lessonsCompleted: 4,
    totalLessons: 12,
    lastAccessed: "1 day ago"
  },
  { 
    id: 3, 
    title: "Machine Learning Basics", 
    progress: 90, 
    difficulty: "Beginner",
    duration: "3 weeks",
    lessonsCompleted: 9,
    totalLessons: 10,
    lastAccessed: "30 minutes ago"
  },
  { 
    id: 4, 
    title: "JavaScript Mastery", 
    progress: 100, 
    difficulty: "Intermediate",
    duration: "5 weeks",
    lessonsCompleted: 15,
    totalLessons: 15,
    lastAccessed: "3 days ago"
  },
];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === "all" || course.difficulty.toLowerCase() === filterDifficulty;
    return matchesSearch && matchesDifficulty;
  });

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
            <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
            <p className="text-muted-foreground mt-1">Manage and track your learning progress</p>
          </div>
          <div className="flex items-center gap-2">
            <Button>
              <IconPlus className="w-4 h-4 mr-2" />
              Generate New Course
            </Button>
            <ModeToggle />
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2">
              <IconFilter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <IconBook className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No courses found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterDifficulty !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Start by generating your first course"
                }
              </p>
              <Button>
                <IconBrain className="w-4 h-4 mr-2" />
                Generate Your First Course
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
