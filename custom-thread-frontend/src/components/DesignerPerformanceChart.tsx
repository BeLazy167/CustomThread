import { SalesByDesigner } from "@/hooks/useSalesReport";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

// Chart colors
const COLORS = [
    "#8b5cf6",
    "#d946ef",
    "#ec4899",
    "#6366f1",
    "#0ea5e9",
    "#10b981",
    "#f59e0b",
    "#ef4444",
];

interface DesignerPerformanceChartProps {
    designers: SalesByDesigner[];
}

// Format currency
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);
};

export function DesignerPerformanceChart({
    designers,
}: DesignerPerformanceChartProps) {
    const [chartType, setChartType] = useState<"revenue" | "orders">("revenue");
    const [visualizationType, setVisualizationType] = useState<"bar" | "pie">(
        "bar"
    );

    // Handle empty data
    if (!designers || designers.length === 0) {
        return (
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Designer Performance</CardTitle>
                    <CardDescription>
                        Sales and revenue by designer
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10">
                    <p className="text-muted-foreground text-center">
                        No designer sales data available for the selected
                        period.
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Sort designers by the selected metric
    const sortedDesigners = [...designers].sort((a, b) =>
        chartType === "revenue" ? b.revenue - a.revenue : b.orders - a.orders
    );

    // Take top 8 designers for visualization
    const topDesigners = sortedDesigners.slice(0, 8);

    // Calculate average per order for each designer
    const designersWithAvg = topDesigners.map((designer) => ({
        ...designer,
        avgPerOrder:
            designer.orders > 0 ? designer.revenue / designer.orders : 0,
    }));

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Designer Performance</CardTitle>
                            <CardDescription>
                                Sales and revenue by designer
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <div className="bg-slate-100 rounded-md p-1 flex">
                                <Button
                                    size="sm"
                                    variant={
                                        chartType === "revenue"
                                            ? "default"
                                            : "ghost"
                                    }
                                    onClick={() => setChartType("revenue")}
                                    className="h-8 px-3 text-xs"
                                >
                                    Revenue
                                </Button>
                                <Button
                                    size="sm"
                                    variant={
                                        chartType === "orders"
                                            ? "default"
                                            : "ghost"
                                    }
                                    onClick={() => setChartType("orders")}
                                    className="h-8 px-3 text-xs"
                                >
                                    Orders
                                </Button>
                            </div>
                            <div className="bg-slate-100 rounded-md p-1 flex">
                                <Button
                                    size="sm"
                                    variant={
                                        visualizationType === "bar"
                                            ? "default"
                                            : "ghost"
                                    }
                                    onClick={() => setVisualizationType("bar")}
                                    className="h-8 px-3 text-xs"
                                >
                                    Bar
                                </Button>
                                <Button
                                    size="sm"
                                    variant={
                                        visualizationType === "pie"
                                            ? "default"
                                            : "ghost"
                                    }
                                    onClick={() => setVisualizationType("pie")}
                                    className="h-8 px-3 text-xs"
                                >
                                    Pie
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-80 mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            {visualizationType === "bar" ? (
                                <BarChart
                                    data={designersWithAvg}
                                    margin={{
                                        top: 20,
                                        right: 30,
                                        left: 20,
                                        bottom: 70,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#f0f0f0"
                                    />
                                    <XAxis
                                        dataKey="designerName"
                                        tick={{ fontSize: 12 }}
                                        tickLine={{ stroke: "#f0f0f0" }}
                                        axisLine={{ stroke: "#f0f0f0" }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={70}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        tickLine={{ stroke: "#f0f0f0" }}
                                        axisLine={{ stroke: "#f0f0f0" }}
                                        tickFormatter={(value) =>
                                            chartType === "revenue"
                                                ? `$${value}`
                                                : value.toString()
                                        }
                                    />
                                    <Tooltip
                                        formatter={(value) =>
                                            chartType === "revenue"
                                                ? formatCurrency(
                                                      value as number
                                                  )
                                                : value
                                        }
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey={chartType}
                                        name={
                                            chartType === "revenue"
                                                ? "Revenue"
                                                : "Orders"
                                        }
                                        fill="#8b5cf6"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            ) : (
                                <PieChart>
                                    <Pie
                                        data={designersWithAvg}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey={chartType}
                                        nameKey="designerName"
                                        label={({ name, percent }) =>
                                            `${name}: ${(percent * 100).toFixed(
                                                0
                                            )}%`
                                        }
                                    >
                                        {designersWithAvg.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value) =>
                                            chartType === "revenue"
                                                ? formatCurrency(
                                                      value as number
                                                  )
                                                : value
                                        }
                                    />
                                    <Legend />
                                </PieChart>
                            )}
                        </ResponsiveContainer>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Designer</TableHead>
                                <TableHead className="text-right">
                                    Orders
                                </TableHead>
                                <TableHead className="text-right">
                                    Revenue
                                </TableHead>
                                <TableHead className="text-right">
                                    Avg. Per Order
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {designers.map((designer) => (
                                <TableRow key={designer.designerId}>
                                    <TableCell className="font-medium">
                                        <Link
                                            to={`/reports/designers/${designer.designerId}`}
                                            className="text-primary hover:underline flex items-center"
                                        >
                                            {designer.designerName}
                                            <ExternalLink className="h-3 w-3 ml-1" />
                                        </Link>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {designer.orders}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(designer.revenue)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {formatCurrency(
                                            designer.orders > 0
                                                ? designer.revenue /
                                                      designer.orders
                                                : 0
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
