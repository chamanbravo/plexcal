interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface SuccessResponseParams<T> {
  title: string;
  message: string;
  data: T;
  pagination?: Pagination;
}

export function successResponse<T>({
  title,
  message,
  data,
  pagination,
}: SuccessResponseParams<T>) {
  return pagination
    ? {
        title,
        message,
        data,
        pagination,
      }
    : {
        title,
        message,
        data,
      };
}
