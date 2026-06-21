import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { saveContextualNote } from '../lib/dmtApi.js';
import { evidenceTypes } from '../lib/uiConstants.js';
import { routeLabel } from '../lib/uiHelpers.js';

export function FloatingLog({ route, user, onSaved }) {
  const [open, setOpen] = useState(false);
  const [large, setLarge] = useState(false);
  const [note, setNote] = useState('');
  const [evidenceType, setEvidenceType] = useState('Texto');
  const [status, setStatus] = useState('');
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef(null);

  useEffect(() => {
    function onMove(event) {
      const d = drag.current;
      if (!d) return;
      const dx = event.clientX - d.startX;
      const dy = event.clientY - d.startY;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) d.moved = true;
      setPos({ x: d.baseX + dx, y: d.baseY + dy });
    }
    function onUp() {
      const d = drag.current;
      drag.current = null;
      if (d && d.mode === 'launcher' && !d.moved) setOpen(true);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  function startDrag(mode, event) {
    if (mode === 'panel' && event.target.closest && event.target.closest('button')) return;
    drag.current = { startX: event.clientX, startY: event.clientY, baseX: pos.x, baseY: pos.y, moved: false, mode };
    event.preventDefault();
  }

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

  const posStyle = { transform: `translate(${pos.x}px, ${pos.y}px)` };

  if (!open) {
    return (
      <aside className="floating-log collapsed" style={posStyle}>
        <button
          className="floating-log-launcher"
          style={{ cursor: 'grab' }}
          onMouseDown={(event) => startDrag('launcher', event)}
        >
          Notas
        </button>
      </aside>
    );
  }

  return (
    <aside className={`floating-log ${large ? 'large' : 'compact'}`} style={posStyle}>
      <header onMouseDown={(event) => startDrag('panel', event)} style={{ cursor: 'move', userSelect: 'none' }}>
        <div>
          <span>Notas contextuales · ⠿ arrastra</span>
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
