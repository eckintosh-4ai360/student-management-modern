"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ComponentProps, useEffect, useRef } from "react";

interface PrefetchLinkProps extends ComponentProps<typeof Link> {
  /**
   * Prefetch strategy
   * - "hover": Prefetch on hover (default Next.js behavior)
   * - "mount": Prefetch immediately when component mounts
   * - "viewport": Prefetch when link enters viewport
   * - "aggressive": Combines mount + hover for critical routes
   */
  prefetchStrategy?: "hover" | "mount" | "viewport" | "aggressive";
}

export function PrefetchLink({
  prefetchStrategy = "hover",
  href,
  children,
  ...props
}: PrefetchLinkProps) {
  const router = useRouter();
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // Early prefetch for mount and aggressive strategies
    if (prefetchStrategy === "mount" || prefetchStrategy === "aggressive") {
      const hrefString = typeof href === "string" ? href : href.pathname || "";
      router.prefetch(hrefString);
    }

    // Viewport-based prefetching using Intersection Observer
    if (prefetchStrategy === "viewport") {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const hrefString = typeof href === "string" ? href : href.pathname || "";
              router.prefetch(hrefString);
              // Disconnect after first prefetch
              observer.disconnect();
            }
          });
        },
        {
          rootMargin: "50px",
        }
      );

      if (linkRef.current) {
        observer.observe(linkRef.current);
      }

      return () => {
        observer.disconnect();
      };
    }
  }, [href, prefetchStrategy, router]);

  return (
    <Link ref={linkRef} href={href} {...props} prefetch={true}>
      {children}
    </Link>
  );
}
