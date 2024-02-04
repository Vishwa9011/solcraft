import * as z from "zod";
import { Input } from "../ui/input";
import SubmitButton from "./SubmitButton";
import { tokenSchema } from "@/lib/validator";

const CreateTokenForm = () => {

  async function onSubmit(values: z.infer<typeof tokenSchema>) {
    console.log(values);
  }


  return (
    <div className="">
      <form action="" className="grid grid-cols-2">
        <Input placeholder="Token Name" className="input-field" />

        <SubmitButton text="Create Token" loadingText="Creating..." />
      </form>
    </div>
  );
}

export default CreateTokenForm;