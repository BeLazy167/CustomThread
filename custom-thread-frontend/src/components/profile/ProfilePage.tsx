import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { DollarSign, ShoppingBag, TrendingUp, Users, Mail, MapPin, Calendar, Palette } from "lucide-react"



const chartColor = "#8884d8" // A soft purple that works well on both light and dark backgrounds

const initialUserData = {
  name: "Jane Doe",
  username: "@janedoe",
  bio: "Fashion designer passionate about sustainable and customizable clothing.",
  email: "jane.doe@example.com",
  location: "New York, USA",
  memberSince: "January 2022",
  specialties: ["T-shirts", "Hoodies"],
}

const userDesigns = [
  { id: 1, name: "Summer Breeze Tee", sales: 150, image: "https://via.placeholder.com/100" },
  { id: 2, name: "Urban Night Hoodie", sales: 120, image: "https://via.placeholder.com/100" },
]

const salesData = [
  { name: "Summer Breeze Tee", sales: 150 },
  { name: "Urban Night Hoodie", sales: 120 },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("details")
  const [userData, setinitialUserData] = useState(initialUserData)
  const [editData, setEditData] = useState(initialUserData)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    
    setEditData({ ...editData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    console.log(editData);
    setinitialUserData(editData)
  }
  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <Avatar className="w-24 h-24">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/adventurer/svg?seed=${initialUserData.username}`}
                alt={initialUserData.name}
              />
              <AvatarFallback>
                {initialUserData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">{initialUserData.name}</h1>
              <p className="text-muted-foreground">{initialUserData.username}</p>
              <p className="mt-2">{initialUserData.bio}</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-auto">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={editData.name} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" name="bio" value={editData.bio} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" value={editData.email} onChange={handleInputChange} />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" name="location" value={editData.location} onChange={handleInputChange} />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSave}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="designs">Designs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{initialUserData.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{initialUserData.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>Member since: {initialUserData.memberSince}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-muted-foreground" />
                    <span>Specialties: {initialUserData.specialties ? initialUserData.specialties.join(", ") : "Not specified"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="designs">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {userDesigns.map((design) => (
              <Card key={design.id}>
                <CardContent className="p-4">
                  <img
                    src={design.image || "/placeholder.svg"}
                    alt={design.name}
                    className="w-full h-40 object-cover mb-2"
                  />
                  <h3 className="font-semibold">{design.name}</h3>
                  <p className="text-sm text-muted-foreground">Sales: {design.sales}</p>
                  <Badge className="mt-2">Featured</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Your design sales performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={salesData}>
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip
                      contentStyle={{ background: "#fff", border: "1px solid #ccc", borderRadius: "4px" }}
                      labelStyle={{ fontWeight: "bold" }}
                    />
                    <Bar dataKey="sales" fill={chartColor} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Selling Designs</CardTitle>
                <CardDescription>Your best performers</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2">
                  {salesData
                    .sort((a, b) => b.sales - a.sales)
                    .slice(0, 3)
                    .map((item, index) => (
                      <li key={index} className="flex justify-between items-center">
                        <span>{item.name}</span>
                        <Badge variant="secondary">{item.sales} sales</Badge>
                      </li>
                    ))}
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Earnings</CardTitle>
                <CardDescription>Your commission this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">
                    ${salesData.reduce((sum, item) => sum + item.sales * 10, 0)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Based on $10 commission per sale</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Sales</CardTitle>
                <CardDescription>Across all designs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">{salesData.reduce((sum, item) => sum + item.sales, 0)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Growth Rate</CardTitle>
                <CardDescription>Month-over-month increase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-2xl font-bold">12.5%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Customers</CardTitle>
                <CardDescription>First-time buyers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-2xl font-bold">87</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

