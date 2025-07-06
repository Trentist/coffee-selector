'use client';

import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('common');

  return (
    <div>
      <h1>{t('error')}</h1>
      <p>{t('something_went_wrong')}</p>
      <button onClick={() => reset()}>{t('try_again')}</button>
    </div>
  );
}