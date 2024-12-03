import {Exception} from "@/lib/common/models/Exception";
import {WhatsappRepository} from "@/lib/whatsapp/models/WhatsappRepository";
import {BusinessHours, DailyHours} from "@/lib/whatsapp/models/BusinessHours";

export class IsTimeWithinLocationBusinessHoursException implements Exception {
  constructor(public readonly message: string) {}
}

export class IsTimeWithinLocationBusinessHoursUseCase {
  private readonly now: Date
  private readonly year: number
  private readonly month: number
  private readonly dayOfMonth: number

  constructor(private readonly repository: WhatsappRepository) {
    this.now = new Date()
    this.year = this.now.getFullYear()
    this.month = this.now.getMonth()
    this.dayOfMonth = this.now.getDate()
  }

  /**
   * Check if the time is within the business hours of the location.
   * @param whatsappId
   * @returns {Promise<boolean>}
   * @throws {IsTimeWithinLocationBusinessHoursException}
   */
  async execute(whatsappId: string): Promise<boolean> {
    try {
      const businessHours: BusinessHours = await this.repository.getBusinessHours(whatsappId)

      const dayHours = this.getDayFromBusinessHours(businessHours, this.now.getDay())

      if (!dayHours) return false
      const startTime = this.timeStringToDate(dayHours.startTime)
      const endTime = this.timeStringToDate(dayHours.endTime)
      const breakStart = dayHours.breakStart ? this.timeStringToDate(dayHours.breakStart) : null
      const breakEnd = dayHours.breakEnd ? this.timeStringToDate(dayHours.breakEnd) : null

      if (this.now < startTime || this.now > endTime) return false

      return !(breakStart && breakEnd && this.now > breakStart && this.now < breakEnd)

    } catch (error) {
      // @ts-ignore
      throw new IsTimeWithinLocationBusinessHoursException(error.message)
    }
  }

  private timeStringToDate(time: string): Date {
    const [hours, minutes] = time.split(':').map(Number)
    return new Date(this.year, this.month, this.dayOfMonth, hours, minutes, 0, 0)
  }

  private getDayFromBusinessHours(businessHours: BusinessHours, day: number): DailyHours | null {
    switch (day) {
      case 0:
        return businessHours.sunday || null
      case 1:
        return businessHours.monday || null
      case 2:
        return businessHours.tuesday || null
      case 3:
        return businessHours.wednesday || null
      case 4:
        return businessHours.thursday || null
      case 5:
        return businessHours.friday || null
      case 6:
        return businessHours.saturday || null
      default:
        return null
    }
  }
}