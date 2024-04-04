import stripe from 'stripe'; // Assuming you have a utility file for initializing Stripe
const stripeInstance = new stripe(process.env.VITE_APP_STRIPE_SK);


export default async function handler(req, res) {
    if (req.method === 'POST') {
        const YOUR_DOMAIN = 'https://alien-gear.vercel.app/'; // Replace with your Vercel app domain

        const { products } = req.body; // Parse products data from request body

        const lineItems = products.map(product => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product.name,
                    description: product.description,
                    images: [product.picture],
                },
                unit_amount: Math.round(product.price * 100), // Convert price to cents
            },
            quantity: 1,
        }));

        try {
            const session = await stripeInstance.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: `${YOUR_DOMAIN}/success`,
                cancel_url: `${YOUR_DOMAIN}/cancel`,
            });

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ id: session.id });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create checkout session' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('Method Not Allowed');
    }
}