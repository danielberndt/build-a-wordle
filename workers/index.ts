import {Router} from "itty-router";
import {addHighscore, getWeeklyHighscores, getYearlyHighscores} from "./highscores";

const router = Router();

router.get<Request>("/_h/ok", () => {
  return new Response(JSON.stringify({ok: true}), {
    headers: {"Content-Type": "application/json"},
  });
});

router.get<Request>("/", () => {
  return new Response(JSON.stringify({welcome: true}), {
    headers: {"Content-Type": "application/json"},
  });
});

router.get<Request>("/get-weekly-scores", async () => {
  const scores = await getWeeklyHighscores();
  return new Response(JSON.stringify({scores}, null, 2), {
    headers: {
      "Content-Type": "application/json",
    },
  });
});

router.get<Request>("/get-yearly-scores", async () => {
  const scores = await getYearlyHighscores();
  return new Response(JSON.stringify({scores}, null, 2), {
    headers: {
      "Content-Type": "application/json",
    },
  });
});

router.post<Request>("/add-score", async (request) => {
  if (request.headers.get("Content-Type") !== "application/json") {
    return new Response("Only support content type 'application/json'", {status: 400});
  }
  const validFields = ["score", "name", "appVersion"];
  const data: {score: number; name: string; appVersion: string} = await request.json();
  for (const f of validFields) {
    if (!(f in data)) {
      return new Response(`Missing field '${f}'`, {status: 400});
    }
  }
  if (!/[a-z]{5}/.test(data.name)) {
    return new Response(`name needs to be 5 lower case letter. Got '${data.name}' instead`, {
      status: 400,
    });
  }

  await addHighscore({
    item: {score: data.score, name: data.name, appVersion: data.appVersion},
    ip: request.headers.get("cf-connecting-ip") || "none",
  });
  const scores = await getWeeklyHighscores();
  return new Response(JSON.stringify({scores}), {
    headers: {
      "Content-Type": "application/json",
    },
  });
});

router.all("*", () => new Response("404, not found!", {status: 404}));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Max-Age": "86400",
};

const cors = {
  handleOptions: (request: Request) => {
    let headers = request.headers;
    if (
      headers.get("Origin") !== null &&
      headers.get("Access-Control-Request-Method") !== null
      // && headers.get("Access-Control-Request-Headers") !== null
    ) {
      return new Response(null, {
        headers: {
          ...corsHeaders,
          ...(headers.get("Access-Control-Request-Headers") && {
            "Access-Control-Allow-Headers": headers.get("Access-Control-Request-Headers") || "",
          }),
        },
      });
    } else {
      return new Response(null, {headers: {Allow: "GET,HEAD,POST,OPTIONS"}});
    }
  },
  handleResponse: (request: Request, response: Response) => {
    let url;
    try {
      url = new URL(request.headers.get("origin") || "");
    } catch {
      return response;
    }
    response.headers.set("Access-Control-Allow-Origin", url.origin);
    response.headers.append("Vary", "Origin");
    return response;
  },
};

addEventListener("fetch", async (e) => {
  if (e.request.method === "OPTIONS") {
    e.respondWith(cors.handleOptions(e.request));
  } else {
    e.respondWith(
      router
        .handle(e.request)
        .then((response: Response) => cors.handleResponse(e.request, response))
    );
  }
});
