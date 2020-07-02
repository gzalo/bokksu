export default function dateFilter(dateText) {
  const date = new Date(dateText);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
}
