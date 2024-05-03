import { Classroom } from './classroom';

export interface Option {
    id: number;
    name: string;
    classroom_number: number;
    //classrooms: Classroom[];
    startYear: string;
    endYear: string;
}
