import { Client, CommandInteraction } from "eris";
import { ServerObj } from "../structures/dataJson";
import * as path from "path";
import * as fs from "fs";

export const info = {
  name: "setdelay",
  description: "Set the delay Vc Ping waits before pinging in your server.",
  disabled: false,
  options: [
    { name: "minutes", description: "The delay in minutes.", type: 4, required: false },
    { name: "seconds", description: "The delay in seconds.", type: 4, required: false },
  ],
};

export async function run(_client: Client, interaction: CommandInteraction): Promise<void> {
  const isAdmin = interaction.member?.permissions.has("administrator");
  const optionsData = interaction.data.options;
  const server: string = interaction.guildID as string;
  const dataFilePath: string = path.join(__dirname, "..", "data.json");
  let data: { [key: string]: ServerObj } = JSON.parse(fs.readFileSync(dataFilePath, "utf8"));

  await interaction.acknowledge(64);

  if (!isAdmin) {
    await interaction.createFollowup("You do not have permission to run this command!!");
    return;
  }

  if (!optionsData?.length) {
    await interaction.createFollowup("No input received.");
    return;
  }

  let delaySum: number = optionsData.reduce((sum: number, arg): number => {
    if (arg.type === 4) {
      arg.value;
      if (arg.name == "minutes") {
        sum += arg.value * 60000; // convert minutes in milliseconds
      } else if (arg.name == "seconds") {
        sum += arg.value * 1000;
      }
    }
    return sum;
  }, 0);

  data[server].delay = delaySum;

  // write updated file
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data));
    console.log(`[Database] Updated ${dataFilePath}`);
  } catch (err) {
    console.error(`[Database] Error updating ${dataFilePath}: ${err}`);
  }

  await interaction.createMessage(`Delay time has been updated.`);
}
