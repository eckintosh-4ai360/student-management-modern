import prisma from "@/lib/prisma";
import { BehaviorPageClient } from "@/components/BehaviorPageClient";

export default async function BehaviorPage() {
  const behaviors = await prisma.behavior.findMany({
    include: {
      student: {
        include: {
          class: true,
          grade: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  const students = await prisma.student.findMany({
    select: {
      id: true,
      name: true,
      surname: true,
    },
  });

  const stats = {
    total: behaviors.length,
    positive: behaviors.filter((b) => b.type === "POSITIVE").length,
    negative: behaviors.filter((b) => b.type === "NEGATIVE").length,
    neutral: behaviors.filter((b) => b.type === "NEUTRAL").length,
    critical: behaviors.filter((b) => b.severity === "CRITICAL").length,
  };

  return (
    <BehaviorPageClient
      behaviors={behaviors}
      students={students}
      stats={stats}
    />
  );
}
