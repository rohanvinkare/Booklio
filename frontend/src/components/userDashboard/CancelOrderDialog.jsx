import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "react-hot-toast";
import { useState } from "react";

const CancelOrderDialog = ({ isOpen, onOpenChange, orderId, onCancelSuccess }) => {
    const [loading, setLoading] = useState(false);

    const handleCancelOrder = async () => {
        try {
            setLoading(true);
            const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/order/api/v1/cancel-order`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ orderId }),
                }
            );

            const contentType = response.headers.get("content-type");
            const data = contentType?.includes("application/json")
                ? await response.json()
                : { success: false, msg: "Invalid response format" };

            if (response.ok && data.success) {
                toast.success("Order cancelled successfully!");
                onCancelSuccess(orderId); // notify parent
                onOpenChange(false);
            } else {
                toast.error(data.msg || "Failed to cancel order");
                console.log(data.msg)
            }
        } catch (error) {
            console.error("Error cancelling order:", error);
            toast.error("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-gray-800 text-white border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold mb-2">Cancel Order</DialogTitle>
                    <DialogDescription className="text-gray-400">
                        Are you sure you want to cancel this order? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-4 mt-6">
                    <Button
                        variant="outline"
                        className="border-gray-600 hover:bg-gray-700"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        No, Keep Order
                    </Button>
                    <Button
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={handleCancelOrder}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            "Yes, Cancel Order"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CancelOrderDialog;
