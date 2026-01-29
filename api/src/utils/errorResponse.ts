interface FieldError {
  field: string;
  message: string;
}

interface ErrorResponseParams {
  title: string;
  message: string;
  errors?: FieldError[];
}

export const errorResponse = ({
  title,
  message,
  errors,
}: ErrorResponseParams) => ({
  title,
  message,
  ...(errors && { errors }),
});
