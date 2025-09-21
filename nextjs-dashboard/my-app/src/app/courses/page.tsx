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
  IconPlus,
  IconSearch,
  IconFilter
} from "@tabler/icons-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: <IconDashboard className="w-5 h-5" /> },
  { label: "Generate Course", href: "/gen-course", icon: <IconBrain className="w-5 h-5" /> },
  { label: "My Courses", href: "/courses", icon: <IconBook className="w-5 h-5" /> },
  { label: "Assessments", href: "/assessments", icon: <IconBook className="w-5 h-5" /> },
  { label: "Chat with AI", href: "/chat", icon: <IconMessageCircle className="w-5 h-5" /> },
];

const mockCourses = [
  { 
    id: 1, 
    title: "React.js Fundamentals", 
    description: "Master the basics of React including components, props, state, and hooks",
    duration: "4 weeks",
    lessons: [
      { id: 1, title: "Introduction to React", completed: true },
      { id: 2, title: "Components and JSX", completed: true },
      { id: 3, title: "Props and State", completed: true },
      { id: 4, title: "Event Handling", completed: true },
      { id: 5, title: "Lifecycle Methods", completed: true },
      { id: 6, title: "Hooks", completed: true },
      { id: 7, title: "Context API", completed: true },
      { id: 8, title: "Routing", completed: false },
      { id: 9, title: "State Management", completed: false },
      { id: 10, title: "Testing", completed: false },
    ],
    tags: ["react", "javascript", "frontend"],
    created_at: "2024-01-15"
  },
  { 
    id: 2, 
    title: "Data Structures & Algorithms", 
    description: "Learn fundamental data structures and algorithms for efficient programming",
    duration: "6 weeks",
    lessons: [
      { id: 1, title: "Arrays and Lists", completed: true },
      { id: 2, title: "Stacks and Queues", completed: true },
      { id: 3, title: "Linked Lists", completed: true },
      { id: 4, title: "Trees", completed: true },
      { id: 5, title: "Graphs", completed: false },
      { id: 6, title: "Sorting Algorithms", completed: false },
      { id: 7, title: "Searching Algorithms", completed: false },
      { id: 8, title: "Dynamic Programming", completed: false },
      { id: 9, title: "Greedy Algorithms", completed: false },
      { id: 10, title: "Complexity Analysis", completed: false },
      { id: 11, title: "Hash Tables", completed: false },
      { id: 12, title: "Advanced Topics", completed: false },
    ],
    tags: ["algorithms", "data-structures", "programming"],
    created_at: "2024-01-10"
  },
  { 
    id: 3, 
    title: "Machine Learning Basics", 
    description: "Introduction to machine learning concepts and practical applications",
    duration: "3 weeks",
    lessons: [
      { id: 1, title: "Introduction to ML", completed: true },
      { id: 2, title: "Data Preprocessing", completed: true },
      { id: 3, title: "Linear Regression", completed: true },
      { id: 4, title: "Logistic Regression", completed: true },
      { id: 5, title: "Decision Trees", completed: true },
      { id: 6, title: "Random Forest", completed: true },
      { id: 7, title: "Clustering", completed: true },
      { id: 8, title: "Neural Networks", completed: true },
      { id: 9, title: "Model Evaluation", completed: true },
      { id: 10, title: "Deployment", completed: false },
    ],
    tags: ["machine-learning", "python", "ai"],
    created_at: "2024-01-05"
  },
  { 
    id: 4, 
    title: "JavaScript Mastery", 
    description: "Advanced JavaScript concepts and modern development practices",
    duration: "5 weeks",
    lessons: [
      { id: 1, title: "ES6+ Features", completed: true },
      { id: 2, title: "Async/Await", completed: true },
      { id: 3, title: "Promises", completed: true },
      { id: 4, title: "Closures", completed: true },
      { id: 5, title: "Prototypes", completed: true },
      { id: 6, title: "Modules", completed: true },
      { id: 7, title: "Generators", completed: true },
      { id: 8, title: "Proxy", completed: true },
      { id: 9, title: "Symbols", completed: true },
      { id: 10, title: "Iterators", completed: true },
      { id: 11, title: "Maps and Sets", completed: true },
      { id: 12, title: "Performance", completed: true },
      { id: 13, title: "Testing", completed: true },
      { id: 14, title: "Build Tools", completed: true },
      { id: 15, title: "Deployment", completed: true },
    ],
    tags: ["javascript", "es6", "advanced"],
    created_at: "2024-01-01"
  },
];

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    // Since we removed difficulty from the new structure, we'll filter by tags instead
    const matchesDifficulty = filterDifficulty === "all" || 
      course.tags.some(tag => tag.toLowerCase().includes(filterDifficulty.toLowerCase()));
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
              <CourseCard key={course.id} course={course} />
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
