import { NextResponse } from "next/server";
// import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
    // Mock dashboard data (replace with Supabase fetch)
    const dashboardData = {
      user: { id: "user_123", name: "Student" },
      courses: [
        { id: "course_1", title: "React Basics", progress: 70 },
        { id: "course_2", title: "Data Structures", progress: 40 },
      ],
      recentActivity: [
        { id: "act_1", action: "Completed Lesson 2 in React Basics" },
        { id: "act_2", action: "Started Data Structures course" },
      ],
    };

    return NextResponse.json({ success: true, dashboard: dashboardData });
  } catch (error) {
    console.error("Error in dashboard:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
