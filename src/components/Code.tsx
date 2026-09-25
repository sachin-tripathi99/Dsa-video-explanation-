import { useEffect, useMemo, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import java from 'highlight.js/lib/languages/java';
import python from 'highlight.js/lib/languages/python';
import cpp from 'highlight.js/lib/languages/cpp';
import { setPref, usePrefs, type Lang } from '../state/store';

hljs.registerLanguage('java', java);
hljs.registerLanguage('python', python);
hljs.registerLanguage('cpp', cpp);

export const LANGS: { id: Lang; label: string }[] = [
  { id: 'java', label: 'Java' },
  { id: 'python', label: 'Python' },
  { id: 'cpp', label: 'C++' },
];

export function highlight(src: string, lang: string) {
  try {
    if (hljs.getLanguage(lang)) return hljs.highlight(src, { language: lang }).value;
  } catch {
    /* fall through */
  }
  return src.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

/** One code block per language; the chosen language is remembered site-wide. */
export function CodeTabs({ code, extra }: { code: Partial<Record<Lang, string | null>>; extra?: React.ReactNode }) {
  const prefs = usePrefs();
  const available = LANGS.filter((l) => code[l.id]);
  const lang = available.some((l) => l.id === prefs.lang) ? prefs.lang : available[0]?.id;
  const [copied, setCopied] = useState(false);
  const src = lang ? code[lang] ?? '' : '';
  const html = useMemo(() => (lang ? highlight(src, lang) : ''), [src, lang]);
  useEffect(() => setCopied(false), [src]);
  if (!available.length) return null;
  const copy = () => {
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    };
    try {
      navigator.clipboard.writeText(src).then(done, () => undefined);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <div className="codebox">
      <div className="tabs" role="tablist" aria-label="Language">
        {available.map((l) => (
          <button key={l.id} className="tab" role="tab" aria-selected={l.id === lang} onClick={() => setPref('lang', l.id)}>
            {l.label}
          </button>
        ))}
        {extra}
        <button className="copy" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}

export function CodeBlock({ src, lang }: { src: string; lang: string }) {
  const html = useMemo(() => highlight(src, lang), [src, lang]);
  return (
    <div className="codebox">
      <pre>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
