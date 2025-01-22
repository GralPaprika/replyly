export interface DailyHours {
  startTime: string
  breakStart?: string
  breakEnd?: string
  endTime: string
}

export interface BusinessHours {
  monday?: DailyHours
  tuesday?: DailyHours
  wednesday?: DailyHours
  thursday?: DailyHours
  friday?: DailyHours
  saturday?: DailyHours
  sunday?: DailyHours
}