import ClientRedirect from "./clientRedirect";

export const dynamic = "force-dynamic";

interface Params {
  encodedUrl: string;
}

export default async function GoProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { encodedUrl } = await params;
  return <ClientRedirect encodedUrl={encodedUrl} />;
}
