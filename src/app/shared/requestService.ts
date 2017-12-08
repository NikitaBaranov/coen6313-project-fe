import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {environment} from '../../environments/environment';
import {Request} from './request.model';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Result} from './result.model';

@Injectable()
export class RequestService {

  private URL: string = environment.BE_URL;
  private ADDRESS = 'api/';

  constructor(private http: Http) {
  }

  /*
    // getData() {
    //   return this.http.get(this.URL + this.ADDRESS)
    //     .map(res => res.json());
    // }

    // getCategories(): Promise<Stock[]> {
    //   return this.http.get(this.URL + this.ADDRESS)
    //     .toPromise()
    //     .then(response => response.json() as Stock[])
    //     .catch(this.handleError);
    // }
  */

  recognise(request: Request): Promise<Result> {
    console.log(request);
    return this.http.post(this.URL + this.ADDRESS, request)
      .toPromise().then(response => response.json() as Request)
      .catch(this.handleError);
  }

  /*
    // updateStock(stock: Stock): Promise<Stock> {
    //   return this.http.put(this.URL + this.ADDRESS, stock)
    //     .toPromise()
    //     .then(response => response.json() as Stock)
    //     .catch(this.handleError);
    // }

    // deleteStock(id: string): Promise<any> {
    //   return this.http.delete(this.URL + this.ADDRESS + id)
    //     .toPromise()
    //     .catch(this.handleError);
    // }
  */

  private handleError(error: any): Promise<any> {
    console.error('Some error occured', error);
    return Promise.reject(error.message || error);
  }
}
