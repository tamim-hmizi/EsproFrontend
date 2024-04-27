import { sponsor } from './sponsor';

export interface event {
    id: number;
    title: string;
    description: string;
    date: Date;
    place: string;
    banner: string;
    affiche: string;
    logo: string;
    sponsors: sponsor[];
}
