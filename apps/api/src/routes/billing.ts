import express from 'express'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { Router } from 'express'


export const billingRouter = Router()

function getStripe() {
    return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

function getSupabase() {
    return createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!
    )
}

const CREDIT_PACKAGES = {
    starter: { credits: 10, priceId: 'price_1T7MkDLUl9fFkLOnuN7ucAse' },
    pro: { credits: 50, priceId: 'price_1T7MkFLUl9fFkLOnOl8MuzDH' },
}
// POST /api/billing/checkout
billingRouter.post('/checkout', async (req, res) => {
    try {
        const { packageId, userId } = req.body
        const pkg = CREDIT_PACKAGES[packageId as keyof typeof CREDIT_PACKAGES]
        if (!pkg) return res.status(400).json({ error: 'Invalid package' })

        const stripe = getStripe()
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [{ price: pkg.priceId, quantity: 1 }],
            success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success`,
            cancel_url: `${process.env.FRONTEND_URL}/dashboard?payment=cancelled`,
            metadata: { userId, credits: pkg.credits.toString() },
        })

        res.json({ url: session.url })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to create checkout session' })
    }
})

// POST /api/billing/webhook
billingRouter.post('/webhook', async (req, res) => {
    const stripe = getStripe()
    const sig = req.headers['stripe-signature'] as string

    let event: Stripe.Event
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch {
        return res.status(400).json({ error: 'Webhook signature invalid' })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const credits = parseInt(session.metadata?.credits ?? '0')

        if (userId && credits > 0) {
            const supabase = getSupabase()
            await supabase.rpc('increment_credits', { user_id: userId, amount: credits })
        }
    }

    res.json({ received: true })
})

export default billingRouter