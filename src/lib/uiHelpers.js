import { getPageLabelFromPath } from '../app/system-map/systemMap.js';

export function getDeviceType() {
  if (window.innerWidth < 768) return 'phone';
  if (window.innerWidth < 1180) return 'tablet';
  return 'desktop';
}

export function getRoute() {
  const path = window.location.pathname;
  return path === '/' ? '/login' : path;
}

export function routeLabel(path) {
  return getPageLabelFromPath(path);
}

export function slidePath(number) {
  return `/slides/slide-${String(number).padStart(2, '0')}.png`;
}

export function getUserDisplayName(user, profile) {
  if (profile?.full_name) return profile.full_name;
  if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
  return 'Juan González Tapia';
}

export function getRole(profile) {
  return ['admin', 'supervisor', 'operador'].includes(profile?.role) ? profile.role : 'operador';
}
