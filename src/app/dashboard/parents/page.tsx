import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AddParentButton } from "@/components/forms/AddParentButton";
import { SearchBar } from "@/components/ui/search-bar";
import { ParentTableRow } from "@/components/tables/ParentTableRow";

export default async function ParentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const userRole = (session?.user as any)?.role || "student";
  
  // Only allow admin and super admin to access this page
  if (userRole !== "admin") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const pageSize = 10;
  const search = params.search || "";

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search } },
      { surname: { contains: search } },
      { username: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
      { address: { contains: search } },
    ];
  }

  const [parents, total] = await Promise.all([
    prisma.parent.findMany({
      where,
      include: {
        students: {
          select: {
            id: true,
            name: true,
            surname: true,
          },
        },
        _count: {
          select: {
            students: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.parent.count({ where }),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Parents</h1>
          <p className="text-gray-500 mt-1">Manage all parents in the system</p>
        </div>
        <AddParentButton />
      </div>

      <div className="flex items-center gap-4">
        <SearchBar placeholder="Search parents by name, username, email, phone, or address..." />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Parents ({total})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium">Parent</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Phone</th>
                  <th className="text-left p-4 font-medium">Address</th>
                  <th className="text-left p-4 font-medium">Students</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No parents found. Click "Add Parent" to create a new parent.
                    </td>
                  </tr>
                ) : (
                  parents.map((parent) => (
                    <ParentTableRow 
                      key={parent.id} 
                      parent={parent}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} parents
              </p>
              <div className="flex items-center space-x-2">
                {page > 1 && (
                  <Link href={`/dashboard/parents?page=${page - 1}${search ? `&search=${search}` : ""}`}>
                    <Button variant="outline" size="sm">Previous</Button>
                  </Link>
                )}
                <span className="text-sm">Page {page} of {totalPages}</span>
                {page < totalPages && (
                  <Link href={`/dashboard/parents?page=${page + 1}${search ? `&search=${search}` : ""}`}>
                    <Button variant="outline" size="sm">Next</Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
