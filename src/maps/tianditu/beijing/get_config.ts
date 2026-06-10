import { decode, encode } from "@liuxspro/libs/base64";

const base_url = "https://beijing.tianditu.gov.cn/tianditu_pro";

interface Years {
  id: number;
  name: string;
}

interface YearDetail {
  serialNo: number;
  id: number;
  name: string;
  serUrl: string;
  infType: number;
  lrName: string;
  years: number;
  tileMatrix: string;
  tileStyle: string;
  layerType: string;
}

const headers = new Headers();
headers.append(
  "User-Agent",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
);
const options = {
  method: "POST",
  headers: headers,
  signal: AbortSignal.timeout(10_000),
};

async function get_years() {
  const year_url = `${base_url}/multitemporal/queryYears`;
  const response = await fetch(year_url, options);
  const result = await response.json();
  const data = decode(result["data"]);
  return JSON.parse(data) as Years[];
}

function encode_data(year: string) {
  return encode(JSON.stringify({ years: year }));
}

async function get_year_detail(year: string) {
  const post_data = encode_data(year);
  const year_url = `${base_url}/multitemporal/queryMultitemporal`;
  const response = await fetch(year_url, { ...options, body: post_data });
  const result = await response.json();
  const data = decode(result["data"]);
  return JSON.parse(data) as YearDetail[];
}

export async function get_config() {
  const years = await get_years();
  const data: YearDetail[] = [];
  for (const year of years) {
    const year_detail = await get_year_detail(year.id.toString());
    data.push(...year_detail);
  }
  return data;
}
