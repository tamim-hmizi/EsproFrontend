
import { User } from './user'
export class academicSp {
    idAS: number;
    nameAS: string;
    //list de users
    users:User[];

    constructor(idAS: number, nameAS: string, users: User[]) {
        this.idAS = idAS;
        this.nameAS = nameAS;
        this.users = users;
      }

}