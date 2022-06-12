import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { RateByNamePipe } from "./pipes/rate-by-name.pipe";

@NgModule({
  declarations: [RateByNamePipe],
  imports: [
    CommonModule
  ],
  exports: [RateByNamePipe]
})
export class SharedModule {
}


