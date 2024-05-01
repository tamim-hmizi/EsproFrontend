import { Level } from './level';
import { Option } from './option';
import { Module } from './module';

export interface Classroom {
    id: number;
    name: string;
    level: Level;
    option: Option;
    modules: Module[];
    startYear: string;
    endYear: string;
    classroomSalle: string;
}
