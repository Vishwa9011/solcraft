"use client";

import * as z from "zod";
import { Input } from "../ui/input";
import SubmitButton from "./SubmitButton";
import { tokenSchema } from "@/lib/validator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tokenDefaultValues } from "@/constants";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Form } from "../ui/form";

const CreateTokenForm = () => {

  const form = useForm<z.infer<typeof tokenSchema>>({
    resolver: zodResolver(tokenSchema),
    defaultValues: tokenDefaultValues
  });


  async function onSubmit(values: z.infer<typeof tokenSchema>) {
    console.log('values: ', values);
  }

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-5">
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
              name="totalSupply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Supply</FormLabel>
                  <FormControl className="w-full">
                    <Input type="number" placeholder="Total Supply" {...field} className="input-field" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="metadataUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Metadata URL</FormLabel>
                <FormControl className="w-full">
                  <Input type="url" placeholder="Metadata URL" {...field} className="input-field" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center mt-5">
            <SubmitButton className="p-medium-18" text="Create Token" loadingText="Creating..." />
          </div>
        </form>
      </Form>

    </div>
  );
}

export default CreateTokenForm;