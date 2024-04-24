import { calendar } from './calendar';

export interface affectation {
    id: number;
    semester: number;
    calendars: calendar[];
}
