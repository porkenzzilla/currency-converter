import {Pipe, PipeTransform} from '@angular/core';
import {IExchangeRateResponse} from '../../core/interfaces/api-currency.interface';

@Pipe({
  name: 'rateByName'
})
export class RateByNamePipe implements PipeTransform {

  transform(value: string, data: IExchangeRateResponse): number {
    if (!value) {
      return 0;
    }

    const rate = data.rates[value] ?? 1;

    return +(1 / rate).toFixed(2);
  }

}
