import { ChildrenNode } from "@/lib/types";
import { Button } from "./button";
import { cn } from "@/lib/utils";

type AnimateButtonProps = {} & ChildrenNode & React.ComponentProps<typeof Button>;

const AnimateButton = ({ children, className, ...rest }: AnimateButtonProps) => {
  return (
    <Button variant={"normal"} className={cn('btn btn-primary gray-200 relative py-2 px-8 overflow-hidden bg-white rounded-full transition-all duration-400 ease-in-out shadow-md hover:scale-105 hover:text-white hover:shadow-lg active:scale-90 before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-blue-500 before:to-blue-300 before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-lg hover:before:left-0', className)} {...rest}>
      {children}
    </Button>
  );
}

export default AnimateButton;