const Twitter = require("twitter-lite");
const moment = require("moment");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

(async () => {
  const client = new Twitter({
    consumer_key: "",
    consumer_secret: "",
    access_token_key: "",
    access_token_secret: "",
  });

  const db = await open({
    filename: "/data/twitter.db",
    driver: sqlite3.Database,
  });

  // Create our tables
  await db.exec(
    "CREATE TABLE IF NOT EXISTS tweets (id TEXT, content TEXT, user_id TEXT, created_at INTEGER)"
  );
  await db.exec(
    "CREATE TABLE IF NOT EXISTS followers (count TEXT, user_id TEXT, created_at INTEGER)"
  );

  // Capture follower count
  const profile = await client.get("account/verify_credentials");
  await db.run("INSERT INTO followers VALUES (?, ?, ?)", [
    profile.followers_count,
    profile.id_str,
    moment().valueOf() / 1000,
  ]);

  // Capture tweets
  const latest = await db.get(
    `SELECT id FROM tweets WHERE user_id='${profile.id_str}' ORDER BY created_at DESC LIMIT 1`
  );

  let opts;
  if (latest) {
    opts = { since_id: latest.id };
  }
  const r = await client.get("statuses/user_timeline", opts);
  for (let t of r) {
    const d = moment(t.created_at, "dd MMM DD HH:mm:ss ZZ YYYY", "en");
    await addEntry(db, t.id_str, t.text, t.user.id_str, d.valueOf() / 1000);
  }
})();

function addEntry(db, id, content, user, created_at) {
  return db.run("INSERT INTO tweets VALUES (?, ?, ?, ?)", [
    id,
    content,
    user,
    created_at,
  ]);
}
