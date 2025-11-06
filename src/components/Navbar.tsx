'use client';

import React from 'react';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import {
  Navbar as ResizableNavbar,
  NavBody,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from './ui/resizable-navbar';
import { IconBrain } from '@tabler/icons-react';
import { ModeToggle } from './modeToggle';

interface LandingNavbarProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

export function LandingNavbar({ onLoginClick, onSignupClick }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <ResizableNavbar>
      <NavBody>
        <Link
          href="/"
          className="relative z-10 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black dark:text-white"
        >
          <IconBrain className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">AI Learning Assistant</span>
        </Link>
        
        <div className="flex items-center gap-2 relative z-20">
        <ModeToggle />
          <NavbarButton
            as="button"
            variant="secondary"
            onClick={onLoginClick}
            className="text-sm"
          >
            Sign In
          </NavbarButton>
          <NavbarButton
            as="button"
            variant="primary"
            onClick={onSignupClick}
            className="text-sm"
          >
            Get Started
          </NavbarButton>
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <Link
            href="/"
            className="flex items-center space-x-2 px-2 py-1"
          >
            <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white dark:text-zinc-900" />
            </div>
            <span className="font-semibold text-lg text-black dark:text-white">FinTech</span>
          </Link>
          <MobileNavToggle
            isOpen={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        </MobileNavHeader>
        <MobileNavMenu
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        >
          <NavbarButton
            as="button"
            variant="secondary"
            onClick={() => {
              onLoginClick?.();
              setMobileMenuOpen(false);
            }}
            className="w-full text-center"
          >
            Login
          </NavbarButton>
          <NavbarButton
            as="button"
            variant="primary"
            onClick={() => {
              onSignupClick?.();
              setMobileMenuOpen(false);
            }}
            className="w-full text-center"
          >
            Sign Up
          </NavbarButton>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
}