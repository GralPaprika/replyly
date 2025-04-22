import {PlansRepository} from "@/lib/plans/models/PlansRepository";
import {Exception} from "@/lib/common/models/Exception";

export class UpdateNetworkIsRegisteredInStripeStatusException implements Exception {
  constructor(readonly message: string) {}
}

export class UpdateNetworkIsRegisteredInStripeStatusUseCase {
  constructor(private readonly repository: PlansRepository) {}

  async execute(id: string, isRegistered: boolean): Promise<void> {
    try {
      await this.repository.updateNetworkIsRegisteredInStripeStatus(id, isRegistered);
    } catch (error) {
      throw new UpdateNetworkIsRegisteredInStripeStatusException(
        // @ts-ignore
        `Error updating network isRegisteredInStripe status. Network ID: ${id}. Error: ${error.message}`
      );
    }
  }
}