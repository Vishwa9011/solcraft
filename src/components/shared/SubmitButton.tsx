"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import Loader from "./Loader";

interface SubmitButtonProps {
  text?: string;
  loadingText?: string;
}

const SubmitButton = ({ text = "Submit", loadingText = "Submitting" }: SubmitButtonProps) => {
  const { pending } = useFormStatus()
  return (
    <Button className="flex gap-2">
      {pending && <Loader />}
      {pending ? loadingText : text}
    </Button>
  );
}

export default SubmitButton;