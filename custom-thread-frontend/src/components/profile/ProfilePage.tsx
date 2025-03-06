import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "../ui/dialog";
import {
    BarChart,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Bar,
    Pie,
    Cell,
} from "recharts";
import {
    User,
    Camera,
    DollarSign,
    Users,
    TrendingUp,
    MapPin,
    Calendar,
    Mail,
    Edit,
    ShoppingBag,
    Share2,
    Award,
    Briefcase,
    Heart,
    Eye,
    MessageSquare,
    Globe,
} from "lucide-react";
import { Skeleton } from "../ui/skeleton";

// Define types for user data
interface UserData {
    name: string;
    username: string;
    bio: string;
    email: string;
    location: string;
    memberSince: string;
    specialties: string[];
    followers: number;
    following: number;
    website: string;
}

// Sample chart data
const salesData = [
    { name: "Jan", value: 65, growth: 2.3 },
    { name: "Feb", value: 80, growth: 15.4 },
    { name: "Mar", value: 95, growth: 12.5 },
    { name: "Apr", value: 75, growth: -5.1 },
    { name: "May", value: 110, growth: 16.3 },
    { name: "Jun", value: 150, growth: 18.7 },
];

const pieData = [
    { name: "T-shirts", value: 45 },
    { name: "Hoodies", value: 30 },
    { name: "Caps", value: 15 },
    { name: "Custom", value: 10 },
];

const COLORS = ["#8b5cf6", "#d946ef", "#ec4899", "#6366f1"];

// Recent designs data
const recentDesigns = [
    {
        id: 1,
        name: "Summer Collection - Tee",
        thumbnail: "/api/placeholder/300/180",
        type: "T-shirt",
        views: 245,
        likes: 56,
        comments: 12,
    },
    {
        id: 2,
        name: "Urban Street Hoodie",
        thumbnail: "/api/placeholder/300/180",
        type: "Hoodie",
        views: 189,
        likes: 43,
        comments: 8,
    },
    {
        id: 3,
        name: "Minimalist Cap Design",
        thumbnail: "/api/placeholder/300/180",
        type: "Cap",
        views: 132,
        likes: 37,
        comments: 5,
    },
];

export default function ProfilePage() {
    const { user, isLoaded } = useUser();
    const [activeTab, setActiveTab] = useState("analytics");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

    // Initialize with default user data
    const initialUserData: UserData = {
        name: "User",
        username: "@designer",
        bio: "Fashion designer passionate about sustainable and customizable clothing. Creating unique pieces that blend style with functionality.",
        email: "",
        location: "New York, USA",
        memberSince: "January 2022",
        specialties: [
            "T-shirts",
            "Hoodies",
            "Caps",
            "Custom Prints",
            "Sustainable Fashion",
            "Limited Editions",
        ],
        followers: 1248,
        following: 365,
        website: "designerportfolio.com",
    };

    const [userData, setUserData] = useState(initialUserData);
    const [editData, setEditData] = useState(initialUserData);

    // Update user data when Clerk user data is loaded
    useEffect(() => {
        if (isLoaded && user) {
            const updatedData = {
                ...userData,
                name: user.fullName || "User",
                username: `@${user.username || "designer"}`,
                email: user.primaryEmailAddress?.emailAddress || "",
                memberSince: user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                      })
                    : userData.memberSince,
            };
            setUserData(updatedData);
            setEditData(updatedData);
        }
    }, [isLoaded, user]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    const handleSpecialtiesChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const specialties = e.target.value
            .split(",")
            .map((item) => item.trim());
        setEditData({ ...editData, specialties });
    };

    const handleSave = async () => {
        if (!editData.name || !editData.email) {
            alert("Name and email are required");
            return;
        }
        try {
            if (user) {
                await user.update({
                    firstName: editData.name.split(" ")[0],
                    lastName: editData.name.split(" ").slice(1).join(" "),
                    unsafeMetadata: {
                        bio: editData.bio,
                        location: editData.location,
                        website: editData.website,
                        specialties: editData.specialties,
                    },
                });
                if (profileImageFile) {
                    await user.setProfileImage({ file: profileImageFile });
                }
            }
            setUserData(editData);
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    if (!isLoaded) {
        return (
            <div className="container mx-auto p-4 max-w-7xl">
                <Skeleton className="h-64 w-full rounded-xl mb-6" />
                <Skeleton className="h-10 w-full max-w-md mb-6" />
                <Skeleton className="h-[600px] w-full rounded-xl" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Profile Header */}
            <div className="relative mb-12 rounded-xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 via-purple-600/80 to-pink-600/90 dark:from-indigo-900/95 dark:via-purple-900/90 dark:to-pink-900/95 h-72"></div>
                <div className="relative pt-12 px-8 pb-0">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                        {/* User Avatar */}
                        <div className="flex-shrink-0">
                            <div className="rounded-full p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg">
                                <Avatar className="w-32 h-32 border-4 border-background shadow-2xl hover:scale-105 transition-all duration-300">
                                    <AvatarImage
                                        src={user?.imageUrl || ""}
                                        alt={userData.name}
                                    />
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-indigo-500 dark:to-purple-600 text-white text-4xl">
                                        {userData.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <Button
                                size="icon"
                                variant="outline"
                                className="absolute bottom-1 right-1 rounded-full h-9 w-9 bg-background shadow-md hover:shadow-lg transition-all border-2 border-purple-200 dark:border-purple-900"
                            >
                                <Camera className="h-4 w-4 text-purple-700 dark:text-purple-400" />
                            </Button>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                                <h1 className="text-4xl font-bold text-white dark:text-white">
                                    {userData.name}
                                </h1>
                                <Badge className="self-center md:self-auto bg-white/20 text-white border-white/30 backdrop-blur-sm dark:bg-white/10 dark:border-white/20">
                                    Premium Designer
                                </Badge>
                            </div>
                            <p className="text-white/80 dark:text-white/70 text-lg">
                                {userData.username}
                            </p>
                            <p className="mt-3 max-w-xl text-white/90 dark:text-white/80">
                                {userData.bio}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                                <div className="flex items-center gap-2 text-white/90">
                                    <Users className="h-4 w-4" />
                                    <span className="font-medium">
                                        {userData.followers.toLocaleString()}
                                    </span>
                                    <span className="text-white/70">
                                        Followers
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-white/90">
                                    <Heart className="h-4 w-4" />
                                    <span className="font-medium">
                                        {userData.following.toLocaleString()}
                                    </span>
                                    <span className="text-white/70">
                                        Following
                                    </span>
                                </div>
                                {userData.website && (
                                    <div className="flex items-center gap-2 text-white/90">
                                        <Globe className="h-4 w-4" />
                                        <a
                                            href={"https://" + userData.website}
                                            className="hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {userData.website}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 mb-8 md:mb-0 md:ml-auto">
                            <Dialog
                                open={isDialogOpen}
                                onOpenChange={setIsDialogOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="gap-2 bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 hover:text-white transition-colors"
                                    >
                                        <Edit className="h-4 w-4" />
                                        Edit Profile
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] dark:border-slate-700 dark:bg-slate-900">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-semibold flex items-center gap-2 dark:text-white">
                                            <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            Edit Profile
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="name"
                                                    className="text-sm font-medium dark:text-slate-200"
                                                >
                                                    Name
                                                </Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    value={editData.name}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your name"
                                                    className="focus-visible:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="email"
                                                    className="text-sm font-medium dark:text-slate-200"
                                                >
                                                    Email
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    value={editData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="your.email@example.com"
                                                    className="focus-visible:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="bio"
                                                className="text-sm font-medium dark:text-slate-200"
                                            >
                                                Bio
                                            </Label>
                                            <Textarea
                                                id="bio"
                                                name="bio"
                                                value={editData.bio}
                                                onChange={handleInputChange}
                                                placeholder="Tell us about yourself"
                                                className="resize-none min-h-24 focus-visible:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="location"
                                                    className="text-sm font-medium dark:text-slate-200"
                                                >
                                                    Location
                                                </Label>
                                                <Input
                                                    id="location"
                                                    name="location"
                                                    value={editData.location}
                                                    onChange={handleInputChange}
                                                    placeholder="City, Country"
                                                    className="focus-visible:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="website"
                                                    className="text-sm font-medium dark:text-slate-200"
                                                >
                                                    Website
                                                </Label>
                                                <Input
                                                    id="website"
                                                    name="website"
                                                    value={editData.website}
                                                    onChange={handleInputChange}
                                                    placeholder="yourwebsite.com"
                                                    className="focus-visible:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="specialties"
                                                className="text-sm font-medium dark:text-slate-200"
                                            >
                                                Specialties (comma separated)
                                            </Label>
                                            <Input
                                                id="specialties"
                                                name="specialties"
                                                value={editData.specialties.join(
                                                    ", "
                                                )}
                                                onChange={
                                                    handleSpecialtiesChange
                                                }
                                                placeholder="T-shirts, Hoodies, etc."
                                                className="focus-visible:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="profileImage"
                                                className="text-sm font-medium dark:text-slate-200"
                                            >
                                                Profile Picture
                                            </Label>
                                            <Input
                                                id="profileImage"
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setProfileImageFile(
                                                        e.target.files?.[0] ||
                                                            null
                                                    )
                                                }
                                                className="focus-visible:ring-purple-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter className="flex justify-between items-center gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() =>
                                                setIsDialogOpen(false)
                                            }
                                            className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSave}
                                            className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600"
                                        >
                                            Save Changes
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            <Button
                                variant="secondary"
                                className="gap-2 bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 hover:text-white transition-colors"
                            >
                                <Share2 className="h-4 w-4" />
                                Share Profile
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* User Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 -mt-6 mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="col-span-1"
                >
                    <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-slate-900 dark:border-slate-800">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                    <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground dark:text-slate-400">
                                        Email
                                    </p>
                                    <p className="font-medium dark:text-white">
                                        {userData.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                    <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground dark:text-slate-400">
                                        Location
                                    </p>
                                    <p className="font-medium dark:text-white">
                                        {userData.location}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="col-span-1"
                >
                    <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-slate-900 dark:border-slate-800">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                    <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground dark:text-slate-400">
                                        Member Since
                                    </p>
                                    <p className="font-medium dark:text-white">
                                        {userData.memberSince}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                    <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground dark:text-slate-400">
                                        Status
                                    </p>
                                    <p className="font-medium dark:text-white">
                                        Premium Designer
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="col-span-1"
                >
                    <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-slate-900 dark:border-slate-800">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                    <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground dark:text-slate-400">
                                        Total Designs
                                    </p>
                                    <p className="font-medium dark:text-white">
                                        24 Designs
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                    <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground dark:text-slate-400">
                                        Total Views
                                    </p>
                                    <p className="font-medium dark:text-white">
                                        12,586
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="col-span-1"
                >
                    <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-slate-900 dark:border-slate-800">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                    <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground dark:text-slate-400">
                                        Total Revenue
                                    </p>
                                    <p className="font-medium dark:text-white">
                                        $4,550.00
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                    <ShoppingBag className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground dark:text-slate-400">
                                        Total Orders
                                    </p>
                                    <p className="font-medium dark:text-white">
                                        187
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap gap-2 mb-10 justify-center md:justify-start">
                {userData.specialties.map((specialty, index) => (
                    <motion.div
                        key={specialty}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Badge
                            variant="secondary"
                            className="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:hover:bg-purple-800/50 text-sm py-1.5 px-3 rounded-full"
                        >
                            {specialty}
                        </Badge>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="mb-8"
            >
                <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg">
                    <TabsTrigger
                        value="analytics"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm rounded-md"
                    >
                        Analytics
                    </TabsTrigger>
                    <TabsTrigger
                        value="designs"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm rounded-md"
                    >
                        Designs
                    </TabsTrigger>
                    <TabsTrigger
                        value="details"
                        className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm rounded-md"
                    >
                        Details
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="analytics">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="col-span-2">
                                <Card className="shadow-md dark:bg-slate-900 dark:border-slate-800">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-2 text-xl dark:text-white">
                                            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            Sales Overview
                                        </CardTitle>
                                        <CardDescription className="dark:text-slate-400">
                                            Your design sales over the last 6
                                            months
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[300px]">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <BarChart data={salesData}>
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        stroke="var(--border)"
                                                        opacity={0.3}
                                                    />
                                                    <XAxis
                                                        dataKey="name"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{
                                                            fill: "var(--muted-foreground)",
                                                        }}
                                                    />
                                                    <YAxis
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={{
                                                            fill: "var(--muted-foreground)",
                                                        }}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor:
                                                                "var(--background)",
                                                            borderColor:
                                                                "var(--border)",
                                                            borderRadius: "8px",
                                                            boxShadow:
                                                                "0 4px 12px rgba(0, 0, 0, 0.1)",
                                                        }}
                                                        formatter={(value) => [
                                                            `${value} units`,
                                                            "Sales",
                                                        ]}
                                                    />
                                                    <Bar
                                                        dataKey="value"
                                                        fill="url(#colorGradient)"
                                                        radius={[4, 4, 0, 0]}
                                                    />
                                                    <defs>
                                                        <linearGradient
                                                            id="colorGradient"
                                                            x1="0"
                                                            y1="0"
                                                            x2="0"
                                                            y2="1"
                                                        >
                                                            <stop
                                                                offset="0%"
                                                                stopColor="#8b5cf6"
                                                                stopOpacity={
                                                                    0.8
                                                                }
                                                            />
                                                            <stop
                                                                offset="100%"
                                                                stopColor="#d946ef"
                                                                stopOpacity={
                                                                    0.6
                                                                }
                                                            />
                                                        </linearGradient>
                                                    </defs>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="col-span-1">
                                <Card className="shadow-md dark:bg-slate-900 dark:border-slate-800 h-full">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-2 text-xl dark:text-white">
                                            <PieChart className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                            Product Distribution
                                        </CardTitle>
                                        <CardDescription className="dark:text-slate-400">
                                            Sales by product category
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-[250px]">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <PieChart>
                                                    <Pie
                                                        data={pieData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                        label={({
                                                            name,
                                                            percent,
                                                        }) =>
                                                            `${name} ${(
                                                                percent * 100
                                                            ).toFixed(0)}%`
                                                        }
                                                    >
                                                        {pieData.map(
                                                            (entry, index) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={
                                                                        COLORS[
                                                                            index %
                                                                                COLORS.length
                                                                        ]
                                                                    }
                                                                />
                                                            )
                                                        )}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor:
                                                                "var(--background)",
                                                            borderColor:
                                                                "var(--border)",
                                                            borderRadius: "8px",
                                                            boxShadow:
                                                                "0 4px 12px rgba(0, 0, 0, 0.1)",
                                                        }}
                                                        formatter={(value) => [
                                                            `${value} units`,
                                                            "Sales",
                                                        ]}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                            <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-slate-900 dark:border-slate-800">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                <h3 className="font-medium dark:text-white">
                                                    Total Revenue
                                                </h3>
                                            </div>
                                            <p className="text-3xl font-bold dark:text-white">
                                                $4,550.00
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-green-600 dark:text-green-500 mt-2">
                                        +12.5% from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-slate-900 dark:border-slate-800">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                <h3 className="font-medium dark:text-white">
                                                    Total Sales
                                                </h3>
                                            </div>
                                            <p className="text-3xl font-bold dark:text-white">
                                                445
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-green-600 dark:text-green-500 mt-2">
                                        +8.2% from last month
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="shadow-md hover:shadow-lg transition-shadow dark:bg-slate-900 dark:border-slate-800">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                <h3 className="font-medium dark:text-white">
                                                    New Customers
                                                </h3>
                                            </div>
                                            <p className="text-3xl font-bold dark:text-white">
                                                126
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-green-600 dark:text-green-500 mt-2">
                                        +18.7% from last month
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </TabsContent>

                <TabsContent value="designs">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="shadow-md dark:bg-slate-900 dark:border-slate-800">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="flex items-center gap-2 text-xl dark:text-white">
                                        <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        Your Designs
                                    </CardTitle>
                                    <Button className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600">
                                        Create New Design
                                    </Button>
                                </div>
                                <CardDescription className="dark:text-slate-400">
                                    Manage and track your design portfolio
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {recentDesigns.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {recentDesigns.map((design, index) => (
                                            <motion.div
                                                key={design.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    delay: index * 0.1,
                                                }}
                                            >
                                                <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all hover:translate-y-[-2px] dark:bg-slate-800">
                                                    <div className="relative h-48 bg-slate-100 dark:bg-slate-700">
                                                        <div className="absolute top-2 right-2">
                                                            <Badge className="bg-white/80 backdrop-blur-sm text-slate-800 hover:bg-white dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-slate-900">
                                                                {design.type}
                                                            </Badge>
                                                        </div>
                                                        <img
                                                            src={
                                                                design.thumbnail
                                                            }
                                                            alt={design.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <CardContent className="p-4">
                                                        <h3 className="font-medium text-lg mb-2 dark:text-white">
                                                            {design.name}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                                            <div className="flex items-center gap-1">
                                                                <Eye className="h-4 w-4" />
                                                                <span>
                                                                    {
                                                                        design.views
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Heart className="h-4 w-4" />
                                                                <span>
                                                                    {
                                                                        design.likes
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <MessageSquare className="h-4 w-4" />
                                                                <span>
                                                                    {
                                                                        design.comments
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <h3 className="text-lg font-medium mb-2 dark:text-white">
                                            No designs yet
                                        </h3>
                                        <p className="text-muted-foreground mb-6 dark:text-slate-400">
                                            Create your first design to see it
                                            here
                                        </p>
                                        <Button className="bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600">
                                            Create Design
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>

                <TabsContent value="details">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="shadow-md dark:bg-slate-900 dark:border-slate-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl dark:text-white">
                                    <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                    Profile Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-medium dark:text-white">
                                            Bio
                                        </h3>
                                        <p className="text-muted-foreground dark:text-slate-400">
                                            {userData.bio}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium dark:text-white">
                                            Location
                                        </h3>
                                        <p className="text-muted-foreground dark:text-slate-400">
                                            {userData.location}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium dark:text-white">
                                            Member Since
                                        </h3>
                                        <p className="text-muted-foreground dark:text-slate-400">
                                            {userData.memberSince}
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium dark:text-white">
                                            Specialties
                                        </h3>
                                        <div className="flex flex-wrap gap-2 mt-2 flex-row">
                                            {userData.specialties.map(
                                                (specialty) => (
                                                    <Badge
                                                        key={specialty}
                                                        variant="secondary"
                                                        className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                                    >
                                                        {specialty}
                                                    </Badge>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
