import {BusinessRepository} from "@/lib/business/models/BusinessRepository";
import {BusinessData} from "@/lib/business/models/BusinessData";
import {Plans} from "@/lib/common/models/Plans";
import {UserRoles} from "@/lib/common/models/UserRoles";
import {Networks} from "@/lib/common/Networks";
import {BusinessCreatedData} from "@/lib/business/models/BusinessCreatedData";
import {Exception} from "@/lib/common/models/Exception";

export class CreateBusinessUseCaseException implements Exception {
  constructor(readonly message: string) {}
}

export class CreateBusinessUseCase {
  constructor(private readonly repository: BusinessRepository) {}

  async execute(data: BusinessData): Promise<BusinessCreatedData> {
    try {
      const businessId = await this.repository.createBusiness(data);

      await this.repository.addPlan(businessId, Plans.Demo);

      const adminName = `${data.businessName.replace(' ', '-')}-admin`
      const adminId = await this.repository.addAdmin({
        businessId,
        username: adminName,
        roleId: UserRoles.Admin,
        name: data.businessName,
        email: data.email,
        phoneNumber: data.phoneNumber,
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

      const whatsappId = await this.repository.addWhatsapp(locationId)

      return {businessId, locationId, whatsappId, userId: adminId};
    } catch (e) {
      console.error(e)
      throw new CreateBusinessUseCaseException((e as Error).message)
    }
  }
}