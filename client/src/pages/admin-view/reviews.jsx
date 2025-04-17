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
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";

function AdminReviews() {
    const [selectedReview, setSelectedReview] = useState(null);
    const [openReviewDetailsDialog, setOpenReviewDetailsDialog] = useState(false);
    const [reviewList, setReviewList] = useState([
        // Temporary mock data - replace with actual data from your API
        {
            id: "1",
            productId: "prod1",
            productName: "Gaming Laptop XYZ",
            rating: 4,
            comment: "Great product, excellent performance and good value for money.",
            userName: "John Doe",
            userEmail: "john@example.com",
            createdAt: "2024-03-20",
            status: "published",
        },
        {
            id: "2",
            productId: "prod2",
            productName: "Wireless Mouse ABC",
            rating: 5,
            comment: "Perfect mouse for gaming, very responsive and comfortable.",
            userName: "Jane Smith",
            userEmail: "jane@example.com",
            createdAt: "2024-03-19",
            status: "published",
        },
    ]);

    const dispatch = useDispatch();
    const { toast } = useToast();

    // Function to handle viewing review details
    const handleViewReviewDetails = (review) => {
        setSelectedReview(review);
        setOpenReviewDetailsDialog(true);
    };

    // Function to render star rating
    const renderStarRating = (rating) => {
        return (
            <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, index) => (
                    <span key={index}>
                        {index < rating ? (
                            <StarFilledIcon className="w-4 h-4 text-yellow-400" />
                        ) : (
                            <StarIcon className="w-4 h-4 text-gray-300" />
                        )}
                    </span>
                ))}
            </div>
        );
    };

    // Function to format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // useEffect(() => {
    //     // TODO: Fetch reviews from your API
    //     // dispatch(fetchAllReviews());
    // }, [dispatch]);

    return (
        <Fragment>
            <div className="container mx-auto py-6">
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Reviews Management</CardTitle>
                        <CardDescription>
                            View and manage product reviews from customers
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reviewList.map((review) => (
                                    <TableRow key={review.id}>
                                        <TableCell>{review.productName}</TableCell>
                                        <TableCell>
                                            {renderStarRating(review.rating)}
                                        </TableCell>
                                        <TableCell>{review.userName}</TableCell>
                                        <TableCell>
                                            {formatDate(review.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                review.status === 'published' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {review.status}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleViewReviewDetails(review)}
                                            >
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Review Details Dialog */}
            <Sheet
                open={openReviewDetailsDialog}
                onOpenChange={() => {
                    setOpenReviewDetailsDialog(false);
                    setSelectedReview(null);
                }}
            >
                <SheetContent side="right" className="overflow-auto w-[400px]">
                    <SheetHeader>
                        <SheetTitle>Review Details</SheetTitle>
                    </SheetHeader>
                    {selectedReview && (
                        <div className="py-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <h3 className="font-medium">Product Information</h3>
                                    <p className="text-sm">Name: {selectedReview.productName}</p>
                                    <p className="text-sm">Product ID: {selectedReview.productId}</p>
                                </div>
                                
                                <div className="space-y-2">
                                    <h3 className="font-medium">Review Details</h3>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm">Rating:</span>
                                        {renderStarRating(selectedReview.rating)}
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <p className="text-sm italic">"{selectedReview.comment}"</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-medium">Reviewer Information</h3>
                                    <p className="text-sm">Name: {selectedReview.userName}</p>
                                    <p className="text-sm">Email: {selectedReview.userEmail}</p>
                                    <p className="text-sm">Posted: {formatDate(selectedReview.createdAt)}</p>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="font-medium">Status</h3>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            selectedReview.status === 'published' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {selectedReview.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-x-2">
                                    <Button 
                                        variant={selectedReview.status === 'published' ? 'destructive' : 'default'}
                                        className="w-full"
                                    >
                                        {selectedReview.status === 'published' ? 'Unpublish Review' : 'Publish Review'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </Fragment>
    );
}

export default AdminReviews;
