import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";
import {IExchangeRateResponse} from "../interfaces/api-currency.interface";

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private _http: HttpClient) {
  }

  getLatestRates(base: string): Observable<IExchangeRateResponse> {
    return this._http.get<IExchangeRateResponse>(`https://api.exchangerate.host/latest?base=${base}`);
  }
}
