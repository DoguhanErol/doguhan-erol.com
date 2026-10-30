import { prisma } from "../lib/db";
import { defaultProfile, defaultProjects, defaultSkills } from "../lib/defaults";
import { hashPassword, normalizeEmail, normalizeUsername } from "../lib/credentials";

async function main() {
  const email = normalizeEmail(process.env.SEED_ADMIN_EMAIL || "admin@example.com");
  const username = normalizeUsername(process.env.SEED_ADMIN_USERNAME || "doguhan");
  const password = process.env.SEED_ADMIN_PASSWORD || "admin123";

  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username: { equals: username, mode: "insensitive" } }],
    },
  });

  if (!existing) {
    await prisma.user.create({
      data: {
        email,
        username,
        password: await hashPassword(password),
      },
    });
    console.log(`Admin oluşturuldu: ${username} (${email})`);
  } else {
    console.log(`Admin duruyor, şifre ezilmedi: ${existing.username}`);
  }

  await prisma.profile.upsert({
    where: { id: "main" },
    update: {},
    create: defaultProfile,
  });

  for (const project of defaultProjects) {
    const found = await prisma.project.findUnique({ where: { slug: project.slug } });
    if (!found) {
      await prisma.project.create({ data: project });
      console.log(`Proje eklendi: ${project.title}`);
    }
  }

  const skillCount = await prisma.skill.count();
  if (skillCount === 0) {
    await prisma.skill.createMany({ data: defaultSkills });
    console.log("Yetenekler eklendi");
  }

  console.log("Seed tamam");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
