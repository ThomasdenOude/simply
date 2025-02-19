import { HttpErrorResponse } from '@angular/common/http';

export type ObserveValues<T> = {
  loading: boolean;
  empty: boolean;
  data: T | null;
  error: Error | HttpErrorResponse | null;
};
