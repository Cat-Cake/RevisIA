import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { BellIcon, PlusIcon, DotsIcon, FileIcon } from '../components/icons.jsx'
import { documentService } from '../services/documentService.js'
import './Documents.css'

export default function Documents() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  function loadDocs() {
    setLoading(true)
    setError(null)
    documentService.list()
      .then((data) => setDocs(Array.isArray(data) ? data : data?.results || []))
      .catch((err) => setError(err.message || 'Impossible de charger les documents.'))
      .finally(() => setLoading(false))
  }

  useEffect(loadDocs, [])

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      await documentService.upload(file)
      loadDocs()
    } catch (err) {
      setError(err.message || "Échec de l'import du PDF.")
    } finally {
      setUploading(false)
    }
  }

  async function handleRemove(id) {
    if (!window.confirm('Supprimer ce document et tout son contenu généré ?')) return
    try {
      await documentService.remove(id)
      setDocs((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      setError(err.message || 'Échec de la suppression.')
    }
  }

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Mes documents</h1>
          <p>Tous tes cours importés, prêts à réviser.</p>
        </div>
        <div className="topbar__actions">
          <button className="iconbtn" aria-label="Notifications"><BellIcon /></button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            hidden
            onChange={handleFileChange}
          />
          <button
            className="btn btn--primary btn--sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <PlusIcon /> {uploading ? 'Import en cours…' : 'Importer un PDF'}
          </button>
        </div>
      </header>

      <div className="docs">
        {loading && <p>Chargement…</p>}
        {error && <p className="docs__error">{error}</p>}

        {!loading && !error && docs.length === 0 && (
          <p>Aucun document importé pour l'instant.</p>
        )}

        {!loading && !error && docs.length > 0 && (
          <div className="docs__grid">
            {docs.map((d) => (
              <article className="doc-card" key={d.id}>
                <div className="doc-card__head">
                  <span className="doc-card__thumb doc-card__thumb--a">
                    <FileIcon />
                  </span>
                </div>

                <h3 className="doc-card__name">{d.nom || d.titre || d.name}</h3>

                <div className="doc-card__foot">
                  <Link to={`/app/documents/${d.id}`} className="btn btn--primary btn--sm doc-card__cta">
                    Réviser
                  </Link>
                  <button
                    className="iconbtn iconbtn--sm"
                    aria-label="Supprimer"
                    onClick={() => handleRemove(d.id)}
                  >
                    <DotsIcon />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
