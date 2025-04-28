import {Plan} from "@/lib/plans/models/Plan";
import {StripeProduct} from "@/lib/plans/models/StripeProduct";
import {StripeProductInterval} from "@/lib/plans/models/StripeProductInterval";

export function PlanToStripeProductMapper(
  plan: Plan
): StripeProduct {
  return {
    id: plan.id,
    name: plan.name,
    description: plan.description,
    metadata: {
      messagesLimit: plan.messagesLimit,
      notificationsLimit: plan.notificationsLimit,
      regionId: plan.regionId,
    },
    default_price_data: {
      currency: plan.currency.code,
      amount: parseInt(plan.price),
      recurring: {
        interval: StripeProductInterval.Month,
        interval_count: 1,
      },
    },
  }
}