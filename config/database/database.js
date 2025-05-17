import { MongoClient, Db } from "mongodb";
/**
 * База данных
 * @type {Db}
 */
export let DB;

await MongoClient.connect(`mongodb://root:pass@localhost:15248/`)
  .then((client) => {
    DB = client.db("autoMaster");
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log(`Database connection error: ${err}`);
  });
