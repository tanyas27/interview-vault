import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getApplication, updateApplication } from '@/actions/applications';
import { ApplicationForm } from '@/components/applications/ApplicationForm';
import { Button } from '@/components/ui/button';

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const application = await getApplication(id);

  if (!application) {
    notFound();
  }

  const updateActionWithId = updateApplication.bind(null, id);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/applications/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1c2024]">
            Edit Application
          </h1>
          <p className="text-xs text-[#717682] mt-0.5">
            Update role details, compensation, and interview progress for {application.companyName}
          </p>
        </div>
      </div>

      <ApplicationForm
        action={updateActionWithId}
        initialData={application}
        submitLabel="Save Changes"
      />
    </div>
  );
}
