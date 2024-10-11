import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelDos6PageRoutingModule } from './nivel-dos.6-routing.module';

import { NivelDos6Page } from './nivel-dos.6.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelDos6PageRoutingModule
  ],
  declarations: [NivelDos6Page]
})
export class NivelDos6PageModule {}
