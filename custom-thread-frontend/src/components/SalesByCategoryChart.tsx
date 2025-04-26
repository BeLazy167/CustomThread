import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { SalesByCategory } from "@/hooks/useSalesReport";

// Chart colors
const COLORS = [
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
  "#6366f1",
  "#0ea5e9",
  "#10b981",
];

interface SalesByCategoryChartProps {
  data?: SalesByCategory[];
}

export function SalesByCategoryChart({ data }: SalesByCategoryChartProps) {
  // Use actual data if available, otherwise generate mock data
  const categoryData = data || [
    { category: "T-Shirts", sales: 45, revenue: 2250 },
    { category: "Hoodies", sales: 30, revenue: 1800 },
    { category: "Pants", sales: 15, revenue: 900 },
    { category: "Accessories", sales: 10, revenue: 500 }
  ];
  
  return (
    <div className="h-80 flex flex-col md:flex-row items-center justify-center">
      <div className="w-full md:w-1/2 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="sales"
              nameKey="category"
              label={({ name, percent }) => 
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {categoryData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value} orders`, 'Sales']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="w-full md:w-1/2 h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="revenue"
              nameKey="category"
              label={({ name, percent }) => 
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {categoryData.map((_, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`$${value}`, 'Revenue']}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
