import OrderView from "./OrderView";

const OrderPage = async ({ params }) => {
  const { id } = await params

  return (
    <OrderView id={id} />
  );
}

export default OrderPage