import { useState, useEffect } from "react";
// import { Link } from "react-router-dom"; // Now used in component files
import { useNavigate } from "react-router-dom"; // Uncommented
// import { useUser } from "@clerk/clerk-react"; // Temporarily unused for development
import { ReportFilters } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useSalesReport, useOnlineStatus } from "@/hooks/useSalesReport";
import { SalesTrendChart } from "@/components/SalesTrendChart";
import { TopSellingDesignsChart } from "@/components/TopSellingDesignsChart";
import { DesignerPerformanceChart } from "@/components/DesignerPerformanceChart";
// Import temporarily commented out for development
import { AdminPasswordModal } from "@/components/AdminPasswordModal";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
// Recharts components are now imported in their respective component files
// Table components are now imported in their respective component files
import {
    Download,
    FileText,
    Filter,
    Loader2,
    RefreshCw,
    TrendingUp,
    DollarSign,
    ShoppingBag,
    Calendar,
    WifiOff,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

// Chart colors are now defined in their respective component files

// Use types from our custom hook
import type {
    TopSellingDesign,
    SalesByDate,
    SalesByDesigner,
} from "@/hooks/useSalesReport";

// Define the interface for Designer
interface Designer {
    id: string;
    name: string;
}

export default function SalesReport() {
    // const { user } = useUser(); // Temporarily unused for development
    const navigate = useNavigate(); // Uncommented
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("overview");
    const [filters, setFilters] = useState<ReportFilters>({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
            .toISOString()
            .split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        designerId: "",
    });
    const [isAdmin, setIsAdmin] = useState(false);
    const [designers, setDesigners] = useState<Designer[]>([]);
    const [showPasswordModal, setShowPasswordModal] = useState(true); // Temporarily unused for development
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if user is online
    const isOnline = useOnlineStatus();

    // Fetch report data using React Query
    const {
        data: reportData,
        isLoading,
        error,
        refetch: loadReportData,
    } = useSalesReport(filters);

    // Authentication temporarily disabled for development
    useEffect(() => {
        // Set as authenticated for development
        setIsAdmin(true);
        setIsAuthenticated(true);

        // Store authentication in session storage for persistence
        sessionStorage.setItem("adminAuthenticated", "true");

        // Commented out for development
        // if (user?.publicMetadata?.role === "admin") {
        //     setIsAdmin(true);
        //
        //     // If not already authenticated, show password modal
        //     if (!adminAuthenticated) {
        //         setShowPasswordModal(true);
        //     } else {
        //         setIsAuthenticated(true);
        //     }
        // } else {
        //     // Redirect non-admin users
        //     toast({
        //         title: "Access Denied",
        //         description:
        //             "You don't have permission to access sales reports.",
        //         variant: "destructive",
        //     });
        //     navigate("/");
        // }
    }, []);

    // Load designers for the dropdown
    useEffect(() => {
        const fetchDesigners = async () => {
            if (!isAdmin) return;

            try {
                // This would normally call an API endpoint to get all designers
                // For now, we'll use the designers from the report data if available
                if (reportData?.salesByDesigner) {
                    const uniqueDesigners = reportData.salesByDesigner.map(
                        (designer) => ({
                            id: designer.designerId,
                            name: designer.designerName,
                        })
                    );
                    setDesigners(uniqueDesigners);
                }
            } catch (error) {
                console.error("Failed to load designers:", error);
            }
        };

        fetchDesigners();
    }, [isAdmin, reportData]);

    // Extract designers from report data when available
    useEffect(() => {
        if (reportData?.salesByDesigner) {
            const uniqueDesigners = reportData.salesByDesigner.map(
                (designer: SalesByDesigner) => ({
                    id: designer.designerId,
                    name: designer.designerName,
                })
            );
            setDesigners(uniqueDesigners);
        }
    }, [reportData]);

    // We're using the loadReportData function directly with arrow functions in the onClick handlers

    // Handle filter changes
    const handleFilterChange = (name: string, value: string) => {
        // If "all" is selected for designerId, set it to empty string for the API
        if (name === "designerId" && value === "all") {
            setFilters((prev) => ({
                ...prev,
                [name]: "",
            }));
        } else {
            setFilters((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Apply filters with validation
    const applyFilters = () => {
        // Data-Dependency Validation: Ensure start date is not after end date
        if (
            filters.startDate &&
            filters.endDate &&
            new Date(filters.startDate) > new Date(filters.endDate)
        ) {
            toast({
                title: "Invalid Date Range",
                description: "Start date cannot be after end date",
                variant: "destructive",
            });
            return;
        }

        // Format dates properly for the API
        const formattedFilters = {
            ...filters,
            startDate: filters.startDate ? filters.startDate : undefined,
            endDate: filters.endDate ? filters.endDate : undefined,
        };

        // Log the filters being applied
        console.log("Applying filters:", formattedFilters);

        loadReportData();
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
                .toISOString()
                .split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
            designerId: "",
        });
    };

    // Export report as CSV
    const exportReportCSV = () => {
        if (!reportData) return;

        try {
            // Create CSV content
            let csvContent = "data:text/csv;charset=utf-8,";

            // Add header
            csvContent +=
                "Report Generated: " + new Date().toLocaleString() + "\r\n\r\n";

            // Add summary data
            csvContent += "Total Sales,Total Revenue,Average Order Value\r\n";
            csvContent += `${
                reportData.totalSales
            },${reportData.totalRevenue.toFixed(
                2
            )},${reportData.averageOrderValue.toFixed(2)}\r\n\r\n`;

            // Add top selling designs
            csvContent += "Top Selling Designs\r\n";
            csvContent += "Design ID,Title,Designer,Quantity,Revenue\r\n";
            reportData.topSellingDesigns.forEach((design: TopSellingDesign) => {
                // Escape commas in text fields
                const safeTitle = `"${design.title.replace(/"/g, '""')}"`;
                const safeDesigner = `"${design.designer.replace(/"/g, '""')}"`;

                csvContent += `${
                    design.designId
                },${safeTitle},${safeDesigner},${
                    design.quantity
                },${design.revenue.toFixed(2)}\r\n`;
            });
            csvContent += "\r\n";

            // Add sales by date
            csvContent += "Sales By Date\r\n";
            csvContent += "Date,Orders,Revenue\r\n";
            reportData.salesByDate.forEach((item: SalesByDate) => {
                csvContent += `${item.date},${
                    item.orders
                },${item.revenue.toFixed(2)}\r\n`;
            });
            csvContent += "\r\n";

            // Add sales by designer
            csvContent += "Sales By Designer\r\n";
            csvContent += "Designer ID,Designer Name,Orders,Revenue\r\n";
            reportData.salesByDesigner.forEach((item: SalesByDesigner) => {
                // Escape commas in designer name
                const safeDesignerName = `"${item.designerName.replace(
                    /"/g,
                    '""'
                )}"`;

                csvContent += `${item.designerId},${safeDesignerName},${
                    item.orders
                },${item.revenue.toFixed(2)}\r\n`;
            });

            // Create download link
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute(
                "download",
                `sales_report_${new Date().toISOString().split("T")[0]}.csv`
            );
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show success message
            toast({
                title: "CSV Exported",
                description: "Sales report has been downloaded as CSV.",
                variant: "default",
            });
        } catch (error) {
            console.error("CSV export error:", error);
            toast({
                title: "Export Failed",
                description: "Failed to generate CSV. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Export report as PDF with enhanced styling
    const exportReportPDF = () => {
        if (!reportData) return;

        try {
            // Create new PDF document
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const primaryColor = [139, 92, 246] as [number, number, number]; // Purple color in RGB

            // Add custom header with logo-like styling
            doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.rect(0, 0, pageWidth, 25, "F");

            // Add title
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text("Custom Thread Sales Report", pageWidth / 2, 15, {
                align: "center",
            });

            // Add report metadata section
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");

            // Add report generation info box
            doc.setDrawColor(220, 220, 220);
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(10, 30, pageWidth - 20, 25, 2, 2, "FD");

            doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 40);
            doc.text(
                `Period: ${filters.startDate} to ${filters.endDate}`,
                15,
                47
            );

            if (filters.designerId) {
                const designerName =
                    designers.find((d) => d.id === filters.designerId)?.name ||
                    filters.designerId;
                doc.text(`Designer: ${designerName}`, 15, 54);
            } else {
                doc.text("Designer: All Designers", 15, 54);
            }

            // Summary table with improved styling
            autoTable(doc, {
                startY: 65,
                head: [["Total Sales", "Total Revenue", "Average Order Value"]],
                body: [
                    [
                        reportData.totalSales.toString(),
                        `$${reportData.totalRevenue.toFixed(2)}`,
                        `$${reportData.averageOrderValue.toFixed(2)}`,
                    ],
                ],
                theme: "grid",
                headStyles: {
                    fillColor: primaryColor,
                    fontSize: 12,
                    fontStyle: "bold",
                    halign: "center",
                },
                bodyStyles: {
                    fontSize: 11,
                    halign: "center",
                },
                styles: {
                    cellPadding: 5,
                },
                columnStyles: {
                    0: { halign: "center" },
                    1: { halign: "center" },
                    2: { halign: "center" },
                },
            });

            // Section title for top designs
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("Top Selling Designs", 14, 95);

            // Top selling designs table
            autoTable(doc, {
                startY: 100,
                head: [["Title", "Designer", "Quantity", "Revenue"]],
                body: reportData.topSellingDesigns.map((design) => [
                    design.title,
                    design.designer,
                    design.quantity.toString(),
                    `$${design.revenue.toFixed(2)}`,
                ]),
                theme: "grid",
                headStyles: {
                    fillColor: primaryColor,
                    fontSize: 11,
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252],
                },
                columnStyles: {
                    0: { cellWidth: "auto" },
                    1: { cellWidth: "auto" },
                    2: { cellWidth: 30, halign: "center" },
                    3: { cellWidth: 40, halign: "right" },
                },
            });

            // Add a new page for more tables
            doc.addPage();

            // Add header to new page
            doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.rect(0, 0, pageWidth, 25, "F");
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text("Sales Details", pageWidth / 2, 15, { align: "center" });

            // Section title for sales by date
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("Sales by Date", 14, 35);

            // Sales by date table
            autoTable(doc, {
                startY: 40,
                head: [["Date", "Orders", "Revenue"]],
                body: reportData.salesByDate.map((item) => [
                    item.date,
                    item.orders.toString(),
                    `$${item.revenue.toFixed(2)}`,
                ]),
                theme: "grid",
                headStyles: {
                    fillColor: primaryColor,
                    fontSize: 11,
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252],
                },
                columnStyles: {
                    0: { cellWidth: "auto" },
                    1: { cellWidth: 40, halign: "center" },
                    2: { cellWidth: 50, halign: "right" },
                },
            });

            // Section title for sales by designer
            const salesByDateTableHeight =
                reportData.salesByDate.length * 10 + 20; // Estimate table height
            const designerSectionY = Math.min(
                40 + salesByDateTableHeight + 20,
                pageHeight - 100
            );

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
            doc.text("Sales by Designer", 14, designerSectionY);

            // Sales by designer table
            autoTable(doc, {
                startY: designerSectionY + 5,
                head: [
                    ["Designer Name", "Orders", "Revenue", "Avg. Per Order"],
                ],
                body: reportData.salesByDesigner.map((item) => [
                    item.designerName,
                    item.orders.toString(),
                    `$${item.revenue.toFixed(2)}`,
                    `$${(item.revenue / item.orders).toFixed(2)}`,
                ]),
                theme: "grid",
                headStyles: {
                    fillColor: primaryColor,
                    fontSize: 11,
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252],
                },
                columnStyles: {
                    0: { cellWidth: "auto" },
                    1: { cellWidth: 40, halign: "center" },
                    2: { cellWidth: 50, halign: "right" },
                    3: { cellWidth: 50, halign: "right" },
                },
            });

            // Add footer to all pages
            // @ts-expect-error - TypeScript doesn't know about internal methods
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);

                // Add footer line
                doc.setDrawColor(220, 220, 220);
                doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);

                // Add footer text
                doc.setFontSize(8);
                doc.setTextColor(100, 100, 100);
                doc.text(
                    `Page ${i} of ${pageCount} - Generated on ${new Date().toLocaleDateString()}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: "center" }
                );
            }

            // Save the PDF
            doc.save(
                `custom_thread_sales_report_${
                    new Date().toISOString().split("T")[0]
                }.pdf`
            );

            // Show success message
            toast({
                title: "PDF Exported",
                description: "Sales report has been downloaded as PDF.",
                variant: "default",
            });
        } catch (error) {
            console.error("PDF generation error:", error);
            toast({
                title: "Export Failed",
                description: "Failed to generate PDF. Please try again.",
                variant: "destructive",
            });
        }
    };

    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(value);
    };

    // Password-related handlers temporarily commented out for development

    const handlePasswordSuccess = () => {
        setIsAuthenticated(true);
        setShowPasswordModal(false);
    };

    const handlePasswordModalClose = () => {
        if (!isAuthenticated) {
            // If they close without authenticating, redirect away
            navigate("/");
        }
        setShowPasswordModal(false);
    };

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="container mx-auto py-10 px-4">
            {/* Password Modal - Temporarily disabled for development */}
            <AdminPasswordModal
                isOpen={showPasswordModal}
                onClose={handlePasswordModalClose}
                onSuccess={handlePasswordSuccess}
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Sales Reports</h1>
                    <div className="flex items-center gap-2">
                        <p className="text-muted-foreground mt-1">
                            Analyze sales performance and trends
                        </p>
                        {!isOnline && (
                            <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-xs mt-1">
                                <WifiOff className="h-3 w-3" />
                                <span>Offline Mode</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                    <Button
                        variant="outline"
                        onClick={exportReportCSV}
                        disabled={!reportData || isLoading || !isAuthenticated}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                    <Button
                        variant="outline"
                        onClick={exportReportPDF}
                        disabled={!reportData || isLoading || !isAuthenticated}
                    >
                        <FileText className="mr-2 h-4 w-4" />
                        Export PDF
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => loadReportData()}
                        disabled={isLoading || !isAuthenticated}
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCw className="mr-2 h-4 w-4" />
                        )}
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="mb-8">
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                        <Filter className="mr-2 h-4 w-4" />
                        Report Filters
                    </CardTitle>
                    <CardDescription>
                        Filter sales data by date range, designer, or design
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                id="startDate"
                                type="date"
                                value={filters.startDate}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "startDate",
                                        e.target.value
                                    )
                                }
                                disabled={!isAuthenticated}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                                id="endDate"
                                type="date"
                                value={filters.endDate}
                                onChange={(e) =>
                                    handleFilterChange(
                                        "endDate",
                                        e.target.value
                                    )
                                }
                                disabled={!isAuthenticated}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="designerId">Designer</Label>
                            <Select
                                value={filters.designerId}
                                onValueChange={(value) =>
                                    handleFilterChange("designerId", value)
                                }
                                disabled={!isAuthenticated}
                            >
                                <SelectTrigger id="designerId">
                                    <SelectValue placeholder="All Designers" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Designers
                                    </SelectItem>
                                    {designers.map((designer) => (
                                        <SelectItem
                                            key={designer.id}
                                            value={designer.id}
                                        >
                                            {designer.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end gap-2">
                            <Button
                                onClick={applyFilters}
                                className="flex-1"
                                disabled={!isAuthenticated}
                            >
                                Apply Filters
                            </Button>
                            <Button
                                variant="outline"
                                onClick={resetFilters}
                                className="flex-1"
                                disabled={!isAuthenticated}
                            >
                                Reset
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-lg">Loading report data...</span>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                className="h-5 w-5 text-red-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Error loading report data
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>
                                    {error instanceof Error
                                        ? error.message
                                        : String(error)}
                                </p>
                            </div>
                            <div className="mt-4">
                                <Button
                                    size="sm"
                                    onClick={() => loadReportData()}
                                    variant="outline"
                                >
                                    Try Again
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : reportData ? (
                <>
                    {/* Report Tabs */}
                    <Tabs
                        defaultValue="overview"
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="mb-8"
                    >
                        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="products">Products</TabsTrigger>
                            <TabsTrigger value="designers">
                                Designers
                            </TabsTrigger>
                        </TabsList>

                        {/* Overview Tab */}
                        <TabsContent value="overview">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Summary Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-purple-50 to-white">
                                        <div className="h-1 bg-purple-500"></div>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Total Sales
                                                    </p>
                                                    <h3 className="text-3xl font-bold mt-1 text-purple-700">
                                                        {reportData?.totalSales ??
                                                            0}
                                                    </h3>
                                                </div>
                                                <div className="h-14 w-14 bg-purple-100 rounded-full flex items-center justify-center shadow-sm">
                                                    <ShoppingBag className="h-7 w-7 text-purple-600" />
                                                </div>
                                            </div>
                                            <div className="mt-6 text-xs text-muted-foreground flex items-center">
                                                <Calendar className="h-3 w-3 mr-1 text-purple-400" />
                                                <span>
                                                    {filters.startDate
                                                        ? new Date(
                                                              filters.startDate
                                                          ).toLocaleDateString()
                                                        : ""}{" "}
                                                    to{" "}
                                                    {filters.endDate
                                                        ? new Date(
                                                              filters.endDate
                                                          ).toLocaleDateString()
                                                        : ""}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-pink-50 to-white">
                                        <div className="h-1 bg-pink-500"></div>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Total Revenue
                                                    </p>
                                                    <h3 className="text-3xl font-bold mt-1 text-pink-700">
                                                        {formatCurrency(
                                                            reportData?.totalRevenue ??
                                                                0
                                                        )}
                                                    </h3>
                                                </div>
                                                <div className="h-14 w-14 bg-pink-100 rounded-full flex items-center justify-center shadow-sm">
                                                    <DollarSign className="h-7 w-7 text-pink-600" />
                                                </div>
                                            </div>
                                            <div className="mt-6 text-xs text-muted-foreground flex items-center">
                                                <Calendar className="h-3 w-3 mr-1 text-pink-400" />
                                                <span>
                                                    {filters.startDate
                                                        ? new Date(
                                                              filters.startDate
                                                          ).toLocaleDateString()
                                                        : ""}{" "}
                                                    to{" "}
                                                    {filters.endDate
                                                        ? new Date(
                                                              filters.endDate
                                                          ).toLocaleDateString()
                                                        : ""}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-blue-50 to-white">
                                        <div className="h-1 bg-blue-500"></div>
                                        <CardContent className="pt-6">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">
                                                        Average Order Value
                                                    </p>
                                                    <h3 className="text-3xl font-bold mt-1 text-blue-700">
                                                        {formatCurrency(
                                                            reportData?.averageOrderValue ??
                                                                0
                                                        )}
                                                    </h3>
                                                </div>
                                                <div className="h-14 w-14 bg-blue-100 rounded-full flex items-center justify-center shadow-sm">
                                                    <TrendingUp className="h-7 w-7 text-blue-600" />
                                                </div>
                                            </div>
                                            <div className="mt-6 text-xs text-muted-foreground flex items-center">
                                                <Calendar className="h-3 w-3 mr-1 text-blue-400" />
                                                <span>
                                                    {filters.startDate
                                                        ? new Date(
                                                              filters.startDate
                                                          ).toLocaleDateString()
                                                        : ""}{" "}
                                                    to{" "}
                                                    {filters.endDate
                                                        ? new Date(
                                                              filters.endDate
                                                          ).toLocaleDateString()
                                                        : ""}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Sales Trend Chart */}
                                <SalesTrendChart
                                    data={reportData?.salesByDate || []}
                                />
                            </motion.div>
                        </TabsContent>

                        {/* Products Tab */}
                        <TabsContent value="products">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <TopSellingDesignsChart
                                    designs={
                                        reportData?.topSellingDesigns || []
                                    }
                                />
                            </motion.div>
                        </TabsContent>

                        {/* Designers Tab */}
                        <TabsContent value="designers">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <DesignerPerformanceChart
                                    designers={
                                        reportData?.salesByDesigner || []
                                    }
                                />
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                            No Report Data
                        </h3>
                        <p className="text-muted-foreground text-center max-w-md mb-4">
                            Apply filters and generate a report to see sales
                            analytics and performance metrics.
                        </p>
                        <Button onClick={() => loadReportData()}>
                            Generate Report
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
