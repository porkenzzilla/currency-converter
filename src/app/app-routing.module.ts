import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TopComponent} from "./pages/top/top.component";
import { ConverterComponent} from "./pages/converter/converter.component";

const routes: Routes = [
  {path: "", component: TopComponent},
  {path: "converter", component: ConverterComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
