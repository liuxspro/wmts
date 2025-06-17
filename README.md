# WMTS Maps

将 XYZ 瓦片转换为 WMTS 服务

## 部署

```
deployctl deploy --entrypoint .\src\server.ts
```

## Maps

### 常用底图合集 `/collection`

常用底图合集 All in One

### 常用底图分集

- 高德 : `/dist/amap.xml`
- esri : `/dist/esri.xml`
- OSM : `/dist/osm.xml`
- 谷歌 :`/dist/google.xml`
- 谷谷 : `/dist/gggis.xml`
- 天地图江苏: `/dist/tianditu_js.xml`
- 天地图北京: `/dist/beijing.xml`

### 天地图 自行设置tk `/tianditu`

天地图需要 token (key)，请求`/tianditu`时,
可通过添加查询参数`?tdt=<token>`或者在 header 标头中添加`tdt`参数来设置 token
