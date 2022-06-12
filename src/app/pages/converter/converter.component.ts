import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {IExchangeRateResponse} from "../../core/interfaces/api-currency.interface";
import {ApiService} from "../../core/api-services/api-currency.service";

@Component({
  selector: 'app-converter',
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConverterComponent implements OnInit, OnDestroy {
  converterForm!: FormGroup;
  defaultRates: IExchangeRateResponse | undefined;
  currentRates: IExchangeRateResponse | undefined;

  currenciesList: string[] | undefined;
  subs: Subscription[] = [];

  constructor(private _apiService: ApiService, private _ch: ChangeDetectorRef) {
    this.converterForm = new FormGroup({
      baseName: new FormControl('USD'),
      baseValue: new FormControl(1, [Validators.required, Validators.min(0)]),
      targetName: new FormControl('UAH'),
      targetValue: new FormControl(0, [Validators.required, Validators.min(0)])
    });
  }

  ngOnInit(): void {
    this.initConverterListeners();
    this._ch.detectChanges();

    this._apiService.getLatestRates('USD').subscribe(res => {
      this.defaultRates = res;
      this.currentRates = res;

      this.currenciesList = Object.keys(res.rates);

      this.baseValueChange();
      this._ch.detectChanges();
    })
  }

  initConverterListeners(): void {
    this.subs.push(...[
      this.converterForm.get('baseValue')!.valueChanges.subscribe(() => {
        this.baseValueChange();
      }),
      this.converterForm.get('baseName')!.valueChanges.subscribe(() => {
        this.baseNameChange();
      }),
      this.converterForm.get('targetValue')!.valueChanges.subscribe(() => {
        this.targetValueChange();
      }),
      this.converterForm.get('targetName')!.valueChanges.subscribe(() => {
        this.targetNameChange();
      }),
    ])
  }

  baseNameChange(): void {
    const baseName = this.converterForm.get('baseName')!.value;

    this._apiService.getLatestRates(baseName).subscribe(res => {
      this.currentRates = res;
      this.currenciesList = Object.keys(res.rates);

      this.baseValueChange();
    })
  }

  targetNameChange(): void {
    this.baseValueChange();
  }

  swapSide(): void {
    const targetNameControl = this.converterForm.get('targetName')!;
    const baseNameControl = this.converterForm.get('baseName')!;

    const targetName = targetNameControl.value;
    const baseName = baseNameControl.value;

    this._apiService.getLatestRates(targetName).subscribe(res => {
      this.currentRates = res;
      this.currenciesList = Object.keys(res.rates);

      targetNameControl.setValue(baseName, {emitEvent: false})
      baseNameControl.setValue(targetName, {emitEvent: false})
      this.baseValueChange();
    })
  }

  targetValueChange(): void {
    const targetName = this.converterForm.get('targetName')!.value;
    const targetValueControl = this.converterForm.get('targetValue')!;
    const baseValueControl = this.converterForm.get('baseValue')!;

    const targetValue = targetValueControl.value;
    const rate = this.currentRates!.rates[targetName]!;

    const backRate = 1 / rate;
    const resultValue = targetValue * backRate
    baseValueControl.setValue(this.roundNum(resultValue, 4), {emitEvent: false})

  }

  baseValueChange(): void {
    const targetName = this.converterForm.get('targetName')!.value;
    const targetValueControl = this.converterForm.get('targetValue')!;
    const baseValueControl = this.converterForm.get('baseValue')!;

    const baseValue = baseValueControl.value;
    const rate = this.currentRates!.rates[targetName]!;

    const resultValue = baseValue * rate
    targetValueControl.setValue(this.roundNum(resultValue, 4), {emitEvent: false})
  }

  roundNum(value: number, decimal: number): number {
    return +value.toFixed(decimal);
  }

  ngOnDestroy(): void {
    for (const sub of this.subs) {
      sub.unsubscribe();
    }
  }

}
