import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchRatingStats,
    fetchProductRatingStats,
    clearProductStats,
    fetchProductsList
} from "@/store/rating-slice";

function AdminRatingAnalysis() {
    const dispatch = useDispatch();
    const {
        overallStats,
        productStats,
        productsList,
        loading,
        error
    } = useSelector((state) => state.rating);

    useEffect(() => {
        console.log('Component mounted, dispatching actions...');
        dispatch(fetchRatingStats());
        dispatch(fetchProductsList());
        return () => {
            dispatch(clearProductStats());
        };
    }, [dispatch]);

    useEffect(() => {
        console.log('Products list updated:', productsList);
    }, [productsList]);

    const handleProductSelect = (productId) => {
        console.log('Selected product ID:', productId);
        if (productId) {
            dispatch(fetchProductRatingStats(productId));
        } else {
            dispatch(clearProductStats());
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen text-red-500">Error: {error}</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Rating Analysis</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Product Rating Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4">
                            <Select onValueChange={handleProductSelect}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {productsList.map((product) => (
                                        <SelectItem key={product.id} value={product.id}>
                                            {product.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {productStats && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-semibold">{productStats.product.name}</h3>
                                    <div className="text-right">
                                        <div>Average Rating: {productStats.product.averageRating.toFixed(1)} ⭐</div>
                                        <div className="text-sm text-gray-500">
                                            Total Reviews: {productStats.product.totalReviews}
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={productStats.distribution}>
                                            <XAxis dataKey="rating" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#8884d8" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="mt-4">
                                    <h4 className="font-semibold mb-2">Recent Reviews</h4>
                                    <div className="space-y-3">
                                        {productStats.recentReviews.map((review, index) => (
                                            <div key={index} className="border-b pb-2">
                                                <div className="flex justify-between">
                                                    <span className="font-medium">{review.userName}</span>
                                                    <span>{review.rating} ⭐</span>
                                                </div>
                                                <p className="text-sm text-gray-500">{review.comment}</p>
                                                <p className="text-xs text-gray-400">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Overall Rating Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={overallStats.distribution}>
                                    <XAxis dataKey="rating" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Rated Products</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {overallStats.topRated?.map((product) => (
                                <div
                                    key={product._id}
                                    className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
                                    onClick={() => handleProductSelect(product._id)}
                                >
                                    <span className="font-medium">{product.name}</span>
                                    <span className="flex items-center">
                                        {product.averageRating.toFixed(1)} ⭐
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {overallStats.recentReviews?.map((review) => (
                                <div key={review._id} className="space-y-1">
                                    <div className="flex justify-between">
                                        <span className="font-medium">{review.productName}</span>
                                        <span>{review.rating} ⭐</span>
                                    </div>
                                    <p className="text-sm text-gray-500">{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default AdminRatingAnalysis; 