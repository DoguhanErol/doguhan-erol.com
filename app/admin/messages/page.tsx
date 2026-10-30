import { deleteMessage, markMessageRead, markMessageUnread } from "@/lib/actions/messages";
import { prisma } from "@/lib/db";

export default async function MessagesPage() {
  const messages = await prisma.message.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Mesajlar</h1>
      <p className="mt-2 mb-6 text-sm text-muted">İletişim formundan gelenler. E-posta sunucusu yok, cevap buradan kopyalanır.</p>
      {messages.length === 0 ? (
        <p className="rounded-3xl border border-line bg-card px-5 py-8 text-sm text-muted">Henüz mesaj yok.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <article key={message.id} className="rounded-3xl border border-line bg-card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">
                  {message.name || "Adsız"}
                  <span className="ml-2 text-sm font-normal text-muted">{message.email}</span>
                </p>
                <p className="text-xs text-muted">
                  {message.createdAt.toLocaleString("tr-TR", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                  {message.read ? "" : " · yeni"}
                </p>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{message.body}</p>
              <div className="mt-4 flex gap-4 text-sm">
                {message.read ? (
                  <form action={markMessageUnread}>
                    <input type="hidden" name="id" value={message.id} />
                    <button type="submit" className="text-muted hover:text-ink">
                      Okunmadı yap
                    </button>
                  </form>
                ) : (
                  <form action={markMessageRead}>
                    <input type="hidden" name="id" value={message.id} />
                    <button type="submit" className="text-accent">
                      Okundu
                    </button>
                  </form>
                )}
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={message.id} />
                  <button type="submit" className="text-red-600">
                    Sil
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
