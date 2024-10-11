import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelTres1PageRoutingModule } from './nivel-tres.1-routing.module';

import { NivelTres1Page } from './nivel-tres.1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelTres1PageRoutingModule
  ],
  declarations: [NivelTres1Page]
})
export class NivelTres1PageModule {}
