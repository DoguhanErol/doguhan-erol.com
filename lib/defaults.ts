export const defaultProfile = {
  id: "main",
  name: "Doğuhan Erol",
  roleTr: "Teknoloji ve İş Geliştirme",
  roleEn: "Technology & Business Development",
  headlineBeforeTr: "İşinizi dijitalleştirerek,",
  headlineAccentTr: "zaman ve prestij kazanmanızı sağlıyorum.",
  headlineBeforeEn: "By digitizing your work,",
  headlineAccentEn: "I help you gain time and prestige.",
  leadTr:
    "Web sitesini, dijital menüyü, masa ve sipariş takibini yazılımla düzenliyorum. Qrivo, kafe ve restoranların paneli. Parma Pizza ile Mila Maestro yayındaki siteler. SCP-294 ise Steam'deki korku oyunum.",
  leadEn:
    "I turn a site, a menu and the daily work into something a business can run. Qrivo is the panel for cafés and restaurants. Parma Pizza and Mila Maestro are live pages. SCP-294 is my horror game on Steam.",
  aboutTr:
    "İşletmeler ve farklı sektörlerdeki müşteriler için web siteleri, yönetim panelleri ve özel yazılım çözümleri geliştiriyorum. Projelerin ihtiyaçlarına göre kurumsal web sitelerinden, QRivo gibi işletmelerin günlük operasyonlarını kolaylaştıran ve sürekli kullanılan yazılım sistemlerine kadar farklı çözümler üretiyorum.\n\nQRivo, işletmelerin menülerini, masa düzenlerini ve sipariş süreçlerini tek bir yönetim paneli üzerinden yönetmelerini sağlayan yazılım projelerimden biri.\n\nBunun yanı sıra, Unity ile geliştirdiğim ve Steam'de BlindEyeGames adıyla yayımladığım SCP-294: The Coffee Machine adlı bağımsız korku oyunu üzerinde de çalışıyorum.\n\nAkademik alanda LaTeX ve metin düzenleme, çeviri ve makale hazırlığı konularında hizmet veriyorum. Web geliştirme ve içerik çalışmalarında Türkçe, İngilizce ve Rusça dillerinde çalışabiliyorum.",
  aboutEn:
    "I develop websites, management dashboards, and custom software solutions for businesses and clients across different industries. Depending on project requirements, my work ranges from corporate websites to fully functional software systems like QRivo, designed to streamline everyday business operations.\n\nQRivo is one of my software projects, enabling businesses to manage their menus, table layouts, and order processes through a centralized management dashboard.\n\nI also develop independent games using Unity. One of my projects, SCP-294: The Coffee Machine, is a horror game published on Steam under the name BlindEyeGames.\n\nIn addition, I provide academic support in LaTeX, document formatting, translation, and research paper preparation. I work in Turkish, English, and Russian across web development and content-related projects.",
  locationTr: "Türkiye",
  locationEn: "Türkiye",
  availabilityTr: "Yeni bir proje veya iş birliği için yazabilirsiniz.",
  availabilityEn: "You can write for new work or a collaboration.",
  stack: "Next.js · TypeScript · PostgreSQL · Prisma · Docker · Tailwind · Unity · Caddy",
  email: "",
  whatsapp: "",
  telegram: "",
  github: "https://github.com/DoguhanErol",
};

export const contactInstagram = "https://www.instagram.com/doguhan_dev/";
export const contactSubstack = "https://substack.com/@doguhanerol";

export const defaultProjects = [
  {
    slug: "qrivo",
    sortOrder: 0,
    published: true,
    title: "Qrivo",
    kickerTr: "QR menü · kafe ve restoran",
    kickerEn: "QR menu · business panel",
    summaryTr:
      "Kafe ve restoranlar için QR menü ve işletme paneli. Ürünler, fiyatlar, masalar ve personel tek yerden yönetilir. Müşteri menüyü telefondan görür; işletme değişiklikleri anında yansıtır.",
    summaryEn:
      "A digital menu for restaurants and cafés. Products, prices, tables and staff are managed from one panel. The guest opens it on a phone, and the business updates it right away.",
    pointsTr: [
      "Masa yönetim sistemi",
      "Masalara özel QR menü",
      "Personelin telefondan giriş yapması",
      "Mutfak ve bar siparişleri ilgili yazıcıdan çıkar",
    ].join("\n"),
    pointsEn: [
      "A table management system",
      "A QR menu on the tables",
      "Mobile sign-in for staff",
      "Kitchen and bar orders come out in the right place",
    ].join("\n"),
    url: "https://qrivo.online/",
    urlLabel: "Qrivo",
    url2: "",
    urlLabel2: "",
    tags: "QR menü, Masa, Personel, Mutfak",
    tone: "qrivo",
  },
  {
    slug: "scp-294",
    sortOrder: 1,
    published: true,
    title: "SCP-294: The Coffee Machine",
    kickerTr: "Steam'de korku oyunu",
    kickerEn: "Horror game · Steam",
    summaryTr:
      "SCP evreninde, istenen her şeyi verebilen bir kahve makinesi. Oyunda D-Sınıfı personelsiniz ve makineyi deniyorsunuz. Görüntü düşük poligonlu, PS1 dönemini andırıyor; kamera birinci şahıs. Hikâye diyaloglar ve mekânla anlatılıyor. Oyun Steam'de, BlindEyeGames adıyla yayımlandı.",
    summaryEn:
      "A coffee machine from the SCP universe that can dispense anything. You try it as D-Class. Low poly, a PS1 feel, first person. The story moves through dialogue and place. On Steam as BlindEyeGames.",
    pointsTr: [
      "PS1 tarzı retro görüntü ve lo-fi atmosfer",
      "Birinci şahıs psikolojik korku",
      "Hikâye diyalog ve mekânla anlatılır",
      "Makineden ne istediğinize dikkat edin",
    ].join("\n"),
    pointsEn: [
      "A retro PS1 look and a lo-fi atmosphere",
      "First-person psychological horror",
      "A story told through dialogue and place",
      "Be careful what you ask for",
    ].join("\n"),
    url: "https://store.steampowered.com/app/4652460/SCP294_The_Coffee_Machine/",
    urlLabel: "Steam",
    url2: "https://www.instagram.com/blindeyegames/",
    urlLabel2: "Instagram",
    tags: "Unity, PS1, Steam",
    tone: "scp",
  },
  {
    slug: "business-websites",
    sortOrder: 2,
    published: true,
    title: "Business websites",
    kickerTr: "İşinizi Dijitale Taşıyın",
    kickerEn: "Take your business online",
    summaryTr:
      "İşletmenizin menüsünü, adresini ve iletişimini kendi sitesinde topluyorum. Müşteri sayfayı telefonda açtığında ne sunduğunuzu görür ve size oradan ulaşır.",
    summaryEn:
      "I put your menu, your address and a way to reach you on a site of your own. A customer opens it on a phone, sees what you offer and gets in touch from that page.",
    pointsTr: [
      "Menü ve ürünler sayfada öne çıkar",
      "Adres ve telefon kolay bulunur",
      "Sayfa telefon ekranına göre düzenlenir",
      "İşletmenin kendine ait bir adresi olur",
    ].join("\n"),
    pointsEn: [
      "The menu and products come first on the page",
      "The address and phone are easy to find",
      "The page is laid out for a phone",
      "The business has an address of its own",
    ].join("\n"),
    url: "https://parmapizzatr.com/",
    urlLabel: "Parma Pizza",
    url2: "https://www.milamaestro.com/",
    urlLabel2: "Mila Maestro",
    tags: "Site, Menü, İletişim",
    tone: "generic",
  },
];

export const defaultSkills = [
  {
    sortOrder: 0,
    published: true,
    titleTr: "Web siteleri",
    titleEn: "Sites and visibility",
    bodyTr:
      "İşletmeniz için web sitesini tasarlıyorum, yayına alıyorum ve bakımını üstleniyorum. Menü, adres ve iletişim bilgileri telefonda da düzgün görünür. Sayfa yapısını ve temel arama motoru uyumunu da düzenliyorum.",
    bodyEn:
      "I design, publish and maintain the page for your business. The menu, the place and a way to reach you open on a phone. I also raise your digital visibility through search and the page itself.",
  },
  {
    sortOrder: 1,
    published: true,
    titleTr: "Qrivo",
    titleEn: "Qrivo",
    bodyTr:
      "Kafe ve restoranlar için QR menü ve işletme paneli geliştiriyorum. Siparişler mutfak ve bar yazıcılarına ayrılır. Personel telefondan girer; masadan açılan adisyon panelde görünür. Qrivo abonelikle kullanılır.",
    bodyEn:
      "I build business tools for cafés and restaurants. A QR menu, orders that print in the kitchen and at the bar, mobile sign-in for staff, and an order taken at the table live in one panel. People subscribe to it.",
  },
  {
    sortOrder: 2,
    published: true,
    titleTr: "Akademik metin desteği",
    titleEn: "Academic publishing",
    bodyTr:
      "Akademisyenler için LaTeX dosyasını düzenlerim, metni çeviririm ve makaleyi dergi formatına uygun hale getiririm.",
    bodyEn:
      "For academics I edit the LaTeX, translate the text, and get the paper ready to send to a journal.",
  },
  {
    sortOrder: 3,
    published: true,
    titleTr: "Low-poly oyunlar",
    titleEn: "Low poly games",
    bodyTr:
      "Low-poly oyunlar geliştiriyorum. Steam ve itch.io için retro görünümlü, atmosferi güçlü oyunlar hazırlayabilirim.",
    bodyEn:
      "I build low poly games. I can ship atmospheric work for Steam and itch.io.",
  },
  {
    sortOrder: 4,
    published: true,
    titleTr: "Türkçe, İngilizce, Rusça",
    titleEn: "Turkish, English, Russian",
    bodyTr:
      "Site, arayüz ve akademik metinleri Türkçe, İngilizce ve Rusça hazırlayabilirim.",
    bodyEn:
      "I can help with work in Turkish, English and Russian. Interface, copy and translation are prepared in those three languages.",
  },
];
