---
name: tianditu-province-layer
description: 在 wmts 仓库中新增或排查天地图省级历史影像（多时相）WMTS 图层。涵盖创建 src/maps/tianditu/<province>/{get_config.ts,<province>.json,<province>.ts}、在 src/server/tianditu.ts 注册路由、在 src/build.ts 增加配置抓取，以及用真实瓦片验证。当用户要求"接入/新增某省天地图历史影像""多时相配置"，或反馈"capabilities 能打开但不出图/瓦片错位"时使用。
---

# 天地图省级历史影像图层接入

## 适用范围

适用于把某个省级（或市级）天地图站点的历史影像 / 多时相 WMTS 服务接入本仓库。
典型形态是：列表接口返回若干期影像，每期对应一个标准 WMTS 服务，瓦片集多为
`guobiao`（EPSG:4490 平方公里网格）。已接入的同类实现：`hunan`、`henan`、`hebei`、
`shanxi`、`jiangxi`。

## 文件结构

以江西为例，一个省级图层由三部分组成：

| 文件                                           | 作用                                              |
| ---------------------------------------------- | ------------------------------------------------- |
| `src/maps/tianditu/<province>/get_config.ts`   | 抓取列表接口并归一化，导出 `getConfig()`          |
| `src/maps/tianditu/<province>/<province>.json` | 归一化后的配置，**需提交到仓库**                  |
| `src/maps/tianditu/<province>/<province>.ts`   | 用 capgen 生成 capabilities，`export default cap` |

目录名沿用既有写法即可（既有中文目录 `江苏`、`beijing`、`jiangxi` 并存）。

## 步骤

### 1. 摸清数据源

先在省级天地图站点找到影像列表接口（如江西是
`https://jiangxi.tianditu.gov.cn/workorder/restHistoryImage/getNormalHistoryImageList.json`）。
需要从中确认每期影像的：服务根地址、图层别名（`alias`/`name`）、标注为启用的瓦片集
（配置里 `tileMatrixSetLinks` 中 `status: true` 的那个）、可用层级、数据范围。

有的接口把配置塞在字符串字段里（江西是 `config`，值是 JSON 字符串），需要 `JSON.parse`；
有的是 JSONP（河南 `duoshixiang.js`，需要截取首尾花括号）；列表也可能是一棵树
（江西 `data[].children[]`），用递归 `flatMap` 展平，跳过没有 `url`/`config` 的分组节点。

层级取 `tileMatrixSetLinks[].matrixIds[].identifier` 的最小/最大值，别硬编码。

### 2. 写 `get_config.ts`

导出 `export async function getConfig()`，返回归一化后的数组。要点：

- 用 `AbortSignal.timeout(10_000)`，失败时抛中文错误：`throw new Error(\`获取江西配置失败: HTTP ${response.status}\`)`。
- `config` 字段解析失败要 `try/catch` 后返回 `null` 跳过，不要让整批挂掉。
- 归一化后的字段保持精简：`name / layer / url（不含 KVP）/ matrixSet / bbox`。

### 3. 生成 `<province>.json`

**必须走与 `build.ts` 相同的代码路径**，即 `JSON.stringify(maps, null, 2)`，
否则下次 `deno task build` 会产生无意义的 diff。可以临时写个脚本生成后删掉：

```ts
import { getConfig } from "./src/maps/tianditu/jiangxi/get_config.ts";
const maps = await getConfig();
await Deno.writeTextFile(
  "./src/maps/tianditu/jiangxi/jiangxi.json",
  JSON.stringify(maps, null, 2),
);
```

```sh
deno run --allow-net --allow-write tmp_gen.ts
```

### 4. 写 `<province>.ts`

```ts
/**
 * 天地图 江西 多时相历史影像
 * https://jiangxi.tianditu.gov.cn/workorder/restHistoryImage/getNormalHistoryImageList.json
 */
import jiangxi_maps from "./jiangxi.json" with { type: "json" };
import {
  type BBox,
  Capabilities,
  cgcs2000_quad,
  MapLayer,
  Service,
} from "@liuxspro/capgen";

const bbox: BBox = [
  [113.3197, 24.2062],
  [118.7336, 30.3602],
];

const layers = jiangxi_maps.map(
  (map) =>
    new MapLayer(
      map.name,
      map.name,
      `jiangxi_${map.layer}`,
      bbox,
      cgcs2000_quad,
      `${map.url}?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${map.layer}` +
        `&STYLE=default&TILEMATRIXSET=${map.matrixSet}` +
        `&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image/jpeg`,
      "image/jpeg",
    ),
);

export const service: Service = {
  title: "天地图 江西",
  abstract: "天地图 江西 历史影像",
  keywords: ["天地图", "江西", "历史影像"],
};

const cap = new Capabilities(service, layers).xml;
export default cap;
```

`LAYER=` 必须写服务端认的别名（`map.layer`），**不是** capabilities 里那个我们自定义的
`jiangxi_*` 标识符；`TILEMATRIXSET=` 用源数据里的 `guobiao` 之类的真实名称。

### 5. 接线

- `src/server/tianditu.ts`：`import <province> from "../maps/tianditu/<province>/<province>.ts";`
  然后 `app.route("/<pinyin>", create_router(<province>));`（`create_router` 来自 `src/utils.ts`）。
- `src/build.ts`：加一个 `try/catch` 块抓取并存 JSON，失败只 `console.error` 跳过。
- 这类省级历史影像服务**不需要 token**，不要加 `set_token`。

### 6. 验证

```sh
deno check src/server/tianditu.ts src/build.ts src/maps/tianditu/<province>/<province>.ts
deno lint  src/maps/tianditu/<province>/
```

项目没有 test/lint/typecheck task，只能直接调 `deno check` / `deno lint`。

再复制本目录下的 `templates/tile-probe.ts` 到仓库根目录，**用真实瓦片验证**
（能打开 capabilities 不等于能出图）：

```sh
deno run --allow-net --allow-read tile-probe.ts
deno run --allow-net --allow-read tile-probe.ts 115.9 28.68   # 指定探测点
```

判定标准：HTTP 200，且响应前 4 字节是 `ff d8 ff e0`（JPEG）或 `89 50 4e 47`（PNG）。
跑完删除探针文件。

## 关键陷阱

### 1. 比例尺基准必须是 28mm，不能抄服务端自报的值

这是"能出 capabilities 但不出图"的头号原因。标准客户端按
`分辨率 = ScaleDenominator × 0.00028`（OGC 约定的像素大小）反算瓦片跨度，
因此必须满足：

```
scale_denominator × 0.00028 × 256 = 360° / 2^z     即   scale = 559082264.0287178 / 2^z
```

也就是仓库里的 `cgcs2000_quad`（EPSG:4490，1~18 级）。天地图服务端 capabilities 里
常常自报 96 DPI 基准（`591658721.9…`，即 capgen 的 `cgcs2000_quad_dpi96`），
**不要照抄**：客户端仍按 0.00028 换算，瓦片跨度会偏大约 5.8%，列号整体错位
（江西 z12 应请求列号 3368，用 DPI96 会算成约 3182），图像完全出不来。

已有省份（henan / hebei / shanxi / jiangxi）都直接用 `cgcs2000_quad`。

### 2. 0 级矩阵高度非法

capgen 的 4326/CRS84 矩阵是 `matrix_width = 2^z`、`matrix_height = 2^(z-1)`，
在 `z = 0` 时高度是 `0.5`，XML 非法。源数据声明了 0 级时，二选一：

- 直接用 `cgcs2000_quad`（本身从 1 级起），少掉的只是那张覆盖 360° 的整球瓦片，
  对省级图层没有影响；
- 或继承 `CRS84TileMatrixSet`/`cgcs2000_quad` 的类并覆写 `generateMatrixs`，
  把高度 `Math.max(1, h)`。

### 3. 网格是平方公里网格，原点固定

id 为 `n` 的矩阵，单张瓦片跨 `360 / 2^n` 度，左上角固定 `(90, -180)`，
行列号从全球原点起算。服务端 capabilities 里的 `MatrixWidth/MatrixHeight`
可能被裁到数据范围，但**顶点和 id 不变**，所以自己声明时按完整 `2^n` 网格写即可。

### 4. 格式声明：认字节，别认 Content-Type

天地图 iServer 经常忽略 `FORMAT` 参数，并且返回的 `Content-Type` 与真实字节不符
（响应头写 `image/png`，字节却是 JPEG）。实测 `FORMAT=image/jpeg`、`image/png`、
`image/jpgpng` 返回内容完全一致，所以：

- 统一声明 `image/jpeg`（与 henan 等省份一致，客户端兼容性最好）；
- 判定是否出图要看前 4 字节魔数，不要看 `Content-Type`。

### 5. bbox 要归一化

列表接口可能给市域图层返回全球范围 `(-180, -90, 180, 90)`（江西 1996 南昌影像就是），
会让客户端满世界请求瓦片。用省界矩形与图层 bbox 求交集即可：

```ts
const bbox: BBox = [
  [Math.max(map.bbox[0], p[0][0]), Math.max(map.bbox[1], p[0][1])],
  [Math.min(map.bbox[2], p[1][0]), Math.min(map.bbox[3], p[1][1])],
];
```

注意：bbox 是数据**声明**范围，不代表真有数据。

### 6. 声明层级可能虚高，必须探测

源数据的层级是“服务能力”上限，不是数据上限。江西 1996 南昌影像声明 `1..24`，
实测 18 级正常、19 级起全部 404。接完后要按 2~3 个高层级探测一遍。
默认的 `cgcs2000_quad` 是 1~18 级，与江西实际数据范围恰好吻合，直接用即可；
确实需要改范围时，用 `cgcs2000_quad.setZoom(min, max)`，并在 `get_config.ts` 里
把层级范围（`tileMatrixSetLinks[].matrixIds[].identifier` 的最小/最大值）也解析进 JSON
（注意 `setZoom` 会把矩阵集 id 改成 `CGCS2000QuadF{min}T{max}`，这是正常的）。

### 7. 稀疏图层要用数据范围内的点探测

只有市域数据的图层（如 1996 南昌影像），用裁剪后的省域中心点探测会得到 404，
这是数据本身范围造成的，不是 URL 写错。此时给探针传南昌的经纬度确认。

### 8. 其它仓库约定

- `deno fmt --check` 在本仓库对**未修改的**文件也会报 `Text differed by line endings`
  （Windows 下仓库文件是 CRLF）。这是既有状态，不要"顺手修"成 LF。
- `.json` 由 `Deno.writeTextFile` 写出，是 LF 且**无文件末尾换行**，与 henan/hunan.json 一致。
- `deno task build` 里抓取失败只打印日志并跳过，已提交的旧 JSON 会静默保留。
  排查"配置没更新"时先看构建日志有没有 `获取 XX 配置失败，跳过`。
- 省级图层只挂在 `/tianditu/<province>` 动态路由下，**不**进 `src/maps.ts` / `dist/`。

## 参考文件

- `templates/tile-probe.ts`：瓦片探针，复制到仓库根目录运行后删除。
