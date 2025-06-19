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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar, Eye } from "lucide-react";
import { format } from "date-fns";
import { Fragment, useState, useEffect } from "react";
import { getRevenueStatistics } from "@/services/api";
// import { toast } from "sonner";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import {
    getOrderDetailsForAdmin,
    resetOrderDetails,
} from "@/store/admin/order-slice";
import AdminOrderDetailsView from "@/components/admin-view/order-details";

function RevenueStatistics() {
    const [startDate, setStartDate] = useState(null);
    const {toast} = useToast();
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statistics, setStatistics] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        dailyRevenue: {},
        orders: []
    });
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { orderDetails } = useSelector((state) => state.adminOrder);
    const dispatch = useDispatch();

    const handleGenerateStatistics = async () => {
        console.log("Clicked generate");
        if (!startDate || !endDate) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please select both start and end dates"
            });
            return;
        }
        console.log("Start:", startDate, "End:", endDate); 
        
        // Compare dates directly since they are already Date objects
        if (startDate > endDate) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Start date cannot be greater than end date"
            });
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

    const handleViewOrderDetails = (orderId) => {
        dispatch(getOrderDetailsForAdmin(orderId));
    };

    useEffect(() => {
        if (orderDetails !== null) {
            setOpenDetailsDialog(true);
        }
    }, [orderDetails]);

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

            {/* Orders List */}
            <Card>
                <CardHeader>
                    <CardTitle>Orders List</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Order Date</TableHead>
                                <TableHead>Order Status</TableHead>
                                <TableHead>Order Price</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {statistics.orders && statistics.orders.length > 0 ? (
                                statistics.orders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell>{order._id}</TableCell>
                                        <TableCell>{format(new Date(order.orderDate), 'PPP')}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={`py-1 px-3 ${
                                                    order.orderStatus === "delivered"
                                                        ? "bg-green-500"
                                                        : order.orderStatus === "cancelled"
                                                        ? "bg-red-600"
                                                        : "bg-yellow-500"
                                                }`}
                                            >
                                                {order.orderStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{order.totalAmount.toLocaleString('en-US')} đ</TableCell>
                                        <TableCell>
                                            <Dialog
                                                open={openDetailsDialog}
                                                onOpenChange={() => {
                                                    setOpenDetailsDialog(false);
                                                    dispatch(resetOrderDetails());
                                                }}
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleViewOrderDetails(order._id)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <AdminOrderDetailsView orderDetails={orderDetails} />
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        No orders found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default RevenueStatistics; 