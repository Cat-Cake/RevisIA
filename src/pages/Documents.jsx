import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PlusIcon, DotsIcon, FileIcon } from '../components/icons.jsx'
import { documentService } from '../services/documentService.js'
import { useToast } from '../components/useToast.js'
import './Documents.css'
import NotificationBell from '../components/NotificationBell.jsx'

const GENERATION_POLL_INTERVAL = 5000

export default function Documents() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const { notify, update, dismiss } = useToast()
  // id de document -> id de la notification « génération en cours »
  const genToasts = useRef(new Map())

  function loadDocs() {
    setLoading(true)
    setError(null)
    documentService.list()
      .then((data) => setDocs(Array.isArray(data) ? data : data?.documents || []))
      .catch((err) => setError(err.message || 'Impossible de charger les documents.'))
      .finally(() => setLoading(false))
  }

  useEffect(loadDocs, [])

  const hasGenerationInProgress = docs.some((d) => d.generationEnCours)

  // Une notification par document : « en cours » puis « terminée »
  useEffect(() => {
    const pending = genToasts.current
    docs.forEach((d) => {
      const name = d.nom || d.titre || d.name || 'ce document'
      if (d.generationEnCours && !pending.has(d.id)) {
        pending.set(d.id, notify({
          type: 'loading',
          title: 'Génération en cours…',
          message: `L'IA analyse « ${name} » et prépare son contenu de révision.`,
          duration: 0,
        }))
      } else if (!d.generationEnCours && pending.has(d.id)) {
        update(pending.get(d.id), {
          type: 'success',
          title: 'Génération terminée',
          message: `« ${name} » est prêt à être révisé.`,
        })
        pending.delete(d.id)
      }
    })
    // Document supprimé entre-temps : on retire sa notification
    pending.forEach((toastId, docId) => {
      if (!docs.some((d) => d.id === docId)) {
        dismiss(toastId)
        pending.delete(docId)
      }
    })
  }, [docs, notify, update, dismiss])

  // On quitte la page : plus rien ne viendra conclure les notifications en attente
  useEffect(() => {
    const pending = genToasts.current
    return () => {
      pending.forEach((toastId) => dismiss(toastId))
      pending.clear()
    }
  }, [dismiss])

  useEffect(() => {
    if (!hasGenerationInProgress) return
    const timer = setTimeout(() => {
      documentService.list()
        .then((data) => setDocs(Array.isArray(data) ? data : data?.documents || []))
        .catch(() => {})
    }, GENERATION_POLL_INTERVAL)
    return () => clearTimeout(timer)
  }, [hasGenerationInProgress, docs])

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    setError(null)
    const toastId = notify({
      type: 'loading',
      title: 'Import en cours…',
      message: `Envoi de « ${file.name} ».`,
      duration: 0,
    })
    try {
      await documentService.upload(file)
      update(toastId, {
        type: 'info',
        title: 'Document importé',
        message: "La génération du contenu par l'IA va démarrer.",
      })
      loadDocs()
    } catch (err) {
      const message = err.message || "Échec de l'import du PDF."
      setError(message)
      update(toastId, { type: 'error', title: "Échec de l'import", message })
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
          <NotificationBell />
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
                  {d.generationEnCours && (
                    <span className="doc-card__badge">
                      <span className="doc-card__badge-dot" /> Génération en cours…
                    </span>
                  )}
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
