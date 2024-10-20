import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelSiete7PageRoutingModule } from './nivel-siete.7-routing.module';

import { NivelSiete7Page } from './nivel-siete.7.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelSiete7PageRoutingModule
  ],
  declarations: [NivelSiete7Page]
})
export class NivelSiete7PageModule {}
