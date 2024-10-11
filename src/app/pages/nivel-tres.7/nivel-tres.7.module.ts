import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelTres7PageRoutingModule } from './nivel-tres.7-routing.module';

import { NivelTres7Page } from './nivel-tres.7.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelTres7PageRoutingModule
  ],
  declarations: [NivelTres7Page]
})
export class NivelTres7PageModule {}
