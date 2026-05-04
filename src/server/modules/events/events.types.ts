type CalendarEventDto = {
    id: string
    title: string
    start: string
    end: string
    color: string
    description: string
    allDay: boolean
    repeatWeekly: boolean
    isClass: boolean
    className: string
    teacherName: string
    teacherId: string | null
}