import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelTres2PageRoutingModule } from './nivel-tres.2-routing.module';

import { NivelTres2Page } from './nivel-tres.2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelTres2PageRoutingModule
  ],
  declarations: [NivelTres2Page]
})
export class NivelTres2PageModule {}
