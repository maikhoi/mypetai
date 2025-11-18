import { redirect } from "next/navigation";
import ClientRedirect from "./clientRedirect";

export const dynamic = "force-dynamic";

interface Params {
  encodedUrl: string;
}

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { encodedUrl } = await params;
  const decodedUrl = decodeURIComponent(encodedUrl);

  // Immediately send user away — no delay.
  // Tracking is handled entirely in ClientRedirect.
  return (
    <>
      <ClientRedirect encodedUrl={encodedUrl} />
      {redirect(decodedUrl)}
    </>
  );
}
