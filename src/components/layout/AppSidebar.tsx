"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { 
  IconBook, 
  IconBrain, 
  IconDashboard, 
  IconMessageCircle
} from "@tabler/icons-react";

const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <IconDashboard className="w-5 h-5" />,
  },
  {
    label: "Generate Course",
    href: "/generate-course",
    icon: <IconBrain className="w-5 h-5" />,
  },
  {
    label: "My Courses",
    href: "/courses",
    icon: <IconBook className="w-5 h-5" />,
  },
  {
    label: "Assessments",
    href: "/assessments",
    icon: <IconBook className="w-5 h-5" />,
  },
  {
    label: "Chat with AI",
    href: "/chat",
    icon: <IconMessageCircle className="w-5 h-5" />,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarBody className="flex flex-col gap-2 p-4">
        {sidebarLinks.map((link) => (
          <SidebarLink key={link.href} link={link} />
        ))}
      </SidebarBody>
    </Sidebar>
  );
}
