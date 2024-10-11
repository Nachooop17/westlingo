import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelDos2PageRoutingModule } from './nivel-dos.2-routing.module';

import { NivelDos2Page } from './nivel-dos.2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelDos2PageRoutingModule
  ],
  declarations: [NivelDos2Page]
})
export class NivelDos2PageModule {}
