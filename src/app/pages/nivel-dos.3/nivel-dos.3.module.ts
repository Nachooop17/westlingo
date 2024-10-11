import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelDos3PageRoutingModule } from './nivel-dos.3-routing.module';

import { NivelDos3Page } from './nivel-dos.3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelDos3PageRoutingModule
  ],
  declarations: [NivelDos3Page]
})
export class NivelDos3PageModule {}
