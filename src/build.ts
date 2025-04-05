import { maps } from "./maps.ts";

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

Object.entries(maps).forEach(async ([key, value]) => {
  await create_dist_dir();
  await Deno.writeTextFile(`./dist/${key}.xml`, value);
});
