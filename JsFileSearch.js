const GetFiles = require("./GetFiles.js");

var search_content = "epic";
var account = "duke";

let data = {
  duke: {
    instance: "h1",
    agent_id: "329",
    access_token: "262f1f3686774c2f9cea64dcb068afc2",
  },
  rssl: {
    instance: "c0",
    agent_id: "34965929",
    access_token: "df15fa874fe14df994ca2bedf70deee5",
  },
  mtsinai: {
    instance: "h1",
    agent_id: "3319",
    access_token: "60d8bd51fbe446d4b8c41c61e31951fa",
  },
  mtsinai_ivr: {
    instance: "h1",
    agent_id: "5714",
    access_token: "60d8bd51fbe446d4b8c41c61e31951fa",
  },
  jh_reference: {
    instance: "h1",
    agent_id: "5718",
    access_token: "60d8bd51fbe446d4b8c41c61e31951fa",
  },
  aish_wipro: {
    instance: "ci2",
    agent_id: "96",
    access_token: "7e5c856da247486497797dec4af330f9",
  },
};

var instance = data[account].instance;
var agent_id = data[account].agent_id;
var access_token = data[account].access_token;

const makeSequentialGetFilesContent = async (apiUrls, search_word) => {
  let apiData = [];
  let args = {
    method: "GET",
    headers: {
      "Access-Token": access_token,
      "Content-Type": "application/json",
    },
    redirect: "follow",
  };
  for (let url of apiUrls) {
    try {
      const response = await fetch(url, args);
      const data = await response.json();
      //   console.log("\n data:", data.js_file.code);
      if (data.js_file.code.includes(search_word)) {
        apiData.push(data.js_file.name);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return apiData;
};

async function test() {
  let GetFiles_resp = "";
  GetFiles_resp = await GetFiles("1", instance, agent_id, access_token);
  // console.log("\n GetFiles_resp: ", GetFiles_resp);
  if (GetFiles_resp === "failed") {
    console.log("\n GetFiles failed");
    return false;
  }
  var all_GetFiles_resp = [];
  all_GetFiles_resp = GetFiles_resp.content;

  if (GetFiles_resp.page > 1) {
    for (let i = 2; i <= GetFiles_resp.page; i++) {
      GetFiles_resp = await GetFiles(i, instance, agent_id, access_token);
      // console.log("\n GetFiles_resp2: ", GetFiles_resp);
      if (GetFiles_resp === "failed") {
        console.log("\n GetFiles failed");
        return false;
      } else {
        GetFiles_resp.content.forEach((element) => {
          all_GetFiles_resp.push(element);
        });
      }
    }
  }

  let JsUrls = [];
  all_GetFiles_resp.forEach((element) => {
    JsUrls.push(`https://${instance}.avaamo.com/dashboard/js_files/${element.id}.json`);
  });
  console.log("\n Total Files in the bot: ", JsUrls.length, " Please wait");
  let valid_files = await makeSequentialGetFilesContent(JsUrls, search_content);
  if (valid_files.length < 1) {
    console.log("\n No match found for this search");
  } else {
    console.log("\n valid_files:", valid_files);
  }
}
test();
