interface MapItem {
  name?: string;
  year?: string;
  layers: { type?: string; id: string; url: string }[];
}

export async function get_jiangsu_config() {
  const config_url =
    "https://jiangsu.tianditu.gov.cn/server/mulitdate/getConfig?type=多时相配置";

  const response = await fetch(config_url);
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
