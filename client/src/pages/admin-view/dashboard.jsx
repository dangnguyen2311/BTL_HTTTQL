import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingBasket, Star } from "lucide-react";
import { fetchAllProducts } from "@/store/admin/products-slice";
import { fetchAllCombos } from "@/store/admin/combo-slice";

function AdminDashboard() {
    const dispatch = useDispatch();
    const { productList } = useSelector((state) => state.adminProducts);
    const { comboList } = useSelector((state) => state.adminCombo);
    const [stats, setStats] = useState({
        products: "Can't show",
        combos: "Can't show",
        reviews: "Can't show"
    });

    useEffect(() => {
        // Fetch data when component mounts
        dispatch(fetchAllProducts());
        dispatch(fetchAllCombos());
    }, [dispatch]);

    useEffect(() => {
        // Update stats when data is available
        if (productList) {
            setStats(prev => ({
                ...prev,
                products: productList.length
            }));
        }
        if (comboList) {
            setStats(prev => ({
                ...prev,
                combos: comboList.length
            }));
        }
    }, [productList, comboList]);

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid gap-4 md:grid-cols-3">
                {/* Products Stats */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <ShoppingBasket className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.products}</div>
                    </CardContent>
                </Card>

                {/* Combos Stats */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Combos</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.combos}</div>
                    </CardContent>
                </Card>

                {/* Reviews Stats */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.reviews}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default AdminDashboard;