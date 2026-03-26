import Stripe from "stripe";
const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);

export async function POST(req) {
  const { 
    products, 
    userId, 
    email, 
    name,
    shippingAdress,
    billingAdress,
    phone,
   } = await req.json();

  let stripeCustomer;

  const existingCustomers = await stripe.customers.list({
    email: email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    stripeCustomer = existingCustomers.data[0];
  } else {
    stripeCustomer = await stripe.customers.create({
      email,
      name,
      metadata: { userId }
    });
  }

  const line_items = products.map(item => ({
    price_data: {
      currency: 'ron',
      product_data: {
        name: item.title,
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomer.id,
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 2000,
            currency: 'ron',
          },
          display_name: 'Livrare prin Curier',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 1 },
            maximum: { unit: 'business_day', value: 3 },
          },
        },
      },
      {
      shipping_rate_data: {
        type: 'fixed_amount',
        fixed_amount: {
            amount: 0,
            currency: 'ron',
          },
          display_name: 'Ridicare din EasyBox',
          delivery_estimate: {
            minimum: { unit: 'business_day', value: 1 },
            maximum: { unit: 'business_day', value: 3 },
          },
        },
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SOCKET_URL}/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SOCKET_URL}/cos`,
    metadata: { 
      userId, 
      cart: JSON.stringify(products),
      name,
      shippingAdress,
      billingAdress,
      phone,
      email
    }
  });

  return Response.json({ url: session.url });
}