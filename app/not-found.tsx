import Link from "next/link";
import Image from "next/image";
import { t } from "@/content/copy";

export default function NotFound() {
  return (
    <section className="min-h-dvh flex flex-col items-center justify-center px-6 text-center">
      {/* Sticker illustration from Goa Sticker Collective */}
      <div className="relative w-48 h-48 md:w-64 md:h-64 mb-8">
        <Image
          src="/images/goa-sticker-collective/24fc85a9-55c6-4fd5-9b5c-c54f416bbb65.png"
          alt={t.notFound.imageAlt}
          fill
          className="object-contain"
          priority
        />
      </div>

      <h1 className="type-h1 mb-3">{t.notFound.heading}</h1>
      <p className="text-ink-soft text-sm mb-8 max-w-[35ch]">{t.notFound.body}</p>

      <Link href="/work" className="btn-primary">
        {t.notFound.cta}
      </Link>
    </section>
  );
}
