# WMTS Maps

将 XYZ 瓦片转换为 WMTS 服务

## 部署

```
deployctl deploy --entrypoint .\src\server.ts
```

## Maps

### 天地图 `/wmts/tianditu`

天地图需要 token (key)，请求`/wmts/tianditu`时, 可通过添加查询参数`?tdt=<token>`或者在 header 标头中添加`tdt`参数
