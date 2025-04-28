import Stripe from "stripe";
import {StripeProduct} from "@/lib/plans/models/StripeProduct";
import {Plan} from "@/lib/plans/models/Plan";
import {Exception} from "@/lib/common/models/Exception";

export class SavePlanInStripeException implements Exception {
  constructor(readonly message: string) {}
}

export class SavePlanInStripeUseCase {
  constructor(
    private readonly stripe: Stripe,
    private readonly planToStripeProductMapper: (plan: Plan) => StripeProduct,
  ) {}

  async execute(data: Plan): Promise<void> {
    const stripeProduct = this.planToStripeProductMapper(data);

    try {
      // @ts-ignore
      await this.stripe.products.create(stripeProduct);
    } catch (error) {
      // @ts-ignore
      throw new SavePlanInStripeException(`Failed to save plan in Stripe: ${error.message}`);
    }
  }
}