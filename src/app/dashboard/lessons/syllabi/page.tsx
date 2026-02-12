import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Download, ArrowLeft, FileText, Calendar, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Sample syllabi data - in a real app, this would come from a database
const syllabi = [
  {
    id: 1,
    title: "Mathematics - Grade 10",
    subject: "Mathematics",
    grade: "10",
    description: "Complete curriculum overview including algebra, geometry, and trigonometry for the academic year.",
    fileSize: "2.4 MB",
    lastUpdated: "2024-01-15",
    instructor: "Dr. Sarah Johnson",
    topics: ["Algebra", "Geometry", "Trigonometry", "Statistics"],
  },
  {
    id: 2,
    title: "English Literature - Grade 11",
    subject: "English",
    grade: "11",
    description: "Comprehensive study of classic and contemporary literature, writing skills, and critical analysis.",
    fileSize: "1.8 MB",
    lastUpdated: "2024-01-20",
    instructor: "Prof. Michael Brown",
    topics: ["Poetry", "Drama", "Prose", "Creative Writing"],
  },
  {
    id: 3,
    title: "Physics - Grade 12",
    subject: "Physics",
    grade: "12",
    description: "Advanced physics curriculum covering mechanics, thermodynamics, electromagnetism, and modern physics.",
    fileSize: "3.1 MB",
    lastUpdated: "2024-01-18",
    instructor: "Dr. Emily Chen",
    topics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Quantum Physics"],
  },
  {
    id: 4,
    title: "Chemistry - Grade 11",
    subject: "Chemistry",
    grade: "11",
    description: "Detailed chemistry syllabus including organic chemistry, inorganic chemistry, and laboratory work.",
    fileSize: "2.7 MB",
    lastUpdated: "2024-01-22",
    instructor: "Dr. Robert Williams",
    topics: ["Organic Chemistry", "Inorganic Chemistry", "Physical Chemistry", "Lab Techniques"],
  },
  {
    id: 5,
    title: "Biology - Grade 10",
    subject: "Biology",
    grade: "10",
    description: "Introduction to life sciences covering cell biology, genetics, ecology, and human anatomy.",
    fileSize: "2.2 MB",
    lastUpdated: "2024-01-25",
    instructor: "Dr. Amanda Martinez",
    topics: ["Cell Biology", "Genetics", "Ecology", "Human Anatomy"],
  },
  {
    id: 6,
    title: "History - Grade 12",
    subject: "History",
    grade: "12",
    description: "World history curriculum focusing on major civilizations, wars, and cultural movements.",
    fileSize: "1.9 MB",
    lastUpdated: "2024-01-17",
    instructor: "Prof. David Anderson",
    topics: ["Ancient Civilizations", "World Wars", "Modern History", "Cultural Studies"],
  },
];

export default function CourseSyllabiPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/lessons">
          <Button variant="ghost" size="sm" className="w-fit gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Lessons
          </Button>
        </Link>
        
        <div className="border-b pb-6 border-border/50">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Book className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-black tracking-tight text-foreground">Course Syllabi</h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Detailed overview of all curriculum requirements and course outlines for this semester
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Syllabi Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {syllabi.map((syllabus) => (
          <Card key={syllabus.id} className="hover:shadow-xl transition-all duration-300 border-border/40">
            <CardHeader className="border-b bg-muted/10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    {syllabus.title}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {syllabus.description}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="shrink-0">
                  Grade {syllabus.grade}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-4">
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{syllabus.instructor}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {syllabus.lastUpdated}</span>
                </div>
              </div>

              {/* Topics */}
              <div>
                <p className="text-sm font-semibold mb-2">Key Topics:</p>
                <div className="flex flex-wrap gap-2">
                  {syllabus.topics.map((topic, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Download Button */}
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-muted-foreground font-medium">
                  {syllabus.fileSize}
                </span>
                <Button className="gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                About Course Syllabi
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Course syllabi provide comprehensive information about course objectives, learning outcomes, 
                assessment methods, required materials, and the weekly schedule of topics. Review your syllabus 
                carefully at the beginning of each semester to understand course expectations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
