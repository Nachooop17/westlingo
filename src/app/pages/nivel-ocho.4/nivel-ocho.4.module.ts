import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelOcho4PageRoutingModule } from './nivel-ocho.4-routing.module';

import { NivelOcho4Page } from './nivel-ocho.4.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelOcho4PageRoutingModule
  ],
  declarations: [NivelOcho4Page]
})
export class NivelOcho4PageModule {}
