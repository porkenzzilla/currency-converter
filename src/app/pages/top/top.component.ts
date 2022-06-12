import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { ApiService } from "../../core/api-services/api-currency.service";
import {IExchangeRateResponse} from "../../core/interfaces/api-currency.interface";

enum BUTTON_STATE {
  normal = 'Show more',
  expanded = 'Hide'
}

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopComponent implements OnInit{
  defaultCompareCurrencies = ['USD', 'EUR'];
  defaultRates: IExchangeRateResponse | undefined;
  currenciesList: string[] | undefined;
  dataLength = 0;
  limit = 0;
  buttonText = BUTTON_STATE.normal;

  constructor(private _apiService: ApiService, private _ch: ChangeDetectorRef) {
  }
 ngOnInit(): void {
   this._ch.detectChanges();
   this._apiService.getLatestRates('UAH').subscribe(res => {
     this.defaultRates = res;
     this.dataLength = Object.keys(res.rates).length;
     this.currenciesList = Object.keys(res.rates);
     this._ch.detectChanges();
   })
 }
  showMoreTokens(): void {
    if (this.buttonText === BUTTON_STATE.normal) {
      this.limit = this.dataLength;
      this.buttonText = BUTTON_STATE.expanded;
      return;
    } else if (this.buttonText === BUTTON_STATE.expanded) {
      this.limit = 0;
      this.buttonText = BUTTON_STATE.normal;
      return;
    }
  }
}
