import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelOcho6PageRoutingModule } from './nivel-ocho.6-routing.module';

import { NivelOcho6Page } from './nivel-ocho.6.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelOcho6PageRoutingModule
  ],
  declarations: [NivelOcho6Page]
})
export class NivelOcho6PageModule {}
