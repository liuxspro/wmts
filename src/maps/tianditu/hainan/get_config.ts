/**
 * 海南天地图历史影像配置
 * https://img.hniplan.com/imagebrower/menuhide
 *
 * 「影像浏览」模块按景（scene）发布 WMTS：瓦片 URL 里的 layer 即元数据的
 * objectid，tilematrixset 固定为 EPSG:3857 的 w。元数据接口按查询范围返回
 * 足迹相交的景，范围之外返回空数组，因此这里用海南省范围检索。
 */

const url = "https://img.hniplan.com/v1/metadata/search/timeline";

const base = "https://img.hniplan.com/imagebrower/";

/** 海南省范围，用于约束检索范围和各景的边界 */
const hainan_bbox: [number, number, number, number] = [
  108.5,
  18.1,
  111.1,
  20.2,
];

interface TimelineImage {
  objectid: number;
  /** 成像时间，毫秒时间戳（字符串） */
  imagedate: string;
  /** 分辨率（米） */
  resolution: number;
  satelliteid: string;
  /** 相对路径，形如 v2/server/<hash>/wmts */
  exporturl: string;
  geom: { bbox: [number, number, number, number] } | null;
}

export interface HainanMap {
  /** 图层名，形如 2024-01-19 GF2 0.8m (1491) */
  name: string;
  /** WMTS 图层标识，即元数据中的 objectid */
  layer: number;
  /** WMTS 服务地址，不含 KVP 参数 */
  url: string;
  /** 瓦片矩阵集，服务端固定为 w（EPSG:3857） */
  matrixSet: string;
  /** [minx, miny, maxx, maxy] */
  bbox: [number, number, number, number];
}

function clip(
  bbox: [number, number, number, number],
): [number, number, number, number] | null {
  const clipped: [number, number, number, number] = [
    Math.max(bbox[0], hainan_bbox[0]),
    Math.max(bbox[1], hainan_bbox[1]),
    Math.min(bbox[2], hainan_bbox[2]),
    Math.min(bbox[3], hainan_bbox[3]),
  ];
  return clipped[0] < clipped[2] && clipped[1] < clipped[3] ? clipped : null;
}

export async function getConfig(): Promise<HainanMap[]> {
  const [minx, miny, maxx, maxy] = hainan_bbox;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json, text/plain, */*",
      "content-type": "application/json;charset=UTF-8",
      Referer: "https://img.hniplan.com/imagebrower/menuhide",
    },
    body: JSON.stringify({
      queryGeometry: {
        coordinates: [[
          [minx, miny],
          [maxx, miny],
          [maxx, maxy],
          [minx, maxy],
          [minx, miny],
        ]],
        type: "Polygon",
      },
    }),
    signal: AbortSignal.timeout(60_000),
  });
  if (!response.ok) {
    throw new Error(`获取海南影像配置失败: HTTP ${response.status}`);
  }
  const data = await response.json();
  const images: TimelineImage[] = data.result ?? [];

  const seen = new Set<number>();
  const maps: HainanMap[] = [];
  for (const image of images) {
    if (seen.has(image.objectid)) continue;
    if (!image.exporturl || !image.geom?.bbox) continue;
    const bbox = clip(image.geom.bbox);
    if (!bbox) continue;
    seen.add(image.objectid);

    const date = new Date(Number(image.imagedate)).toISOString().slice(0, 10);
    maps.push({
      name:
        `${date} ${image.satelliteid} ${image.resolution}m (${image.objectid})`,
      layer: image.objectid,
      url: base + image.exporturl,
      matrixSet: "w",
      bbox,
    });
  }

  // 新的影像排在前面
  return maps.sort((a, b) => b.name.localeCompare(a.name));
}
