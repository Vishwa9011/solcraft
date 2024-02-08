"use client";

import { useFormStatus } from "react-dom";
import { Button, ButtonProps } from "../ui/button";
import Loader from "./Loader";
import { cn } from "@/lib/utils/utils";
import AnimateButton from "../ui/animated-button";

interface SubmitButtonProps extends ButtonProps {
  text?: string;
  loadingText?: string;
  className?: string;
}

const SubmitButton = ({ text = "Submit", loadingText = "Submitting", className, ...rest }: SubmitButtonProps) => {
  const { pending } = useFormStatus()
  return (
    <AnimateButton className={cn("flex gap-2", className)} {...rest}>
      {pending && <Loader />}
      {pending ? loadingText : text}
    </AnimateButton>
  );
}

export default SubmitButton;