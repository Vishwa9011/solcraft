'use client';

type ErrorMessageProps = {
   error: string | null;
};

export function ErrorMessage({ error }: ErrorMessageProps) {
   if (!error) return null;
   return (
      <div
         role="alert"
         className="border-destructive/30 bg-destructive/5 text-destructive rounded-2xl border px-3 py-2 text-xs font-medium"
      >
         {error}
      </div>
   );
}
