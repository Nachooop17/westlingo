import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelTres4PageRoutingModule } from './nivel-tres.4-routing.module';

import { NivelTres4Page } from './nivel-tres.4.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelTres4PageRoutingModule
  ],
  declarations: [NivelTres4Page]
})
export class NivelTres4PageModule {}
