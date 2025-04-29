import {Plan} from "@/lib/plans/models/Plan";
import {StripeProduct} from "@/lib/plans/models/StripeProduct";
import {StripeProductInterval} from "@/lib/plans/models/StripeProductInterval";

const DIGITS_FOR_DECIMALS_STRIPE = Math.pow(10, 2);

export function PlanToStripeProductMapper(
  plan: Plan
): StripeProduct {
  return {
    id: plan.id,
    name: plan.displayName,
    description: plan.description,
    metadata: {
      messagesLimit: plan.messagesLimit,
      notificationsLimit: plan.notificationsLimit,
      regionId: plan.regionId,
      replylyName: plan.name,
    },
    default_price_data: {
      currency: plan.currency.code,
      unit_amount: parseInt(plan.price) * DIGITS_FOR_DECIMALS_STRIPE,
      recurring: {
        interval: StripeProductInterval.Month,
        interval_count: 1,
      },
    },
  }
}