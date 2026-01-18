import type { ReactNode } from 'react';

type InfoTileProps = {
   label: string;
   value: string;
};

export function InfoTile({ label, value }: InfoTileProps) {
   return (
      <div className="border-border-low bg-card/70 rounded-2xl border p-4 text-left shadow-[0_18px_35px_rgba(0,0,0,0.28)]">
         <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.2em] uppercase">{label}</p>
         <p className="text-foreground mt-3 text-2xl font-semibold">{value}</p>
      </div>
   );
}

type InfoRowProps = {
   label: string;
   value: ReactNode;
};

export function InfoRow({ label, value }: InfoRowProps) {
   return (
      <div className="flex items-center justify-between gap-4">
         <span className="text-muted-foreground text-[11px] font-semibold tracking-[0.2em] uppercase">{label}</span>
         <div className="text-foreground text-sm font-semibold">{value}</div>
      </div>
   );
}
