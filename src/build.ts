import { maps } from "./maps.ts";
import { get_jiangsu_config } from "./maps/tianditu/江苏/get_config.ts";
import { get_config as get_beijing_config } from "./maps/tianditu/beijing/get_config.ts";

async function create_dist_dir() {
  try {
    await Deno.mkdir("dist", { recursive: true });
  } catch (err) {
    if (err instanceof Deno.errors.AlreadyExists) {
      console.log("dist 文件夹已存在");
    } else {
      console.error("发生错误:", err);
    }
  }
}

async function main() {
  try {
    console.log("Getting jiangsu maps...");
    const jiangsu_maps = await get_jiangsu_config();
    await Deno.writeTextFile(
      `./src/maps/tianditu/江苏/jiangsu.json`,
      JSON.stringify(jiangsu_maps, null, 2),
    );
  } catch (err) {
    console.error("获取江苏配置失败，跳过:", err);
  }

  try {
    console.log("Getting beijing maps...");
    const beijing_maps = await get_beijing_config();
    await Deno.writeTextFile(
      `./src/maps/tianditu/beijing/beijing.json`,
      JSON.stringify(beijing_maps, null, 2),
    );
  } catch (err) {
    console.error("获取北京配置失败，跳过:", err);
  }

  await create_dist_dir();
  for (const [key, value] of Object.entries(maps)) {
    try {
      await Deno.writeTextFile(`./dist/${key}.xml`, value);
    } catch (err) {
      console.error(`写入 ${key}.xml 失败，跳过:`, err);
    }
  }

  console.log("Done!");
}

main();
