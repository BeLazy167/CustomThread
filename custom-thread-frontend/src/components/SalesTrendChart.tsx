import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    TooltipProps,
} from "recharts";
import { SalesByDate } from "@/hooks/useSalesReport";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface SalesTrendChartProps {
    data: SalesByDate[];
}

// Custom tooltip component for better formatting
const CustomTooltip = ({
    active,
    payload,
    label,
}: TooltipProps<number, string>) => {
    if (active && payload && payload.length >= 2) {
        // Make sure we have both data points (orders and revenue)
        const ordersValue =
            payload[0]?.value !== undefined ? payload[0].value : 0;
        const revenueValue =
            payload[1]?.value !== undefined ? payload[1].value : 0;

        return (
            <div className="bg-white p-4 border rounded-md shadow-md">
                <p className="font-medium text-sm mb-2">{label}</p>
                <div className="space-y-1">
                    <p className="text-sm">
                        <span className="inline-block w-3 h-3 rounded-full bg-purple-500 mr-2"></span>
                        Orders:{" "}
                        <span className="font-medium">{ordersValue}</span>
                    </p>
                    <p className="text-sm">
                        <span className="inline-block w-3 h-3 rounded-full bg-pink-500 mr-2"></span>
                        Revenue:{" "}
                        <span className="font-medium">
                            $
                            {typeof revenueValue === "number"
                                ? revenueValue.toFixed(2)
                                : "0.00"}
                        </span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

export function SalesTrendChart({ data }: SalesTrendChartProps) {
    const [chartType, setChartType] = useState<"area" | "bar">("area");

    // Format dates for better display and handle empty data
    const formattedData = (data || []).map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
    }));

    // If no data, show placeholder message
    if (!data || data.length === 0) {
        return (
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Sales Trend</CardTitle>
                    <CardDescription>
                        Revenue and order count over time
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10">
                    <p className="text-muted-foreground text-center">
                        No sales data available for the selected period.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mb-8">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Sales Trend</CardTitle>
                        <CardDescription>
                            Revenue and order count over time
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant={
                                chartType === "area" ? "default" : "outline"
                            }
                            onClick={() => setChartType("area")}
                        >
                            Area
                        </Button>
                        <Button
                            size="sm"
                            variant={
                                chartType === "bar" ? "default" : "outline"
                            }
                            onClick={() => setChartType("bar")}
                        >
                            Bar
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === "area" ? (
                            <AreaChart
                                data={formattedData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f0f0f0"
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    tickLine={{ stroke: "#f0f0f0" }}
                                    axisLine={{ stroke: "#f0f0f0" }}
                                />
                                <YAxis
                                    yAxisId="left"
                                    tick={{ fontSize: 12 }}
                                    tickLine={{ stroke: "#f0f0f0" }}
                                    axisLine={{ stroke: "#f0f0f0" }}
                                    label={{
                                        value: "Orders",
                                        angle: -90,
                                        position: "insideLeft",
                                        style: {
                                            textAnchor: "middle",
                                            fontSize: 12,
                                            fill: "#8b5cf6",
                                        },
                                    }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    tick={{ fontSize: 12 }}
                                    tickLine={{ stroke: "#f0f0f0" }}
                                    axisLine={{ stroke: "#f0f0f0" }}
                                    label={{
                                        value: "Revenue ($)",
                                        angle: 90,
                                        position: "insideRight",
                                        style: {
                                            textAnchor: "middle",
                                            fontSize: 12,
                                            fill: "#ec4899",
                                        },
                                    }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    wrapperStyle={{ paddingTop: 10 }}
                                    iconType="circle"
                                />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="orders"
                                    name="Orders"
                                    stroke="#8b5cf6"
                                    fill="url(#colorOrders)"
                                    activeDot={{ r: 6 }}
                                    strokeWidth={2}
                                />
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="revenue"
                                    name="Revenue ($)"
                                    stroke="#ec4899"
                                    fill="url(#colorRevenue)"
                                    activeDot={{ r: 6 }}
                                    strokeWidth={2}
                                />
                                <defs>
                                    <linearGradient
                                        id="colorOrders"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#8b5cf6"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#8b5cf6"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="colorRevenue"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#ec4899"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#ec4899"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        ) : (
                            <AreaChart
                                data={formattedData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f0f0f0"
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    tickLine={{ stroke: "#f0f0f0" }}
                                    axisLine={{ stroke: "#f0f0f0" }}
                                />
                                <YAxis
                                    yAxisId="left"
                                    tick={{ fontSize: 12 }}
                                    tickLine={{ stroke: "#f0f0f0" }}
                                    axisLine={{ stroke: "#f0f0f0" }}
                                    label={{
                                        value: "Orders",
                                        angle: -90,
                                        position: "insideLeft",
                                        style: {
                                            textAnchor: "middle",
                                            fontSize: 12,
                                            fill: "#8b5cf6",
                                        },
                                    }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    tick={{ fontSize: 12 }}
                                    tickLine={{ stroke: "#f0f0f0" }}
                                    axisLine={{ stroke: "#f0f0f0" }}
                                    label={{
                                        value: "Revenue ($)",
                                        angle: 90,
                                        position: "insideRight",
                                        style: {
                                            textAnchor: "middle",
                                            fontSize: 12,
                                            fill: "#ec4899",
                                        },
                                    }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    wrapperStyle={{ paddingTop: 10 }}
                                    iconType="circle"
                                />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="orders"
                                    name="Orders"
                                    stroke="#8b5cf6"
                                    fill="url(#colorOrders)"
                                    activeDot={{ r: 6 }}
                                    strokeWidth={2}
                                />
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="revenue"
                                    name="Revenue ($)"
                                    stroke="#ec4899"
                                    fill="url(#colorRevenue)"
                                    activeDot={{ r: 6 }}
                                    strokeWidth={2}
                                />
                                <defs>
                                    <linearGradient
                                        id="colorOrders"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#8b5cf6"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#8b5cf6"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                    <linearGradient
                                        id="colorRevenue"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#ec4899"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#ec4899"
                                            stopOpacity={0.1}
                                        />
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
