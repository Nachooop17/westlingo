import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelTres6PageRoutingModule } from './nivel-tres.6-routing.module';

import { NivelTres6Page } from './nivel-tres.6.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelTres6PageRoutingModule
  ],
  declarations: [NivelTres6Page]
})
export class NivelTres6PageModule {}
