import { Calendar } from './calendar';
import { Module } from './module';
import { User } from './user';
import { Classroom } from './classroom';

export interface Affectation {
    id: number;
    semester: number;
    calendar: Calendar;
    module: Module;
    user: User;
    classroom: Classroom;
}
