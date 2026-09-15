'use client';

import Script from 'next/script';

/**
 * Яндекс.Метрика.
 *
 * Стратегия lazyOnload: счётчик грузится после того, как страница полностью
 * отрисована и стала интерактивной. Аналитика не должна конкурировать за
 * канал с первым экраном — на мобильном интернете это прямо бьёт по LCP.
 *
 * Без NEXT_PUBLIC_YM_ID не рендерится вовсе: на превью-деплоях и в разработке
 * статистика счётчику не нужна и только портит данные.
 */
export function Analytics() {
  const id = process.env.NEXT_PUBLIC_YM_ID;
  if (!id) return null;

  return (
    <>
      <Script id="ym-init" strategy="lazyOnload">
        {`
          (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
          m[i].l=1*new Date();
          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
          ym(${JSON.stringify(id)}, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });
        `}
      </Script>

      <noscript>
        <div>
          {/* Счётчик без JS — именно пиксель 1×1 на стороннем домене.
              next/image здесь неприменим: он попытался бы оптимизировать
              и закешировать трекинговый запрос, лишив его смысла. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${id}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
