const headers = new Headers();
headers.append(
  "User-Agent",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36 Edg/149.0.0.0",
);
headers.append(
  "Referer",
  "https://ditu.zjzwfw.gov.cn/resources-server/rescenter/index.html",
);

const nodeId = "2c9292047a95a5b9017ac1bd56e603cc"; // 历史影像

async function get_count() {
  const data = new URLSearchParams();
  data.append("nodeId", "8a94a45665a2408f0165a76d1fa90003");
  data.append("pageIndex", "0");
  data.append("rows", "6");
  data.append("useProductionTime", "false");
  data.append("orderByName", "true");
  const options = {
    method: "POST",
    headers: headers,
    body: data,
  };
  const r = await fetch(
    "https://ditu.zjzwfw.gov.cn/resources-server/resources/base/group.do",
    options,
  );
  const response = await r.json();
  const rdata = response.data.data[0].count;
  return rdata;
}

export async function getConfig() {
  const count = await get_count();
  const data = new URLSearchParams();
  data.append("nodeId", nodeId);
  data.append("pageIndex", "0");
  data.append("rows", count);
  data.append("useProductionTime", "false");
  data.append("orderByName", "true");

  const options = {
    method: "POST",
    headers: headers,
    body: data,
  };
  const r = await fetch(
    "https://ditu.zjzwfw.gov.cn/resources-server/resources/base/list/new.do",
    options,
  );
  return await r.json();
}
