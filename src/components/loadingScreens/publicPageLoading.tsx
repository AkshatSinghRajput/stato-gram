"use client";
import { Skeleton } from "@/components/ui/skeleton";

function SkeletonCard() {
  return (
    <div className="flex flex-col items-center space-y-3">
      <Skeleton className="h-[125px] w-[70%] rounded-xl" />
    </div>
  );
}

export default function PublicPageLoading() {
  return (
    <div className="flex flex-col gap-4 justify-center h-screen w-full">
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
