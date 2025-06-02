"use client";

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";

import { signUpSchema } from "@/schemas/signUpSchema";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export default function SignUpForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signUp, isLoaded, setActive } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);
    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerifying(true);
    } catch (error: any) {
      console.log("signup error", error);
      setAuthError(
        error.errors?.[0]?.message ||
          "An error occured during the signup. please try again"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    setIsSubmitting(true);
    setAuthError(null);
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
      console.log(result);
      if (result.status === "complete") {
        await setActive({ session: result.createdUserId });
        router.push("/dashboard");
      } else {
        console.error("Verification incomplete", result);
        setVerificationError("Verification could not be complete");
      }
    } catch (error: any) {
      console.error("Verification incomplete", error);
      setVerificationError(
        error.errors?.[0]?.message ||
          "An error occured during the signup. please try again"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  if (verifying) {
    return (
      <Card className="w-full max-w-sm">
  <CardHeader className="text-center">
    <CardTitle>Verify Your Email</CardTitle>
    <CardDescription>
      We've sent a verification code to your email
    </CardDescription>
  </CardHeader>

  <CardContent>
    {verificationError && (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p>{verificationError}</p>
      </div>
    )}

    <form onSubmit={handleVerificationSubmit} className="flex flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="verificationCode">Verification Code</Label>
        <Input
          id="verificationCode"
          type="text"
          placeholder="Enter the 6-digit code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          autoFocus
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Verifying..." : "Verify Email"}
      </Button>
    </form>

    <div className="mt-6 text-center text-sm text-muted-foreground">
      Didn't receive a code?{" "}
      <button
        type="button"
        onClick={async () => {
          if (signUp) {
            await signUp.prepareEmailAddressVerification({
              strategy: "email_code",
            });
          }
        }}
        className="text-primary hover:underline font-medium"
      >
        Resend code
      </button>
    </div>
  </CardContent>
</Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>Create Your Account</CardTitle>
    <CardDescription>
      Sign up to start managing your images securely
    </CardDescription>
  </CardHeader>

  <CardContent>
    {authError && (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-center gap-2">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <p>{authError}</p>
      </div>
    )}

    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Email Field */}
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your.email@example.com"
          {...register("email")}
          required
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password Field */}
      <div className="grid gap-2">
        <Label htmlFor="passwordConfirmation">Confirm Password</Label>
        <div className="relative">
          <Input
            id="passwordConfirmation"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("passwordConfirmation")}
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.passwordConfirmation && (
          <p className="text-sm text-red-600">
            {errors.passwordConfirmation.message}
          </p>
        )}
      </div>

      {/* Terms Notice */}
      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
        <p>
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  </CardContent>

  <CardFooter className="flex justify-center py-4">
    <p className="text-sm text-muted-foreground">
      Already have an account?{" "}
      <Link
        href="/sign-in"
        className="underline underline-offset-4 text-primary font-medium"
      >
        Sign in
      </Link>
    </p>
  </CardFooter>
</Card>
  );
}
