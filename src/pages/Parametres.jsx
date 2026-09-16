import { useEffect, useState } from 'react'
import { BellIcon } from '../components/icons.jsx'
import { authService } from '../services/authService.js'
import './Parametres.css'

export default function Parametres() {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [ancienMdp, setAncienMdp] = useState('')
  const [nouveauMdp, setNouveauMdp] = useState('')
  const [confirmMdp, setConfirmMdp] = useState('')

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const [profil, setProfil] = useState({ saving: false, error: null, ok: false })
  const [mdp, setMdp] = useState({ saving: false, error: null, ok: false })

  useEffect(() => {
    let cancelled = false
    authService.me()
      .then((data) => {
        if (cancelled) return
        setNom(data?.nom || data?.name || '')
        setEmail(data?.email || '')
      })
      .catch((err) => { if (!cancelled) setLoadError(err.message || 'Impossible de charger ton profil.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  async function handleProfil(e) {
    e.preventDefault()
    setProfil({ saving: true, error: null, ok: false })
    try {
      await authService.updateProfile({ nom, email })
      setProfil({ saving: false, error: null, ok: true })
    } catch (err) {
      setProfil({ saving: false, error: err.message || 'Enregistrement impossible.', ok: false })
    }
  }

  async function handleMdp(e) {
    e.preventDefault()
    if (nouveauMdp !== confirmMdp) {
      setMdp({ saving: false, error: 'Les deux mots de passe ne correspondent pas.', ok: false })
      return
    }
    setMdp({ saving: true, error: null, ok: false })
    try {
      await authService.changePassword({ ancien_mot_de_passe: ancienMdp, mot_de_passe: nouveauMdp })
      setAncienMdp('')
      setNouveauMdp('')
      setConfirmMdp('')
      setMdp({ saving: false, error: null, ok: true })
    } catch (err) {
      setMdp({ saving: false, error: err.message || 'Modification impossible.', ok: false })
    }
  }

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Paramètres</h1>
          <p>Gère ton compte et tes informations personnelles.</p>
        </div>
        <button className="iconbtn" aria-label="Notifications"><BellIcon /></button>
      </header>

      <div className="settings">
        {loading && <p>Chargement…</p>}
        {loadError && <p className="settings__error">{loadError}</p>}

        {!loading && !loadError && (
          <>
            <section className="panel settings-card">
              <div className="settings-card__head">
                <h2>Profil</h2>
                <p>Ces informations apparaissent sur ton compte.</p>
              </div>
              <form className="settings-form" onSubmit={handleProfil}>
                <div className="field">
                  <label htmlFor="set-nom">Nom</label>
                  <input
                    id="set-nom"
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Ton nom"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="set-email">Adresse e-mail</label>
                  <input
                    id="set-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ton@email.com"
                    required
                  />
                </div>
                {profil.error && <p className="settings__error">{profil.error}</p>}
                {profil.ok && <p className="settings__ok">Profil mis à jour.</p>}
                <div className="settings-form__actions">
                  <button type="submit" className="btn btn--primary" disabled={profil.saving}>
                    {profil.saving ? 'Enregistrement…' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </section>

            <section className="panel settings-card">
              <div className="settings-card__head">
                <h2>Mot de passe</h2>
                <p>Choisis un mot de passe long et unique.</p>
              </div>
              <form className="settings-form" onSubmit={handleMdp}>
                <div className="field">
                  <label htmlFor="set-old">Mot de passe actuel</label>
                  <input
                    id="set-old"
                    type="password"
                    value={ancienMdp}
                    onChange={(e) => setAncienMdp(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="set-new">Nouveau mot de passe</label>
                  <input
                    id="set-new"
                    type="password"
                    value={nouveauMdp}
                    onChange={(e) => setNouveauMdp(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="set-confirm">Confirmer le mot de passe</label>
                  <input
                    id="set-confirm"
                    type="password"
                    value={confirmMdp}
                    onChange={(e) => setConfirmMdp(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                {mdp.error && <p className="settings__error">{mdp.error}</p>}
                {mdp.ok && <p className="settings__ok">Mot de passe modifié.</p>}
                <div className="settings-form__actions">
                  <button type="submit" className="btn btn--primary" disabled={mdp.saving}>
                    {mdp.saving ? 'Modification…' : 'Modifier le mot de passe'}
                  </button>
                </div>
              </form>
            </section>
          </>
        )}
      </div>
    </>
  )
}
