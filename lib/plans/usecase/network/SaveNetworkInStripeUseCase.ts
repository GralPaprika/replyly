import Stripe from "stripe";
import {CreateFeatureModel} from "@/lib/common/models/stripe/CreateFeatureModel";
import {Exception} from "@/lib/common/models/Exception";

export class SaveNetworkInStripeException implements Exception {
  constructor(readonly message: string) {}
}

enum ErrorMessage {
  FeatureCreationFailed = 'Feature creation failed',
}

export class SaveNetworkInStripeUseCase {
  constructor(
    private readonly stripe: Stripe,
  ) {}

  async execute(data: CreateFeatureModel): Promise<void> {
    try {
      const feature = await this.stripe.entitlements.features.create(data);

      if (!feature.active) {
        return Promise.reject(new SaveNetworkInStripeException(ErrorMessage.FeatureCreationFailed));
      }

    } catch (error) {
      // @ts-ignore
      throw new SaveNetworkInStripeException(error.message);
    }
  }
}