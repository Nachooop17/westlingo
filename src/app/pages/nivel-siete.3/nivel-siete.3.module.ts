import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelSiete3PageRoutingModule } from './nivel-siete.3-routing.module';

import { NivelSiete3Page } from './nivel-siete.3.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelSiete3PageRoutingModule
  ],
  declarations: [NivelSiete3Page]
})
export class NivelSiete3PageModule {}
