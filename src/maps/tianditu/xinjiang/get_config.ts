/**
 * 新疆天地图历史影像配置
 * https://xinjiang.tianditu.gov.cn/map/
 */

const url =
  "https://xinjiang.tianditu.gov.cn/platformmaintenance/imagemultitemporal/selectbyfilter";

interface ImageSource {
  wmtsUrl: string | null;
  serviceName: string | null;
  matrixSetName: string | null;
  epsg: string | null;
  tileGridExtent: number[] | null;
}

interface ImageRecord {
  name: string;
  serviceType: string;
  releaseTime: string;
  startLevel: number;
  endLevel: number;
  serviceSource: ImageSource | null;
}

export interface XinjiangMap {
  name: string;
  /** WMTS 图层标识 */
  layer: string;
  /** WMTS 服务地址，不含 KVP 参数 */
  url: string;
  /** 天地图使用的瓦片矩阵集 */
  matrixSet: string;
  /** [minx, miny, maxx, maxy] */
  bbox: [number, number, number, number];
  /** 服务声明的可用层级 */
  startLevel: number;
  endLevel: number;
}

export async function getConfig(): Promise<XinjiangMap[]> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json, text/plain, */*",
      "content-type": "application/json;charset=UTF-8",
      Referer: "https://xinjiang.tianditu.gov.cn/map/",
    },
    body: JSON.stringify({
      useServiceTypes: true,
      serviceTypes: ["Image"],
      useServiceDimensions: false,
      serviceDimensions: [],
      useSourceFilters: true,
      sourceFilters: [],
      usePagination: false,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`获取新疆配置失败: HTTP ${response.status}`);
  }
  const data = await response.json();
  const records: ImageRecord[] = data.data?.filterImages ?? [];

  return records.flatMap((record) => {
    const source = record.serviceSource;
    // 注记（ImageNote）来自国家天地图 cia 服务且需要 token，不属于本图层
    if (record.serviceType !== "Image" || !source?.wmtsUrl) return [];
    if (!source.serviceName) return [];

    const extent = source.tileGridExtent ?? [-180, -90, 180, 90];

    return [{
      name: record.name,
      layer: source.serviceName,
      url: source.wmtsUrl,
      matrixSet: source.matrixSetName ?? "default028mm",
      bbox: [extent[0], extent[1], extent[2], extent[3]] as [
        number,
        number,
        number,
        number,
      ],
      startLevel: record.startLevel,
      endLevel: record.endLevel,
    }];
  });
}
