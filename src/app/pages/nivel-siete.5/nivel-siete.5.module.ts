import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelSiete5PageRoutingModule } from './nivel-siete.5-routing.module';

import { NivelSiete5Page } from './nivel-siete.5.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelSiete5PageRoutingModule
  ],
  declarations: [NivelSiete5Page]
})
export class NivelSiete5PageModule {}
