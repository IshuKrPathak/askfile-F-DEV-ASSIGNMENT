import { type ClassValue, clsx } from "clsx";
import { Metadata } from "next";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//upgradation
export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path; // client side

  //server or deployed on vercel
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;

  //other case
  return `http://localhost:${process.env.PORT ?? 3000}${path}`;
}

export function constructMetadata({
  title = "AskFile - Getting information easier by chatting through the document",
  description = " AskFile is an open-source software to make chatting with documents more convenient and efficient.",
  image = "/preview.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@IshuKrPathak",
    },
    icons,
    metadataBase: new URL("https://ask-file.vercel.app"),
    themeColor: "#fff",
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
