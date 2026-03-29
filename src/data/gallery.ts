export interface GalleryImage {
  id: number;
  year: 2024 | 2025;
  event: string;
  description: string;
  date: string;
  photo: string;
  photographer: string;
}

const events2024 = [
  { event: "Төгсөлтийн ёслол 2024", date: "2024-06-15" },
  { event: "Спортын наадам", date: "2024-05-20" },
  { event: "Шинжлэх ухааны үзэсгэлэн", date: "2024-04-10" },
  { event: "Соёлын арга хэмжээ", date: "2024-03-08" },
  { event: "Математикийн олимпиад", date: "2024-02-14" },
  { event: "Хандивын арга хэмжээ", date: "2024-01-20" },
  { event: "Шинэ жилийн баяр", date: "2023-12-25" },
  { event: "Намрын фестиваль", date: "2023-10-15" },
  { event: "Хичээлийн жилийн эхлэл", date: "2023-09-01" },
  { event: "Багшийн баяр", date: "2024-10-05" },
  { event: "Уран зохиолын уралдаан", date: "2024-04-23" },
  { event: "Робот тэмцээн", date: "2024-05-05" },
];

const events2025 = [
  { event: "Төгсөлтийн ёслол 2025", date: "2025-06-20" },
  { event: "Спортын наадам 2025", date: "2025-05-18" },
  { event: "Технологийн үзэсгэлэн", date: "2025-04-12" },
  { event: "Урлагийн тоглолт", date: "2025-03-10" },
  { event: "Олимпиадын бэлтгэл", date: "2025-02-20" },
  { event: "Цэвэр байгаль аян", date: "2025-01-15" },
  { event: "Шинэ жилийн баяр 2025", date: "2024-12-28" },
  { event: "Намрын нааш 2025", date: "2024-10-20" },
  { event: "Хичээлийн жил 2024-2025 эхлэл", date: "2024-09-02" },
  { event: "Дебат тэмцээн", date: "2025-03-25" },
  { event: "Их сургуулийн танилцуулга", date: "2025-04-05" },
];

export const galleryImages2024: GalleryImage[] = events2024.flatMap((ev, ei) =>
  Array.from({ length: 4 }).map((_, i) => ({
    id: 2024 * 1000 + ei * 10 + i + 1,
    year: 2024 as const,
    event: ev.event,
    description: `${ev.event} - ${i + 1}-р зураг. Олула сургуулийн оюутнууд болон багш нарын хамтарсан арга хэмжээ.`,
    date: ev.date,
    photo: `https://picsum.photos/seed/olula2024${ei}${i}/600/400`,
    photographer: `Б. Батжаргал`,
  }))
);

export const galleryImages2025: GalleryImage[] = events2025.flatMap((ev, ei) =>
  Array.from({ length: 4 }).map((_, i) => ({
    id: 2025 * 1000 + ei * 10 + i + 1,
    year: 2025 as const,
    event: ev.event,
    description: `${ev.event} - ${i + 1}-р зураг. Олула сургуулийн оюутнууд болон багш нарын хамтарсан арга хэмжээ.`,
    date: ev.date,
    photo: `https://picsum.photos/seed/olula2025${ei}${i}/600/400`,
    photographer: `Д. Дэлгэрмаа`,
  }))
);

export const allGalleryImages = [...galleryImages2024, ...galleryImages2025];
