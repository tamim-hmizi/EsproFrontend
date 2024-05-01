import { Position } from './position'
import { academicSp} from './academicSp'
import { Role} from './role'

export class User {
    
  idU: number;
  nameU: string;
  surnameU: string;
  password: string;
  email: string;
  telnum: number;
  img: string;
  role: Role;
  //pos
  positions:Position[];
  //acadmics:academicSp[];
  /*setRole(role: Role) {
    this.role = role;
  }

 /* constructor(id: number, name: string, surname: string, password: string, email: string, telnum: number, img: string, positions: Position[], acadmics: academicSp[]) {
    this.idU = id;
    this.nameU = name;
    this.surnameU = surname;
    this.password = password;
    this.email = email;
    this.telnum = telnum;
    this.img = img;
    this.positions = positions;
    this.acadmics = acadmics;
  }*/
}
