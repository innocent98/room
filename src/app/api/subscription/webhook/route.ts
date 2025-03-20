import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import Stripe from "stripe"
import { headers } from "next/headers"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! || '', {
//   apiVersion: "2025-02-24.acacia",
// })

// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET! || ''

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = (await headers()).get("stripe-signature") as string

    let event: Stripe.Event

    try {
      // event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error) {
      console.error("Webhook signature verification failed:", error)
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    // Handle the event
    // switch (event.type) {
    //   case "checkout.session.completed": {
    //     const session = event.data.object as Stripe.Checkout.Session
    //     await handleCheckoutSessionCompleted(session)
    //     break
    //   }
    //   case "invoice.paid": {
    //     const invoice = event.data.object as Stripe.Invoice
    //     await handleInvoicePaid(invoice)
    //     break
    //   }
    //   case "customer.subscription.updated": {
    //     const subscription = event.data.object as Stripe.Subscription
    //     await handleSubscriptionUpdated(subscription)
    //     break
    //   }
    //   case "customer.subscription.deleted": {
    //     const subscription = event.data.object as Stripe.Subscription
    //     await handleSubscriptionDeleted(subscription)
    //     break
    //   }
    //   default:
    //     console.log(`Unhandled event type: ${event.type}`)
    // }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error handling webhook:", error)
    return NextResponse.json({ error: "Error handling webhook" }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  if (!session.metadata?.userId || !session.metadata?.planId) {
    console.error("Missing metadata in checkout session")
    return
  }

  const userId = session.metadata.userId
  const planId = session.metadata.planId
  const stripeSubscriptionId = session.subscription as string

  // Get the subscription details from Stripe
  // const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)

  // Create a new subscription in the database
  // await prisma.subscription.create({
  //   data: {
  //     userId,
  //     planId,
  //     status: "active",
  //     // startDate: new Date(stripeSubscription.current_period_start * 1000),
  //     // endDate: stripeSubscription.cancel_at ? new Date(stripeSubscription.cancel_at * 1000) : null,
  //     stripeCustomerId: session.customer as string,
  //     stripeSubscriptionId,
  //     // currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
  //     // currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
  //     // cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
  //   },
  // })

  // Create a payment history record
  if (session.amount_total) {
    await prisma.paymentHistory.create({
      data: {
        userId,
        amount: session.amount_total / 100, // Convert from cents
        currency: session.currency?.toUpperCase() || "USD",
        status: "succeeded",
        paymentMethod: "card",
        paymentIntentId: session.payment_intent as string,
        description: `Subscription to plan: ${planId}`,
      },
    })
  }

  // Enable all disabled forms for the user
  await prisma.form.updateMany({
    where: { userId, disabled: true },
    data: { disabled: false },
  })
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return

  // Find the subscription in our database
  const subscription = await prisma.subscription.findFirst({
    where: {
      stripeSubscriptionId: invoice.subscription as string,
    },
  })

  if (!subscription) {
    console.error("Subscription not found for invoice:", invoice.id)
    return
  }

  // Create a payment history record
  await prisma.paymentHistory.create({
    data: {
      userId: subscription.userId,
      amount: invoice.amount_paid / 100, // Convert from cents
      currency: invoice.currency.toUpperCase(),
      status: "succeeded",
      paymentMethod: "card",
      invoiceId: invoice.id,
      description: `Invoice payment for subscription: ${subscription.id}`,
    },
  })

  // Update the subscription period
  // const stripeSubscription = await stripe.subscriptions.retrieve(invoice.subscription as string)

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      // currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
      // currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    },
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  // Find the subscription in our database
  const dbSubscription = await prisma.subscription.findFirst({
    where: {
      stripeSubscriptionId: subscription.id,
    },
  })

  if (!dbSubscription) {
    console.error("Subscription not found:", subscription.id)
    return
  }

  // Update the subscription in our database
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: subscription.status === "active" ? "active" : "canceled",
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
    },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  // Find the subscription in our database
  const dbSubscription = await prisma.subscription.findFirst({
    where: {
      stripeSubscriptionId: subscription.id,
    },
  })

  if (!dbSubscription) {
    console.error("Subscription not found:", subscription.id)
    return
  }

  // Update the subscription in our database
  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: "expired",
      endDate: new Date(),
    },
  })
}

