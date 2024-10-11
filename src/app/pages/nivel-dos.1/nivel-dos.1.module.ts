import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelDos1PageRoutingModule } from './nivel-dos.1-routing.module';

import { NivelDos1Page } from './nivel-dos.1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelDos1PageRoutingModule
  ],
  declarations: [NivelDos1Page]
})
export class NivelDos1PageModule {}
