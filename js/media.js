import * as THREE from 'three';

export function makePhoto(group, tex, i, total, primary) {
  let x, y, z;
  if (primary) {
    x = i === 0 ? -2.5 : 2.5;
    y = 0;
    z = 14;
  } else {
    // Wide 2-turn 3D spiral with generous radial & vertical spacing so photos never overlap
    const t = i / Math.max(1, total - 1);
    const a = t * Math.PI * 4 + 0.5;
    const r = 18 + t * Math.max(26, total * 1.2);
    x = Math.cos(a) * r;
    z = Math.sin(a) * r;
    y = (t - 0.5) * 16 + Math.sin(i * 1.7) * 4.5;
  }

  const asp = tex.image ? (tex.image.width / tex.image.height) : 16 / 9;
  const w = primary ? 4.2 : 3.2;
  const h = w / asp;

  const geo = new THREE.PlaneGeometry(w, h);
  const mat = new THREE.MeshBasicMaterial({
    map: tex,
    color: 0xffffff,
    side: THREE.DoubleSide,
    transparent: true,
    toneMapped: false
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.lookAt(0, primary ? 0 : y * 0.3, 0);

  const border = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0xffe0ec, transparent: true, opacity: 0.45 }));
  mesh.add(border);
  group.add(mesh);

  return { mesh, originalPosition: mesh.position.clone(), originalRotation: mesh.quaternion.clone() };
}
