import { Component, OnInit } from '@angular/core';
'@angular/core';
import { Router } from '@angular/router';
import { RDIService } from 'src/app/demo/service/RDI.service';
import { PublicationService } from 'src/app/demo/service/Publication.service';

import { ActivatedRoute } from '@angular/router';
import { RDI } from 'src/app/demo/api/RDI';
import { Observable } from 'rxjs';
import { Publication } from 'src/app/demo/api/Publication';
import { RDIMember } from 'src/app/demo/api/RDIMember';

@Component({
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.css']

})
export class DetailsComponent implements OnInit{
    itemId: number | null = null; // Holds the route parameter
rdi:RDI;
describe:string;
publications:Publication[]=[];
rdimembers:RDIMember[]=[];
responsableMembers:RDIMember[];
otherMembers :RDIMember[];
    constructor(public RDIService: RDIService, public router: Router,private route: ActivatedRoute,
        public PublicationService: PublicationService
    ) { }
    ngOnInit():void{
        this.route.params.subscribe((params) => {
            this.itemId = Number(params['rdiId']); // Retrieve the 'id' parameter from the route
          });
        
          this.RDIService.getRDI(this.itemId).subscribe((data) => {
            this.rdi = data; // Assign the actual RDI data after subscription
          
          this.PublicationService.getPublicationsByRdiId(this.rdi.id).subscribe((data) => {
            this.publications = data; // Assign the actual RDI data after subscription
          });
          this.RDIService.retrieveRDIMembers(this.rdi.id).subscribe((data)=>{
            this.rdimembers=data
            this.responsableMembers = data.filter(member => member.position.toLowerCase() === 'responsablerdi');

// Filtrer les autres membres qui ne sont pas "responsable"
this.otherMembers = this.rdimembers.filter(member => member.position.toLowerCase() == 'chercheur');

          });
         // Filtrer le membre qui a le rôle de "responsable"

    });
          
        
    }
 
   
    describetype(type:string):string{
        if (type="Appliquee"){return "targets applied research with a practical or industrial emphasis."}else if(type="Academique"){return "  explores academic and theoretical research."}else if(type="Pedagogique"){return"aims at educational methods and pedagogical advancements"}else{return 'no type'}

    }
}
