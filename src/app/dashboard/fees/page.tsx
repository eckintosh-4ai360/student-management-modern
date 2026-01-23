import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { AddFeeButton } from "@/components/forms/AddFeeButton";
import { FeeActions } from "@/components/tables/FeeActions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function FeesPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string };
}) {
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role || "student";
  const username = (session?.user as any)?.username;

  const page = parseInt(searchParams.page || "1");
  const pageSize = 20;
  const statusFilter = searchParams.status || "all";

  // Build where clause based on user role
  let where: any = statusFilter !== "all" ? { status: statusFilter as any } : {};
  
  // If student, only show their fees
  if (userRole === "student" && username) {
    const student = await prisma.student.findUnique({
      where: { username },
      select: { id: true },
    });
    if (student) {
      where.studentId = student.id;
    }
  }

  const [fees, total, students] = await Promise.all([
    prisma.fee.findMany({
      where,
      include: {
        student: {
          include: {
            class: true,
            parent: true,
          },
        },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { dueDate: "desc" },
    }),
    prisma.fee.count({ where }),
    userRole === "admin" ? prisma.student.findMany({
      select: { 
        id: true, 
        name: true, 
        surname: true,
        class: {
          select: { name: true }
        }
      },
      orderBy: { name: "asc" },
    }) : Promise.resolve([]),
  ]);

  const totalPages = Math.ceil(total / pageSize);

  // Calculate totals
  const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const paidAmount = fees.filter(f => f.status === "PAID").reduce((sum, fee) => sum + fee.amount, 0);
  const pendingAmount = fees.filter(f => f.status === "PENDING").reduce((sum, fee) => sum + fee.amount, 0);
  const overdueAmount = fees.filter(f => f.status === "OVERDUE").reduce((sum, fee) => sum + fee.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {userRole === "student" ? "My Fees & Bills" : "Fees & Bills"}
          </h1>
          <p className="text-gray-500 mt-1">
            {userRole === "student" 
              ? "View your payment information and due dates" 
              : "Manage student fees and payments"}
          </p>
        </div>
        {userRole === "admin" && <AddFeeButton students={students} />}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/dashboard/fees" className="block">
          <Card className={`hover:shadow-md transition-shadow cursor-pointer ${statusFilter === "all" ? "ring-2 ring-blue-500" : ""}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">GH₵{totalAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/fees?status=PAID" className="block">
          <Card className={`hover:shadow-md transition-shadow cursor-pointer ${statusFilter === "PAID" ? "ring-2 ring-green-500" : ""}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Paid Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">GH₵{paidAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/fees?status=PENDING" className="block">
          <Card className={`hover:shadow-md transition-shadow cursor-pointer ${statusFilter === "PENDING" ? "ring-2 ring-orange-500" : ""}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">GH₵{pendingAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/fees?status=OVERDUE" className="block">
          <Card className={`hover:shadow-md transition-shadow cursor-pointer ${statusFilter === "OVERDUE" ? "ring-2 ring-red-500" : ""}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Overdue Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">GH₵{overdueAmount.toFixed(2)}</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        <Link href="/dashboard/fees">
          <Button variant={statusFilter === "all" ? "default" : "outline"} size="sm">
            All
          </Button>
        </Link>
        <Link href="/dashboard/fees?status=PENDING">
          <Button variant={statusFilter === "PENDING" ? "default" : "outline"} size="sm">
            Pending
          </Button>
        </Link>
        <Link href="/dashboard/fees?status=PAID">
          <Button variant={statusFilter === "PAID" ? "default" : "outline"} size="sm">
            Paid
          </Button>
        </Link>
        <Link href="/dashboard/fees?status=OVERDUE">
          <Button variant={statusFilter === "OVERDUE" ? "default" : "outline"} size="sm">
            Overdue
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {userRole === "student" ? "My Fees" : `All Fees (${total})`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {userRole !== "student" && (
                    <th className="text-left p-4 font-medium">Student</th>
                  )}
                  <th className="text-left p-4 font-medium">Title</th>
                  <th className="text-left p-4 font-medium">Amount</th>
                  <th className="text-left p-4 font-medium">Due Date</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  {userRole !== "student" && (
                    <th className="text-left p-4 font-medium">Parent</th>
                  )}
                  {userRole === "admin" && (
                    <th className="text-left p-4 font-medium">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {fees.map((fee) => (
                  <tr key={fee.id} className="border-b hover:bg-gray-50">
                    {userRole !== "student" && (
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{fee.student.name} {fee.student.surname}</p>
                          <p className="text-sm text-gray-500">{fee.student.class.name}</p>
                        </div>
                      </td>
                    )}
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{fee.title}</p>
                        {fee.description && (
                          <p className="text-xs text-gray-500">{fee.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-semibold">GH₵{fee.amount.toFixed(2)}</td>
                    <td className="p-4 text-sm">
                      {format(new Date(fee.dueDate), "MMM dd, yyyy")}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          fee.status === "PAID"
                            ? "bg-green-100 text-green-700"
                            : fee.status === "OVERDUE"
                            ? "bg-red-100 text-red-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {fee.status}
                      </span>
                    </td>
                    {userRole !== "student" && (
                      <td className="p-4 text-sm">
                        {fee.student.parent?.name || "No Parent"} {fee.student.parent?.surname || ""}
                      </td>
                    )}
                    {userRole === "admin" && (
                      <td className="p-4">
                        <FeeActions fee={fee} students={students} />
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {fees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No fees found.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-600">
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center space-x-2">
                {page > 1 && (
                  <Link href={`/dashboard/fees?page=${page - 1}${statusFilter !== "all" ? `&status=${statusFilter}` : ""}`}>
                    <Button variant="outline" size="sm">Previous</Button>
                  </Link>
                )}
                {page < totalPages && (
                  <Link href={`/dashboard/fees?page=${page + 1}${statusFilter !== "all" ? `&status=${statusFilter}` : ""}`}>
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

