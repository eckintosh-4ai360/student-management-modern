import prisma from "@/lib/prisma";
import { ActivityLogTable } from "@/components/tables/ActivityLogTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function LogsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || "";
  const page = parseInt(params.page || "1");
  const pageSize = 10;

  const where = query
    ? {
        OR: [
          { userName: { contains: query } },
          { userId: { contains: query } },
          { action: { contains: query } },
          { role: { contains: query } },
        ],
      }
    : {};

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.activityLog.count({ where }),
  ]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-teal-700 dark:text-teal-400 uppercase">
            User Login History and Activities
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor system access and user operations in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-green-600 text-white hover:bg-green-700 border-0">
            <FileDown className="w-4 h-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" size="sm" className="bg-orange-500 text-white hover:bg-orange-600 border-0">
            <FileText className="w-4 h-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <select className="bg-background border border-input rounded px-2 py-1 text-sm">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
              <span className="text-sm text-muted-foreground">entries</span>
            </div>
            
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="search record here"
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ActivityLogTable logs={logs} />
          
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} entries
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled={page === 1}>Previous</Button>
              <Button variant="default" size="sm" className="bg-blue-600 h-8 w-8 p-0">1</Button>
              <Button variant="outline" size="sm" disabled={page * pageSize >= total}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
