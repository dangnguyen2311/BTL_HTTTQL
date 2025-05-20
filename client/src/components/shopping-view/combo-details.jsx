import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "../ui/use-toast";
import { Badge } from "../ui/badge";
import { categoryOptionsMap } from "@/config";

function ComboDetailsDialog({ open, setOpen, comboDetails }) {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { toast } = useToast();

    function handleAddToCart() {
        dispatch(
            addToCart({
                userId: user?.id,
                productId: comboDetails?._id,
                quantity: 1,
                isCombo: true
            })
        ).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchCartItems(user?.id));
                toast({
                    title: "Combo is added to cart",
                });
                setOpen(false);
            }
        });
    }

    return (
        <Dialog open={open} onOpenChange={() => setOpen(false)}>
            <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
                <div className="relative overflow-hidden rounded-lg">
                    <img
                        src={comboDetails?.image}
                        alt={comboDetails?.name}
                        width={600}
                        height={600}
                        className="aspect-square w-full object-cover"
                    />
                </div>
                <div className="">
                    <div>
                        <h1 className="text-3xl font-extrabold">{comboDetails?.name}</h1>
                        <p className="text-muted-foreground text-lg mb-2">
                            {categoryOptionsMap[comboDetails?.category]}
                        </p>
                        <p className="text-muted-foreground text-2xl mb-5 mt-4">
                            {comboDetails?.description}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p
                            className={`text-3xl font-bold text-primary ${comboDetails?.salePrice > 0 ? "line-through" : ""
                                }`}
                        >
                            ${comboDetails?.price}
                        </p>
                        {comboDetails?.salePrice > 0 ? (
                            <p className="text-2xl font-bold text-muted-foreground">
                                ${comboDetails?.salePrice}
                            </p>
                        ) : null}
                    </div>
                    <div className="mt-5 mb-5">
                        <h3 className="font-semibold mb-2">Products in this combo:</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {comboDetails?.products?.map((product) => (
                                <Badge key={product._id} variant="secondary" className="text-sm">
                                    {product.title}
                                </Badge>
                            ))}
                        </div>
                        {comboDetails?.totalStock === 0 ? (
                            <Button className="w-full opacity-60 cursor-not-allowed">
                                Out of Stock
                            </Button>
                        ) : (
                            <Button
                                className="w-full"
                                onClick={handleAddToCart}
                            >
                                Add to Cart
                            </Button>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ComboDetailsDialog; 