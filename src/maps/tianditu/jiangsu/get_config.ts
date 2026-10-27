interface MapItem {
  name?: string;
  year?: string;
  layers: { type?: string; id: string; url: string }[];
}

export async function get_jiangsu_config() {
  // 该站点的 HTTPS 仅支持 TLS 1.2 + 静态 RSA/CBC 套件（AES128-SHA、AES256-SHA），
  // 没有 TLS 1.3，也没有 ECDHE/AEAD 套件，Deno 的 rustls 客户端会直接
  // HandshakeFailure，因此这里只能走 HTTP（curl、浏览器等 OpenSSL/schannel 客户端不受影响）。
  const config_url =
    "http://jiangsu.tianditu.gov.cn/server/mulitdate/getConfig?type=多时相配置";

  const response = await fetch(config_url, {
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`获取江苏配置失败: HTTP ${response.status}`);
  }
  const data = await response.json();
  const items = data["config"]["items"];
  const maps = items.map((item: MapItem) => {
    const name = item.name || item.year;
    const image_layer = item.layers[0];
    delete image_layer.type;
    return { name, ...image_layer };
  });
  return maps;
}
