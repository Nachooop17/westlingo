import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelDos4PageRoutingModule } from './nivel-dos.4-routing.module';

import { NivelDos4Page } from './nivel-dos.4.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelDos4PageRoutingModule
  ],
  declarations: [NivelDos4Page]
})
export class NivelDos4PageModule {}
