import { PLANS } from '@/config/stripe'
import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2023-10-16',
  typescript: true,
})

export async function getUserSubscriptionPlan() {
  const { getUser } = getKindeServerSession()
  const user = getUser()

  if (!user.id) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCustomerPeriodEnd: null,
    }
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  })

  if (!dbUser) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCanceled: false,
      stripeCustomerPeriodEnd: null,
    }
  }

  const isSubscribed = Boolean(
    dbUser.stripePriceId &&
      dbUser.stripeCustomerPeriodEnd && // 86400000 = 1 day
      dbUser.stripeCustomerPeriodEnd.getTime() + 86_400_000 > Date.now()
  )

  const plan = isSubscribed
    ? PLANS.find((plan) => plan.price.priceIds.test === dbUser.stripePriceId)
    : null

  let isCanceled = false
  if (isSubscribed && dbUser.stipeSubscriptionId) {
    const stripePlan = await stripe.subscriptions.retrieve(
      dbUser.stipeSubscriptionId
    )
    isCanceled = stripePlan.cancel_at_period_end
  }

  return {
    ...plan,
    stripeSubscriptionId: dbUser.stipeSubscriptionId,
    stripeCustomerPeriodEnd: dbUser.stripeCustomerPeriodEnd,
    stripeCustomerId: dbUser.stripeCustomerId,
    isSubscribed,
    isCanceled,
  }
}