import PropertyForm from "@/components/admin/PropertyForm";

export const dynamic = "force-dynamic";

export default function NewProperty() {
  return (
    <>
      <h1 className="mb-6 font-display text-3xl font-bold">Add property</h1>
      <PropertyForm />
    </>
  );
}
