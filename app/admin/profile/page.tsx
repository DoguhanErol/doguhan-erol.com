import { ProfileForm } from "@/components/admin/profile-form";
import { getProfile } from "@/lib/content";
import { resolvePublicMediaUrl } from "@/lib/media-url";

export default async function ProfilePage() {
  const profile = await getProfile();
  if (!profile) {
    return <p>Profil yok. Seed çalıştırın.</p>;
  }

  const portrait = resolvePublicMediaUrl(profile.portraitUrl);

  return (
    <div>
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">Profil</h1>
      <ProfileForm
        profile={{
          ...profile,
          portraitUrl: portrait ? `${portrait}?v=${profile.updatedAt.getTime()}` : null,
        }}
      />
    </div>
  );
}
