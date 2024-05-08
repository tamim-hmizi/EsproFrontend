import { Publication } from "./Publication";
import { RDIMember } from "./RDIMember";
import { TypeRecherche } from "./enum";

export interface ResearchAxis {
  id: number;
  // Define other properties as needed
}

export interface RDI {
  id: number;
  theme: string;
  keywords: string;
  dateCreation: Date;
  typeR: TypeRecherche;
  researchAxis: ResearchAxis[];
  RDIMembers: RDIMember[];
  publication:Publication[];
}






