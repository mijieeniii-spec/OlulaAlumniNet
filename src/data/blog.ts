export interface BlogPost {
  id: number;
  title: string;
  content: string;
  author: string;
  authorRole: "alumni" | "teacher";
  authorEmail: string;
  authorPhoto: string;
  date: string;
  category: string;
  imageUrl?: string;
  tags: string[];
}

export interface QAPost {
  id: number;
  question: string;
  askedBy: string;
  askedByEmail: string;
  askedDate: string;
  answers: {
    id: number;
    content: string;
    answeredBy: string;
    answeredByEmail: string;
    answeredByRole: "alumni" | "teacher";
    date: string;
  }[];
}

export const categories = [
  "Их сургуулийн тухай",
  "Карьер зөвлөгөө",
  "Амьдралын туршлага",
  "Шинжлэх ухаан",
  "Урлаг соёл",
  "Спорт",
  "Технологи",
  "Нийгэм",
];

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "MIT дахь миний эхний жил",
    content: `MIT-д суралцаж эхэлснээс хойш нэг жил болжээ. Энэ жилд маш олон зүйл сурч, туршлага хуримтлуулав. Тэнд суралцах нь хэрхэн байдгийг хуваалцахыг хүсэв.\n\nЭхний сар маш хэцүү байсан. Хэл, соёл, хичээлийн систем бүгд шинэ байв. Гэхдээ Олула сургуулийн суурь мэдлэг намайг маш сайн бэлтгэсэн гэдэгт итгэлтэй байна.\n\nМатематик, физикийн хичээлүүдэд Монгол дахь сурсан зүйлс маш их тус болсон. Ялангуяа Д. Дэлгэрмаа багшийн заасан математик хичээл.\n\nХэн нэг нь MIT-д орохыг хүсэж байгаа бол намайг дагаарай, бүх зүйлийг хуваалцана!`,
    author: "Б. Болормаа",
    authorRole: "alumni",
    authorEmail: "болормаа1@alumni.olula.mn",
    authorPhoto: "https://api.dicebear.com/7.x/personas/svg?seed=alumni2024-0",
    date: "2025-03-15",
    category: "Их сургуулийн тухай",
    imageUrl: "https://picsum.photos/seed/mit2025/800/400",
    tags: ["MIT", "АНУ", "Их сургууль", "Туршлага"],
  },
  {
    id: 2,
    title: "Солонгост сурахаас өмнө мэдэх ёстой 10 зүйл",
    content: `Солонгост суралцахыг зорьж буй дүүгий нарт зориулав. Энэ нийтлэлд Солонгост суралцахаас өмнө мэдэх ёстой 10 чухал зүйлийг хуваалцана.\n\n1. Солонгос хэлний бэлтгэл - Хамгийн чухал зүйл\n2. Оюутны виз авах процесс\n3. Дотуур байрны онцлог\n4. Хоол, соёл\n5. Хичээлийн систем\n6. Тэтгэлгийн боломжууд\n7. Нийгмийн даатгал\n8. Банкны данс нээх\n9. Гар утасны тариф\n10. Нутгийн монгол оюутнуудтай холбогдох\n\nЭдгээр бэлтгэлийг хийснээр Солонгост суралцах нь маш сайхан туршлага болно!`,
    author: "Д. Дөлгөөн",
    authorRole: "alumni",
    authorEmail: "дөлгөөн2@alumni.olula.mn",
    authorPhoto: "https://api.dicebear.com/7.x/personas/svg?seed=alumni2024-1",
    date: "2025-03-10",
    category: "Амьдралын туршлага",
    imageUrl: "https://picsum.photos/seed/korea2025/800/400",
    tags: ["Солонгос", "Сурах", "Зөвлөгөө"],
  },
  {
    id: 3,
    title: "Математикийн олимпиадад амжилттай оролцох нууц",
    content: `Математикийн олимпиадад амжилттай оролцохын тулд ямар зүйлийг хийх хэрэгтэй вэ? Улсын олимпиадын 1-р байрны эзэн болсон туршлагаасаа хуваалцъя.\n\nЭхний зүйл бол тогтмол дадлага хийх явдал. Өдөр бүр дор хаяж 2-3 цагийн дадлага хийх хэрэгтэй. Олон жилийн олимпиадын даалгаврыг бодож туршиж хар.\n\nЭнгийн нэмэлт ресурсуудаас гадна Art of Problem Solving вэбсайт маш сайн. Тэнд дэлхийн хамгийн сайн олимпиадын даалгаврууд байдаг.\n\nМатематикийн олимпиадын амжилт нь их сургуулийн хүсэлтэнд маш их тус болдог. Ялангуяа АНУ, Их Британийн их сургуулиудад.`,
    author: "Д. Дэлгэрмаа",
    authorRole: "teacher",
    authorEmail: "дэлгэрмаа@teacher.olula.mn",
    authorPhoto: "https://api.dicebear.com/7.x/personas/svg?seed=teacher2024",
    date: "2025-02-28",
    category: "Шинжлэх ухаан",
    imageUrl: "https://picsum.photos/seed/math2025/800/400",
    tags: ["Математик", "Олимпиад", "Зөвлөгөө"],
  },
  {
    id: 4,
    title: "Парист амьдрах нь",
    content: `Парист суралцаж байгаа цагаасаа хэдэн ч зүйл хуваалцах дуртай байдаг. Sciences Po-д суралцаж байгаа намайг дагаж олон асуулт ирдэг тул энэ нийтлэлийг бичлээ.\n\nПарис хот нь мэдээж туйлын сайхан. Эйфелийн цамхагийн дэргэд байдаг кофейнд суугаад хичээлийн бичлэгээ унших нь мэдэхгүй л юм...\n\nГэхдээ Монгол хоолоо ихэд хамдаад байдаг. Тиймдаа тус хотод монгол хоолны газар хайсаар олов. Монгол Базаар гэсэн газар байдаг юм байна!`,
    author: "Э. Энхтуяа",
    authorRole: "alumni",
    authorEmail: "энхтуяа3@alumni.olula.mn",
    authorPhoto: "https://api.dicebear.com/7.x/personas/svg?seed=alumni2024-2",
    date: "2025-01-20",
    category: "Амьдралын туршлага",
    imageUrl: "https://picsum.photos/seed/paris2025/800/400",
    tags: ["Франц", "Парис", "Амьдрал"],
  },
  {
    id: 5,
    title: "Их сургуулийн хүсэлтийн эссэ хэрхэн бичих вэ?",
    content: `Их сургуулийн хүсэлт гаргахдаа хамгийн чухал хэсгийн нэг бол хувийн эссэ юм. Та өөрийнхөө тухай хэрхэн ярих вэ?\n\nЭнэ нийтлэлд би их сургуулийн хүсэлтийн эссэ хэрхэн бичих тухай зөвлөгөө өгье.\n\n1. Өөрийнхөө өвөрмөц туршлагыг ярь\n2. Тодорхой жишээ ашигла\n3. Боломжит болон одоогийн өөрийнхөө талаар ярь\n4. Нэг гол санааны эргэн тойронд бичих\n5. Редакторт шалгуул\n\nЭдгээр зөвлөгөөнүүд АНУ, Их Британи, Австрали болон бусад орны их сургуулиудад өргөдөл гаргахад тусална.`,
    author: "Б. Батцэцэг",
    authorRole: "teacher",
    authorEmail: "батцэцэг@teacher.olula.mn",
    authorPhoto: "https://api.dicebear.com/7.x/personas/svg?seed=teacher2025",
    date: "2025-03-20",
    category: "Их сургуулийн тухай",
    tags: ["Эссэ", "Их сургууль", "Зөвлөгөө"],
  },
  {
    id: 6,
    title: "Токиогийн амьдрал: Жил шинэ болсон туршлага",
    content: `Токиод суралцаж байгаа цагаасаа хэдэн ч туршлага хуваалцах дуртай байдаг. University of Tokyo-д суралцаж байгаа намайг таниулъя.\n\nЯпон хэл бол хамгийн хэцүү зүйл байсан. Гэхдээ Японд амьдрахад хэл сурах нь маш хурдан болдог.\n\nСургуулийн байгалийн гоо сайхан нь сэтгэл татам. Хавар боловч болоход бол...`,
    author: "Г. Гантулга",
    authorRole: "alumni",
    authorEmail: "гантулга4@alumni.olula.mn",
    authorPhoto: "https://api.dicebear.com/7.x/personas/svg?seed=alumni2024-3",
    date: "2025-02-10",
    category: "Амьдралын туршлага",
    imageUrl: "https://picsum.photos/seed/tokyo2025/800/400",
    tags: ["Япон", "Токио", "Амьдрал"],
  },
];

export const qaData: QAPost[] = [
  {
    id: 1,
    question: "Их сургуулийн хүсэлт гаргахад ямар бичиг баримт хэрэгтэй вэ?",
    askedBy: "Б. Сүрэн",
    askedByEmail: "сүрэн@student.olula.mn",
    askedDate: "2025-03-25",
    answers: [
      {
        id: 1,
        content: "Ерөнхийдөө: транскрипт, эссэ, зөвлөмжийн захидал, тест оноо (SAT/ACT/IELTS/TOEFL) хэрэгтэй. Орны болон сургуулийн дагуу ялгаатай байж болно.",
        answeredBy: "Б. Болормаа",
        answeredByEmail: "болормаа1@alumni.olula.mn",
        answeredByRole: "alumni",
        date: "2025-03-26",
      },
      {
        id: 2,
        content: "Нэмж хэлэхэд, зарим сургуулиуд нэмэлт бичиг баримт шаарддаг. Тухайн сургуулийн вэбсайтаас мэдээлэл авна уу.",
        answeredBy: "Д. Дэлгэрмаа",
        answeredByEmail: "дэлгэрмаа@teacher.olula.mn",
        answeredByRole: "teacher",
        date: "2025-03-26",
      },
    ],
  },
  {
    id: 2,
    question: "Солонгос хэлний хэдэн түвшин байгаа бол?",
    askedBy: "О. Оюунбилэг",
    askedByEmail: "оюунбилэг@student.olula.mn",
    askedDate: "2025-03-20",
    answers: [
      {
        id: 3,
        content: "TOPIK шалгалтаар 1-6 хүртэлх түвшин байдаг. Их сургуульд орохын тулд ерөнхийдөө 3-4-р түвшин хэрэгтэй байдаг. Зарим тэтгэлгийн хувьд өндөр оноо шаарддаг.",
        answeredBy: "Д. Дөлгөөн",
        answeredByEmail: "дөлгөөн2@alumni.olula.mn",
        answeredByRole: "alumni",
        date: "2025-03-21",
      },
    ],
  },
  {
    id: 3,
    question: "IELTS-ийг хэдэн нас дээр өгч болдог вэ?",
    askedBy: "Г. Гэрэлмаа",
    askedByEmail: "гэрэлмаа@student.olula.mn",
    askedDate: "2025-03-15",
    answers: [
      {
        id: 4,
        content: "IELTS-д насны хязгаарлалт байдаггүй. Гэхдээ ихэнх оролцогчид 16-аас дээш насны байдаг. Чи хэдэн настай байсан ч өгч болно!",
        answeredBy: "Б. Батцэцэг",
        answeredByEmail: "батцэцэг@teacher.olula.mn",
        answeredByRole: "teacher",
        date: "2025-03-16",
      },
    ],
  },
];

export const countryData: { country: string; count: number; lat: number; lng: number; flag: string }[] = [
  { country: "АНУ", count: 7, lat: 39.5, lng: -98.35, flag: "🇺🇸" },
  { country: "Солонгос", count: 12, lat: 35.9, lng: 127.8, flag: "🇰🇷" },
  { country: "Япон", count: 5, lat: 36.2, lng: 138.25, flag: "🇯🇵" },
  { country: "Франц", count: 2, lat: 46.2, lng: 2.2, flag: "🇫🇷" },
  { country: "Австрали", count: 3, lat: -25.3, lng: 133.8, flag: "🇦🇺" },
  { country: "Их Британи", count: 4, lat: 55.4, lng: -3.4, flag: "🇬🇧" },
  { country: "Канад", count: 2, lat: 56.1, lng: -106.3, flag: "🇨🇦" },
  { country: "Герман", count: 3, lat: 51.2, lng: 10.5, flag: "🇩🇪" },
  { country: "Сингапур", count: 2, lat: 1.35, lng: 103.82, flag: "🇸🇬" },
  { country: "Монгол", count: 26, lat: 46.9, lng: 103.8, flag: "🇲🇳" },
];
