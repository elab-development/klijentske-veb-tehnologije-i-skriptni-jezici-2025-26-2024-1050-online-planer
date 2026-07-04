import type { EventCategoryId } from '../types/EventCategory';
import type { PlannerEventProps } from '../types/PlannerEvent';

const seedTimestamp = '2026-06-01T08:00:00.000Z';

interface EventSeedInput {
  id: string;
  userId: number;
  title: string;
  dateTime: string;
  categoryId: EventCategoryId;
  note?: string;
  isCompleted?: boolean;
}

interface EventTemplate {
  title: string;
  time: string;
  categoryId: EventCategoryId;
  note: string;
}

const padDay = (day: number) => day.toString().padStart(2, '0');

const createSeedEvent = ({
  categoryId,
  dateTime,
  id,
  isCompleted = false,
  note = '',
  title,
  userId,
}: EventSeedInput): PlannerEventProps => ({
  id,
  userId,
  title,
  dateTime,
  categoryId,
  note,
  isCompleted,
  createdAt: seedTimestamp,
  updatedAt: seedTimestamp,
});

const userJuneTemplates: Record<number, EventTemplate[]> = {
  1: [
    {
      title: 'Predavanje - Distribuirani sistemi',
      time: '10:00',
      categoryId: 'study',
      note: 'Poneti beleske i proveriti materijale sa vezbi.',
    },
    {
      title: 'Pisanje seminarskog rada',
      time: '13:00',
      categoryId: 'work',
      note: 'Dopuniti tekst i proveriti reference.',
    },
    {
      title: 'Kupovina namirnica',
      time: '17:00',
      categoryId: 'personal',
      note: 'Napraviti listu pre odlaska.',
    },
    {
      title: 'Jutarnje vezbanje',
      time: '07:30',
      categoryId: 'health',
      note: 'Kratak trening od 30 minuta.',
    },
    {
      title: 'Sastanak sa timom za projekat',
      time: '18:30',
      categoryId: 'social',
      note: 'Dogovor oko sledeceg sprinta.',
    },
    {
      title: 'Ponavljanje za ispit',
      time: '20:00',
      categoryId: 'study',
      note: 'Proci zadatke iz poslednja dva roka.',
    },
    {
      title: 'Odgovoriti na emailove',
      time: '08:30',
      categoryId: 'work',
      note: 'Prioritet su poruke vezane za fakultet.',
    },
  ],
  2: [
    {
      title: 'Planiranje nedeljnih obaveza',
      time: '09:00',
      categoryId: 'personal',
      note: 'Srediti listu prioriteta za ovu nedelju.',
    },
    {
      title: 'Online kurs - React',
      time: '11:00',
      categoryId: 'study',
      note: 'Zavrsiti modul o komponentama.',
    },
    {
      title: 'Rad na prezentaciji',
      time: '14:30',
      categoryId: 'work',
      note: 'Pripremiti tri glavna slajda.',
    },
    {
      title: 'Setnja i istezanje',
      time: '18:00',
      categoryId: 'health',
      note: 'Lagani tempo posle ucenja.',
    },
    {
      title: 'Kafa sa kolegama',
      time: '19:30',
      categoryId: 'social',
      note: 'Proveriti termin u grupi.',
    },
    {
      title: 'Citanje poglavlja iz skripte',
      time: '16:00',
      categoryId: 'study',
      note: 'Obeleziti pitanja za konsultacije.',
    },
    {
      title: 'Sredjivanje finansija',
      time: '12:00',
      categoryId: 'personal',
      note: 'Uneti troskove za ovu sedmicu.',
    },
  ],
  3: [
    {
      title: 'Code review projekta',
      time: '09:30',
      categoryId: 'work',
      note: 'Pregledati otvorene komentare.',
    },
    {
      title: 'Laboratorijske vezbe',
      time: '12:15',
      categoryId: 'study',
      note: 'Poneti pripremu i laptop.',
    },
    {
      title: 'Trcanje u parku',
      time: '17:30',
      categoryId: 'health',
      note: 'Cilj je 5 kilometara laganim tempom.',
    },
    {
      title: 'Porodicni rucak',
      time: '15:00',
      categoryId: 'social',
      note: 'Potvrditi vreme dolaska.',
    },
    {
      title: 'Sredjivanje sobe',
      time: '18:45',
      categoryId: 'personal',
      note: 'Odvojiti stvari za donaciju.',
    },
    {
      title: 'Priprema za kolokvijum',
      time: '21:00',
      categoryId: 'study',
      note: 'Resiti probni test.',
    },
    {
      title: 'Slanje izvestaja mentoru',
      time: '10:45',
      categoryId: 'work',
      note: 'Dodati kratak rezime napretka.',
    },
  ],
};

const createJuneEventsForUser = (userId: number) => {
  const templates = userJuneTemplates[userId];

  return Array.from({ length: 30 }, (_, index) => {
    const day = index + 1;
    const template = templates[index % templates.length];

    return createSeedEvent({
      id: `seed-user-${userId}-jun-${padDay(day)}`,
      userId,
      title: template.title,
      dateTime: `2026-06-${padDay(day)}T${template.time}`,
      categoryId: template.categoryId,
      note: template.note,
      isCompleted: day < 5,
    });
  });
};

const mayCompletedEvents: readonly EventSeedInput[] = [
  {
    id: 'seed-user-1-may-06',
    userId: 1,
    title: 'Zavrsen koncept seminarskog rada',
    dateTime: '2026-05-06T14:00',
    categoryId: 'work',
    note: 'Predat prvi nacrt mentoru.',
    isCompleted: true,
  },
  {
    id: 'seed-user-1-may-10',
    userId: 1,
    title: 'Procitano poglavlje iz baze podataka',
    dateTime: '2026-05-10T19:00',
    categoryId: 'study',
    note: 'Izvucene beleske za ispit.',
    isCompleted: true,
  },
  {
    id: 'seed-user-1-may-14',
    userId: 1,
    title: 'Kontrolni pregled',
    dateTime: '2026-05-14T09:30',
    categoryId: 'health',
    note: 'Sve obavljeno po planu.',
    isCompleted: true,
  },
  {
    id: 'seed-user-1-may-21',
    userId: 1,
    title: 'Dogovor sa projektnim timom',
    dateTime: '2026-05-21T18:00',
    categoryId: 'social',
    note: 'Podeljene odgovornosti za jun.',
    isCompleted: true,
  },
  {
    id: 'seed-user-2-may-05',
    userId: 2,
    title: 'Zavrsen React modul',
    dateTime: '2026-05-05T11:00',
    categoryId: 'study',
    note: 'Sacuvani primeri za ponavljanje.',
    isCompleted: true,
  },
  {
    id: 'seed-user-2-may-12',
    userId: 2,
    title: 'Predat izvestaj za praksu',
    dateTime: '2026-05-12T15:30',
    categoryId: 'work',
    note: 'Poslata finalna verzija.',
    isCompleted: true,
  },
  {
    id: 'seed-user-2-may-18',
    userId: 2,
    title: 'Plan ishrane za nedelju',
    dateTime: '2026-05-18T08:45',
    categoryId: 'health',
    note: 'Spisak namirnica je pripremljen.',
    isCompleted: true,
  },
  {
    id: 'seed-user-2-may-27',
    userId: 2,
    title: 'Rodjendansko okupljanje',
    dateTime: '2026-05-27T20:00',
    categoryId: 'social',
    note: 'Rezervacija potvrdjena.',
    isCompleted: true,
  },
  {
    id: 'seed-user-3-may-04',
    userId: 3,
    title: 'Zavrsen code review',
    dateTime: '2026-05-04T10:00',
    categoryId: 'work',
    note: 'Komentari su zatvoreni.',
    isCompleted: true,
  },
  {
    id: 'seed-user-3-may-11',
    userId: 3,
    title: 'Predate laboratorijske vezbe',
    dateTime: '2026-05-11T12:15',
    categoryId: 'study',
    note: 'Profesor potvrdio prijem.',
    isCompleted: true,
  },
  {
    id: 'seed-user-3-may-19',
    userId: 3,
    title: 'Trening snage',
    dateTime: '2026-05-19T17:00',
    categoryId: 'health',
    note: 'Odrađen ceo plan treninga.',
    isCompleted: true,
  },
  {
    id: 'seed-user-3-may-25',
    userId: 3,
    title: 'Sredjen licni budzet',
    dateTime: '2026-05-25T18:45',
    categoryId: 'personal',
    note: 'Majski troskovi arhivirani.',
    isCompleted: true,
  },
];

export const predefinedPlannerEvents: readonly PlannerEventProps[] = [
  ...[1, 2, 3].flatMap((userId) => createJuneEventsForUser(userId)),
  ...mayCompletedEvents.map(createSeedEvent),
];

export const getPredefinedEventsForUser = (userId: number) =>
  predefinedPlannerEvents.filter((event) => event.userId === userId);
