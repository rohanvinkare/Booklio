import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonLoader() {
  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 min-h-screen">
      <div className="mb-6">
        <Skeleton className="h-8 w-48 bg-gray-800 mb-2" />
        <Skeleton className="h-4 w-64 bg-gray-800" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-24 bg-gray-700 mb-2" />
              <Skeleton className="h-8 w-16 bg-gray-700 mb-2" />
              <Skeleton className="h-4 w-32 bg-gray-700" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-48 bg-gray-700 mb-4" />
              <Skeleton className="h-64 w-full bg-gray-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}