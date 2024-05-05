import { Fundraiser } from "./fundraiser";
import { User } from "./user";

export interface Donation {
    id?: number;
    type: string;
    amount: number;
    status: string;
    user?: User;
    fundraiserId: number;
}
