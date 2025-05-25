import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
const prisma = new PrismaClient();

async function seedStages() {
  console.log('Start seeding stages...');

  const stages = [
    { id: 'pSOTN4Z0iGBT7e', name: 'Cold', color: '#64748b' }, // slate-500
    { id: 'QMbQIk4rWPwiYW', name: 'Due for validation', color: '#f59e0b' }, // amber-500
    { id: '1MJcur3ekOW5ul', name: 'Converted', color: '#22c55e' }, // green-500
    { id: 'VQEMBlOofaXZDT', name: 'Hot', color: '#ef4444' }, // red-500
    { id: 'TlDYQFL2HYAfvQ', name: 'Prospective', color: '#3b82f6' }, // blue-500
    { id: 'J9Cjc6N9NPW4Y0', name: 'Undecided', color: '#737373' }, // slate-400 (no 500 equivalent for light gray)
    { id: 'kenHPALeNH5-sd', name: 'Walk-in Expected', color: '#10b981' }, // emerald-500
    { id: 'gs6eITqsvfknIf', name: 'Walked In', color: '#8b5cf6' }, // violet-500
  ];

  for (const stage of stages) {
    const createdStage = await prisma.stage.upsert({
      where: { id: stage.id },
      update: {},
      create: stage,
    });
    console.log(`Created stage: ${createdStage.name}`);
  }

  console.log('Seeding stages completed.');
}

async function seedSources() {
  console.log('Start seeding sources...');

  const sources = [
    {
      id: 'PglcgQE9lR2a4D',
      source: 'Community Events',
      description:
        'Visitors who come to the institute through community events or local outreach activities.',
    },
    {
      id: 'HWkhCkaGwpNheW',
      source: 'Direct Walk-in',
      description:
        'People who visit the institute physically without prior online interaction.',
    },
    {
      id: 'xcQQsKYmH2ga3Q',
      source: 'Facebook',
      description: 'Facebook ads or organic posts.',
    },
    {
      id: 'aRGcid_FYUReus',
      source: 'Google',
      description: 'Google search results or Google ads.',
    },
    {
      id: 'Z9mYjV2brmJZID',
      source: 'Instagram',
      description: 'Instagram posts, stories, or ads.',
    },
    {
      id: '0d0KDsEf5FEHz8',
      source: 'Referrals',
      description: 'word-of-mouth or referral programs.',
    },
    {
      id: 'RCIObWhcKDArD8',
      source: 'Website',
      description: "Visitors who directly access the institute's website.",
    },
  ];

  for (const source of sources) {
    const createdSource = await prisma.sources.upsert({
      where: { id: source.id },
      update: {},
      create: source,
    });
    console.log(`Created source: ${createdSource.source}`);
  }

  console.log('Seeding sources completed.');
}

async function seedInstruments() {
  console.log('Start seeding instruments...');

  const instruments = [
    {
      id: 'Ot9E-RCYsJiaBF',
      name: 'Acoustic Guitar',
      description:
        'Great for beginners to develop finger strength and coordination while learning chords, strumming patterns, and basic melodies.',
    },
    {
      id: 'FapYtKKQvsUYZa',
      name: 'Carnatic Vocals',
      description:
        'Emphasizes voice training, precision in pitch, and understanding of ragas and talas. Builds a deep foundation in classical South Indian music traditions.',
    },
    {
      id: 'uVD6xcH65hIune',
      name: 'Drums',
      description:
        'Helps students develop a strong sense of rhythm, timing, and coordination. A great way to build focus and energy control through structured practice.',
    },
    {
      id: 'ZuddN1CdhSM9rt',
      name: 'Electric Guitar',
      description:
        'Perfect for students interested in rock, blues, or contemporary music. Helps develop finger strength, string bending techniques, and an understanding of different effects and tones.',
    },
    {
      id: 'ZmTwmZNTsxjQER',
      name: 'Hindustani Vocals',
      description:
        'Introduces students to the nuances of North Indian classical music, including raga development, voice modulation, and improvisation techniques.',
    },
    {
      id: 'B7umi84w2zyFiT',
      name: 'Piano',
      description:
        'Ideal for building a strong foundation in music theory, hand coordination, and sight-reading skills. Suitable for learners of all ages.',
    },
    {
      id: 'tcmwv0brKO0NOj',
      name: 'Ukulele',
      description:
        'Perfect for beginners due to its small size and simple chord structures. Helps develop rhythm, finger coordination, and basic song-playing skills.',
    },
    {
      id: '2opT8D2my5-XxZ',
      name: 'Violin',
      description:
        'A great instrument for developing fine motor skills, pitch recognition, and bowing technique. Helps students build discipline and expressiveness through classical and contemporary pieces.',
    },
    {
      id: '7ITh41fIS6Gli8',
      name: 'Western Vocals',
      description:
        'Focuses on pitch accuracy, breath control, and vocal techniques across genres like pop, rock, and jazz. Encourages expression and confidence in performance.',
    },
  ];

  for (const instrument of instruments) {
    const createdInstrument = await prisma.instruments.upsert({
      where: { id: instrument.id },
      update: {},
      create: instrument,
    });
    console.log(`Created instrument: ${createdInstrument.name}`);
  }

  console.log('Seeding instruments completed.');
}

async function seedPlans() {
  console.log('Start seeding plans...');

  const plans = [
    {
      code: 'RCmp_D',
      name: '1 month',
      price: 480000,
      total_slots: 8,
      description:
        'Ideal for short-term exploration or trial of the institute’s curriculum.',
      create_date: new Date('2025-05-18T13:58:24.644Z'),
      updated_date: new Date('2025-05-18T13:58:24.644Z'),
    },
    {
      code: '3YYKHo',
      name: '12 month',
      price: 4032000,
      total_slots: 96,
      description:
        'Comprehensive 12-month plan for deep learning and exam preparation.',
      create_date: new Date('2025-05-18T13:51:43.480Z'),
      updated_date: new Date('2025-05-18T13:55:53.195Z'),
    },
    {
      code: 'AtIG8r',
      name: '3 month',
      price: 1368000,
      total_slots: 24,
      description:
        '3-month plan suited for beginners to get oriented with structured learning.',
      create_date: new Date('2025-05-18T13:50:43.192Z'),
      updated_date: new Date('2025-05-18T13:50:43.192Z'),
    },
    {
      code: '97Z2dL',
      name: '6 month',
      price: 2492000,
      total_slots: 48,
      description:
        '6-month plan suited for intermediate progress or exam preparation.',
      create_date: new Date('2025-05-18T13:51:20.453Z'),
      updated_date: new Date('2025-05-18T13:51:20.453Z'),
    },
  ];

  for (const plan of plans) {
    const createdPlan = await prisma.plans.upsert({
      where: { code: plan.code },
      update: {},
      create: plan,
    });
    console.log(`Created plan: ${createdPlan.name} (${createdPlan.code})`);
  }

  console.log('Seeding plans completed.');
}

async function seedCourses() {
  const instruments = await prisma.instruments.findMany();

  const difficulties = ['FOUNDATION', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  for (const instrument of instruments) {
    for (const difficulty of difficulties) {
      const courseName = `${instrument.name} | ${difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}`;

      const course = await prisma.course.create({
        data: {
          id: nanoid(14),
          name: courseName,
          difficulty,
          description: `${difficulty.charAt(0) + difficulty.slice(1).toLowerCase()} course for the ${instrument.name.toLowerCase()}`,
          instrument_id: instrument.id,
          teacher_id: null,
        },
      });
      console.log(`Created course: ${course.name} (${course.id})`);
    }
  }

  console.log('Seeding completed.');
}

async function main() {
  await seedStages();
  await seedSources();
  await seedInstruments();
  await seedPlans();
  await seedCourses();
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
