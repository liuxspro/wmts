# 海南省历史影像 WMTS 接入分析

本目录实现 `/tianditu/hainan` 路由，数据源是海南省地理信息公共服务平台的「影像浏览」
模块（`https://img.hniplan.com/imagebrower/menuhide`）。以下是接入时实际探测到的
结论，供后续维护和排查使用。

## 1. 数据接口

```
POST https://img.hniplan.com/v1/metadata/search/timeline
Content-Type: application/json;charset=UTF-8
Referer: https://img.hniplan.com/imagebrower/menuhide

{
  "queryGeometry": {
    "type": "Polygon",
    "coordinates": [[[minx,miny],[maxx,miny],[maxx,maxy],[minx,maxy],[minx,miny]]]
  }
}
```

- **`queryGeometry` 是起作用的**，按景的足迹与查询多边形求交。用海口点查返回海南的景；
  用北京点 `116.4,39.9` 查返回 `{"success":true}`（无 `result`）；用全球多边形查返回 1570 条。
- 返回的每条记录主要字段：`objectid`、`imagedate`（毫秒时间戳字符串）、`resolution`（米）、
  `satelliteid`、`filename`、`servername`（服务哈希）、`exporturl`（`v2/server/<hash>/wmts`）、
  `geom.bbox`。
- 无需 token，也没有防盗链 Referer 校验（不带 Referer 也能取）。

## 2. 服务形态：按「景」发布，不是按「期」

- 瓦片 URL 里的 `layer` **就是 `objectid`**，每个景一个独立 WMTS 图层：

  ```
  https://img.hniplan.com/imagebrower/v2/server/<hash>/wmts
    ?layer=<objectid>&style=default&tilematrixset=w
    &Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng
    &TileMatrix={z}&TileCol={x}&TileRow={y}
  ```

- 每个图层的 `WGS84BoundingBox` 与元数据的 `geom.bbox` 完全一致；图层内通过「裁剪函数」
  只在自己的足迹内出图，**足迹外返回 334 字节透明 PNG（HTTP 200）**，不是 404。
  因此判断"有没有图"必须看字节大小 + 魔数，不能只看状态码。
- 元数据里每景的 `url` 都指向同一个 ArcGIS 镶嵌数据集
  （`http://172.25.201.11:6080/geoscene/rest/services/imageserver_8Ubit_3bands_00/ImageServer`，内网），
  说明服务端内部是"镶嵌 + 按景裁剪"，但**对外没有把镶嵌结果发布成单个图层**。

## 3. 矩阵集：标准 EPSG:3857

源服务自报三个矩阵集：`w`（墨卡托）、`la`（经纬直投）、`lt`。使用 `w`：

| 项 | 源服务 `w` | capgen `web_mercator_quad` |
| --- | --- | --- |
| CRS | `urn:ogc:def:crs:EPSG::3857` | `EPSG:3857` |
| 首级 ScaleDenominator | `559082264.0287178` | `559082264.0287178` |
| TopLeftCorner | `-20037508.342789244 20037508.342789244` | `-20037508.3427892 20037508.3427892` |
| 瓦片 | 256×256 | 256×256 |

两者完全一致（28mm 基准 + GoogleMapsCompatible），所以直接用
`web_mercator_quad.clone().setZoom(11, 19)`，不需要自定义矩阵集。
瓦片实测为 PNG（`89 50 4e 47`），声明 `image/png`。

## 4. 层级范围定为 11~19

源服务声明 `w` 覆盖 0~20 级，但低层级大景的裁剪计算非常慢：

| 层级 | 现象（layer 1528，海南中部） |
| --- | --- |
| 2 / 4 / 6 | HTTP 200 + JSON 报错 `{"error":...["Function Read Error [裁剪函数]"]}` |
| 8 / 9 | 约 60s 后 504 |
| 10 | 200，耗时约 18.7s |
| 11 | 200，耗时约 5.3s |
| 16 | 200，正常 |
| 20 | 200，服务端过采样（0.5m 景在 18 级为原生，19 级以上是放大） |

所以从 11 级起声明，避免客户端在低层级大面积拉瓦片时被 504 刷屏。

## 5. 图层规模：1431 个

`get_config.ts` 用海南省范围检索，按 `objectid` 去重、把景的边界裁到省域：

| 维度 | 数量 |
| --- | --- |
| 图层总数 | 1431（检索 1447 条，去重 1444，裁边后 1431） |
| 不同成像日期 | 144 |
| 单日最多景数 | 120（2025-05-06）、88（2024-04-30） |
| 按年 | 2018:2 / 2021:1 / 2022:56 / 2023:13 / 2024:949 / 2025:361 / 2026:49 |
| 按分辨率 | 0.5m:720 / 2m:317 / 0.8m:170 / 0.7m:143 / 2.5m:55 / 2.1m:25 / 0.65m:1 |

图层名形如 `海南 2024-01-19 GF2 0.8m (1491)`，末尾的 `objectid` 用于区分同名景
（同名最多 15 个）。图层标识为 `hainan_<objectid>`。

Capabilities XML 约 1.33 MB，因为图层数多，**没有并入 `/tianditu/collection`**。

## 6. 单日没有全省整幅图

把 144 个日期的景足迹并集和省域框（108.5~111.1、18.1~20.2）比较：

| 指标 | 结果 |
| --- | --- |
| 并集覆盖 ≥90% 省域框的日期 | 1 个（2026-01-13，5 条斜带） |
| 并集覆盖 <60% 的日期 | 128 个 |
| 每日覆盖宽度中位数 | 省域的 26% |
| 每日覆盖高度中位数 | 省域的 52% |

以 2025-05-06 为例：120 景全是 GF2 2m，单景约 0.26°×0.24°（≈28km×26km），
并集只盖到 109.672~110.489°E（海南东部），且景面积之和是并集面积的 **4.85 倍**
（大量重叠的重复过境）。

结论：不是"整省图被切成小块"，而是"每次拍摄只覆盖一条带，多天的景叠加才凑出全省"。
想按某一天看全省，只能同时叠加当天所有景，且一定有空洞和拼接缝。

## 7. 不可用的"期"级镶嵌服务

前端 bundle 里硬编码了 17 条「海南XXXX年影像」镶嵌服务，接口
`POST /v2/imageservice/servicelist` 也能返回 53 条"期"服务，但**公网不可达**：

- `https://hainan.tianditu.gov.cn/myservice/services/<uuid>/wmts` → 返回单页应用 HTML；
- `https://hainan.hniplan.com:86/tdtgeoscene/rest/services/tdt/hainan_img_2025/MapServer/wmts`
  → TLS 握手失败（curl/deno 均失败），http 也返回单页应用 HTML；
- `POST /v2/imageservice/servicelist` 返回的 URL 指向内网 `https://172.25.201.7/ime-cloud/...`。

所以按景接入是当前唯一可行路径。

## 8. 网关只实现了 WMTS

同一台 `img.hniplan.com` 网关的其他能力探测结果：

| 尝试 | 结果 |
| --- | --- |
| `/wms?SERVICE=WMS&REQUEST=GetCapabilities` | 404 |
| `/wmts?SERVICE=WMS&REQUEST=GetCapabilities` | 返回 WMTS capabilities（不认 WMS） |
| `/exportImage?bbox=...&size=256,256` | 404 |
| `...wmts?layer=1528,1553`（多图层） | 400 |
| `...wmts?layer=1528;1553` | 200，返回内容与 `layer=1528` 完全相同（分号无效） |

因此"按范围返回一张镶嵌图"在这条链路上做不到；按范围查询只存在于元数据接口，
它返回的是景的列表，不是图。要真正按视野出图，得写 QGIS 插件/脚本调元数据接口后
自行叠加或本地镶嵌，或者拿到那个内网 ImageServer 的 `exportImage` 地址。

## 9. 验证记录

- `deno check` / `deno lint` 通过。
- `app.request("/hainan/1.0.0/WMTSCapabilities.xml")` → 200，`text/xml;charset=UTF-8`，1.33 MB。
- 按图层 bbox 中心抽样 20 个图层、请求 `z=16` 瓦片：20/20 返回正常 PNG（57KB~170KB）。
- 已知空图层：`objectid` 为 6/7/8 的三个 2018-09-26 GE1 0.5m 景（足迹在海南岛西南侧近海），
  `z=11` 与 `z=16` 均返回 334 字节透明 PNG；换另一个服务实例（`478cd35…c6`）同样为空，
  属于源数据问题，未做特殊处理。

## 10. 维护

- `hainan.json` 由 `deno task build` 抓取写出（与 `get_config.ts` 同一代码路径），需提交。
- 想临时重抓，可写个脚本调用 `getConfig()` 后 `JSON.stringify(maps, null, 2)` 写到本目录，
  跑完删除脚本。
- 若源服务以后发布了"期"级镶嵌服务且公网可达，应优先改成期级图层，图层数会降到几十个。
