"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useGetUserLinksQuery, useDeleteLinkMutation } from "@/lib/store/api/linksApi"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { QrCode, MoreHorizontal, Eye, Trash2, Copy, Search, Crown } from "lucide-react"
import Link from "next/link"

export default function QRCodesPage() {
  const { data: session } = useSession()
  const { data: links = [], isLoading, refetch } = useGetUserLinksQuery()
  const [deleteLink] = useDeleteLinkMutation()
  const [searchTerm, setSearchTerm] = useState("")

  const userPlan = session?.user?.plan || "FREE"

  if (userPlan === "FREE") {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Premium Feature</h1>
          <p className="text-gray-600 mb-8">Upgrade to Premium to manage your QR codes and access detailed analytics</p>
          <Link href="/dashboard/billing">
            <Button size="lg">
              <Crown className="mr-2 h-5 w-5" />
              Upgrade to Premium
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const filteredLinks = links.filter(
    (link) =>
      link.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this QR code?")) {
      try {
        await deleteLink(id).unwrap()
        refetch()
      } catch (error) {
        alert("Failed to delete QR code")
      }
    }
  }

  const copyToClipboard = (code: string) => {
    const url = `${window.location.origin}/r/${code}`
    navigator.clipboard.writeText(url)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My QR Codes</h1>
            <p className="text-gray-600">Manage and track your QR codes</p>
          </div>
          <Link href="/dashboard/create">
            <Button>
              <QrCode className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>QR Code Management</CardTitle>
            <CardDescription>View, edit, and analyze your generated QR codes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search QR codes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : filteredLinks.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Scans</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLinks.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <QrCode className="h-4 w-4" />
                          {link.code}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {link.type.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(link.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className="font-medium">{link._count?.scans || 0}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">Active</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => copyToClipboard(link.code)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy URL
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/analytics/${link.code}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Analytics
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(link.id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No QR codes found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm ? "Try adjusting your search" : "Create your first QR code to get started"}
                </p>
                <Link href="/dashboard/create">
                  <Button>Create QR Code</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
