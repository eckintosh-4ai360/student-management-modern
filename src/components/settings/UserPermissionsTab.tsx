"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

interface UserPermissionsTabProps {
  admins: any[];
  teachers: any[];
}

export function UserPermissionsTab({ admins, teachers }: UserPermissionsTabProps) {
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserType, setSelectedUserType] = useState<"admin" | "teacher">("admin");
  const [position, setPosition] = useState("");
  const [staffId, setStaffId] = useState("");
  const [permissions, setPermissions] = useState({
    // Financial
    statement: false,
    prepareBill: false,
    admissions: false,
    paymentList: false,
    generateBill: false,
    arrearsPDF: false,
    // Academic & Admin
    schoolFees: false,
    receipt: false,
    viewDetail: false,
    expenses: false,
    income: false,
    specialFeesOffer: false,
    // Staff Management
    busFee: false,
    feedingFee: false,
    salary: false,
    salaryAdvance: false,
    financialReport: false,
    message: false,
  });

  const allUsers = [
    ...admins.map((a) => ({ ...a, type: "admin" as const })),
    ...teachers.map((t) => ({ ...t, type: "teacher" as const })),
  ];

  const handleUserChange = (userId: string) => {
    setSelectedUser(userId);
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setSelectedUserType(user.type);
      setStaffId(user.staffId);
      setPosition(user.type === "admin" ? user.role : "Teacher");
    }
  };

  const handlePermissionChange = (key: string, value: boolean) => {
    setPermissions((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    // TODO: Implement saveUserPermissions action
    toast.success("User permissions updated successfully!");
    console.log({
      userId: selectedUser,
      userType: selectedUserType,
      position,
      staffId,
      permissions,
    });
  };

  const handleClear = () => {
    setSelectedUser("");
    setPosition("");
    setStaffId("");
    setPermissions({
statement: false,
      prepareBill: false,
      admissions: false,
      paymentList: false,
      generateBill: false,
      arrearsPDF: false,
      schoolFees: false,
      receipt: false,
      viewDetail: false,
      expenses: false,
      income: false,
      specialFeesOffer: false,
      busFee: false,
      feedingFee: false,
      salary: false,
      salaryAdvance: false,
      financialReport: false,
      message: false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* User Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="selectUser">Select User</Label>
          <select
            id="selectUser"
            value={selectedUser}
            onChange={(e) => handleUserChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select...</option>
            <optgroup label="Administrators">
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.name} ({admin.staffId})
                </option>
              ))}
            </optgroup>
            <optgroup label="Teachers">
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} {teacher.surname} ({teacher.staffId})
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Position"
            disabled={!selectedUser}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="staffId">Staff ID</Label>
          <Input
            id="staffId"
            value={staffId}
            readOnly
            className="bg-gray-100"
            placeholder="Staff ID"
          />
        </div>
      </div>

      {/* Permissions Grid */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-4 text-blue-600">Permissions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { label: "Statement", key: "statement" },
            { label: "Prepare Bill", key: "prepareBill" },
            { label: "Admissions", key: "admissions" },
            { label: "Payment List", key: "paymentList" },
            { label: "Generate Bill", key: "generateBill" },
            { label: "Arrears PDF", key: "arrearsPDF" },
            { label: "School Fees", key: "schoolFees" },
            { label: "Receipt", key: "receipt" },
            { label: "View Detail", key: "viewDetail" },
            { label: "Expenses", key: "expenses" },
            { label: "Income", key: "income" },
            { label: "Special Fees Offer", key: "specialFeesOffer" },
            { label: "Bus Fee", key: "busFee" },
            { label: "Feeding Fee", key: "feedingFee" },
            { label: "Salary", key: "salary" },
            { label: "Salary Advance", key: "salaryAdvance" },
            { label: "Financial Report", key: "financialReport" },
            { label: "Message", key: "message" },
          ].map(({ label, key }) => (
            <div key={key} className="space-y-1">
              <Label className="text-sm text-gray-600">{label}</Label>
              <select
                value={permissions[key as keyof typeof permissions] ? "yes" : "no"}
                onChange={(e) => handlePermissionChange(key, e.target.value === "yes")}
                disabled={!selectedUser}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="no">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={handleClear} className="bg-red-500 text-white hover:bg-red-600">
          CLEAR
        </Button>
        <Button type="submit" disabled={!selectedUser} className="bg-blue-600 hover:bg-blue-700">
          UPDATE
        </Button>
      </div>
    </form>
  );
}
