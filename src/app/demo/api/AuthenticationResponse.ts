import { LoginComponent } from "../components/auth/login/login.component";
import { Role } from "./role";

export class AuthenticationResponse {
    jwt:string; 
    nameU:string;
    surnameU:string;
    role:Role;
    idU:number;

   mfaEnabled:boolean;
   secretImageUri:string;

   
}
