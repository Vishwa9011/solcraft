'use client';
import { useState, type ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Coins, Shield } from 'lucide-react';
import { useTokenActions } from '../hooks';
import { address } from '@solana/kit';
import { toast } from 'sonner';

const cardShell = 'border-border/60 bg-card/80 shadow-sm rounded-2xl';
const labelClass = 'text-[11px] font-semibold text-muted-foreground';

type FieldStackProps = {
   id: string;
   label: string;
   children: ReactNode;
};

function FieldStack({ id, label, children }: FieldStackProps) {
   return (
      <div className="flex flex-col gap-1.5">
         <label className={labelClass} htmlFor={id}>
            {label}
         </label>
         {children}
      </div>
   );
}

export function TokenBuilderSidecards() {
   const { mintTokens, transferOrRevokeMintAuthority } = useTokenActions();
   const [mintAddress, setMintAddress] = useState('');
   const [mintAmount, setMintAmount] = useState('');
   const [mintAuthorityAddress, setMintAuthorityAddress] = useState('');
   const [mintAuthorityNew, setMintAuthorityNew] = useState('');

   const parseAddress = (value: string, label: string) => {
      const trimmed = value.trim();
      if (!trimmed) {
         toast.error(`Enter a ${label}.`);
         return null;
      }
      try {
         return address(trimmed);
      } catch (error) {
         toast.error(error instanceof Error ? error.message : `Invalid ${label}.`);
         return null;
      }
   };

   const parseAmount = (value: string) => {
      const amount = Number(value);
      if (!Number.isFinite(amount) || amount <= 0) {
         toast.error('Enter a valid amount.');
         return null;
      }
      return amount;
   };

   const handleMintTokens = async () => {
      const mint = parseAddress(mintAddress, 'mint address');
      const amount = parseAmount(mintAmount);
      if (!mint || amount === null) return;

      await mintTokens.mutateAsync({ mint, amount: BigInt(amount) });
   };

   const handleTransferMintAuthority = async (revoke: boolean) => {
      const mint = parseAddress(mintAuthorityAddress, 'mint address');
      if (!mint) return;
      if (revoke) {
         await transferOrRevokeMintAuthority.mutateAsync({ mint, newAuthority: null });
      }
      const newAuthority = parseAddress(mintAuthorityNew, 'new authority address');
      if (!newAuthority) return;
      await transferOrRevokeMintAuthority.mutateAsync({ mint, newAuthority });
   };

   const hasMintAddress = Boolean(mintAddress.trim());
   const hasMintAmount = Boolean(mintAmount.trim());
   const hasMintAuthorityAddress = Boolean(mintAuthorityAddress.trim());
   const hasMintAuthorityNew = Boolean(mintAuthorityNew.trim());

   return (
      <div className="space-y-8">
         <Card className={cardShell}>
            <CardHeader>
               <CardTitle>Mint Desk</CardTitle>
               <CardDescription>Mint additional supply into your wallet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <FieldStack id="mint-desk-address" label="Mint address">
                  <Input
                     id="mint-desk-address"
                     placeholder="Mint public key"
                     value={mintAddress}
                     onChange={event => setMintAddress(event.target.value)}
                  />
               </FieldStack>
               <FieldStack id="mint-desk-amount" label="Amount">
                  <Input
                     id="mint-desk-amount"
                     type="number"
                     min={0}
                     placeholder="250000"
                     value={mintAmount}
                     onChange={event => setMintAmount(event.target.value)}
                  />
               </FieldStack>
               <Button
                  type="button"
                  className="w-full"
                  onClick={() => void handleMintTokens()}
                  disabled={!hasMintAddress || !hasMintAmount || mintTokens.isPending}
               >
                  {mintTokens.isPending ? 'Minting...' : 'Mint tokens'}
               </Button>
               <p className="text-muted-foreground text-xs">Requires mint authority on the token.</p>
            </CardContent>
         </Card>

         <Card className={cardShell}>
            <CardHeader>
               <div className="flex items-center justify-between">
                  <div>
                     <CardTitle>Authority Desk</CardTitle>
                     <CardDescription>Transfer or revoke mint and freeze powers.</CardDescription>
                  </div>
                  <Badge variant="outline">Critical</Badge>
               </div>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                     <Coins className="text-primary size-4" />
                     Mint authority
                  </div>
                  <FieldStack id="authority-mint-address" label="Mint address">
                     <Input
                        id="authority-mint-address"
                        placeholder="Mint address"
                        value={mintAuthorityAddress}
                        onChange={event => setMintAuthorityAddress(event.target.value)}
                     />
                  </FieldStack>
                  <FieldStack id="authority-mint-new" label="New authority">
                     <Input
                        id="authority-mint-new"
                        placeholder="New authority address or leave empty to revoke"
                        value={mintAuthorityNew}
                        onChange={event => setMintAuthorityNew(event.target.value)}
                     />
                  </FieldStack>
                  <div className="flex gap-2">
                     <Button
                        type="button"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => void handleTransferMintAuthority(false)}
                        disabled={
                           !hasMintAuthorityAddress || !hasMintAuthorityNew || transferOrRevokeMintAuthority.isPending
                        }
                     >
                        {transferOrRevokeMintAuthority.isPending ? 'Transferring...' : 'Transfer'}
                     </Button>
                     <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => void handleTransferMintAuthority(true)}
                        disabled={!hasMintAuthorityAddress || transferOrRevokeMintAuthority.isPending}
                     >
                        {transferOrRevokeMintAuthority.isPending ? 'Revoking...' : 'Revoke'}
                     </Button>
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
