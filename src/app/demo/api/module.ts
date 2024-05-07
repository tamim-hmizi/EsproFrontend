import { Skill } from './skill'
export interface Module {
    id: number;
    name: string;
    description: string;
    teaching_hours: number;
    ects: number;
    skills: Skill[]; 
}
