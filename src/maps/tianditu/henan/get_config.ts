export async function getConfig() {
  const url = "https://henan.tianditu.gov.cn/duoshixiang.js";
  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`获取河南配置失败: HTTP ${response.status}`);
  }
  const text = await response.text();
  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}");
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("获取河南配置失败: 无法在响应中定位 JSON");
  }
  const jsonStr = text.slice(jsonStart, jsonEnd + 1);
  const data = JSON.parse(jsonStr);
  return data.RECORDS;
}
