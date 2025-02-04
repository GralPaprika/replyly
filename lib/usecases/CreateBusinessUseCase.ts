import {BusinessRepository} from "@/lib/business/models/BusinessRepository";
import {BusinessSchema} from "@/lib/business/models/BusinessSchema";
import {Plans} from "@/lib/common/models/Plans";
import {UserRoles} from "@/lib/common/models/UserRoles";
import {Networks} from "@/lib/common/Networks";

export class CreateBusinessUseCase {
  constructor(private readonly repository: BusinessRepository) {}

  async createBusiness(data: BusinessSchema): Promise<string> {
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

    return businessId;
  }
}