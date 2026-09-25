import React from 'react';
import { marked, type Token, type Tokens } from 'marked';
import { Link } from 'react-router-dom';
import { CodeBlock, CodeTabs } from './Code';
import type { Lang } from '../state/store';

const LANG_ALIAS: Record<string, Lang> = { java: 'java', python: 'python', py: 'python', cpp: 'cpp', 'c++': 'cpp' };

function inlineTokens(tokens: Token[] | undefined): React.ReactNode {
  if (!tokens) return null;
  return tokens.map((t, i) => {
    switch (t.type) {
      case 'text':
        return 'tokens' in t && t.tokens ? <React.Fragment key={i}>{inlineTokens(t.tokens)}</React.Fragment> : <React.Fragment key={i}>{decode((t as Tokens.Text).text)}</React.Fragment>;
      case 'strong':
        return <strong key={i}>{inlineTokens((t as Tokens.Strong).tokens)}</strong>;
      case 'em':
        return <em key={i}>{inlineTokens((t as Tokens.Em).tokens)}</em>;
      case 'codespan':
        return <code key={i}>{decode((t as Tokens.Codespan).text)}</code>;
      case 'del':
        return <del key={i}>{inlineTokens((t as Tokens.Del).tokens)}</del>;
      case 'br':
        return <br key={i} />;
      case 'link': {
        const l = t as Tokens.Link;
        if (l.href.startsWith('#/')) return <Link key={i} to={l.href.slice(1)}>{inlineTokens(l.tokens)}</Link>;
        return <a key={i} href={l.href} target="_blank" rel="noopener noreferrer">{inlineTokens(l.tokens)}</a>;
      }
      case 'escape':
        return <React.Fragment key={i}>{decode((t as Tokens.Escape).text)}</React.Fragment>;
      default:
        return <React.Fragment key={i}>{'raw' in t ? decode(String(t.raw)) : ''}</React.Fragment>;
    }
  });
}

function decode(s: string) {
  return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function blocks(tokens: Token[]): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type === 'code') {
      // Group consecutive java/python/cpp blocks into one tabbed block.
      const group: Partial<Record<Lang, string>> = {};
      let j = i;
      while (j < tokens.length) {
        const c = tokens[j];
        if (c.type === 'space') {
          j++;
          continue;
        }
        if (c.type !== 'code') break;
        const lang = LANG_ALIAS[(c as Tokens.Code).lang ?? ''];
        if (!lang || group[lang]) break;
        group[lang] = (c as Tokens.Code).text;
        j++;
      }
      if (Object.keys(group).length) {
        out.push(<CodeTabs key={i} code={group} />);
        i = j - 1;
      } else {
        out.push(<CodeBlock key={i} src={(t as Tokens.Code).text} lang={(t as Tokens.Code).lang ?? ''} />);
      }
      continue;
    }
    switch (t.type) {
      case 'heading': {
        const h = t as Tokens.Heading;
        const Tag = (`h${Math.min(Math.max(h.depth, 2), 4)}`) as 'h2' | 'h3' | 'h4';
        out.push(<Tag key={i}>{inlineTokens(h.tokens)}</Tag>);
        break;
      }
      case 'paragraph':
        out.push(<p key={i}>{inlineTokens((t as Tokens.Paragraph).tokens)}</p>);
        break;
      case 'list': {
        const l = t as Tokens.List;
        const items = l.items.map((it, k) => <li key={k}>{it.tokens.some((x) => x.type !== 'text') ? blocks(it.tokens) : inlineTokens(it.tokens)}</li>);
        out.push(l.ordered ? <ol key={i} start={typeof l.start === 'number' ? l.start : undefined}>{items}</ol> : <ul key={i}>{items}</ul>);
        break;
      }
      case 'blockquote':
        out.push(<blockquote key={i}>{blocks((t as Tokens.Blockquote).tokens)}</blockquote>);
        break;
      case 'table': {
        const tb = t as Tokens.Table;
        out.push(
          <div className="table-wrap" key={i}>
            <table>
              <thead>
                <tr>{tb.header.map((h, k) => <th key={k}>{inlineTokens(h.tokens)}</th>)}</tr>
              </thead>
              <tbody>
                {tb.rows.map((r, k) => (
                  <tr key={k}>{r.map((c, m) => <td key={m}>{inlineTokens(c.tokens)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
        break;
      }
      case 'hr':
        out.push(<hr key={i} />);
        break;
      case 'text':
        out.push(<p key={i}>{inlineTokens((t as Tokens.Text).tokens ?? [t])}</p>);
        break;
      default:
        break;
    }
  }
  return out;
}

export function Markdown({ src, className = 'prose' }: { src: string; className?: string }) {
  const tokens = React.useMemo(() => marked.lexer(src), [src]);
  return <div className={className}>{blocks(tokens)}</div>;
}

/** Inline-only markdown (for short strings inside cards). */
export function MdInline({ src }: { src: string }) {
  const tokens = React.useMemo(() => marked.Lexer.lexInline(src), [src]);
  return <>{inlineTokens(tokens)}</>;
}
