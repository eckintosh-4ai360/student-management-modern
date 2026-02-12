import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Library, Download, ArrowLeft, ExternalLink, FileText, BookOpen } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Sample reference materials data
const referenceCategories = [
  {
    category: "Citation & Formatting",
    icon: <FileText className="w-5 h-5 text-purple-500" />,
    materials: [
      {
        id: 1,
        title: "APA Style Guide (7th Edition)",
        description: "Complete guide to APA citation format for research papers and academic writing.",
        type: "PDF Guide",
        fileSize: "850 KB",
      },
      {
        id: 2,
        title: "MLA Formatting Handbook",
        description: "Modern Language Association style guide for humanities papers.",
        type: "PDF Guide",
        fileSize: "720 KB",
      },
      {
        id: 3,
        title: "Chicago Manual of Style",
        description: "Comprehensive style guide for citations, footnotes, and bibliographies.",
        type: "PDF Guide",
        fileSize: "1.1 MB",
      },
    ],
  },
  {
    category: "Writing Resources",
    icon: <BookOpen className="w-5 h-5 text-green-500" />,
    materials: [
      {
        id: 4,
        title: "Academic Writing Template",
        description: "Pre-formatted template for research papers with proper margins and spacing.",
        type: "DOCX Template",
        fileSize: "45 KB",
      },
      {
        id: 5,
        title: "Essay Structure Guide",
        description: "Step-by-step guide to structuring effective academic essays.",
        type: "PDF Guide",
        fileSize: "520 KB",
      },
      {
        id: 6,
        title: "Thesis Statement Worksheet",
        description: "Interactive worksheet to help develop strong thesis statements.",
        type: "PDF Worksheet",
        fileSize: "280 KB",
      },
    ],
  },
  {
    category: "Research Tools",
    icon: <Library className="w-5 h-5 text-orange-500" />,
    materials: [
      {
        id: 7,
        title: "Research Methodology Guide",
        description: "Comprehensive guide to qualitative and quantitative research methods.",
        type: "PDF Guide",
        fileSize: "1.5 MB",
      },
      {
        id: 8,
        title: "Literature Review Template",
        description: "Structured template for organizing and writing literature reviews.",
        type: "DOCX Template",
        fileSize: "38 KB",
      },
      {
        id: 9,
        title: "Data Analysis Cheat Sheet",
        description: "Quick reference for common statistical tests and data visualization.",
        type: "PDF Reference",
        fileSize: "420 KB",
      },
    ],
  },
];

const externalResources = [
  {
    id: 1,
    title: "Purdue Online Writing Lab (OWL)",
    description: "Comprehensive writing resources and citation guides",
    url: "https://owl.purdue.edu",
  },
  {
    id: 2,
    title: "Google Scholar",
    description: "Search engine for scholarly literature and academic papers",
    url: "https://scholar.google.com",
  },
  {
    id: 3,
    title: "Grammarly Education",
    description: "Writing assistance and grammar checking tools",
    url: "https://www.grammarly.com/edu",
  },
  {
    id: 4,
    title: "Citation Machine",
    description: "Automatic citation generator for multiple formats",
    url: "https://www.citationmachine.net",
  },
];

export default function AcademicReferencePage() {
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
            <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg">
              <Library className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-black tracking-tight text-foreground">Academic Reference</h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Standardized reference materials, formatting guidelines, and writing resources
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reference Materials by Category */}
      <div className="space-y-8">
        {referenceCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="space-y-4">
            <div className="flex items-center gap-2">
              {category.icon}
              <h2 className="text-2xl font-bold">{category.category}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.materials.map((material) => (
                <Card key={material.id} className="hover:shadow-lg transition-all duration-300 border-border/40">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-bold leading-tight">
                        {material.title}
                      </CardTitle>
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {material.type}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm mt-2">
                      {material.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">
                        {material.fileSize}
                      </span>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Download className="w-3 h-3" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* External Resources */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ExternalLink className="w-6 h-6 text-blue-600" />
          External Resources
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {externalResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-all duration-300 border-border/40">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost" className="gap-2 shrink-0">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Library className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                Using Academic References
              </h3>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                These reference materials are designed to help you maintain academic standards in your writing 
                and research. Always check with your instructor about which citation style to use for specific 
                assignments. Proper citation prevents plagiarism and gives credit to original authors.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
