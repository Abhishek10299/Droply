import React from "react";
import { ImageKitProvider } from "imagekitio-next";
import { HeroUIProvider } from "@heroui/system";
const authenticator = async () => {
  try {
    const response = await fetch("/api/imageKit-auth");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Authentication error:", error);
    throw error;
  }
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ImageKitProvider
      authenticator={authenticator}
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}
    >
      <HeroUIProvider>{children}</HeroUIProvider>
    </ImageKitProvider>
  );
}
