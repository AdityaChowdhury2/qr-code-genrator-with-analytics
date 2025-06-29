import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  QrCode,
  LinkIcon,
  FileText,
  MessageSquare,
  Smartphone,
  BarChart3,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          QR Code Generator & Analytics
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Create dynamic QR codes for URLs, PDFs, contact cards, messages, and
          app downloads with detailed analytics
        </p>
        <Link href="/create">
          <Button size="lg" className="text-lg px-8 py-3">
            <QrCode className="mr-2 h-5 w-5" />
            Create QR Code
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Website URLs
            </CardTitle>
            <CardDescription>
              Create QR codes that redirect to any website or web page
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              PDF Documents
            </CardTitle>
            <CardDescription>
              Generate QR codes for direct PDF downloads and viewing
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Contact Cards
            </CardTitle>
            <CardDescription>
              Share contact information via vCard format
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Text Messages
            </CardTitle>
            <CardDescription>
              Display custom messages when scanned
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              App Downloads
            </CardTitle>
            <CardDescription>
              Smart redirects to iOS App Store or Google Play
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </CardTitle>
            <CardDescription>
              Track scans, locations, devices, and usage patterns
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-left">
          <div>
            <h3 className="font-semibold mb-2">Dynamic QR Codes</h3>
            <p className="text-sm text-muted-foreground">
              Update destinations without regenerating QR codes
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Detailed Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Track scans, locations, devices, and time patterns
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Multiple Formats</h3>
            <p className="text-sm text-muted-foreground">
              Support for URLs, PDFs, vCards, messages, and apps
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Production Ready</h3>
            <p className="text-sm text-muted-foreground">
              Built with Next.js, Prisma, and MySQL for scale
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default function HomePage() {
//   return (
//     <div>
//       <h1 className="text-2xl font-bold">Hello World</h1>
//     </div>
//   );
// }
