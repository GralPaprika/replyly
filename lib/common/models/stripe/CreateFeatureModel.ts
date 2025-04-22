import Stripe from "stripe";


export interface CreateFeatureModel {
  lookup_key: string;
  name: string;
  metadata?:  Stripe.MetadataParam | undefined;
}