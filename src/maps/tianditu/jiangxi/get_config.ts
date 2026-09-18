/**
 * 江西省天地图历史影像配置
 * https://jiangxi.tianditu.gov.cn/workorder/restHistoryImage/getNormalHistoryImageList.json
 */

const url =
  "https://jiangxi.tianditu.gov.cn/workorder/restHistoryImage/getNormalHistoryImageList.json";

interface HistoryNode {
  name: string;
  type: string | null;
  url: string | null;
  config: string | null;
  minx: number | null;
  miny: number | null;
  maxx: number | null;
  maxy: number | null;
  children?: HistoryNode[];
}

interface HistoryLayerConfig {
  layers?: {
    alias?: string;
    name?: string;
    tileMatrixSetLinks?: {
      status: boolean;
      tileMatrixSet: string;
    }[];
  }[];
}

export interface JiangxiMap {
  name: string;
  /** WMTS 图层标识 */
  layer: string;
  /** WMTS 服务地址，不含 KVP 参数 */
  url: string;
  /** 天地图使用的瓦片矩阵集 */
  matrixSet: string;
  /** [minx, miny, maxx, maxy] */
  bbox: [number, number, number, number];
}

function flatten(nodes: HistoryNode[]): HistoryNode[] {
  return nodes.flatMap((node) => [node, ...flatten(node.children ?? [])]);
}

function parse_map(node: HistoryNode): JiangxiMap | null {
  if (node.type !== "WMTS" || !node.url || !node.config) return null;
  const { minx, miny, maxx, maxy } = node;
  if (minx === null || miny === null || maxx === null || maxy === null) {
    return null;
  }

  let config: HistoryLayerConfig;
  try {
    config = JSON.parse(node.config);
  } catch {
    return null;
  }

  const layer = config.layers?.[0];
  // 配置中 status 为 true 的矩阵集即地图页面实际使用的矩阵集
  const matrix_link = layer?.tileMatrixSetLinks?.find((link) => link.status);
  if (!layer || !matrix_link) return null;

  return {
    name: node.name,
    layer: layer.alias ?? layer.name ?? "default",
    url: node.url,
    matrixSet: matrix_link.tileMatrixSet,
    bbox: [minx, miny, maxx, maxy],
  };
}

export async function getConfig(): Promise<JiangxiMap[]> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`获取江西配置失败: HTTP ${response.status}`);
  }
  const data = await response.json();
  return flatten(data.data ?? []).flatMap((node) => {
    const map = parse_map(node);
    return map ? [map] : [];
  });
}
