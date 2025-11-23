import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create admin user with specified credentials
  const adminPassword = await bcrypt.hash("Ocean0976@@", 10);
  const admin = await prisma.user.upsert({
    where: { email: "frankmwelwa32@gmail.com" },
    update: {
      password: adminPassword,
      role: "ADMIN",
      isVerified: false,
    },
    create: {
      email: "frankmwelwa32@gmail.com",
      password: adminPassword,
      role: "ADMIN",
      isVerified: false, // Admin also requires 2FA verification
    },
  });
  console.log("✅ Admin user created:", admin.email);
  console.log("📧 Admin credentials:");
  console.log("   Email: frankmwelwa32@gmail.com");
  console.log("   Password: Ocean0976@@");
  console.log("   Role: ADMIN");
  console.log("   Verified: false (requires 2FA)");

  // Create sample events organized by admin
  const event1 = await prisma.event.create({
    data: {
      title: "Annual Tech Conference 2025",
      description: "Join us for the biggest tech conference of the year featuring talks from industry leaders.",
      date: new Date("2025-06-15T10:00:00Z"),
      location: "Convention Center, Lusaka",
      organizerId: admin.id,
      approved: true,
    },
  });
  console.log("✅ Sample event created:", event1.title);

  const event2 = await prisma.event.create({
    data: {
      title: "Community Workshop: Web Development",
      description: "Learn the fundamentals of web development in this hands-on workshop.",
      date: new Date("2025-05-20T14:00:00Z"),
      location: "Community Hub, Ndola",
      organizerId: admin.id,
      approved: true,
    },
  });
  console.log("✅ Sample event created:", event2.title);

  const event3 = await prisma.event.create({
    data: {
      title: "Music Festival 2025",
      description: "Experience the best of local and international music at this exciting festival.",
      date: new Date("2025-07-10T16:00:00Z"),
      location: "Stadium Complex, Kitwe",
      organizerId: admin.id,
      approved: false, // Pending approval
    },
  });
  console.log("✅ Sample event created:", event3.title);

  console.log("🎉 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

