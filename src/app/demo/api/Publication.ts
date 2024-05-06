import { RDI } from "./RDI";
import { RDIMember } from "./RDIMember";
import { TypeP } from "./enum";

export interface Publication {
    id: number;
    descriptionP: string;
    subjectP: string;
    dateP: Date;
    chercheurs: RDIMember[]; // You may replace 'any' with appropriate type if you have defined chercheurs type
    typeP:TypeP ;
  link:String;}
  