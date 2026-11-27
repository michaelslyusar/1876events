// Floor-area diagrams for the rooms, drawn in feet so every room shares a scale.
// Furniture is illustrative: a typical setup for the room, not a floor plan.
// The svg scales with its box; strokes stay hairline (see .scale__box in styles.css).

const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

export const plan = (r) => {
  const ratio = r.shape || 1;
  const W = Math.sqrt(r.sqft * ratio);
  const H = Math.sqrt(r.sqft / ratio);
  const n = (v) => +v.toFixed(2);
  const rect = (cls, x, y, w, h, rx = 0) =>
    `<rect class="${cls}" x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"${rx ? ` rx="${n(rx)}"` : ""}/>`;
  const chair = (x, y, s = 1.7) => rect("p-chair", x - s / 2, y - s / 2, s, s, s / 4);
  const hanger = (cx, cy) =>
    `<path class="p-hanger" d="M${n(cx - 0.95)} ${n(cy + 0.5)}L${n(cx)} ${n(cy - 0.2)}L${n(cx + 0.95)} ${n(cy + 0.5)}ZM${n(cx)} ${n(cy - 0.2)}v-0.3a0.25 0.25 0 1 1 0.25 -0.25"/>`;

  // A door drawn on a wall: an opening, the open leaf and its swing.
  // side: "top" | "bottom" | "left" | "right"; at: where the opening starts along the wall.
  // inset: how far the door's wall stands out from the room edge (e.g. a protruding section).
  const door = (side, at, w, { double = false, hinge = "start", inset = 0 } = {}) => {
    const leaf = (lw) =>
      rect("p-leaf", -0.12, 0, 0.24, lw) + `<path class="p-swing" d="M0 ${n(lw)}A${n(lw)} ${n(lw)} 0 0 0 ${n(lw)} 0"/>`;
    const mirror = (lw, inner) => `<g transform="translate(${n(lw)} 0) scale(-1 1)">${inner}</g>`;
    let d = rect("p-gap", 0, -0.45, w, 0.9) + `<path class="p-jamb" d="M0 -0.45v0.9M${n(w)} -0.45v0.9"/>`;
    if (double) d += leaf(w / 2) + `<g transform="translate(${n(w / 2)} 0)">${mirror(w / 2, leaf(w / 2))}</g>`;
    else d += hinge === "end" ? mirror(w, leaf(w)) : leaf(w);
    const t = {
      top: `translate(${n(at)} 0)`,
      bottom: `translate(${n(at)} ${n(H)}) scale(1 -1)`,
      left: `matrix(0 1 1 0 0 ${n(at)})`,
      right: `matrix(0 1 -1 0 ${n(W)} ${n(at)})`,
    }[side];
    return `<g transform="${t}${inset ? ` translate(0 ${n(inset)})` : ""}">${d}</g>`;
  };
  let g = "";

  if (r.layout === "boardroom") {
    // Long racetrack table, four chairs a side, one at the head; TV and window on the end wall.
    const tw = W * 0.56, th = H * 0.36, tx = (W - tw) / 2, ty = (H - th) / 2;
    g += rect("p-window", W - 0.5, H * 0.12, 0.5, H * 0.76);
    g += rect("p-tv", W - 1.9, H / 2 - 2.4, 0.55, 4.8);
    g += rect("p-table", tx, ty, tw, th, th / 2);
    for (let i = 0; i < 4; i++) {
      const x = tx + th / 2 + ((tw - th) * (i + 0.5)) / 4;
      g += chair(x, ty - 1.3) + chair(x, ty + th + 1.3);
    }
    g += chair(tx + tw + 1.3, H / 2) + chair(tx - 1.3, H / 2);
    // Left wall: credenza above the door (middle of the wall), wardrobe bottom-left.
    const dy = H / 2 - 1.5;
    g += rect("p-table", 0, 0.5, 1.4, dy - 1);
    g += door("left", dy, 3);
    g += rect("p-table", 0, H - 2.6, 3.2, 2.6) + hanger(1.6, H - 1.3);
  } else if (r.layout === "theatre") {
    // Front (top): windows with a door directly behind the podium; a chair and screen to
    // its left, a draped table to its right. In the front-left corner the wall steps out,
    // and the exit door sits in that protruding section, facing the room.
    const px = W / 2 - 2.3;
    g += rect("p-window", 6.5, 0, px - 8.5, 0.5) + rect("p-window", px + 2, 0, 24.5 - px - 2, 0.5);
    g += door("top", px - 1.5, 3);
    g += rect("p-table", px - 1.6, 3.8, 3.2, 2, 0.4);
    g += chair(px - 2.6, 4.8, 1.5);
    g += rect("p-tv", 5, 2.4, 4.4, 0.5);
    g += rect("p-table", px + 3.2, 3.6, 7, 2, 0.2);
    g += rect("p-block", 0, 0, 4.6, 2);
    g += door("top", 0.8, 3, { inset: 2 });
    // Theatre rows in two blocks with a centre aisle, facing the podium.
    const sp = 2.15, rows = 5, y0 = 9.4, left = 5, right = 5, aisle = 3.6;
    const x0 = (W - (left + right) * sp - aisle) / 2 + sp / 2;
    for (let row = 0; row < rows; row++) {
      const y = y0 + row * 3.2;
      for (let i = 0; i < left; i++) g += chair(x0 + i * sp, y, 1.5);
      for (let i = 0; i < right; i++) g += chair(x0 + left * sp + aisle + i * sp, y, 1.5);
    }
    // Draped tables in an L along the left wall and into the back-left corner.
    g += rect("p-table", 0.3, 14, 1.9, H - 14.3, 0.2) + rect("p-table", 2.2, H - 2.2, 7, 1.9, 0.2);
    // Back (bottom): stacked chairs, exit double doors, wardrobe in the corner (as in Champlain).
    g += chair(16.5, H - 1.9, 1.5) + chair(16.8, H - 1.6, 1.5) + chair(17.1, H - 1.3, 1.5);
    g += door("bottom", W - 12, 5, { double: true });
    g += rect("p-table", W - 5, H - 3, 5, 3) + hanger(W - 2.5, H - 1.5);
  } else if (r.layout === "ballroom") {
    // Windows along the whole top wall; exit doors on the side walls by the windows;
    // from the corridor (bottom), a single door into A and C and double doors into B.
    // Movable partitions split the room into equal sections.
    const names = r.sections || ["A"], s = names.length, sw = W / s;
    for (let k = 0; k < s; k++) g += rect("p-window", sw * k + 1, 0, sw - 2, 0.5);
    g += door("left", 1, 3) + door("right", 1, 3);
    for (let k = 1; k < s; k++) g += `<line class="p-wall" x1="${n(sw * k)}" y1="0" x2="${n(sw * k)}" y2="${n(H)}"/>`;

    // Round table for ten.
    const round = (cx, cy) => {
      let t = `<circle class="p-table" cx="${n(cx)}" cy="${n(cy)}" r="2.5"/>`;
      for (let c = 0; c < 10; c++) {
        const a = (c / 10) * Math.PI * 2;
        t += `<circle class="p-chair" cx="${n(cx + Math.cos(a) * 3.45)}" cy="${n(cy + Math.sin(a) * 3.45)}" r="0.62"/>`;
      }
      return t;
    };
    // Banquet row: as many 6 ft tables as fit the section, with gaps between them,
    // three chairs a side at each and none on the ends.
    const row = (cx, cy) => {
      const gap = 1.5, count = Math.max(1, Math.floor((sw - 0.5) / (6 + gap)));
      const x = cx - (count * 6 + (count - 1) * gap) / 2;
      let t = "";
      for (let i = 0; i < count; i++) {
        const tx = x + i * (6 + gap);
        t += rect("p-table", tx, cy - 1.25, 6, 2.5);
        for (let c = 0; c < 3; c++) t += chair(tx + 1 + c * 2, cy - 2.4, 1.4) + chair(tx + 1 + c * 2, cy + 2.4, 1.4);
      }
      return t;
    };
    // 8 ft rectangular table, four chairs a side.
    const long = (cx, cy) => {
      let t = rect("p-table", cx - 4, cy - 1.25, 8, 2.5);
      for (let i = 0; i < 4; i++) t += chair(cx - 3 + i * 2, cy - 2.4, 1.4) + chair(cx - 3 + i * 2, cy + 2.4, 1.4);
      return t;
    };
    // Three rows of tables down each section, clear of the corridor doors.
    const ys = [0, 1, 2].map((i) => 6.8 + (i * (H - 14.6)) / 2);

    names.forEach((name, k) => {
      const x0 = sw * k, mid = x0 + sw / 2;
      g += `<text class="p-label" x="${n(mid)}" y="2.9">${esc(name)}</text>`;
      if (k === Math.floor(s / 2)) {
        // Middle section: banquet rows on rectangular tables, double doors.
        g += door("bottom", mid - 3, 6, { double: true });
        ys.forEach((y) => (g += row(mid, y)));
        return;
      }
      g += door("bottom", mid - 1.5, 3, { hinge: k < s / 2 ? "start" : "end" });
      if (k === 0) {
        // First section: rounds of ten, aisle down the middle to the door.
        for (const fx of [0.25, 0.75]) ys.forEach((y) => (g += round(x0 + sw * fx, y)));
      } else {
        // Last section: rounds and rectangular tables in a checkerboard.
        [0.25, 0.75].forEach((fx, c) => {
          ys.forEach((y, i) => (g += (i + c) % 2 ? long(x0 + sw * fx, y) : round(x0 + sw * fx, y)));
        });
      }
    });
  }
  return `<svg class="scale__box" viewBox="0 0 ${n(W)} ${n(H)}" aria-hidden="true" focusable="false">${g}</svg>`;
};
