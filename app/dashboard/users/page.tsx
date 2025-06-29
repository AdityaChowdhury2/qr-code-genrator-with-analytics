"use client"

import { useSession } from "next-auth/react"
import { useGetAllUsersQuery, useUpdateUserPlanMutation } from "@/lib/store/api/usersApi"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Users, Crown, User, Shield } from "lucide-react"

export default function UsersPage() {
  const { data: session } = useSession()
  const { data: users = [], isLoading, refetch } = useGetAllUsersQuery()
  const [updateUserPlan] = useUpdateUserPlanMutation()

  const userRole = session?.user?.role || "USER"

  if (userRole !== "ADMIN") {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </DashboardLayout>
    )
  }

  const handlePlanUpdate = async (userId: string, newPlan: string) => {
    try {
      await updateUserPlan({ userId, plan: newPlan }).unwrap()
      refetch()
    } catch (error) {
      alert("Failed to update user plan")
    }
  }

  const totalUsers = users.length
  const premiumUsers = users.filter((user) => user.plan === "PREMIUM").length
  const freeUsers = users.filter((user) => user.plan === "FREE").length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-600">Manage users and their subscription plans</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">All registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
              <Crown className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{premiumUsers}</div>
              <p className="text-xs text-muted-foreground">
                {totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0}% of total users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Free Users</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{freeUsers}</div>
              <p className="text-xs text-muted-foreground">
                {totalUsers > 0 ? Math.round((freeUsers / totalUsers) * 100) : 0}% of total users
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage user accounts and subscription plans</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : users.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>QR Codes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium">{user.name?.charAt(0).toUpperCase() || "U"}</span>
                          </div>
                          <span className="font-medium">{user.name || "Unknown"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.plan === "PREMIUM" ? "default" : "secondary"}
                          className={user.plan === "PREMIUM" ? "bg-yellow-100 text-yellow-800" : ""}
                        >
                          {user.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{user._count?.links || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          {user.plan === "FREE" ? (
                            <Button size="sm" variant="outline" onClick={() => handlePlanUpdate(user.id, "PREMIUM")}>
                              Upgrade
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => handlePlanUpdate(user.id, "FREE")}>
                              Downgrade
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No users found</h3>
                <p className="text-gray-600">No users have registered yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
