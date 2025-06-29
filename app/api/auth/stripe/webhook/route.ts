import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    console.error("Webhook signature verification failed:", error)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        const userId = session.metadata?.userId

        if (userId && session.subscription) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan: "PREMIUM",
              subscriptionId: session.subscription as string,
              subscriptionStatus: "active",
            },
          })
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object

        await prisma.user.updateMany({
          where: { subscriptionId: subscription.id },
          data: {
            subscriptionStatus: subscription.status,
            plan: subscription.status === "active" ? "PREMIUM" : "FREE",
          },
        })
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object

        await prisma.user.updateMany({
          where: { subscriptionId: subscription.id },
          data: {
            plan: "FREE",
            subscriptionStatus: "canceled",
          },
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
