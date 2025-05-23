import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
    Airplay,
    BabyIcon,
    CakeSlice,
    ChefHat,
    ChevronLeftIcon,
    ChevronRightIcon,
    CloudLightning,
    Drumstick,
    IceCreamCone,
    Pizza,
    Heater,
    Images,
    Shirt,
    ShirtIcon,
    ShoppingBasket,
    UmbrellaIcon,
    WashingMachine,
    WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllFilteredProducts,
    fetchProductDetails,
    fetchRecommendedProductsCollaborativeFiltering,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import ShoppingComboTile from "@/components/shopping-view/combo-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import { fetchAllCombos } from "@/store/admin/combo-slice";
import ComboDetailsDialog from "@/components/shopping-view/combo-details";

const categoriesWithIcon = [

    { id: "fried-chicken", label: "Gà rán", icon: Drumstick },
    { id: "pizza", label: "Pizza", icon: Pizza },
    { id: "noodle", label: "Mỳ Ý", icon: ChefHat },
    { id: "dessert", label: "Món tráng miệng", icon: CakeSlice },
    { id: "icecream", label: "Kem", icon: IceCreamCone },
    { id: "drink", label: "Thức uống", icon: UmbrellaIcon },
];

// const brandsWithIcon = [
//     { id: "nike", label: "Nike", icon: Shirt },
//     { id: "adidas", label: "Adidas", icon: WashingMachine },
//     { id: "puma", label: "Puma", icon: ShoppingBasket },
//     { id: "levi", label: "Levi's", icon: Airplay },
//     { id: "zara", label: "Zara", icon: Images },
//     { id: "h&m", label: "H&M", icon: Heater },
// ];
function ShoppingHome() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const { productList, productDetails } = useSelector(
        (state) => state.shopProducts
    );
    const { comboList } = useSelector((state) => state.adminCombo);
    const { featureImageList } = useSelector((state) => state.commonFeature);
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [openComboDetailsDialog, setOpenComboDetailsDialog] = useState(false);
    const [selectedCombo, setSelectedCombo] = useState(null);

    function handleNavigateToListingPage(getCurrentItem, section) {
        sessionStorage.removeItem("filters");
        const currentFilter = {
            [section]: [getCurrentItem.id],
        };

        sessionStorage.setItem("filters", JSON.stringify(currentFilter));
        navigate(`/shop/listing`);
    }

    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId));
    }

    function handleAddtoCart(getCurrentProductId) {
        dispatch(
            addToCart({
                userId: user?.id,
                productId: getCurrentProductId,
                quantity: 1,
            })
        ).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                toast({
                    title: "Product is added to cart",
                });
            }
        });
    }

    function handleGetComboDetails(getCurrentComboId) {
        const combo = comboList.find(c => c._id === getCurrentComboId);
        if (combo) {
            setSelectedCombo(combo);
            setOpenComboDetailsDialog(true);
        }
    }

    function handleAddComboToCart(getCurrentComboId) {
        dispatch(
            addToCart({
                userId: user?.id,
                productId: getCurrentComboId,
                quantity: 1,
                isCombo: true
            })
        ).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                toast({
                    title: "Combo is added to cart",
                });
            }
        });
    }

    useEffect(() => {
        if (productDetails !== null) setOpenDetailsDialog(true);
    }, [productDetails]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
        }, 15000);

        return () => clearInterval(timer);
    }, [featureImageList]);

    useEffect(() => {
        dispatch(fetchAllCombos());
        dispatch(getFeatureImages());
        if (user?.id) {
            dispatch(fetchRecommendedProductsCollaborativeFiltering(user.id));
        } else {
            console.log("No user ID available, skipping recommendation fetch");
        }
    }, [dispatch, user]);

    // useEffect(() => {
    //     console.log("Recommended Products:", recommendedProducts);
    //     console.log("Is Loading:", isLoading);
    // }, [recommendedProducts, isLoading]);

    return (
        <div className="flex flex-col min-h-screen">

            {/* <div className="relative w-full h-[600px] overflow-hidden">

                {featureImageList && featureImageList.length > 0
                    ? featureImageList.map((slide, index) => (
                        <img
                            src={slide?.image}
                            key={index}
                            className={`${index === currentSlide ? "opacity-100" : "opacity-0"
                                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
                        />
                    ))
                    : null}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                        setCurrentSlide(
                            (prevSlide) =>
                                (prevSlide - 1 + featureImageList.length) %
                                featureImageList.length
                        )
                    }
                    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
                >
                    <ChevronLeftIcon className="w-4 h-4" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                        setCurrentSlide(
                            (prevSlide) => (prevSlide + 1) % featureImageList.length
                        )
                    }
                    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
                >
                    <ChevronRightIcon className="w-4 h-4" />
                </Button>
            </div> */}

            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Shop by category
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                        {categoriesWithIcon.map((categoryItem) => (
                            <Card
                                key={categoryItem.id}
                                onClick={() =>
                                    handleNavigateToListingPage(categoryItem, "category")
                                }
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                            >
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                                    <span className="font-bold">{categoryItem.label}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* <section className="py-12 bg-gray-50">

                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {brandsWithIcon.map((brandItem) => (
                            <Card
                                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                                className="cursor-pointer hover:shadow-lg transition-shadow"
                            >
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                                    <span className="font-bold">{brandItem.label}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section> */}


            {/* <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Feature Products
                    </h2>
                    {isLoading ? (
                        <p className="text-center">Loading recommendations...</p>
                    ) : recommendedProducts && recommendedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {recommendedProducts.map((productItem) => (

                                <ShoppingProductTile
                                    key={productItem._id}
                                    handleGetProductDetails={handleGetProductDetails}
                                    product={productItem}
                                    handleAddtoCart={handleAddtoCart}
                                />

                            ))}
                        </div>
                    ) : (
                        <p className="text-center">No recommendations available. Check logs for details.</p>
                    )}

                </div>
            </section> */}

            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Featured Products
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {productList && productList.length > 0
                            ? productList.map((productItem) => (
                                <ShoppingProductTile
                                    key={productItem._id}
                                    handleGetProductDetails={handleGetProductDetails}
                                    product={productItem}
                                    handleAddtoCart={handleAddtoCart}
                                />
                            ))
                            : null}
                    </div>
                </div>
            </section>

            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Special Combos
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {comboList && comboList.length > 0
                            ? comboList.map((comboItem) => (
                                <ShoppingComboTile
                                    key={comboItem._id}
                                    combo={comboItem}
                                    handleGetComboDetails={handleGetComboDetails}
                                    handleAddtoCart={handleAddComboToCart}
                                />
                            ))
                            : null}
                    </div>
                </div>
            </section>

            <ProductDetailsDialog
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
                productDetails={productDetails}
            />

            <ComboDetailsDialog
                open={openComboDetailsDialog}
                setOpen={setOpenComboDetailsDialog}
                comboDetails={selectedCombo}
            />
        </div>
    );
}

export default ShoppingHome;