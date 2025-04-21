import { notFound } from 'next/navigation';

import BackButton from './components';

import styles from './page.module.css';
import { getSelectedRow } from '@/app/components/Table/utils';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const item = await getSelectedRow(Number(id));
  if (!item) return { title: 'Item Not Found' };

  return {
    title: `${item.issueType} — #${item.id}`,
    description: item.description,
    openGraph: {
      title: `Accessibility Issue #${item.id}`,
      description: item.description,
      url: item.url,
      images: [{ url: item.screenshot }]
    }
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const item = await getSelectedRow(Number(id));

  if (!item) return notFound();

  return (
    <div className={styles.wrapper}>
      <BackButton autoFocus />
      <h1 className={styles.title}>
        Issue #{item.id}: {item.issueType}
      </h1>
      <ul className={styles.list}>
        <li><strong>Severity:</strong> {item.severity}</li>
        <li><strong>Component:</strong> {item.component}</li>
        <li><strong>Selector:</strong> {item.selector}</li>
        <li>
          <strong>URL:</strong>{' '}
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            {item.url}
          </a>
        </li>
        <li><strong>Description:</strong> {item.description}</li>
        <li>
          <strong>Code Snippet:</strong>
          <pre className={styles.code}>{item.codeSnippet}</pre>
        </li>
        <li>
          <strong>Screenshot:</strong>
          <div>
            <img
              src={item.screenshot}
              alt={`Screenshot of issue #${item.id}`}
              className={styles.image}
            />
          </div>
        </li>
      </ul>
    </div>
  );
}
