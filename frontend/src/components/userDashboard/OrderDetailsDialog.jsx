import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

const OrderDetailsDialog = ({ isOpen, onOpenChange, order, loading, onCancel }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] bg-gradient-to-br from-black via-[#0d0b1e] to-black text-white shadow-lg rounded-xl p-4 sm:p-6 md:p-8 border-[#172554]"
      >
        <ScrollArea className="h-[80vh]">
          <div className="space-y-6 sm:space-y-8 text-sm sm:text-base">
            {/* Header - Improved mobile layout */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#38bdf8]" viewBox="0 0 26 26" fill="none">
                  <path d="M1 26V13C1 6.37258 6.37258 1 13 1C19.6274 1 25 6.37258 25 13C25 19.6274 19.6274 25 13 25H12" stroke="currentColor" strokeWidth="2" />
                  <path d="M5 26V13.16C5 8.65336 8.58172 5 13 5C17.4183 5 21 8.65336 21 13.16C21 17.6666 17.4183 21.32 13 21.32H12" stroke="currentColor" strokeWidth="2" />
                  <circle cx="13" cy="13.0214" r="5" fill="currentColor" />
                </svg>
                <div>
                  <h1 className="text-base sm:text-lg font-bold text-[#38bdf8]">Booklio</h1>
                  <p className="text-xs text-neutral-400">Your trusted book store</p>
                </div>
              </div>
              <div className="flex flex-col gap-1 sm:text-right">
                <h2 className="text-lg sm:text-xl font-bold">Invoice</h2>
                <p className="text-sm text-neutral-400">
                  <span className="block sm:inline">Order ID: </span>
                  <span className="font-medium text-white break-all">{order?.orderId}</span>
                </p>
                <p className="text-sm text-white font-bold">
                  <span className="block sm:inline">Date: </span>
                  {order?.createdAt && new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Address & Status - Improved mobile spacing */}
            <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-4">
              <div>
                <h3 className="text-md font-semibold mb-1">Shipping Address</h3>
                <address className="not-italic text-sm text-neutral-300 leading-5 space-y-1">
                  <p>{order?.shippingAddress?.street}</p>
                  <p>{order?.shippingAddress?.city}, {order?.shippingAddress?.state}</p>
                  <p>{order?.shippingAddress?.country} - {order?.shippingAddress?.zipCode}</p>
                </address>
              </div>
              <div className="sm:text-right">
                <h3 className="text-md font-semibold mb-1">Order Status</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold capitalize inline-block
                  ${order?.status === "completed" ? "bg-green-100 text-green-700" :
                    order?.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                      order?.status === "cancelled" ? "bg-red-100 text-red-700" :
                        order?.status === "placed" ? "bg-blue-100 text-blue-700" :
                          "bg-gray-100 text-gray-700"}`}>
                  {order?.status}
                </span>
              </div>
            </div>

            {/* Book Info - Improved mobile readability */}
            <div className="border border-[#1f1c2e] p-3 sm:p-4 rounded-lg bg-[#181425] text-xs sm:text-sm">
              <div className="hidden sm:grid sm:grid-cols-5 font-medium uppercase text-neutral-400 mb-2">
                <div className="col-span-2">Title</div>
                <div>Author</div>
                <div>Qty</div>
                <div className="text-right">ISBN</div>
              </div>

              {/* Enhanced mobile view */}
              <div className="grid sm:hidden gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-neutral-400">Title:</div>
                  <div className="text-white break-words">{order?.bookInfo?.data?.volumeInfo?.title}</div>

                  <div className="text-neutral-400">Author:</div>
                  <div className="text-white">{order?.bookInfo?.data?.volumeInfo?.authors?.[0] || 'N/A'}</div>

                  <div className="text-neutral-400">Quantity:</div>
                  <div className="text-orange-400">{order?.quantity}</div>

                  <div className="text-neutral-400">ISBN:</div>
                  <div className="text-white break-all">{order?.isbn}</div>
                </div>
              </div>

              {/* Desktop layout remains unchanged */}
              <div className="hidden sm:grid sm:grid-cols-5 text-white">
                <div className="col-span-2 truncate">{order?.bookInfo?.data?.volumeInfo?.title}</div>
                <div>{order?.bookInfo?.data?.volumeInfo?.authors?.[0]}</div>
                <div className="text-orange-500">{order?.quantity}</div>
                <div className="text-right">{order?.isbn}</div>
              </div>
            </div>

            {/* Payment - Improved mobile alignment */}
            <div className="flex flex-col gap-3 sm:items-end">
              <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-5 sm:gap-x-2">
                <dt className="text-left sm:col-span-3 font-semibold">Total Amount:</dt>
                <dd className="text-right sm:text-left text-green-500">₹{order?.price}</dd>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-5 sm:gap-x-2">
                <dt className="text-left sm:col-span-3 font-semibold">Payment Status:</dt>
                <dd className="text-right sm:text-left capitalize text-neutral-300">{order?.status}</dd>
              </div>
            </div>

            {/* Footer - Improved mobile text sizing */}
            <div className="pt-4 border-t border-[#1f1c2e] text-center sm:text-start">
              <h4 className="text-md sm:text-lg font-semibold">Thank you for your order!</h4>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">Need help? Reach us at:</p>
              <p className="text-xs sm:text-sm font-medium text-[#38bdf8] mt-1">support@booklio.in</p>
            </div>

            {/* Cancel Button - Full width on mobile */}
            {order?.status === "pending" && (
              <div className="flex justify-end sm:justify-end gap-4 pt-2">
                <Button
                  variant="destructive"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                  onClick={onCancel}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Cancel Order"
                  )}
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;