'use client';
import { useState, useRef, useCallback } from 'react';

type Props = {
  value: string;
  onChange: (url: string) => void;
};

export default function ImageUploader({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [tab, setTab] = useState<'upload' | 'url'>('upload');
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(async (file: File) => {
    setUploading(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else {
        setError(data.error ?? 'Error al subir');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) upload(file);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Tabs */}
      <div className="flex gap-1 bg-gris-claro p-1 rounded w-fit">
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${tab === 'upload' ? 'bg-white text-tinta shadow-sm' : 'text-gris-medio hover:text-tinta'}`}
        >
          📁 Subir archivo
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${tab === 'url' ? 'bg-white text-tinta shadow-sm' : 'text-gris-medio hover:text-tinta'}`}
        >
          🔗 Pegar URL
        </button>
      </div>

      {tab === 'upload' ? (
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            dragOver ? 'border-azul bg-azul/5' : 'border-gris-claro hover:border-azul hover:bg-azul/5'
          } ${uploading ? 'opacity-60 cursor-wait' : ''}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFile}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-azul border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gris-medio">Subiendo imagen...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">📷</span>
              <p className="text-sm font-medium text-tinta">Arrastrá una imagen o tocá para seleccionar</p>
              <p className="text-xs text-gris-medio">JPG, PNG, WebP · Máximo 5MB</p>
            </div>
          )}
        </div>
      ) : (
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://..."
          className="w-full border-2 border-gris-claro rounded px-3 py-2.5 focus:border-azul outline-none text-sm transition-colors"
        />
      )}

      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}

      {/* Preview */}
      {value && (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="preview"
            className="rounded-lg h-40 w-full object-cover"
            onError={e => (e.currentTarget.style.display = 'none')}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm transition-colors"
            title="Quitar imagen"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
