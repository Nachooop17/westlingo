import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelTres8PageRoutingModule } from './nivel-tres.8-routing.module';

import { NivelTres8Page } from './nivel-tres.8.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelTres8PageRoutingModule
  ],
  declarations: [NivelTres8Page]
})
export class NivelTres8PageModule {}
