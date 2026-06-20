import { modules } from '../data/modules.js';

export function AdminAccountsPage() {
  return (
    <section className="page-grid">
      <article className="hero-panel">
        <p className="section-label">Admin · Cuentas</p>
        <h3>Administración de accesos</h3>
        <p>
          Módulo reservado para enrolamiento, actualización de perfiles y solicitudes de reset
          de acceso institucional.
        </p>
      </article>
      <article className="status-card">
        <span>Perfiles V1</span>
        <strong>Admin · Supervisor · Operador</strong>
        <p>Los permisos se aplican mediante Supabase Auth, perfiles y RLS.</p>
      </article>
      <article className="status-card">
        <span>Reset de acceso</span>
        <strong>Requiere flujo seguro</strong>
        <p>
          No se debe exponer `service_role` en el frontend. El reset debe ejecutarse desde
          Supabase Dashboard o desde una función backend protegida.
        </p>
      </article>
      <article className="status-card">
        <span>Dato mínimo</span>
        <strong>Correo institucional y rol</strong>
        <p>No registrar datos reales de víctimas, PSC, causas, folios ni ubicaciones.</p>
      </article>
    </section>
  );
}

export function AdminContentPage() {
  return (
    <section className="page-grid two-columns">
      <article className="hero-panel">
        <p className="section-label">Admin · Editor</p>
        <h3>Textos de láminas</h3>
        <p>
          Módulo para revisar y actualizar textos pedagógicos asociados a cada lámina. Las
          imágenes aprobadas se mantienen como fuente visual; los textos editables viven en
          Supabase.
        </p>
      </article>
      <section className="resource-list">
        {modules.map((module) => (
          <article key={module.number}>
            <span>Lámina {String(module.number).padStart(2, '0')}</span>
            <strong>{module.title}</strong>
            <p>{module.objective}</p>
          </article>
        ))}
      </section>
    </section>
  );
}
