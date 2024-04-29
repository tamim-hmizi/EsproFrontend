import { Role } from "./role";

export class AuthenticationResponse {
    jwt:string; 
    nameU:string;
    surnameU:string;
    role:Role;

}
