// RSSL
// var instance = "c0";
// var agent_id = "49659";
// var access_token = "df15fa874fe14df994ca2bedf70deee5";

// // Duke
var instance = "h1";
var agent_id = "329";
var access_token = "262f1f3686774c2f9cea64dcb068afc2";

// MtSinai;
var instance = "h1";
// // var agent_id = "3319"; //mt sinai
// // var agent_id = "5714"; // sinai ivr
// var agent_id = "5718"; // JH reference
// var access_token = "60d8bd51fbe446d4b8c41c61e31951fa";

// var instance = "ci2";
// var agent_id = "96";
// var access_token = "7e5c856da247486497797dec4af330f9";

var search_content = "Flow_end_message";

const GetFiles = async () => {
  let url = `https://${instance}.avaamo.com/dashboard/bots/${agent_id}/js_files.json?page=1&admin_id=All&agent_id=${agent_id}`;
  let args = {
      method: "GET",
      headers: {
        "Access-Token": access_token,
        "Content-Type": "application/json",
      },
      redirect: "follow",
    },
    jsonResponse = await fetch(url, args)
      .then((res) => {
        // console.log("\n updateAttributes res :",res)
        console.log("\n GetFiles res.status :", res.status);
        if (res.status == 200) {
          return res.json();
        } else return "failed";
      })
      .then((json) => {
        console.log("\n GetFiles Response : \n", json);
        if (json === "failed") return "failed";
        else return json.files;
      })
      .catch((err) => {
        console.log("\nError", err);
        return "failed";
      });
  //   console.log("\n jsonResponse: ", jsonResponse);
  return jsonResponse;
};

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
  let GetFiles_resp = await GetFiles();
  //   console.log("\n GetFiles_resp: ", GetFiles_resp);
  if (GetFiles_resp === "failed") {
    console.log("\n GetFiles failed");
    return false;
  }
  let JsUrls = [];
  GetFiles_resp.forEach((element) => {
    JsUrls.push(`https://${instance}.avaamo.com/dashboard/js_files/${element.id}.json`);
  });
  let valid_files = await makeSequentialGetFilesContent(JsUrls, search_content);
  if (valid_files.length < 1) {
    console.log("\n No match found for this search");
  } else {
    console.log("\n valid_files:", valid_files);
  }
}
test();
