import { Publication } from "./Publication";
import { RDI } from "./RDI";
import { RDIPost } from "./enum";
import { User } from "./user";

export interface RDIMember {
  id: number;
  position: RDIPost; 
  Publications: Publication[]; 
  rdi: RDI; 
  user: User; 
 dateP:Date;

}
