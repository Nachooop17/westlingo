import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NivelTres5PageRoutingModule } from './nivel-tres.5-routing.module';

import { NivelTres5Page } from './nivel-tres.5.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NivelTres5PageRoutingModule
  ],
  declarations: [NivelTres5Page]
})
export class NivelTres5PageModule {}
