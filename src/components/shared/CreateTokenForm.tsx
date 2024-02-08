"use client";

import * as z from "zod";
import { Input } from "../ui/input";
import SubmitButton from "./SubmitButton";
import { tokenSchema } from "@/lib/validator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tokenDefaultValues } from "@/constants";
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Form } from "../ui/form";
import { useProvider } from "@/context/AppProvider";
import { Button } from "../ui/button";
import useTransactionToast from "@/hooks/useTransactionToast";
import DragAndDrop from "./DragAndDrop";
import { createTokenAndMint } from "@/lib/actions/mint";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Textarea } from "../ui/textarea";

const CreateTokenForm = () => {
  const wallet = useWallet()
  const { connection } = useConnection()
  const txToast = useTransactionToast()

  const form = useForm<z.infer<typeof tokenSchema>>({
    resolver: zodResolver(tokenSchema),
    defaultValues: tokenDefaultValues
  });



  const handleImageChange = async (file: File) => {

  }


  async function onSubmit(values: z.infer<typeof tokenSchema>) {
    createTokenAndMint({ ...values, image: "" }, wallet, connection)
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Name</FormLabel>
                  <FormControl className="w-full">
                    <Input placeholder="Token Name" {...field} className="input-field" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Symbol</FormLabel>
                  <FormControl className="w-full">
                    <Input placeholder="Token symbol" {...field} className="input-field" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DragAndDrop className={"border-red-50 row-span-3 md:row-span-3 md:row-start-2 md:col-start-2 p-2"} handleImg={handleImageChange} />
            <FormField
              control={form.control}
              name="decimals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Decimals</FormLabel>
                  <FormControl className="w-full">
                    <Input type="number" placeholder="Decimals" {...field} className="input-field" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl className="w-full">
                    <Input type="number" placeholder="Amount" {...field} className="input-field" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metadataUrl"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>Metadata URL</FormLabel>
                  <FormControl className="w-full">
                    <Input type="url" placeholder="Metadata URL" {...field} className="input-field" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Metadata URL</FormLabel>
                  <FormControl className="w-full">
                    <Textarea {...field} placeholder="Type a short description... " className="textfield resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-center mt-5">
            <SubmitButton className="p-medium-18" text="Create Token" loadingText="Creating..." />
          </div>
        </form>
      </Form>
    </div>
  );
}

export default CreateTokenForm;