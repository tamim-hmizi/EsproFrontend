import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { CloudinaryModule } from '@cloudinary/ng';
@NgModule({
    declarations: [],
    imports: [CloudinaryModule, CommonModule, PagesRoutingModule],
})
export class PagesModule {}
