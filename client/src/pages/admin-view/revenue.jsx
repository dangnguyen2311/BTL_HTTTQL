import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { Fragment, useState } from "react";
import { getRevenueStatistics } from "@/services/api";
import { toast } from "sonner";

function RevenueStatistics() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statistics, setStatistics] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        dailyRevenue: {}
    });

    const handleGenerateStatistics = async () => {
        if (!startDate || !endDate) {
            toast.error("Please select both start and end dates");
            return;
        }

        try {
            setLoading(true);
            const response = await getRevenueStatistics(startDate, endDate);
            if (response.success) {
                setStatistics(response.data);
                toast.success("Statistics generated successfully");
            }
        } catch (error) {
            toast.error(error.message || "Failed to generate statistics");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-6">
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Revenue Statistics</CardTitle>
                    <CardDescription>
                        View revenue statistics within a specific date range
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-row space-x-4">
                            {/* Start Date Picker */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium">Start Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                !startDate && "text-muted-foreground"
                                            )}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {startDate ? format(startDate, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={startDate}
                                            onSelect={setStartDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            {/* End Date Picker */}
                            <div className="flex flex-col space-y-2">
                                <label className="text-sm font-medium">End Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                !endDate && "text-muted-foreground"
                                            )}
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            {endDate ? format(endDate, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={endDate}
                                            onSelect={setEndDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <Button 
                                className="self-end"
                                onClick={handleGenerateStatistics}
                                disabled={!startDate || !endDate || loading}
                            >
                                {loading ? "Loading..." : "Generate Statistics"}
                            </Button>
                        </div>

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-3 gap-4 mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Total Revenue</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {statistics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0 })} đ
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Total Orders</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {statistics.totalOrders}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Average Order Value</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {statistics.averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 0 })} đ
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Daily Revenue Chart */}
                        {Object.keys(statistics.dailyRevenue).length > 0 && (
                            <Card className="mt-6">
                                <CardHeader>
                                    <CardTitle>Daily Revenue</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        {/* TODO: Add chart component here */}
                                        <div className="grid grid-cols-7 gap-2">
                                            {Object.entries(statistics.dailyRevenue).map(([date, revenue]) => (
                                                <div key={date} className="text-center">
                                                    <p className="text-sm text-gray-500">{format(new Date(date), 'MMM dd')}</p>
                                                    <p className="font-semibold">{revenue.toFixed(0)} đ</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default RevenueStatistics; 