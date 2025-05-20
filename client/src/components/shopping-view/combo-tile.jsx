import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { categoryOptionsMap } from "@/config";

function ShoppingComboTile({
    combo,
    handleGetComboDetails,
    handleAddtoCart,
}) {
    return (
        <Card className="w-full max-w-sm mx-auto">
            <div onClick={() => handleGetComboDetails(combo?._id)}>
                <div className="relative">
                    <img
                        src={combo?.image}
                        alt={combo?.name}
                        className="w-full h-[300px] object-cover rounded-t-lg"
                    />
                    {combo?.totalStock === 0 ? (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            Out Of Stock
                        </Badge>
                    ) : combo?.totalStock < 10 ? (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            {`Only ${combo?.totalStock} combos left`}
                        </Badge>
                    ) : combo?.salePrice > 0 ? (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            Sale
                        </Badge>
                    ) : null}
                </div>
                <CardContent className="p-4">
                    <h2 className="text-xl font-bold mb-2">{combo?.name}</h2>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[16px] text-muted-foreground">
                            {categoryOptionsMap[combo?.category]}
                        </span>
                    </div>
                    <p className="text-muted-foreground mb-2">{combo?.description}</p>
                    <div className="flex justify-between items-center mb-2">
                        <span
                            className={`${combo?.salePrice > 0 ? "line-through" : ""
                                } text-lg font-semibold text-primary`}
                        >
                            ${combo?.price}
                        </span>
                        {combo?.salePrice > 0 ? (
                            <span className="text-lg font-semibold text-primary">
                                ${combo?.salePrice}
                            </span>
                        ) : null}
                    </div>
                    <div className="mt-2">
                        <h3 className="font-semibold mb-1">Products in combo:</h3>
                        <div className="flex flex-wrap gap-2">
                            {combo?.products?.map((product) => (
                                <Badge key={product._id} variant="secondary">
                                    {product.title}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </div>
            <CardFooter>
                {combo?.totalStock === 0 ? (
                    <Button className="w-full opacity-60 cursor-not-allowed">
                        Out Of Stock
                    </Button>
                ) : (
                    <Button
                        onClick={() => handleAddtoCart(combo?._id)}
                        className="w-full"
                    >
                        Add to cart
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}

export default ShoppingComboTile; 