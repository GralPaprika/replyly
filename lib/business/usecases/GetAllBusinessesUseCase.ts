import {BusinessRepository} from "@/lib/business/models/BusinessRepository";
import {SlimBusinessDto} from "@/lib/business/models/SlimBusinessDto";

export class GetAllBusinessesUseCase {
  constructor(private readonly repository: BusinessRepository) {}

  execute(): Promise<SlimBusinessDto[]> {
    return this.repository.getAll()
  }
}