import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelOcho2PageRoutingModule } from './nivel-ocho.2-routing.module';

import { NivelOcho2Page } from './nivel-ocho.2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelOcho2PageRoutingModule
  ],
  declarations: [NivelOcho2Page]
})
export class NivelOcho2PageModule {}
