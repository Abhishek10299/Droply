"use client";
import { SignedIn, SignedOut, useClerk } from "@clerk/nextjs";
import { ChevronDown, CloudUpload, Menu, X } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useState } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { useEffect, useRef } from "react";

interface SerializedUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  username?: string | null;
  emailAddress?: string | null;
}

interface NavbarProps {
  user?: SerializedUser | null;
}

export default function Navbar({ user }: NavbarProps) {
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isOnDashboard =
    pathname === "/dashboard" || pathname?.startsWith("/dashboard/");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-menu-button="true"]')) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const handleSignOut = () => {
    signOut(() => router.push("/"));
  };

  const userDetails = {
    fullName: user
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : "",
    initials: user
      ? `${user.firstName || ""} ${user.lastName || ""}`
          .trim()
          .split(" ")
          .map((n) => n?.[0] || "")
          .join("")
          .toUpperCase() || "U"
      : "U",
    displayName:
      user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.firstName || user?.username || user?.emailAddress || "User",
    email: user?.emailAddress || "",
  };
  return (
    <header
      className={`sticky top-0 z-50 border-b bg-background transition-shadow ${
        isScrolled ? "shadow" : ""
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        <Link href="/" className="flex items-center gap-2">
          <CloudUpload className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Droply</h1>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </SignedOut>

          <SignedIn>
            {!isOnDashboard && (
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.imageUrl || undefined} />
                    <AvatarFallback>{userDetails.initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">
                    {userDetails.displayName}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard?tab=profile")}
                >
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                  My Files
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-500"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <SignedIn>
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.imageUrl || undefined} />
              <AvatarFallback>{userDetails.initials}</AvatarFallback>
            </Avatar>
          </SignedIn>
          <button
            className="z-50 p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            data-menu-button="true"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}

        <div
          ref={mobileMenuRef}
          className={`fixed top-0 right-0 bottom-0 z-50 w-4/5 max-w-sm transform bg-background p-6 pt-20 shadow-lg transition-transform md:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <SignedOut>
            <div className="flex flex-col gap-4">
              <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full">Sign In</Button>
              </Link>
              <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b py-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.imageUrl || undefined} />
                  <AvatarFallback>{userDetails.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{userDetails.displayName}</p>
                  <p className="text-sm text-muted-foreground">
                    {userDetails.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {!isOnDashboard && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  href="/dashboard?tab=profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="mt-4 text-left text-red-500"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
