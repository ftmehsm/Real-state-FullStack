import CreateAdForm from "@/components/ads/CreateAdForm";
import { categories } from "@/const/ad";
import { getAdById } from "@/lib/services/ad.services";
import { updateAdAction } from "@/app/actions/ad.actions";
import { notFound } from "next/navigation";

type EditAdPageProps = {
  params: Promise<{
    adId: string;
  }>;
};

export default async function EditAdPage({
  params,
}: EditAdPageProps) {
  const { adId } = await params;

  console.log("adId:", adId);
console.log("typeof adId:", typeof adId);

  const ad = await getAdById(adId);

  if (!ad) {
    notFound();
  }

  const updateAction = updateAdAction.bind(null, adId);

  return (
    <main>
      <CreateAdForm
        initialData={ad}
        categories={categories}
        action={updateAction}
        isEditing
      />
    </main>
  );
}