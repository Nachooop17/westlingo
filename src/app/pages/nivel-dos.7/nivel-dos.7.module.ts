import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelDos7PageRoutingModule } from './nivel-dos.7-routing.module';

import { NivelDos7Page } from './nivel-dos.7.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelDos7PageRoutingModule
  ],
  declarations: [NivelDos7Page]
})
export class NivelDos7PageModule {}
