import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

// Initial state for user details view
const initialUserDetails = {
    id: "",
    name: "",
    email: "",
    role: "",
    createdAt: "",
    orders: [],
};

function AdminUsers() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [openUserDetailsDialog, setOpenUserDetailsDialog] = useState(false);
    const [userList, setUserList] = useState([
        // Temporary mock data - replace with actual data from your API
        {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            role: "customer",
            createdAt: "2024-03-20",
            orders: [
                { id: "ord1", total: 99.99, status: "delivered" },
                { id: "ord2", total: 149.99, status: "processing" },
            ],
        },
        // Add more mock users as needed
    ]);

    const dispatch = useDispatch();
    const { toast } = useToast();

    // Function to handle viewing user details
    const handleViewUserDetails = (user) => {
        setSelectedUser(user);
        setOpenUserDetailsDialog(true);
    };

    // Function to handle adding new user
    const handleAddNewUser = () => {
        // TODO: Implement add new user functionality
        toast({
            title: "Add New User",
            description: "This feature will be implemented soon.",
        });
    };

    // Function to handle deleting a user
    const handleDeleteUser = (userId) => {
        // TODO: Implement delete user functionality
        setUserList((prevUsers) => prevUsers.filter((user) => user.id !== userId));
        toast({
            title: "User Deleted",
            description: "User has been successfully removed.",
        });
    };

    // useEffect(() => {
    //     // TODO: Fetch users from your API
    //     // dispatch(fetchAllUsers());
    // }, [dispatch]);

    return (
        <Fragment>
            <div className="container mx-auto py-6">
                <Card className="mb-6">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Users Management</CardTitle>
                            <CardDescription>
                                View and manage all registered users in the system
                            </CardDescription>
                        </div>
                        <Button onClick={handleAddNewUser}>Add New User</Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Joined Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userList.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell className="capitalize">
                                            {user.role}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="space-x-2">
                                            <Button
                                                variant="outline"
                                                onClick={() => handleViewUserDetails(user)}
                                            >
                                                View Details
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => handleDeleteUser(user.id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* User Details Dialog */}
            <Sheet
                open={openUserDetailsDialog}
                onOpenChange={() => {
                    setOpenUserDetailsDialog(false);
                    setSelectedUser(null);
                }}
            >
                <SheetContent side="right" className="overflow-auto w-[400px]">
                    <SheetHeader>
                        <SheetTitle>User Details</SheetTitle>
                    </SheetHeader>
                    {selectedUser && (
                        <div className="py-6">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium">Personal Information</h3>
                                    <p>Name: {selectedUser.name}</p>
                                    <p>Email: {selectedUser.email}</p>
                                    <p className="capitalize">Role: {selectedUser.role}</p>
                                    <p>Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium mb-2">Order History</h3>
                                    <div className="space-y-2">
                                        {selectedUser.orders.map((order) => (
                                            <div
                                                key={order.id}
                                                className="border p-2 rounded-md"
                                            >
                                                <p>Order ID: {order.id}</p>
                                                <p>Total: ${order.total}</p>
                                                <p className="capitalize">
                                                    Status: {order.status}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </Fragment>
    );
}

export default AdminUsers;
