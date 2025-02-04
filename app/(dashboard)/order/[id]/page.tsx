import { getOrderByID } from "@/actions/order";
import OrderDetailsTable from "@/components/shared/orderDetailsTable/OrderDetailsTable";
import { ShippingAddress } from "@/types";

const OrderDetailPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const order = await getOrderByID(id);

  return (
    <div>
      <OrderDetailsTable
        order={{
          ...order,

          shippingAddress: order?.shippingAddress as ShippingAddress,
        }}
      />
    </div>
  );
};

export default OrderDetailPage;
