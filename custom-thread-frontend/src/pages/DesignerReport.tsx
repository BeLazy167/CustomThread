import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { reportApi, ReportFilters } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
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
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Download,
    FileText,
    Filter,
    Loader2,
    RefreshCw,
    TrendingUp,
    DollarSign,
    ShoppingBag,
    ArrowLeft,
    Palette,
} from "lucide-react";

export default function DesignerReport() {
    const { designerId } = useParams<{ designerId: string }>();
    const { user } = useUser();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [reportData, setReportData] = useState<any>(null);
    const [filters, setFilters] = useState<ReportFilters>({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
            .toISOString()
            .split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
    });
    const [hasAccess, setHasAccess] = useState(false);

    // Check if user has access to this report
    useEffect(() => {
        if (!designerId) {
            navigate("/");
            return;
        }

        const isAdmin = user?.publicMetadata?.role === "admin";
        const isOwnReport = user?.id === designerId;

        if (isAdmin || isOwnReport) {
            setHasAccess(true);
        } else {
            toast({
                title: "Access Denied",
                description: "You don't have permission to access this report.",
                variant: "destructive",
            });
            navigate("/");
        }
    }, [user, designerId, navigate, toast]);

    // Load report data
    const loadReportData = async () => {
        if (!hasAccess || !designerId) return;

        setIsLoading(true);
        try {
            const response = await reportApi.getDesignerReport(
                designerId,
                filters
            );
            setReportData(response.data);
        } catch (error) {
            toast({
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to load report data",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Load data on initial render and when filters change
    useEffect(() => {
        if (hasAccess && designerId) {
            loadReportData();
        }
    }, [hasAccess, designerId]);

    // Handle filter changes
    const handleFilterChange = (name: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Apply filters
    const applyFilters = () => {
        loadReportData();
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            startDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
                .toISOString()
                .split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
        });
    };

    // Export report as CSV
    const exportReportCSV = () => {
        if (!reportData) return;

        // Create CSV content
        let csvContent = "data:text/csv;charset=utf-8,";

        // Add header
        csvContent +=
            "Designer Report - " +
            (reportData.salesByDesigner?.[0]?.designerName || "Designer") +
            "\r\n";
        csvContent +=
            "Report Generated: " + new Date().toLocaleString() + "\r\n\r\n";

        // Add summary data
        csvContent += "Total Sales,Total Revenue,Average Order Value\r\n";
        csvContent += `${
            reportData.totalSales
        },${reportData.totalRevenue.toFixed(
            2
        )},${reportData.averageOrderValue.toFixed(2)}\r\n\r\n`;

        // Add designer metrics
        csvContent += "Designer Metrics\r\n";
        csvContent +=
            "Total Designs,Active Designs,Inactive Designs,Avg Revenue Per Design\r\n";
        csvContent += `${reportData.designerMetrics.totalDesigns},${
            reportData.designerMetrics.activeDesigns
        },${
            reportData.designerMetrics.inactiveDesigns
        },${reportData.designerMetrics.avgRevenuePerDesign.toFixed(2)}\r\n\r\n`;

        // Add top selling designs
        csvContent += "Top Selling Designs\r\n";
        csvContent += "Design ID,Title,Quantity,Revenue\r\n";
        reportData.topSellingDesigns.forEach((design: any) => {
            csvContent += `${design.designId},${design.title},${
                design.quantity
            },${design.revenue.toFixed(2)}\r\n`;
        });
        csvContent += "\r\n";

        // Add sales by date
        csvContent += "Sales By Date\r\n";
        csvContent += "Date,Orders,Revenue\r\n";
        reportData.salesByDate.forEach((item: any) => {
            csvContent += `${item.date},${item.orders},${item.revenue.toFixed(
                2
            )}\r\n`;
        });

        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute(
            "download",
            `designer_report_${designerId}_${
                new Date().toISOString().split("T")[0]
            }.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(value);
    };

    if (!hasAccess) {
        return null;
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <Button
                        variant="ghost"
                        className="mb-2 -ml-4 flex items-center text-muted-foreground"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold">Designer Report</h1>
                    <p className="text-muted-foreground mt-1">
                        {reportData?.salesByDesigner?.[0]?.designerName ||
                            "Designer"}{" "}
                        - Performance Analysis
                    </p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                    <Button
                        variant="outline"
                        onClick={exportReportCSV}
                        disabled={!reportData || isLoading}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                    <Button
                        variant="outline"
                        onClick={loadReportData}
                        disabled={isLoading}
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
                        Filter designer data by date range
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            />
                        </div>
                        <div className="flex items-end gap-2">
                            <Button onClick={applyFilters} className="flex-1">
                                Apply Filters
                            </Button>
                            <Button
                                variant="outline"
                                onClick={resetFilters}
                                className="flex-1"
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
            ) : reportData ? (
                <>
                    {/* Designer Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Total Sales
                                        </p>
                                        <h3 className="text-2xl font-bold mt-1">
                                            {reportData.totalSales}
                                        </h3>
                                    </div>
                                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <ShoppingBag className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Total Revenue
                                        </p>
                                        <h3 className="text-2xl font-bold mt-1">
                                            {formatCurrency(
                                                reportData.totalRevenue
                                            )}
                                        </h3>
                                    </div>
                                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <DollarSign className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Total Designs
                                        </p>
                                        <h3 className="text-2xl font-bold mt-1">
                                            {
                                                reportData.designerMetrics
                                                    .totalDesigns
                                            }
                                        </h3>
                                    </div>
                                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Palette className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Avg. Revenue Per Design
                                        </p>
                                        <h3 className="text-2xl font-bold mt-1">
                                            {formatCurrency(
                                                reportData.designerMetrics
                                                    .avgRevenuePerDesign
                                            )}
                                        </h3>
                                    </div>
                                    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <TrendingUp className="h-6 w-6 text-primary" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sales Trend Chart */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Sales Trend</CardTitle>
                            <CardDescription>
                                Revenue and order count over time
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={reportData.salesByDate}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis yAxisId="left" />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                        />
                                        <Tooltip
                                            formatter={(value: any) =>
                                                typeof value === "number"
                                                    ? value.toFixed(2)
                                                    : value
                                            }
                                        />
                                        <Legend />
                                        <Bar
                                            yAxisId="left"
                                            dataKey="orders"
                                            fill="#8b5cf6"
                                            name="Orders"
                                        />
                                        <Bar
                                            yAxisId="right"
                                            dataKey="revenue"
                                            fill="#ec4899"
                                            name="Revenue ($)"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Selling Designs */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Top Selling Designs</CardTitle>
                            <CardDescription>
                                Best performing designs by quantity sold
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Design</TableHead>
                                        <TableHead className="text-right">
                                            Quantity
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Revenue
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Avg. Price
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData.topSellingDesigns.map(
                                        (design: any) => (
                                            <TableRow key={design.designId}>
                                                <TableCell className="font-medium">
                                                    {design.title}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {design.quantity}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(
                                                        design.revenue
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatCurrency(
                                                        design.revenue /
                                                            design.quantity
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Design Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Design Activity</CardTitle>
                            <CardDescription>
                                Active vs. inactive designs
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="h-64">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        {
                                                            name: "Active Designs",
                                                            value: reportData
                                                                .designerMetrics
                                                                .activeDesigns,
                                                        },
                                                        {
                                                            name: "Inactive Designs",
                                                            value: reportData
                                                                .designerMetrics
                                                                .inactiveDesigns,
                                                        },
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    outerRadius={80}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                    label={({
                                                        name,
                                                        percent,
                                                    }: {
                                                        name: string;
                                                        percent: number;
                                                    }) =>
                                                        `${name}: ${(
                                                            percent * 100
                                                        ).toFixed(0)}%`
                                                    }
                                                >
                                                    <Cell fill="#8b5cf6" />
                                                    <Cell fill="#d1d5db" />
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-primary rounded-full mr-2"></div>
                                                <span className="font-medium">
                                                    Active Designs
                                                </span>
                                            </div>
                                            <p className="text-2xl font-bold mt-1">
                                                {
                                                    reportData.designerMetrics
                                                        .activeDesigns
                                                }
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Designs with sales in the
                                                selected period
                                            </p>
                                        </div>
                                        <div>
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                                                <span className="font-medium">
                                                    Inactive Designs
                                                </span>
                                            </div>
                                            <p className="text-2xl font-bold mt-1">
                                                {
                                                    reportData.designerMetrics
                                                        .inactiveDesigns
                                                }
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Designs with no sales in the
                                                selected period
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">
                            No Report Data
                        </h3>
                        <p className="text-muted-foreground text-center max-w-md mb-4">
                            Apply filters and generate a report to see designer
                            performance metrics.
                        </p>
                        <Button onClick={loadReportData}>
                            Generate Report
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
