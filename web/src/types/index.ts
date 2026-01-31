export type CalendarViewType = "calendar" | "list";
export type ClassViewType = "schedule" | "types";

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  title: string;
  message: string;
  errors: ApiFieldError[];
}
