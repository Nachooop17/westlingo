import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelDos5PageRoutingModule } from './nivel-dos.5-routing.module';

import { NivelDos5Page } from './nivel-dos.5.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelDos5PageRoutingModule
  ],
  declarations: [NivelDos5Page]
})
export class NivelDos5PageModule {}
