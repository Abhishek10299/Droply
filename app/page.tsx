import Navbar from "@/components/Navbar/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  ArrowRight,
  CloudUpload,
  Folder,
  ImageIcon,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-12 md:py-20 px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-6 text-center lg:text-left">
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
                    Store your <span className="text-primary">images</span> with
                    ease
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground">
                    Simple. Secure. Fast.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
                  <SignedOut>
                    <Link href="/sign-up">
                      <Button size="lg">Get Started</Button>
                    </Link>
                    <Link href="/sign-in">
                      <Button size="lg">Sign In</Button>
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/dashboard">
                      <Button size="lg" className="flex items-center gap-2">
                        Go to Dashboard <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </SignedIn>
                </div>
              </div>
              <div className="flex justify-center order-first lg:order-last">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="h-24 md:h-32 w-24 md:w-32 text-primary/70" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-12 md:py-16 px-4 md:px-6 bg-muted/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                What You Get
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <CloudUpload className="h-10 md:h-12 w-10 md:w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">
                    Quick Uploads
                  </h3>
                  <p className="text-muted-foreground">Drag, drop, done.</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Folder className="h-10 md:h-12 w-10 md:w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">
                    Smart Organization
                  </h3>
                  <p className="text-muted-foreground">
                    Keep it tidy, find it fast.
                  </p>
                </CardContent>
              </Card>

              <Card className="sm:col-span-2 md:col-span-1 mx-auto sm:mx-0 max-w-md sm:max-w-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Shield className="h-10 md:h-12 w-10 md:w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground">
                    Locked Down
                  </h3>
                  <p className="text-muted-foreground">
                    Your images, your eyes only.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-20 px-4 md:px-6 bg-muted/20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
              Ready?
            </h2>
            <SignedOut>
              <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Link href="/sign-up">
                  <Button size="lg" className="flex items-center gap-2">
                    Let's Go <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard">
                <Button size="lg">
                  Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </SignedIn>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/20 border-t py-4 md:py-6">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <CloudUpload className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Droply</h2>
            </div>
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Droply
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
