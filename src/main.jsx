import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <main className="login-page theme-boldo">
          <section className="login-hero">
            <p>DMT Web-Labs</p>
            <h1>No fue posible cargar la aplicación</h1>
            <h2>Revise la consola del navegador o el último despliegue en Vercel.</h2>
            <div className="login-legal">
              Este mensaje evita una pantalla en blanco. No registre datos reales de víctimas,
              PSC, domicilios, teléfonos, coordenadas, folios o causas en pruebas.
            </div>
          </section>
          <section className="login-card">
            <p className="section-label">Detalle técnico</p>
            <h3>Error de interfaz</h3>
            <p className="form-status">{this.state.error.message}</p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);
