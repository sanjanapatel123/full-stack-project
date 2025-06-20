import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      name: 'Sanjana',
      email: 'sanjana@example.com',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Alex',
      email: 'alex@example.com',
    },
  });

  await prisma.event.create({
    data: {
      name: 'Tech Meetup',
      location: 'Mumbai',
      startTime: new Date(),
      attendees: {
        connect: { id: user1.id },
      },
    },
  });

  await prisma.event.create({
    data: {
      name: 'Open Mic Night',
      location: 'Pune',
      startTime: new Date(),
    },
  });
}

main().then(() => {
  console.log("🌱 Database seeded");
  prisma.$disconnect();
});
