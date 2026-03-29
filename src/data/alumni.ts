export interface Alumni {
  id: number;
  name: string;
  nameEn: string;
  classYear: 2024 | 2025;
  photo: string;
  birthDate: string;
  email: string;
  instagram: string;
  quote: string;
  homeRoomTeacher: string;
  currentUniversity: string;
  currentCountry: string;
  currentCity: string;
  acceptedUniversities: string[];
  awards: string[];
  major: string;
  bio: string;
}

export interface ClassTeacher {
  name: string;
  photo: string;
  year: number;
  subject: string;
}

export const classTeachers: ClassTeacher[] = [
  {
    name: "Д. Дэлгэрмаа",
    photo: "https://api.dicebear.com/7.x/personas/svg?seed=teacher2024",
    year: 2024,
    subject: "Математик",
  },
  {
    name: "Б. Батцэцэг",
    photo: "https://api.dicebear.com/7.x/personas/svg?seed=teacher2025",
    year: 2025,
    subject: "Англи хэл",
  },
];

const alumniNames2024 = [
  "Б. Болормаа", "Д. Дөлгөөн", "Э. Энхтуяа", "Г. Гантулга", "М. Мөнхбат",
  "Н. Номин", "О. Отгонбаяр", "Т. Тэгшжаргал", "С. Сарантуяа", "Х. Халиун",
  "Ж. Жаргалмаа", "З. Зулзага", "А. Анхбаяр", "Б. Батмөнх", "У. Ундрал",
  "Ц. Цэцэгмаа", "Ч. Чингүүн", "Е. Энх-Амгалан", "Р. Рэнчинхандмаа", "П. Пүрэвдорж",
  "Л. Лхагвасүрэн", "К. Ховд"
];

const alumniNames2025 = [
  "А. Алтанцэцэг", "Б. Баярсайхан", "В. Вандансүрэн", "Г. Гэрэлмаа", "Д. Дагиймаа",
  "Э. Эрдэнэсүрэн", "Ж. Жавзандолгор", "З. Золзаяа", "И. Идэрцэцэг", "К. Кэрэн",
  "Л. Лувсанцэрэн", "М. Мөнхцэцэг", "Н. Нарантуяа", "О. Одгэрэл", "П. Пүрэвжав",
  "Р. Равдан", "С. Солонго", "Т. Тунгалагмаа", "У. Уянга", "Ф. Франсиска",
  "Х. Хонгор", "Ц. Цэрэнпунцаг", "Ч. Чулуунбаатар", "Ш. Шинэцэцэг"
];

const universities = [
  "МУИС", "МҮТИС", "ШУТ", "ХААИС", "АУИС",
  "NUS Singapore", "Seoul National University", "Yonsei University",
  "University of Tokyo", "MIT", "Stanford University",
  "University of Toronto", "University of Melbourne",
  "Sciences Po Paris", "TU Berlin", "University of Edinburgh",
];

const countries = ["Монгол", "Солонгос", "Япон", "АНУ", "Канад", "Австрали", "Франц", "Герман", "Их Британи"];
const majors = ["Компьютерийн шинжлэх ухаан", "Бизнес удирдлага", "Эдийн засаг", "Хуульч", "Анагаах ухаан", "Инженерчлэл", "Дизайн", "Математик"];
const awards = [
  "Улсын математикийн олимпиадын 1-р байр",
  "Хан-Банкны тэтгэлэгт хөтөлбөр",
  "STEM Сайдын шагнал",
  "Дээд боловсролын тэтгэлэг",
  "Нийгмийн идэвхтэн шагнал",
  "Уран зохиолын тэмцээний 2-р байр",
  "Физикийн олимпиад - Мөнгөн медаль",
  "Робот тэмцээн - 1-р байр",
];
const quotes = [
  "Амжилт бол аялал, очих газар биш.",
  "Хичээл зүтгэл бүхнийг даван туулна.",
  "Өнөөдрийн зүтгэл маргаашийн амжилт.",
  "Мэдлэг бол хамгийн үнэт баялаг.",
  "Боломжийг бий болго, хүлээж суу биш.",
  "Зорилготой хүн замаа олно.",
  "Итгэл, зүтгэл, амжилт.",
  "Мөрөөдөл нь зорилго болно, зорилго нь бодит болно.",
];

function generateAlumni(names: string[], year: 2024 | 2025, teacherName: string): Alumni[] {
  return names.map((name, i) => {
    const seed = `${year}-${i}`;
    const uni = universities[i % universities.length];
    const country = countries[i % countries.length];
    const accepted = [uni, universities[(i + 3) % universities.length], universities[(i + 6) % universities.length]];
    return {
      id: year * 100 + i + 1,
      name,
      nameEn: name.replace(".", "").trim(),
      classYear: year,
      photo: `https://api.dicebear.com/7.x/personas/svg?seed=alumni${seed}`,
      birthDate: `200${(i % 5) + 5}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
      email: `${name.split(".")[1]?.trim().toLowerCase() || "alumni"}${i + 1}@alumni.olula.mn`,
      instagram: `@olula_alumni_${year}_${i + 1}`,
      quote: quotes[i % quotes.length],
      homeRoomTeacher: teacherName,
      currentUniversity: uni,
      currentCountry: country,
      currentCity: country === "Монгол" ? "Улаанбаатар" : country,
      acceptedUniversities: accepted,
      awards: i % 3 === 0 ? [awards[i % awards.length], awards[(i + 2) % awards.length]] : [awards[i % awards.length]],
      major: majors[i % majors.length],
      bio: `${name} нь Олула дунд сургуулийн ${year} оны төгсөгч. ${majors[i % majors.length]} чиглэлээр ${uni}-д суралцаж байна.`,
    };
  });
}

export const alumni2024 = generateAlumni(alumniNames2024, 2024, "Д. Дэлгэрмаа");
export const alumni2025 = generateAlumni(alumniNames2025, 2025, "Б. Батцэцэг");
export const allAlumni = [...alumni2024, ...alumni2025];
