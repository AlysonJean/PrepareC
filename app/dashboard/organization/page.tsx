import { getOrganization } from "@/lib/auth-service";
import { OrgForm } from "./org-form";

export default async function OrganizationPage() {
    const org = await getOrganization();

    if (!org) {
        return <div>Organização não encontrada.</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-lg font-semibold md:text-2xl">Minha Organização</h1>
            <OrgForm initialData={org} />
        </div>
    );
}
