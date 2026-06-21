import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;

  if (url.includes('api/customer-config')) {
    return of(new HttpResponse({
      status: 200,
      body: {
        isKycRequired: true,
        isPremiumUser: true
      }
    }));
  }

  if (url.endsWith('/api/countries')) {
    return of(new HttpResponse({
      status: 200,
      body: [
        { name: 'United States', code: 'US' },
        { name: 'Canada', code: 'CA' },
        { name: 'United Kingdom', code: 'GB' }
      ]
    }));
  }

  if (url.includes('/api/states/')) {
    const parts = url.split('/');
    const country = parts[parts.length - 1];
    let states: { name: string; code: string }[] = [];
    if (country === 'US') {
      states = [
        { name: 'New York', code: 'NY' },
        { name: 'California', code: 'CA' }
      ];
    } else if (country === 'CA') {
      states = [
        { name: 'Ontario', code: 'ON' },
        { name: 'Quebec', code: 'QC' }
      ];
    } else if (country === 'GB') {
      states = [
        { name: 'England', code: 'ENG' },
        { name: 'Scotland', code: 'SCT' }
      ];
    }
    return of(new HttpResponse({
      status: 200,
      body: states
    }));
  }

  return next(req);
};
