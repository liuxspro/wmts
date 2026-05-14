import { maps } from "./maps.ts";
import { get_jiangsu_config } from "./maps/tianditu/江苏/get_config.ts";

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

const jiangsu_maps = await get_jiangsu_config();
console.log("Getting jiangsu maps...");
await Deno.writeTextFile(
  `./src/maps/tianditu/江苏/jiangsu.json`,
  JSON.stringify(jiangsu_maps, null, 2),
);

Object.entries(maps).forEach(async ([key, value]) => {
  await create_dist_dir();
  await Deno.writeTextFile(`./dist/${key}.xml`, value);
});
console.log("Done!");
