import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
// FormsModule might not be needed if your redirector page has no forms
// import { FormsModule } from '@angular/forms';

import { QuizFinalRedirectorPageRoutingModule } from './quiz-final-redirector-routing.module';

// QuizFinalRedirectorPage is standalone, so it's not declared here.
// It's also not imported here unless used in a template of another component declared in this module.

@NgModule({
  imports: [
    CommonModule,
    // FormsModule, 
    IonicModule,
    QuizFinalRedirectorPageRoutingModule // Import the routing module
  ],
  // declarations: [] // Should be empty as QuizFinalRedirectorPage is standalone and routed
})
export class QuizFinalRedirectorPageModule { } // Ensure this class name matches what app-routing.module.ts expects