import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addComboFormElements } from "@/config";
import CommonForm from "@/components/common/form";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { Badge } from "@/components/ui/badge";
import { addNewCombo, deleteCombo, editCombo, fetchAllCombos } from "@/store/admin/combo-slice";
import { fetchAllProducts } from "@/store/admin/products-slice";

const initialFormData = {
    image: null,
    name: "",
    description: "",
    price: "",
    salePrice: "",
    totalStock: "",
    products: [],
    averageReview: 0,
};

function ComboTile({
    combo,
    setFormData,
    setOpenCreateDialog,
    setCurrentEditedId,
    handleDelete,
}) {
    return (
        <Card className="w-full max-w-sm mx-auto">
            <div>
                <div className="relative">
                    <img
                        src={combo?.image}
                        alt={combo?.name}
                        className="w-full h-[300px] object-cover rounded-t-lg"
                    />
                    {combo?.totalStock === 0 ? (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            Hết hàng
                        </Badge>
                    ) : combo?.totalStock < 10 ? (
                        <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">
                            {`Chỉ còn ${combo?.totalStock} combo`}
                        </Badge>
                    ) : null}
                </div>
                <CardContent>
                    <h2 className="text-xl font-bold mb-2 mt-2">{combo?.name}</h2>
                    <p className="text-muted-foreground mb-2">{combo?.description}</p>
                    <div className="flex justify-between items-center mb-2">
                        <span
                            className={`${combo?.salePrice > 0 ? "line-through" : ""
                                } text-lg font-semibold text-primary`}
                        >
                            ${combo?.price}
                        </span>
                        {combo?.salePrice > 0 ? (
                            <span className="text-lg font-bold">${combo?.salePrice}</span>
                        ) : null}
                    </div>
                    <div className="mt-2">
                        <h3 className="font-semibold mb-1">Sản phẩm trong combo:</h3>
                        <div className="flex flex-wrap gap-2">
                            {combo?.products?.map((product) => (
                                <Badge key={product._id} variant="secondary">
                                    {product.title}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <Button
                        onClick={() => {
                            setOpenCreateDialog(true);
                            setCurrentEditedId(combo?._id);
                            setFormData(combo);
                        }}
                    >
                        Sửa
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(combo?._id)}>Xóa</Button>
                </CardFooter>
            </div>
        </Card>
    );
}

function AdminCombo() {
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const dispatch = useDispatch();
    const { toast } = useToast();
    const { comboList } = useSelector((state) => state.adminCombo);
    const { productList } = useSelector((state) => state.adminProducts);

    function onSubmit(event) {
        event.preventDefault();

        const comboData = {
            ...formData,
            image: uploadedImageUrl,
            products: selectedProducts
        };

        if (currentEditedId !== null) {
            dispatch(editCombo({ id: currentEditedId, formData: comboData }))
                .then((data) => {
                    if (data?.payload?.success) {
                        dispatch(fetchAllCombos());
                        setFormData(initialFormData);
                        setOpenCreateDialog(false);
                        setCurrentEditedId(null);
                        setSelectedProducts([]);
                        toast({
                            title: "Combo updated successfully",
                        });
                    }
                    
                });
        } else {
            dispatch(addNewCombo(comboData))
                .then((data) => {
                    if (data?.payload?.success) {
                        dispatch(fetchAllCombos());
                        setOpenCreateDialog(false);
                        setImageFile(null);
                        setFormData(initialFormData);
                        setSelectedProducts([]);
                        toast({
                            title: "Combo added successfully",
                        });
                    }
                });
        }
    }

    function handleDelete(getCurrentComboId) {
        dispatch(deleteCombo(getCurrentComboId))
            .then((data) => {
                if (data?.payload?.success) {
                    dispatch(fetchAllCombos());
                    toast({
                        title: "Combo deleted successfully",
                    });
                }
            });
    }

    function isFormValid() {
        const requiredFields = ['name', 'description', 'price', 'totalStock'];
        return requiredFields.every(field => formData[field] !== "") && selectedProducts.length > 0;
    }

    useEffect(() => {
        dispatch(fetchAllCombos());
        dispatch(fetchAllProducts());
    }, [dispatch]);

    return (
        <Fragment>
            <div className="mb-5 w-full flex justify-end">
                <Button onClick={() => setOpenCreateDialog(true)}>
                    Add New Combo
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {comboList && comboList.length > 0
                    ? comboList.map((comboItem) => (
                        <ComboTile
                            key={comboItem._id}
                            combo={comboItem}
                            setFormData={setFormData}
                            setOpenCreateDialog={setOpenCreateDialog}
                            setCurrentEditedId={setCurrentEditedId}
                            handleDelete={handleDelete}
                        />
                    ))
                    : null}
            </div>
            <Sheet
                open={openCreateDialog}
                onOpenChange={() => {
                    setOpenCreateDialog(false);
                    setCurrentEditedId(null);
                    setFormData(initialFormData);
                    setSelectedProducts([]);
                }}
            >
                <SheetContent side="right" className="overflow-auto">
                    <SheetHeader>
                        <SheetTitle>
                            {currentEditedId !== null ? "Edit Combo" : "Add New Combo"}
                        </SheetTitle>
                    </SheetHeader>
                    <ProductImageUpload
                        imageFile={imageFile}
                        setImageFile={setImageFile}
                        uploadedImageUrl={uploadedImageUrl}
                        setUploadedImageUrl={setUploadedImageUrl}
                        setImageLoadingState={setImageLoadingState}
                        imageLoadingState={imageLoadingState}
                        isEditMode={currentEditedId !== null}
                    />
                    <div className="py-6">
                        <CommonForm
                            onSubmit={onSubmit}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={currentEditedId !== null ? "Edit" : "Add"}
                            formControls={addComboFormElements}
                            isBtnDisabled={!isFormValid()}
                        />
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Chọn sản phẩm cho combo:</h3>
                            <div className="grid gap-2">
                                {productList?.map((product) => (
                                    <label key={product._id} className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedProducts.some(p => p._id === product._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedProducts([...selectedProducts, product]);
                                                } else {
                                                    setSelectedProducts(selectedProducts.filter(p => p._id !== product._id));
                                                }
                                            }}
                                        />
                                        <span>{product.title}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </Fragment>
    );
}

export default AdminCombo; 