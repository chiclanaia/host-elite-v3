
export interface CalendarEvent {
    start: Date;
    end: Date;
    summary: string;
    description?: string;
}

export class IcalParser {
    static parse(icalData: string): CalendarEvent[] {
        const events: CalendarEvent[] = [];
        const lines = icalData.split(/\r\n|\n|\r/);

        let inEvent = false;
        let pStart: string | null = null;
        let pEnd: string | null = null;
        let summary: string | null = null;
        let description: string | null = null;

        for (const line of lines) {
            if (line.startsWith('BEGIN:VEVENT')) {
                inEvent = true;
                pStart = null;
                pEnd = null;
                summary = null;
                description = null;
            } else if (line.startsWith('END:VEVENT')) {
                inEvent = false;
                if (pStart && pEnd) {
                    events.push({
                        start: this.parseDate(pStart),
                        end: this.parseDate(pEnd),
                        summary: summary || 'Booked',
                        description: description || ''
                    });
                }
            } else if (inEvent) {
                if (line.startsWith('DTSTART')) pStart = line.split(':')[1];
                if (line.startsWith('DTEND')) pEnd = line.split(':')[1];
                if (line.startsWith('SUMMARY')) summary = line.split(':')[1];
                if (line.startsWith('DESCRIPTION')) description = line.split(':')[1];
            }
        }
        return events;
    }

    private static parseDate(dateStr: string): Date {
        // Simple parser for YYYYMMDD or YYYYMMDDTHHMMSSZ
        if (!dateStr) return new Date();
        const y = parseInt(dateStr.substring(0, 4));
        const m = parseInt(dateStr.substring(4, 6)) - 1;
        const d = parseInt(dateStr.substring(6, 8));
        return new Date(y, m, d);
    }
}
