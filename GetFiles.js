const GetFiles = async (page, instance, agent_id, access_token) => {
  let url = `https://${instance}.avaamo.com/dashboard/bots/${agent_id}/js_files.json?page=${page}&admin_id=All&agent_id=${agent_id}`;
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
        // console.log("\n GetFiles Response : \n", json);
        if (json === "failed") return "failed";
        // else return json.files;
        else
          return {
            page: json.total_pages,
            content: json.files,
          };
      })
      .catch((err) => {
        console.log("\nError", err);
        return "failed";
      });
  //   console.log("\n jsonResponse: ", jsonResponse);
  return jsonResponse;
};

module.exports = GetFiles;
