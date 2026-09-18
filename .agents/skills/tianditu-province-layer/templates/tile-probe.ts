/**
 * 瓦片探针：校验省级图层能否真正出图（能打开 capabilities ≠ 能出图）
 *
 * 用法：复制本文件到仓库根目录后执行，跑完删除。
 *   deno run --allow-net --allow-read tile-probe.ts
 *   deno run --allow-net --allow-read tile-probe.ts 115.9 28.68   # 指定探测点经纬度
 *
 * 判定标准：HTTP 200 且响应前 4 字节为 ff d8 ff e0（JPEG）或 89 50 4e 47（PNG）。
 * 注意：只有市域数据的稀疏图层（如“1996年南昌市影像”）用图层中心点会 404，
 * 需要显式传入数据范围内的经纬度。
 */
import cap from "./src/maps/tianditu/jiangxi/jiangxi.ts"; // TODO 改成目标省份

const layers = [...cap.matchAll(/<Layer>([\s\S]*?)<\/Layer>/g)].map((m) => {
  const body = m[1];
  const g = (tag: string) =>
    body.match(new RegExp(`<${tag}>([^<]*)<`))?.[1] ?? "";
  const corners = [
    ...body.matchAll(/<ows:(?:Lower|Upper)Corner>([^<]*)</g),
  ].map((c) => c[1].split(" ").map(Number));
  return {
    title: g("ows:Title"),
    id: g("ows:Identifier"),
    set: g("TileMatrixSet"),
    template: (body.match(/template="([^"]*)"/)?.[1] ?? "").replace(
      /&amp;/g,
      "&",
    ),
    bbox: corners,
  };
});

// <TileMatrixSetLink> 内也有 <TileMatrixSet> 标签，
// 因此必须连带匹配 <ows:Title> 才能只命中顶层定义
const sets = [
  ...cap.matchAll(/<TileMatrixSet>\s*<ows:Title>([\s\S]*?)<\/TileMatrixSet>/g),
].map((m) => {
  const body = m[1];
  const id = body.match(/<ows:Identifier>([^<]*)</)?.[1] ?? "";
  const zooms = body.split("<TileMatrix>").slice(1).map((chunk) => {
    const g = (tag: string) =>
      chunk.match(new RegExp(`<${tag}>([^<]*)<`))?.[1] ?? "";
    return {
      id: Number(g("ows:Identifier")),
      scale: Number(g("ScaleDenominator")),
      tl: g("TopLeftCorner"),
      w: Number(g("MatrixWidth")),
      h: Number(g("MatrixHeight")),
    };
  });
  return { id, zooms };
});

console.log(`图层 ${layers.length} 个，矩阵集 ${sets.length} 个`);
for (const set of sets) {
  const first = set.zooms[0];
  const last = set.zooms[set.zooms.length - 1];
  const bad = set.zooms.filter(
    (z) =>
      !Number.isInteger(z.h) || z.h < 1 || !Number.isInteger(z.w) || z.w < 1,
  );
  console.log(
    `  ${set.id}: ${set.zooms.length} 级 ${first.id}..${last.id}，左上角 ${first.tl}，非法矩阵 ${bad.length}`,
  );
  // 28mm 基准校验：scale × 0.00028 × 256 应等于 360 / 2^z 度
  const deg = (first.scale * 0.00028 * 256) / (2 * Math.PI * 6378137) * 360;
  console.log(
    `    基准校验: ${first.id} 级算得瓦片跨度 ${deg.toFixed(6)}°，应为 ${
      (360 / 2 ** first.id).toFixed(6)
    }°`,
  );
}

const arg_lon = Number(Deno.args[0]);
const arg_lat = Number(Deno.args[1]);

console.log("=== 瓦片探测 ===");
for (const layer of layers) {
  const set = sets.find((s) => s.id === layer.set);
  if (!set) {
    console.log(`找不到矩阵集 ${layer.set}（图层 ${layer.id}）`);
    continue;
  }
  const min = set.zooms[0].id;
  const max = set.zooms[set.zooms.length - 1].id;
  const z = Math.min(Math.max(12, min), max);
  const lon = Number.isFinite(arg_lon)
    ? arg_lon
    : (layer.bbox[0][0] + layer.bbox[1][0]) / 2;
  const lat = Number.isFinite(arg_lat)
    ? arg_lat
    : (layer.bbox[0][1] + layer.bbox[1][1]) / 2;
  const deg = 360 / 2 ** z;
  const col = Math.floor((lon + 180) / deg);
  const row = Math.floor((90 - lat) / deg);
  const url = layer.template
    .replace("{TileMatrix}", String(z))
    .replace("{TileCol}", String(col))
    .replace("{TileRow}", String(row));
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    const buf = new Uint8Array(await res.arrayBuffer());
    const magic = [...buf.slice(0, 4)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");
    const ok = magic === "ff d8 ff e0" || magic === "89 50 4e 47";
    console.log(
      `${
        ok ? "OK  " : "BAD "
      } ${layer.id} z=${z} row=${row} col=${col} -> HTTP ${res.status} ${buf.length}B magic=${magic}`,
    );
  } catch (err) {
    console.log(`FAIL ${layer.id}: ${err}`);
  }
}
