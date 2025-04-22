import {PlansRepository} from "@/lib/plans/models/PlansRepository";
import {CreateNetworkDto} from "@/lib/plans/models/network/CreateNetworkDto";
import {Exception} from "@/lib/common/models/Exception";

export class CreateNetworkException implements Exception {
  constructor(readonly message: string) {}
}

export class CreateNetworkUseCase {
  constructor(
    private readonly repository: PlansRepository,
  ) {}

  async execute(data: CreateNetworkDto): Promise<{ id: string }> {

    try {
      const network = await this.repository.createNetwork(data);

      return {id: network.id};
    } catch (error) {
      // @ts-ignore
      throw new CreateNetworkException(error.message);
    }
  }
}