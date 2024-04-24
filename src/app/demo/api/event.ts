import { sponsor } from './sponsor';

export interface event {
    id: number;
    title: string;
    description: string;
    date: Date;
    place: string;
    sponsors: sponsor[];
}
