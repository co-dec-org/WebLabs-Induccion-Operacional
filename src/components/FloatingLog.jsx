import { useState } from 'react';
import { saveContextualNote } from '../lib/dmtApi.js';
import { evidenceTypes } from '../lib/uiConstants.js';
import { routeLabel } from '../lib/uiHelpers.js';

export function FloatingLog({ route, user, onSaved }) {
  const [open, setOpen] = useState(false);
  const [large, setLarge] = useState(false);
  const [note, setNote] = useState('');
  const [evidenceType, setEvidenceType] = useState('Texto');
  const [status, setStatus] = useState('');

  async function handleSave() {
    if (!note.trim()) {
      setStatus('Ingrese una nota antes de guardar.');
      return;
    }

    try {
      await saveContextualNote({
        userId: user?.id,
        page: routeLabel(route),
        contextLabel: route,
        note,
        evidenceType,
      });
      setNote('');
      setStatus('Registro guardado.');
      onSaved();
    } catch (error) {
      setStatus(error.message || 'No fue posible guardar.');
    }
  }

  if (!open) {
    return (
      <aside className="floating-log collapsed">
        <button className="floating-log-launcher" onClick={() => setOpen(true)}>
          Bitácora
        </button>
      </aside>
    );
  }

  return (
    <aside className={`floating-log ${large ? 'large' : 'compact'}`}>
      <header>
        <div>
          <span>Bitácora contextual</span>
          <strong>{routeLabel(route)}</strong>
        </div>
        <div className="floating-log-actions">
          <button onClick={() => setLarge(!large)}>{large ? 'Achicar' : 'Agrandar'}</button>
          <button onClick={() => setOpen(false)}>Minimizar</button>
        </div>
      </header>
      <label>
        Tipo de evidencia
        <select value={evidenceType} onChange={(event) => setEvidenceType(event.target.value)}>
          {evidenceTypes.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </label>
      <label>
        Nota
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Registrar observación, duda o criterio de análisis."
        />
      </label>
      <button className="save-note" onClick={handleSave}>Guardar registro</button>
      <p>{status || 'No ingresar datos reales de víctimas, PSC, domicilios, teléfonos, coordenadas, folios ni causas.'}</p>
    </aside>
  );
}
