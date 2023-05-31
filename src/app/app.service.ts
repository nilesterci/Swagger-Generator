import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  public sendGet(req) {
    // req.url = "https://painel-pedido-dev.plataformaneo.com.br/api/v1/assistedSale/sellers/getAll?quantityByPage=10&page=1";
    // req.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIzeS9HWjhXbzNnc2VMU1R1TmtGbXlnPT0iLCJzdWIiOiJnVldtcWRQdHRMK1dzcVk3eVlVb0dER0xhVktZWlBheTdxY3JUWXdvbUxoNWc1ZFgwVHN3dXB2WWVmeFJLT1pRIiwianRpIjoiYTE5YWM0NzctMGYyYi00MWI5LTkyYmYtNDBmY2FkNjQ5ODE1IiwibmZiIjoxNjYwNjg1OTM4LCJVcmxTdGF0aWNGaWxlcyI6IlRNSjNXeFJOTFBZRmZ4Vy9xVmt3cmdTVDBZN0ZnUXQ2SGFRSnRkS2pkNDRITjNrY2hyMnI0cHFvaWVtMGlaSXRrbTBoM0dUTWZ1ZmVxUThiU2ZxanJ3PT0iLCJNaWNyb1NlcnZpY2UiOiJwYWluZWxwZWRpZG8iLCJhY2Nlc3NfdG9rZW4iOnRydWUsInN0YXJ0IjoxLCJlbmQiOjMsImlhdCI6MTY2MDY4NTkzOCwiZXhwIjoxNjYwNjg5NTM4LCJhdWQiOiJodHRwOi8vcGFpbmVscGVkaWRvLWRldi5wbGF0YWZvcm1hbmVvLmNvbS5ici8iLCJpc3MiOiJKZXQifQ.acLWio2HW_Grr0PiGDpEvhQhNrdgVSFrS4ZJS-yxIWA";
    var params = new HttpParams();

    const headers1 = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.token}`,
    });

    // params = params.append("nome", valor.toString());

    try {
      switch (req.tipo) {
        case 'get': {
          return this.http.get<any>(`https://${req.url}`, {
            headers: headers1,
            params: req.parametros,
          });
        }
        case 'post': {
          return this.http.get<any>(`https://${req.url}`, {
            headers: headers1,
            params: req.parametros,
          });
        }
        case 'put': {
          return this.http.get<any>(`https://${req.url}`, {
            headers: headers1,
            params: req.parametros,
          });
        }
        case 'delete': {
          return this.http.get<any>(`https://${req.url}`, {
            headers: headers1,
            params: req.parametros,
          });
        }
        default: {
          return this.http.get<any>(`https://${req.url}`);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  public getToken(req) {
    const headers1 = new HttpHeaders({
      'Content-Type': 'application/json-patch+json',
      Authorization: `Bearer ${req.token}`,
    });

    try {
      return this.http.post<any>(`https://${req.url.split('/')[0]}/api/v1/auth`, req.credential, {
        headers: headers1
      });

    } catch (error) {
      throw error;
    }
}
}
