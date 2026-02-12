"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileJson, ArrowLeft, Search, ExternalLink, BookOpen, Filter } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Select } from "@/components/ui/select";

// Sample library catalog data
const books = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "978-0262033848",
    category: "Computer Science",
    grade: "11-12",
    availability: "Available",
    copies: 5,
    description: "Comprehensive guide to algorithms and data structures.",
  },
  {
    id: 2,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0141439518",
    category: "Literature",
    grade: "10-12",
    availability: "Available",
    copies: 8,
    description: "Classic novel of manners and social commentary.",
  },
  {
    id: 3,
    title: "Physics for Scientists and Engineers",
    author: "Raymond A. Serway",
    isbn: "978-1133947271",
    category: "Physics",
    grade: "11-12",
    availability: "Limited",
    copies: 2,
    description: "Comprehensive physics textbook with modern applications.",
  },
  {
    id: 4,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0743273565",
    category: "Literature",
    grade: "10-12",
    availability: "Available",
    copies: 12,
    description: "American classic exploring themes of wealth and society.",
  },
  {
    id: 5,
    title: "Organic Chemistry",
    author: "Paula Yurkanis Bruice",
    isbn: "978-0134042282",
    category: "Chemistry",
    grade: "11-12",
    availability: "Available",
    copies: 6,
    description: "Comprehensive organic chemistry with biological applications.",
  },
  {
    id: 6,
    title: "World History: Patterns of Interaction",
    author: "Roger B. Beck",
    isbn: "978-0547491127",
    category: "History",
    grade: "9-12",
    availability: "Available",
    copies: 15,
    description: "Global history from ancient civilizations to modern times.",
  },
  {
    id: 7,
    title: "Campbell Biology",
    author: "Jane B. Reece",
    isbn: "978-0321558237",
    category: "Biology",
    grade: "10-12",
    availability: "Limited",
    copies: 3,
    description: "Comprehensive biology textbook covering all major topics.",
  },
  {
    id: 8,
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    isbn: "978-1285741550",
    category: "Mathematics",
    grade: "11-12",
    availability: "Available",
    copies: 10,
    description: "Standard calculus textbook with clear explanations.",
  },
];

const digitalResources = [
  {
    id: 1,
    title: "JSTOR Digital Library",
    description: "Access to thousands of academic journals and primary sources",
    url: "https://www.jstor.org",
  },
  {
    id: 2,
    title: "Project Gutenberg",
    description: "Free eBooks of classic literature and historical texts",
    url: "https://www.gutenberg.org",
  },
  {
    id: 3,
    title: "Khan Academy",
    description: "Free educational videos and practice exercises",
    url: "https://www.khanacademy.org",
  },
  {
    id: 4,
    title: "Open Library",
    description: "Digital lending library with millions of books",
    url: "https://openlibrary.org",
  },
];

export default function LibraryCatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredBooks = books.filter((book) => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery);
    
    const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...Array.from(new Set(books.map(book => book.category)))];

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
            <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
              <FileJson className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-black tracking-tight text-foreground">Library Catalog</h1>
              <p className="text-muted-foreground mt-2 text-lg">
                Digital access to the school's book and journal database
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="all">All Categories</option>
                {categories.filter(c => c !== "all").map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Found {filteredBooks.length} {filteredBooks.length === 1 ? "book" : "books"}
          </p>
        </CardContent>
      </Card>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBooks.map((book) => (
          <Card key={book.id} className="hover:shadow-lg transition-all duration-300 border-border/40">
            <CardHeader className="border-b bg-muted/10">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-base font-bold leading-tight line-clamp-2">
                    {book.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
                </div>
                <Badge 
                  variant={book.availability === "Available" ? "default" : "secondary"}
                  className="shrink-0"
                >
                  {book.availability}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4 space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{book.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <Badge variant="outline">{book.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Grade Level:</span>
                  <span className="font-medium">{book.grade}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Copies Available:</span>
                  <span className="font-medium">{book.copies}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">ISBN:</span>
                  <span className="font-mono text-xs">{book.isbn}</span>
                </div>
              </div>

              <Button className="w-full mt-4" variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Request Book
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No books found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Digital Resources */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ExternalLink className="w-6 h-6 text-green-600" />
          Digital Library Resources
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {digitalResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-all duration-300 border-border/40">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{resource.title}</h3>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="gap-2 shrink-0" asChild>
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                How to Borrow Books
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                To borrow a book from the library, click the "Request Book" button and submit your request. 
                You will be notified when the book is ready for pickup. Books can be borrowed for up to 2 weeks 
                and may be renewed once if no other students have requested them. Late returns may result in fines.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
