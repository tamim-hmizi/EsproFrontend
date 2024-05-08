import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RdiFrontComponent } from './rdifront.component';
import { RdiFrontRoutingModule } from './rdifront-routing.module';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { GalleriaModule } from 'primeng/galleria';
import { CarouselModule } from 'primeng/carousel';
import { DataViewModule } from 'primeng/dataview';

import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { RatingModule } from 'primeng/rating';
import { StyleClassModule } from 'primeng/styleclass';

import { FormsModule } from '@angular/forms';




@NgModule({
	imports: [
		StyleClassModule,
		RatingModule,
		DropdownModule,
		InputTextModule,
		OrderListModule,
		PickListModule,
		
		CommonModule,
		RdiFrontRoutingModule,
		ButtonModule,
		ImageModule,
		GalleriaModule,
		CarouselModule,
		DataViewModule
	],
	declarations: [RdiFrontComponent]
})
export class RdiFrontModule { }
