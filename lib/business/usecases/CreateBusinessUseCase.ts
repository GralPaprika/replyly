import {BusinessRepository} from "@/lib/business/models/BusinessRepository";
import {CreateBusinessRequest} from "@/lib/business/models/CreateBusinessRequest";
import {Plans} from "@/lib/common/models/Plans";
import {UserRoles} from "@/lib/common/models/UserRoles";
import {Networks} from "@/lib/common/Networks";
import {CreateBusinessResponse} from "@/lib/business/models/CreateBusinessResponse";

export class CreateBusinessUseCase {
  constructor(private readonly repository: BusinessRepository) {}

  async execute(data: CreateBusinessRequest): Promise<CreateBusinessResponse> {
    const businessId = await this.repository.createBusiness(data);

    await this.repository.addPlan(businessId, Plans.Demo);

    const adminName = `${data.businessName.replace(' ', '-')}-admin`
    const adminId = await this.repository.addAdmin({
      businessId,
      username: adminName,
      roleId: UserRoles.Admin,
      name: data.businessName,
      email: data.email,
    });

    const locationId = await this.repository.addLocation({
      businessId,
      name: 'Default',
      isGlobal: true,
      address: data.address,
      schedule: data.schedule,
    });

    await this.repository.addUserToLocation(locationId, adminId)

    await this.repository.addNetwork(businessId, Networks.WhatsApp)

    const whatsapp = await this.repository.addWhatsapp(locationId, data.phoneNumber)

    return { businessId, locationId, whatsapp };
  }
}