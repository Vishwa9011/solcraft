'use client';

type ErrorMessageProps = {
   error: string | null;
};

export function ErrorMessage({ error }: ErrorMessageProps) {
   if (!error) return null;
   return <p className="text-destructive text-xs font-semibold">{error}</p>;
}
