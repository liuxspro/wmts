export async function getConfig() {
  const url =
    "https://hunan.tianditu.gov.cn/api/tps/multiTemporalImagery/list?orderBy=sort_number";
  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`获取江苏配置失败: HTTP ${response.status}`);
  }
  const data = await response.json();
  const maps = data.data;
  return maps;
}
