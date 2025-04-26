import { TopSellingDesign } from "@/hooks/useSalesReport";
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
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Chart colors
const COLORS = [
    "#8b5cf6",
    "#d946ef",
    "#ec4899",
    "#6366f1",
    "#0ea5e9",
    "#10b981",
];

interface TopSellingDesignsChartProps {
    designs: TopSellingDesign[];
}

// Format currency
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(value);
};

export function TopSellingDesignsChart({
    designs,
}: TopSellingDesignsChartProps) {
    const [chartType, setChartType] = useState<"pie" | "bar">("pie");

    // Handle empty data
    if (!designs || designs.length === 0) {
        return (
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Top Selling Designs</CardTitle>
                    <CardDescription>
                        Best performing designs by quantity sold
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10">
                    <p className="text-muted-foreground text-center">
                        No design sales data available for the selected period.
                    </p>
                </CardContent>
            </Card>
        );
    }

    // Take top 5 designs for the chart
    const topDesigns = designs.slice(0, 5);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
                <Card>
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
                                    <TableHead>Designer</TableHead>
                                    <TableHead className="text-right">
                                        Quantity
                                    </TableHead>
                                    <TableHead className="text-right">
                                        Revenue
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {designs.map((design: TopSellingDesign) => (
                                    <TableRow key={design.designId}>
                                        <TableCell className="font-medium">
                                            {design.title}
                                        </TableCell>
                                        <TableCell>{design.designer}</TableCell>
                                        <TableCell className="text-right">
                                            {design.quantity}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(design.revenue)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Sales Distribution</CardTitle>
                                <CardDescription>
                                    Top designs by percentage of sales
                                </CardDescription>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    size="sm"
                                    variant={
                                        chartType === "pie"
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => setChartType("pie")}
                                    className="h-8 px-2 text-xs"
                                >
                                    Pie
                                </Button>
                                <Button
                                    size="sm"
                                    variant={
                                        chartType === "bar"
                                            ? "default"
                                            : "outline"
                                    }
                                    onClick={() => setChartType("bar")}
                                    className="h-8 px-2 text-xs"
                                >
                                    Bar
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartType === "pie" ? (
                                    <PieChart>
                                        <Pie
                                            data={topDesigns}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="quantity"
                                            nameKey="title"
                                            label={({
                                                name,
                                                percent,
                                            }: {
                                                name: string;
                                                percent: number;
                                            }) =>
                                                `${name.substring(0, 10)}${
                                                    name.length > 10
                                                        ? "..."
                                                        : ""
                                                }: ${(percent * 100).toFixed(
                                                    0
                                                )}%`
                                            }
                                        >
                                            {topDesigns.map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(
                                                value,
                                                _name,
                                                props
                                            ) => {
                                                const formattedValue =
                                                    typeof value === "number"
                                                        ? formatCurrency(value)
                                                        : "N/A";
                                                const percentage = (
                                                    props.payload.percent * 100
                                                ).toFixed(1);
                                                return [
                                                    `${formattedValue} (${percentage}%)`,
                                                    props.payload.payload.title,
                                                ];
                                            }}
                                        />
                                    </PieChart>
                                ) : (
                                    <BarChart
                                        data={topDesigns}
                                        layout="vertical"
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            horizontal={true}
                                            vertical={false}
                                        />
                                        <XAxis type="number" />
                                        <YAxis
                                            type="category"
                                            dataKey="title"
                                            width={100}
                                            tick={(props) => {
                                                const { x, y, payload } = props;
                                                const title =
                                                    payload.value as string;
                                                const displayTitle =
                                                    title.length > 15
                                                        ? `${title.substring(
                                                              0,
                                                              15
                                                          )}...`
                                                        : title;

                                                return (
                                                    <text
                                                        x={x}
                                                        y={y}
                                                        dy={4}
                                                        textAnchor="end"
                                                        fill="#666"
                                                        fontSize={12}
                                                    >
                                                        {displayTitle}
                                                    </text>
                                                );
                                            }}
                                        />
                                        <Tooltip
                                            formatter={(value, name) => [
                                                name === "quantity"
                                                    ? value
                                                    : formatCurrency(
                                                          value as number
                                                      ),
                                                name === "quantity"
                                                    ? "Quantity"
                                                    : "Revenue",
                                            ]}
                                        />
                                        <Legend />
                                        <Bar
                                            dataKey="quantity"
                                            name="Quantity"
                                            fill="#8b5cf6"
                                            radius={[0, 4, 4, 0]}
                                        />
                                    </BarChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">
                                Top Performers
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {topDesigns.map((design, index) => (
                                    <Badge
                                        key={design.designId}
                                        variant="outline"
                                        className="flex items-center gap-1"
                                        style={{
                                            borderColor:
                                                COLORS[index % COLORS.length],
                                        }}
                                    >
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    COLORS[
                                                        index % COLORS.length
                                                    ],
                                            }}
                                        ></span>
                                        {design.title.substring(0, 15)}
                                        {design.title.length > 15 ? "..." : ""}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
