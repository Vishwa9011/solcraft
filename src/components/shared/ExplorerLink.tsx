"use client";

import Link from 'next/link';
import { useCluster } from '@/solana';
import React, { ReactNode } from 'react';

interface ExplorerLinkProps {
  label: string | ReactNode;
  path: string;
  className?: string
}

const ExplorerLink = ({ label, path, className }: ExplorerLinkProps) => {
  const { getExplorerUrl } = useCluster()
  return (
    <Link href={getExplorerUrl(path)} className={className}>
      {label}
    </Link>
  );
}

export default ExplorerLink;