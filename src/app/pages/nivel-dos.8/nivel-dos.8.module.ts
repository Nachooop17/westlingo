import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelDos8PageRoutingModule } from './nivel-dos.8-routing.module';

import { NivelDos8Page } from './nivel-dos.8.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelDos8PageRoutingModule
  ],
  declarations: [NivelDos8Page]
})
export class NivelDos8PageModule {}
