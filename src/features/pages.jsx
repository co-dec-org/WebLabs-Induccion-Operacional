import { deviceLabels, evidenceTypes } from '../lib/uiConstants.js';
import { getRole, getUserDisplayName } from '../lib/uiHelpers.js';

export function HomePage({ navigate }) {
  const learningSteps = [
    ['1', 'Comprender el evento', '70% completado'],
    ['2', 'Analizar riesgo', '45% completado'],
    ['3', 'Decidir acción', '25% completado'],
    ['4', 'Registrar evidencia', '10% completado'],
  ];

  return (
    <section className="home-approved">
      <div className="home-top-grid">
        <article className="approved-panel welcome-panel">
          <div className="circle-icon">▱</div>
          <div>
            <h3>Bienvenido al entorno de formación S.M.T.</h3>
            <strong>Entrenamiento para operadores telemáticos</strong>
            <p>Material educativo, simulaciones operacionales y revisión legal-operacional para formación interna.</p>
          </div>
          <div className="panel-illustration" aria-hidden="true" />
        </article>

        <article className="approved-panel learning-route">
          <h3>Tu ruta de aprendizaje</h3>
          <div className="route-steps">
            {learningSteps.map(([number, title, progress]) => (
              <div className="route-step" key={number}>
                <span>{number}</span>
                <div className="route-icon">▤</div>
                <strong>{title}</strong>
                <small>{progress}</small>
                <i style={{ width: progress.split('%')[0] + '%' }} />
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="home-card-grid">
        <article className="approved-card">
          <div className="circle-icon small">▱</div>
          <h4>Inducción operacional</h4>
          <p>Conoce los fundamentos del Sistema de Monitoreo Telemático, flujos de trabajo y buenas prácticas operativas.</p>
          <button onClick={() => navigate('/induccion')}>Continuar módulo →</button>
        </article>
        <article className="approved-card disabled-card">
          <div className="circle-icon small">▷</div>
          <h4>Simulaciones</h4>
          <p>Práctica con escenarios simulados y retroalimentación para mejorar tu toma de decisiones operacionales.</p>
          <button disabled>No disponible →</button>
        </article>
        <article className="approved-card">
          <div className="circle-icon small">▣</div>
          <h4>Bitácora de entrenamiento</h4>
          <p>Registra tus actividades, evaluaciones y reflexiones para fortalecer tu aprendizaje continuo.</p>
          <button onClick={() => navigate('/bitacora')}>Abrir bitácora →</button>
        </article>
        <article className="approved-card">
          <div className="circle-icon small">⚖</div>
          <h4>Marco legal-operacional</h4>
          <p>Consulta la normativa aplicable y los criterios que sustentan la toma de decisiones operacionales.</p>
          <button onClick={() => navigate('/marco-legal')}>Ver marco legal →</button>
        </article>
      </div>

      <div className="home-bottom-grid">
        <article className="approved-panel evidence-summary">
          <h3>Resumen de tu bitácora</h3>
          <p>Capacidades disponibles para registrar y documentar tus actividades.</p>
          <div>
            {evidenceTypes.map((type) => (
              <span key={type}>{type === 'Audio' ? 'Audio 1 min' : type === 'Video' ? 'Video 30 seg' : type}</span>
            ))}
          </div>
        </article>
        <article className="approved-panel privacy-reminder">
          <div className="circle-icon">✓</div>
          <div>
            <h3>Usar solo casos simulados, anonimizados o autorizados.</h3>
            <p>Protegemos la información y la dignidad de las personas.</p>
          </div>
        </article>
      </div>
    </section>
  );
}

export function BitacoraPage({ notes, reloadNotes }) {
  const displayNotes = notes.length
    ? notes
    : [
        {
          id: 'demo-1',
          created_at: 'Hoy 18:42',
          page: 'Inducción',
          context_label: 'Lámina 07 · Lógica operacional general',
          evidence_type: 'Nota',
          note: 'Duda sobre cuándo clasificar, contactar o escalar según continuidad y contexto.',
        },
        {
          id: 'demo-2',
          created_at: 'Hoy 18:15',
          page: 'Inducción',
          context_label: 'Lámina 04 · Principios operacionales',
          evidence_type: 'Captura',
          note: 'Registro de lectura revisado.',
        },
        {
          id: 'demo-3',
          created_at: 'Ayer 21:10',
          page: 'Marco legal',
          context_label: 'Ley 21.378',
          evidence_type: 'Nota',
          note: 'Síntesis revisada.',
        },
      ];
  const selected = displayNotes[0];

  return (
    <section className="bitacora-approved">
      <article className="summary-strip">
        <div className="circle-icon">▣</div>
        <div>
          <h3>Notas contextuales del operador</h3>
          <p>Registros creados desde la caja flotante según la página, lámina o módulo consultado.</p>
        </div>
        <strong><span>{displayNotes.length}</span> registros</strong>
        <strong><span>5</span> páginas fuente</strong>
        <strong><span>4</span> con evidencia</strong>
        <strong>Última nota:<br />{selected.page} / Lámina 07</strong>
      </article>

      <div className="bitacora-tools">
        <label className="search-box light">
          <input placeholder="Buscar en mis notas" />
        </label>
        {['Todas', 'Inducción', 'Home', 'Marco legal', 'Recursos', 'Bitácora'].map((filter) => (
          <button key={filter} className={filter === 'Todas' ? 'active' : ''}>{filter}</button>
        ))}
        <button className="manual-note" onClick={reloadNotes}>Nueva nota manual</button>
      </div>

      <div className="bitacora-grid">
        <section className="records-panel">
          <h3>Registros capturados</h3>
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Página fuente</th>
                <th>Contexto</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {displayNotes.map((note, index) => (
                <tr key={note.id} className={index === 0 ? 'selected' : ''}>
                  <td>{note.created_at?.startsWith('20') ? 'Hoy' : note.created_at || 'Hoy'}</td>
                  <td>{note.page || 'Inducción'}</td>
                  <td>{note.context_label || 'Registro contextual'}</td>
                  <td>{note.evidence_type || 'Nota'}</td>
                  <td><span className={index % 2 === 0 ? 'badge draft' : 'badge reviewed'}>{index % 2 === 0 ? 'Borrador' : 'Revisado'}</span></td>
                  <td><button>Abrir ›</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>Mostrando 1 a {displayNotes.length} de {displayNotes.length} registros</p>
        </section>

        <aside className="record-detail">
          <h3>Detalle del registro</h3>
          <strong>{selected.page} / Lámina 07</strong>
          <span>Creado hoy, 18:42</span>
          <label>
            Nota de lectura
            <textarea readOnly value={selected.note || ''} />
          </label>
          <div className="tag-row">
            <span>Nota</span>
            <span>Borrador</span>
            <span>Sin datos reales</span>
          </div>
          <button>Editar nota</button>
          <button>Marcar revisado</button>
          <button>Exportar</button>
        </aside>
      </div>

      <p className="privacy-banner">No ingresar datos reales de víctimas, PSC, domicilios, teléfonos, coordenadas ni folios.</p>
    </section>
  );
}

export function MarcoLegalPage() {
  const laws = [
    ['Ley 21.378', 'Monitoreo telemático en Ley 20.066 y Ley 19.968', 'Establece el monitoreo telemático como medida cautelar o de protección.'],
    ['Decreto 19', 'Reglamento de la Ley 21.378', 'Aprueba el reglamento que regula la implementación y operación del sistema.'],
    ['Ley 20.066', 'Violencia intrafamiliar y protección de víctimas', 'Define la violencia intrafamiliar y establece medidas de protección y sanción.'],
    ['Ley 19.968', 'Tribunales de Familia y medidas cautelares', 'Regula competencia, procedimientos y medidas cautelares en familia.'],
    ['Ley 20.603', 'Penas sustitutivas y reforma penal', 'Modifica el sistema de penas y establece penas sustitutivas y medidas alternativas.'],
    ['Ley 21.719', 'Protección de datos personales', 'Regula el tratamiento y protección de datos personales en el sector público.'],
  ];

  return (
    <section className="legal-approved">
      <div className="legal-grid">
        <section>
          <article className="approved-panel legal-hero">
            <div className="circle-icon">⚖</div>
            <div>
              <h3>Base normativa del Sistema de Monitoreo Telemático</h3>
              <p>Consulta guiada del marco legal-operacional aplicable a formación, protección de víctimas, medidas cautelares, monitoreo telemático y tratamiento responsable de datos.</p>
            </div>
          </article>
          <label className="wide-search">
            <input placeholder="Buscar norma o concepto" />
            <button>Filtrar</button>
          </label>
          <div className="law-list">
            {laws.map(([title, summary, body], index) => (
              <article key={title}>
                <span>{index + 1}</span>
                <div>
                  <strong>{title} — {summary}</strong>
                  <p>{body}</p>
                </div>
                <button>Ver síntesis ↗</button>
              </article>
            ))}
          </div>
        </section>
        <aside className="legal-side">
          <article className="approved-panel">
            <h3>Lectura operacional</h3>
            <div className="side-row"><span>♢</span><p><strong>Finalidad protectora</strong>El marco legal tiene como fin la protección integral de las víctimas.</p></div>
            <div className="side-row"><span>◎</span><p><strong>Criterio de actuación</strong>Actuar con proporcionalidad, oportunidad y respeto a procedimientos vigentes.</p></div>
            <div className="side-row"><span>▣</span><p><strong>Trazabilidad y datos</strong>Registrar con trazabilidad mínima y proteger la información conforme a la ley.</p></div>
          </article>
          <article className="approved-panel">
            <h3>Relación normativa</h3>
            <div className="norm-flow"><span>Ley</span><b>→</b><span>Reglamento</span><b>→</b><span>Protocolo</span><b>→</b><span>Operador</span></div>
          </article>
          <article className="approved-panel privacy-callout">No usar esta web para ingresar datos reales de víctimas, PSC, domicilios, teléfonos, coordenadas ni folios.</article>
        </aside>
      </div>
      <p className="privacy-banner">Material educativo · No reemplaza instrucciones oficiales ni sistemas institucionales.</p>
    </section>
  );
}

export function RecursosPage() {
  const resources = [
    ['Láminas de inducción', '14 módulos aprobados', 'Abrir'],
    ['Plantillas de registro', 'Textos de entrenamiento para notas operacionales', 'Ver plantillas'],
    ['Glosario S.M.T.', 'Conceptos: trazo válido, zona de exclusión, CENCO, PSC', 'Consultar'],
    ['Marco legal resumido', 'Ley 21.378, Decreto 19 y normas asociadas', 'Revisar'],
    ['Guía de privacidad', 'Uso de datos simulados, anonimizados o autorizados', 'Leer'],
    ['Material de apoyo', 'Recursos complementarios para capacitación', 'Explorar'],
  ];

  return (
    <section className="resources-approved">
      <div className="resources-grid">
        <section>
          <article className="approved-panel legal-hero">
            <div className="circle-icon">▤</div>
            <div>
              <h3>Biblioteca de apoyo para la formación S.M.T.</h3>
              <p>Materiales de consulta, plantillas y documentos de apoyo para reforzar criterio legal-operacional y trazabilidad educativa.</p>
            </div>
          </article>
          <label className="wide-search">
            <input placeholder="Buscar recurso o concepto" />
          </label>
          <div className="filter-row">
            {['Todos', 'Láminas', 'Protocolos', 'Plantillas', 'Glosario', 'Documentos', 'Enlaces'].map((filter) => (
              <button key={filter} className={filter === 'Todos' ? 'active' : ''}>{filter}</button>
            ))}
          </div>
          <div className="resource-grid">
            {resources.map(([title, body, action]) => (
              <article key={title} className="approved-card">
                <div className="circle-icon small">▤</div>
                <h4>{title}</h4>
                <p>{body}</p>
                <button>{action} ›</button>
              </article>
            ))}
          </div>
        </section>
        <aside className="legal-side">
          <article className="approved-panel">
            <h3>Uso recomendado</h3>
            <div className="side-row"><span>▤</span><p><strong>Consulta durante lectura</strong>Accede a contenidos clave mientras avanzas en la inducción.</p></div>
            <div className="side-row"><span>▣</span><p><strong>Apoyo para bitácora</strong>Usa plantillas y guías para registrar tus notas.</p></div>
            <div className="side-row"><span>♢</span><p><strong>Material autorizado</strong>Todo el material disponible está validado para uso formativo institucional.</p></div>
          </article>
          <article className="approved-panel selected-resource">
            <h3>Recurso seleccionado</h3>
            <strong>Láminas de inducción</strong>
            <p>14 módulos aprobados</p>
            <dl><dt>Tipo</dt><dd>Presentación</dd><dt>Estado</dt><dd>Aprobado</dd><dt>Última revisión</dt><dd>15/05/2025</dd></dl>
          </article>
          <article className="approved-panel privacy-callout">No subir ni registrar capturas reales identificables de Tracker, IFT u otros sistemas oficiales.</article>
        </aside>
      </div>
    </section>
  );
}

export function PerfilPage({ user, profile, deviceType, visualMode }) {
  const role = getRole(profile);
  const displayName = getUserDisplayName(user, profile);

  return (
    <section className="profile-approved">
      <div className="profile-grid">
        <section>
          <article className="approved-panel profile-card">
            <div className="circle-icon profile-avatar">○</div>
            <div>
              <h3>{displayName}</h3>
              <p>Operador en formación</p>
              <p>{profile?.department || 'Departamento de Monitoreo Telemático'}</p>
              <p>Correo institucional: {user?.email || 'usuario@gendarmeria.cl'}</p>
            </div>
            <span className="profile-shield">✓</span>
          </article>

          <h3 className="section-heading">Preferencias de sesión</h3>
          <div className="profile-card-grid">
            <article className="approved-card compact">
              <h4>Vista por dispositivo</h4>
              <p>Desktop <span>{visualMode}</span></p>
              <p>Tablet <span>Boldo</span></p>
              <p>Phone <span>Boldo</span></p>
            </article>
            <article className="approved-card compact">
              <h4>Recordarme en este dispositivo</h4>
              <p>Mantener sesión activa en este equipo de forma segura.</p>
              <b className="toggle-on" />
            </article>
            <article className="approved-card compact">
              <h4>Última sesión visual</h4>
              <p>Hoy, 18:42</p>
              <p>{deviceLabels[deviceType]} · {visualMode}</p>
            </article>
          </div>

          <h3 className="section-heading">Avance formativo</h3>
          <div className="profile-card-grid">
            <article className="approved-card compact"><h4>Inducción</h4><p>4/14 láminas revisadas</p><progress value="29" max="100" /></article>
            <article className="approved-card compact"><h4>Bitácora</h4><p>12 notas contextuales</p><progress value="60" max="100" /></article>
            <article className="approved-card compact"><h4>Marco legal</h4><p>3 síntesis revisadas</p><progress value="50" max="100" /></article>
          </div>

          <div className="profile-card-grid bottom">
            <article className="approved-panel privacy-callout">No ingresar datos reales de víctimas, PSC, domicilios, teléfonos, coordenadas ni folios.</article>
            <article className="approved-panel account-actions">
              <h3>Acciones de cuenta</h3>
              <button>Cambiar contraseña enviada al correo institucional</button>
              <button>Cerrar sesión</button>
            </article>
          </div>
        </section>

        <aside className="legal-side">
          <article className="approved-panel activity-panel">
            <h3>Resumen de actividad</h3>
            {['Inducción / Lámina 07', 'Marco legal', 'Recursos'].map((item, index) => (
              <div className="side-row" key={item}>
                <span>{index === 0 ? '▤' : index === 1 ? '⚖' : '▱'}</span>
                <p><strong>{item}</strong>{index === 0 ? 'Nota creada · Hoy, 18:42' : index === 1 ? 'Síntesis revisada · Hoy, 16:10' : 'Plantilla consultada · Ayer, 21:35'}</p>
              </div>
            ))}
            <button>Ver toda la actividad →</button>
          </article>
          <article className="approved-panel">
            <h3>Consejo de uso</h3>
            <div className="side-row"><span>●</span><p>Usa la Bitácora para registrar notas contextuales desde cualquier página. Te ayudará a consolidar tu criterio operacional.</p></div>
          </article>
        </aside>
      </div>
    </section>
  );
}
