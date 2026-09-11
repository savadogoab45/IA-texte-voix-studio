import { Spinner } from "@/components/ui";

export default function Loading() {
  return (
    <div className="grid min-h-screen place-items-center">
      <Spinner className="h-6 w-6" />
    </div>
  );
}
