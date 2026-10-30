# Doğuhan Erol portfolyosu — yapay zeka notları

Bu dosya siteyi değiştiren asistanlar içindir. Sahip Türkçe yazar ve Türkçe yanıt bekler. İstenmeden commit, push veya canlı sunucuda `bash scripts/vps.sh` çalıştırma.

Canlı domain `doguhan-erol.com`. Qrivo ayrı bir ürün ve `https://qrivo.online`. Bu repo Qrivo’nun kodu değildir. Qrivo kaynakları `../qrivo/main-qrivo`.

## Ne bu

Tek sayfalık, iki dilli kişisel site. Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, Prisma 6, PostgreSQL 16, NextAuth v5 (JWT, credentials), next-intl 4, Zod, MinIO. Üretimde Caddy 2 ve `output: "standalone"`.

Kimse için tenant yok. Tek yönetici hesabı var. Oturum JWT olduğu için aynı hesap birkaç cihazdan açık kalır. Çıkış yalnız o cihazı kapatır.

## Komutlar

| Ne | Komut |
| --- | --- |
| Geliştirme | `npm run dev` — `next dev --turbopack --port 3010` |
| Lokal Docker | `npm run local` veya `bash scripts/local.sh` |
| Üretim | `bash scripts/vps.sh` — aşağıdaki VPS uyarısını okumadan çalıştırma |
| Şema | `npm run db:push` |
| Seed | `npm run db:seed` |

Lokal adres `http://localhost:3010`. Postgres host portu `5434`. MinIO `9010` / konsol `9011`. Veritabanı adı, kullanıcı ve şifre lokalde `portfolio`. Compose proje adı lokal betikte `doguhan-portfolio`.

`localhost:5434` sandbox içinden reddedilebilir. Prisma komutunu sandbox dışında çalıştır. `tsx -e` üst seviyede `await` kabul etmez; `async function main()` kullan.

Geliştirmede `lib/db.ts` eski Prisma istemcisini `globalThis` üzerinden düşürür. Şema değişince süreci bilinçli yönet. Port 3010 ayaktaysa geliştirme sunucusunu kendiliğinden yeniden başlatma.

## Klasörler

- `app/page.tsx` — ana sayfa, metadata, JSON-LD. `force-dynamic`.
- `app/layout.tsx` — fontlar, ikonlar, tema betiği. Betik ilk boyamadan önce çalışır.
- `app/login`, `app/admin` — giriş ve yönetim. Herkese açık menüde link yok. İkisi de `noindex`.
- `app/api/locale` — `site_locale` çerezini yazar.
- `components/site` — herkese açık arayüz.
- `components/admin` — yönetim formları.
- `messages/tr.json`, `messages/en.json` — menü, bölüm başlıkları, form. Proje ve hakkımda metni burada değil.
- `lib/defaults.ts` — seed’e giren profil, projeler, yetenekler. Instagram ve Substack sabitleri de burada.
- `lib/content.ts` — veritabanını sayfanın kullandığı şekle çevirir.
- `lib/seo.ts` — arama başlığı değil, meta açıklama ve yapısal veri.
- `lib/locale.ts` — dil seçimi.
- `prisma/schema.prisma`, `prisma/seed.ts`.
- `public/media` — videolar, ekran görüntüleri, portre, logolar. `app/` altına konan video tarayıcıya açılmaz.
- `public/favicon.ico`, `icon-*.png`, `apple-touch-icon.png`, `og.png`, `site.webmanifest` — `public/media/logoportfolio.png` dosyasından üretilmiş marka.

## Metin nerede durur

Canlı sitede görünen profil, proje ve yetenek metni veritabanındadır. `lib/defaults.ts` yalnız kayıt yokken kullanılır.

`prisma/seed.ts` şunları yapmaz:

- Var olan yöneticinin şifresini veya kullanıcı adını ezmez.
- Var olan profili güncellemez (`update: {}`).
- Slug’ı duran projeyi yeniden yazmaz.
- Yetenek sayısı sıfır değilse yetenek eklemez.

Bu yüzden yayındaki bir cümleyi değiştirmek için hem `lib/defaults.ts` hem `id: "main"` profil satırı (veya ilgili proje / yetenek satırı) güncellenir. Yalnız dosyayı değiştirmek açık siteyi değiştirmez. Yalnız veritabanını değiştirmek bir sonraki boş kurulumda kaybolur.

Hakkımda metni boş satırla ayrılmış dört paragraftır. Sayfa `content.about.split(/\n\s*\n/)` ile böler.

Şu metinler kodda sabittir, veritabanında yoktur:

- İletişim Instagram: `contactInstagram` → `https://www.instagram.com/doguhan_dev/`
- İletişim Substack: `contactSubstack` → `https://substack.com/@doguhanerol`
- Meta açıklama: `lib/seo.ts`. Hero’daki `lead` arama açıklaması olarak kullanılmaz.
- `business-websites` Türkçe başlığı: `lib/content.ts` içinde “İşletme siteleri”. Veritabanı başlığı “Business websites” kalır. İngilizce sayfa ve yönetim paneli veritabanı başlığını gösterir.

`tags` tek dildedir. Türkçe etiketler İngilizce sayfada da görünür. Bunu iki dile ayırmak şema işidir.

Yetenek ikonları sırayla `Globe`, `QrCode`, `BookOpen`, `Box`, `Languages`. Sıra `sortOrder` ile gelir. Veritabanında ikon kolonu yoktur. Yeni bir yetenek eklenecekse `components/site/home.tsx` içindeki `skillIcons` dizisine de bak.

## Güvenle değiştirilir

- Profil, proje, yetenek ve hesap: yönetim paneli (`/admin`) veya Prisma. İki dil alanını birlikte güncelle.
- Chrome metinleri: `messages/tr.json` ve `messages/en.json`.
- Yeni herkese açık görsel veya video: `public/media`, sonra bileşendeki yolu.
- WhatsApp ve Telegram: yönetim → Profil. Boşken buton görünür ama link olmaz. Numara veya kullanıcı adı uydurma.
- E-posta ve GitHub: profil satırı.

## Dikkat ederek değiştirilir

- `Project.tone`: `qrivo`, `scp` veya `generic`. Hero medyasını bu seçer.
  - `qrivo` → `public/media/qrivo-menu.mp4`
  - `scp` → `public/media/scp-steam.mp4`
  - diğer → `components/site/site-build.tsx` içindeki telefon maketi
- Hero videoları sessiz, otomatik oynar ve döngüye girmez. Biri bitince sonraki sekmeye geçer (`components/site/work-stage.tsx`, `HeroClip`). İşler bölümündeki `LoopVideo` döner.
- İşler bölümü masaüstünde sıra sırayla yer değiştirir: çift indekste medya solda, tek indekste metin solda. Telefonda sıra başlık, medya, metin olarak kalır. DOM sırasını bozma.
- Hero ızgarası: küçük ekranda `grid-cols-[minmax(0,1fr)]`. Masaüstü metin kolonuna `min-w-0` koyma; vurgu kelimesi telefon görselinin üstüne biner.
- Portre `public/media/portre.webp`. Yönetimden yüklenen portre varsa o kullanılır, yoksa bu dosya. Kırpma yok; `object-cover` ile zorlama. Yüz uydurma.
- Ekran görüntüsü şeridi `components/site/shot-reel.tsx`: `parmass.png`, `maestross.png`, `qrivoss.png`.
- Tema geçişi View Transitions API. Karanlık soldan sağa (`theme-reveal-ltr`), aydınlık sağdan sola (`theme-reveal-rtl`). Açılışta sistem teması okunur; kayıtlı seçim varsa o kazanır. Sayfa önce karşı temada boyanır, sonra silme animasyonu hedefe gider. Bu geçiş `localStorage` yazmaz. Azaltılmış harekette animasyon yoktur. Ayrıntı: `app/layout.tsx` içindeki tema betiği, `components/providers.tsx`, `lib/theme-intro.ts`.
- Dil: tek URL. `/tr` ve `/en` yok. Çerez yoksa dil İngilizcedir. Tarayıcı dili siteyi Türkçe açmaz. `site_locale=tr` veya `en` çerezi seçimi bir yıl tutar. Harf kaydırma animasyonu kaldırıldı; geri getirme. Buton çerezi yazar ve `router.refresh()` çağırır.
- Arama: başlık `Doğuhan Erol — {rol}` ve `title.absolute` olmalı. Şablon başlığa ikinci kez isim eklemesin. Açıklamayı hero cümlesinden üretme. `sameAs` yalnız kimlik linkleridir: GitHub, kişisel Instagram, Substack, BlindEyeGames Instagram. Parma Pizza, Mila Maestro ve oyun mağaza sayfası kişi kimliği değildir. Qrivo `SoftwareApplication`, SCP-294 `VideoGame` olarak yazılır.
- İkonlar ve `og.png` logo dosyasındandır. Portre, kişi şemasındaki fotoğraftır. Paylaşım görseli logo olarak kalır.
- `@smithy/node-http-handler` ve `@smithy/core` sürümleri `package.json` içinde kilitlidir. Kaldırma; MinIO istemcisi kurulumu kırılır.
- `DEPLOY_ENV=local|production` çerezin `Secure` bayrağını belirler. Lokalde `production` yapma.

## Yapma

- Qrivo’nun veritabanına, volume’una, ağına veya Caddy sürecine dokunma.
- Bu projenin üretim Caddy’sini, Qrivo ayaktayken 80 ve 443 yayınlayacak şekilde başlatma. İkisi de bu portları ister. Ayrıntı aşağıdaki VPS bölümünde.
- `.env` içindeki gerçek şifreleri commit etme. `.env` ignore edilir. `.env.production.example` yer tutucudur.
- Yönetici şifresini seed ile “düzeltme”. Seed var olan hesabı bilinçli olarak atlar.
- WhatsApp numarası, Telegram kullanıcı adı, müşteri hikâyesi, yayınlanmış makale veya arama sonucu uydurma.
- Parma Pizza ve Mila Maestro’yu yapılan işin kendisi gibi anlatma. Onlar işletme siteleri kartındaki örnek linklerdir. Hakkımda metninde geçmezler.
- İşletme siteleri kartına Docker, VPS veya deploy cümlesi yazma. Qrivo maddeleri müşteriye görünen iştir: masa, masadaki QR menü, personelin telefondan girişi, mutfak ve bar siparişinin ilgili yazıcıdan çıkması.
- “Kısa korku oyunu” yazma. Oyunun adı `SCP-294: The Coffee Machine`. Geliştirici adı `BlindEyeGames`.
- Butonlarda `qrivo.online` yazma. Buton metni `Qrivo`. Hakkımda paragraflarında sahip `QRivo` yazdı; o iki alanda bu yazımı koru. Sitenin geri kalanı `Qrivo`.
- Hakkımda metnini tek paragrafa indirgeme.
- Hero’daki isim satırını geri getirme. İsim üst menüde durur.
- Alt bilgiye iletişim bloğu ekleme. Alt bilgi telif ve başa dön linkidir. Sabit başa dön düğmesi `scrollY > 32` sonra çıkar.
- Giriş sayfasını herkese açık menüye koyma.

## Sahibin içerik kararları

Rol: Türkçe `Teknoloji ve İş Geliştirme`, İngilizce `Technology & Business Development`.

Hero başlığı bu anlama gelir: işi dijitalleştirerek zaman ve prestij kazandırmak. İki dilde de bu anlam korunur.

Hakkımda dört parçadır: yazılım ve paneller, QRivo, SCP-294, akademik LaTeX / çeviri / makale hazırlığı ve Türkçe–İngilizce–Rusça.

İletişim butonları her zaman görünür: WhatsApp, Telegram, Instagram, Substack. İlk ikisi profil dolunca link olur. Son ikisi sabittir.

## Medya

Kullanılan dosyalar:

- `qrivo-menu.mp4` — hero, telefon
- `qrivo-desktop.mp4` — Qrivo iş kartında döngü
- `scp-steam.mp4` — hero, SCP telefonu
- `Trailer.mp4` — SCP iş kartında döngü
- `portre.webp` — hakkımda, kare ve tam kare
- `logoportfolio.png` — favicon ve paylaşım görselinin kaynağı
- `QrivoLogoSquare.png`, `scplogo.png`
- `parmass.png`, `maestross.png`, `qrivoss.png`

`public/media` içinde kullanılmayan kaynak kayıtlar durabilir. Onları hero’ya alma. Dosya adlarında boşluk vardır; yeni yolda boşluksuz isim kullan.

## Yönetim ve giriş

Lokal hesap `.env` içindeki `SEED_ADMIN_USERNAME` ve `SEED_ADMIN_PASSWORD` ile oluşur. Örnek dosyada kullanıcı `doguhan`, şifre `admin123`. Bu şifre yayına gitmez.

Yayında, ilk `init-db` çalışmadan önce sunucu `.env` dosyasında `SEED_ADMIN_EMAIL`, `SEED_ADMIN_USERNAME` ve `SEED_ADMIN_PASSWORD` gerçek değer olur. `scripts/vps.sh`, `change-me` içeren yönetici şifresini reddeder. Hesap bir kez oluştuktan sonra şifre yönetimdeki Hesap sayfasından değişir. Mevcut şifre istenir. Yeni şifre boşsa şifre aynı kalır.

Giriş kullanıcı adı veya e-posta ile olur. Büyük-küçük harf duyarsızdır.

## Aynı VPS, Qrivo dururken

Qrivo’nun Caddy’si 80 ve 443’ü tutar. Bu projenin `docker-compose.prod.yml` dosyası o portları açmaz ve kendi Caddy’sini başlatmaz. `scripts/vps.sh` compose proje adını `doguhan-portfolio` yapar, `web-edge` ağını yoksa oluşturur, veritabanı ile MinIO’yu ayrı volume’da kaldırır.

Uygulama konteyneri `doguhan-portfolio-app`, MinIO konteyneri `doguhan-portfolio-minio`. İkisi `web-edge` ağındadır. Qrivo veritabanı `qrmenu`, bu proje `portfolio`. Bucket adı `portfolio`.

`scripts/vps.sh` uygulamayı kaldırır, ardından `scripts/attach-edge.sh` Qrivo Caddy’sini `web-edge` ağına bağlar ve `deploy/caddy-site.caddy` bloklarını o Caddy dosyasının sonuna ekler. `qrivo.online` satırlarını silmez. Kural duruyorsa ikinci kez yazmaz. Reload olmazsa yedeği (`Caddyfile.bak.portfolio`) geri koyar. Caddy bulunamazsa uygulama yine de ayaktadır; DNS oturunca `bash scripts/attach-edge.sh` tekrar çalışır.

`deploy/Caddyfile` yalnız makinede başka kimse 80/443 dinlemiyorsa, `standalone` profili ile kullanılır. Paylaşılan VPS’te bu profil açılmaz.

Domain ve MinIO adresi `lib/env.ts` üzerinden istek anında okunur. `NEXT_PUBLIC_*` statik yazılırsa imaj derlenirken `localhost` gömülür. Yeni adres için `ROOT_DOMAIN` veya `NEXT_PUBLIC_ROOT_DOMAIN`, medya için `MINIO_PUBLIC_URL` veya `NEXT_PUBLIC_MINIO_PUBLIC_URL`. `NEXTAUTH_URL=https://doguhan-erol.com`. `AUTH_SECRET` en az 32 karakter. Veritabanı ve MinIO şifreleri en az 12. Yönetici şifresi en az 8 ve `change-me` içeremez.
