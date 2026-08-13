'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StackButton from '@/components/ui/StackButton';
import RichEditor from './RichEditor';
import { uploadImage } from './uploadImage';

export type Term = { id?: number; name: string; slug: string };

export type PostData = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  body_html: string;
  cover_image: string | null;
  status: 'draft' | 'published';
  category: Term | null;
  tags: Term[];
  seo_title: string | null;
  seo_desc: string | null;
  reading_mins: number | null;
  published_at: string | null;
  author?: { id: number; name: string } | null;
};

export type TaxonomyOptions = { categories: string[]; tags: string[] };

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseTags(input: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input.split(',')) {
    const t = raw.trim();
    if (!t) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

export default function PostForm({
  mode,
  post,
  options,
}: {
  mode: 'create' | 'edit';
  post?: PostData;
  options?: TaxonomyOptions;
}) {
  const router = useRouter();

  const [title, setTitle] = useState(post?.title ?? '');
  const [slug, setSlug] = useState(post?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [cover, setCover] = useState(post?.cover_image ?? '');
  const [body, setBody] = useState(post?.body_html ?? '');
  const [category, setCategory] = useState(post?.category?.name ?? '');
  const [tagsInput, setTagsInput] = useState((post?.tags ?? []).map((t) => t.name).join(', '));
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? '');
  const [seoDesc, setSeoDesc] = useState(post?.seo_desc ?? '');
  const [status, setStatus] = useState<'draft' | 'published'>(post?.status ?? 'draft');

  const [saving, setSaving] = useState<null | 'draft' | 'published'>(null);
  const [error, setError] = useState('');
  const [justSaved, setJustSaved] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);

  const effectiveSlug = slugTouched ? slug : slugify(title);

  // Touched helper — any edit marks the form dirty and clears the saved flag.
  function edit<T>(setter: (v: T) => void) {
    return (v: T) => {
      setter(v);
      setDirty(true);
      setJustSaved(false);
    };
  }

  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  async function onCoverFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setCoverUploading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      edit(setCover)(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cover upload failed.');
    } finally {
      setCoverUploading(false);
    }
  }

  async function save(target: 'draft' | 'published') {
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!body.trim() || body === '<p></p>') {
      setError('The post body cannot be empty.');
      return;
    }

    setSaving(target);
    setError('');

    const payload = {
      title: title.trim(),
      slug: effectiveSlug || undefined,
      excerpt: excerpt.trim() || null,
      body_html: body,
      cover_image: cover.trim() || null,
      category: category.trim() || null,
      tags: parseTags(tagsInput),
      seo_title: seoTitle.trim() || null,
      seo_desc: seoDesc.trim() || null,
      status: target,
    };

    try {
      const url = mode === 'create' ? '/api/admin/posts' : `/api/admin/posts/${post!.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const firstError =
          data?.errors && typeof data.errors === 'object'
            ? (Object.values(data.errors)[0] as string[])?.[0]
            : undefined;
        setError(firstError ?? data?.message ?? 'Save failed. Please try again.');
        setSaving(null);
        return;
      }

      setDirty(false);
      const saved = data?.data as PostData | undefined;

      if (mode === 'create' && saved?.id) {
        window.location.assign(`/jundullah/blogs/${saved.id}/edit`);
        return;
      }

      // Edit mode: reflect canonical values from the server.
      if (saved) {
        setSlug(saved.slug);
        setSlugTouched(true);
        setStatus(saved.status);
      }
      setSaving(null);
      setJustSaved(true);
      router.refresh();
    } catch {
      setError('Network error. Please try again.');
      setSaving(null);
    }
  }

  return (
    <section className="adm-main adm-editor">
      <div className="adm-editor-head">
        <div>
          <Link href="/jundullah/blogs" className="adm-link">← All posts</Link>
          <h1 className="adm-h1">{mode === 'create' ? 'New post' : 'Edit post'}</h1>
        </div>
        <div className="adm-editor-actions">
          <span className={`adm-badge adm-badge-${status}`}>{status}</span>
          {justSaved && <span className="adm-saved">Saved ✓</span>}
          {mode === 'edit' && post && (
            <StackButton
              href={`/jundullah/blogs/${post.id}/preview`}
              target="_blank"
              size="sm"
              tone="ghost"
            >
              Preview ↗
            </StackButton>
          )}
          <StackButton type="button" size="sm" tone="ghost" onClick={() => save('draft')} disabled={saving !== null}>
            {saving === 'draft' ? 'Saving…' : 'Save draft'}
          </StackButton>
          <StackButton type="button" size="sm" onClick={() => save('published')} disabled={saving !== null}>
            {saving === 'published' ? 'Publishing…' : status === 'published' ? 'Update' : 'Publish'}
          </StackButton>
        </div>
      </div>

      {error && <p className="adm-form-error">{error}</p>}

      <div className="adm-editor-grid">
        <div className="adm-editor-main">
          <label className="adm-field2">
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => edit(setTitle)(e.target.value)}
              placeholder="A meaningful headline"
              className="adm-title-input"
            />
          </label>

          {/* NOT a <label>: it wraps the toolbar buttons, and a label would
              delegate every click inside it to its first control (the H2
              button), silently toggling the caret's block to a heading. */}
          <div className="adm-field2">
            <span>Body</span>
            <RichEditor value={post?.body_html ?? ''} onChange={edit(setBody)} />
          </div>
        </div>

        <aside className="adm-editor-side">
          <label className="adm-field2">
            <span>Slug</span>
            <input
              type="text"
              value={effectiveSlug}
              onChange={(e) => {
                setSlugTouched(true);
                edit(setSlug)(e.target.value);
              }}
              placeholder="auto-from-title"
            />
            <small className="adm-hint">/blog/{effectiveSlug || 'your-post'}</small>
          </label>

          <label className="adm-field2">
            <span>Excerpt</span>
            <textarea
              value={excerpt}
              onChange={(e) => edit(setExcerpt)(e.target.value)}
              rows={3}
              placeholder="One-line summary for cards and previews."
            />
          </label>

          <label className="adm-field2">
            <span>Category</span>
            <input
              type="text"
              list="adm-category-options"
              value={category}
              onChange={(e) => edit(setCategory)(e.target.value)}
              placeholder="e.g. Brand strategy"
            />
            <datalist id="adm-category-options">
              {(options?.categories ?? []).map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <small className="adm-hint">One category per post. New names are created automatically.</small>
          </label>

          <label className="adm-field2">
            <span>Tags</span>
            <input
              type="text"
              list="adm-tag-options"
              value={tagsInput}
              onChange={(e) => edit(setTagsInput)(e.target.value)}
              placeholder="comma, separated, tags"
            />
            <datalist id="adm-tag-options">
              {(options?.tags ?? []).map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
            <small className="adm-hint">Comma-separated. New tags are created automatically.</small>
          </label>

          <div className="adm-field2">
            <span>Cover image</span>
            {cover && (
              <div className="adm-cover-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cover} alt="Cover preview" />
                <button type="button" className="adm-cover-remove" onClick={() => edit(setCover)('')}>
                  Remove
                </button>
              </div>
            )}
            <label className="adm-upload-btn">
              {coverUploading ? 'Uploading…' : cover ? 'Replace cover' : 'Upload cover'}
              <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={onCoverFile} disabled={coverUploading} />
            </label>
            <input
              type="text"
              value={cover}
              onChange={(e) => edit(setCover)(e.target.value)}
              placeholder="or paste an image URL"
              className="adm-cover-url"
            />
          </div>

          <div className="adm-side-group">
            <p className="adm-side-title">SEO</p>
            <label className="adm-field2">
              <span>SEO title</span>
              <input type="text" value={seoTitle} onChange={(e) => edit(setSeoTitle)(e.target.value)} placeholder="Defaults to title" />
            </label>
            <label className="adm-field2">
              <span>Meta description</span>
              <textarea value={seoDesc} onChange={(e) => edit(setSeoDesc)(e.target.value)} rows={3} placeholder="Defaults to excerpt" />
            </label>
          </div>
        </aside>
      </div>
    </section>
  );
}
