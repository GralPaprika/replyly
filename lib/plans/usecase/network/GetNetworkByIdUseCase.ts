import {PlansRepository} from "@/lib/plans/models/PlansRepository";

export class GetNetworkByIdUseCase {
  constructor(private readonly repository: PlansRepository) {}

  async execute(id: string): Promise<Network> {
    const network = await this.repository.getNetworkById(id)
    if (!network) {
      throw new Error("Network not found")
    }
    return network
  }
}