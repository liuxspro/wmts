// const zoom = Array.from({ length: 22 }, (_, i) => i);

// const scale = zoom.map((z) => {
//   return (256 * Math.pow(2, z) * 0.0254 / 96) / (2 * Math.PI * 6378137);
// });

export function scaleToZoom(scale: number): number {
  return Math.log2((2 * Math.PI * 6378137 * scale) / (256 * 0.0254 / 96));
}

export function zoomToScale(zoom: number): number {
  return (256 * Math.pow(2, zoom) * 0.0254 / 96) / (2 * Math.PI * 6378137);
}
