import React from 'react';
export function GendarmeriaLogo({ compact = false }) {
  return (
    <div className={compact ? 'gendarmeria-logo compact' : 'gendarmeria-logo'} aria-label="Gendarmería de Chile">
      <img src="/gendarmeria-logo.png" alt="" aria-hidden="true" />
      {!compact && (
        <div>
          <strong>Gendarmería de Chile</strong>
          <span>Departamento de Monitoreo Telemático</span>
        </div>
      )}
    </div>
  );
}
