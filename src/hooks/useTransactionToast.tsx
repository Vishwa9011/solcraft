"use client"
import ExplorerLink from '@/components/shared/ExplorerLink';
import React from 'react';
import toast from 'react-hot-toast';

const useTransactionToast = () => {
  return (txHash: string) => toast.custom(t => (
    <div className="bg-white text-black rounded-lg px-4 py-2 h-20 flex flex-col gap-2">
      <p className='font-semibold'>Transaction Confirmed! 🎉</p>
      <div className="flex gap-2">
        <ExplorerLink path={`tx/${txHash}`} label={"View"} className='ml-auto btn btn-primary btn-sm' />
        <button className='btn btn-sm hover:bg-gray-100 ' onClick={() => toast.dismiss(t.id)}>Dismiss</button>
      </div>
    </div>
  ));
}

export default useTransactionToast;