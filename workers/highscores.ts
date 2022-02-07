import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
  AttributeValue,
} from "@aws-sdk/client-dynamodb";
import {getYearDayKey, getYearKey, getYearMonthKey, getYearWeekKey} from "./date-utils";

declare global {
  const AWS_REGION: string;
  const AWS_ACCESS_KEY: string;
  const AWS_SECRET_KEY: string;
  const AWS_DYNAMO_TABLE: string;
}

const getClient = () => {
  return new DynamoDBClient({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
    },
  });
};

const simplifyItem = (item: {[key: string]: AttributeValue}) => {
  return Object.fromEntries(
    Object.entries(item).map(([key, val]) => [
      key,
      Object.entries(val).map(([k, v]) => (k === "N" ? parseInt(v, 10) : v))[0] || null,
    ])
  );
};

export const getWeeklyHighscores = async () => {
  const dyno = getClient();
  const get = new QueryCommand({
    TableName: AWS_DYNAMO_TABLE,
    KeyConditionExpression: "yearAndWeek = :week",
    IndexName: "byWeek",
    ExpressionAttributeValues: {
      ":week": {S: getYearWeekKey(new Date())},
    },
    ExpressionAttributeNames: {"#n": "name"},
    ProjectionExpression: `#n, score, createdAt`,
    ScanIndexForward: false,
    Limit: 100,
  });
  const {Items} = await dyno.send(get);
  return (Items || []).map(simplifyItem);
};

export const getYearlyHighscores = async () => {
  const dyno = getClient();
  const get = new QueryCommand({
    TableName: AWS_DYNAMO_TABLE,
    KeyConditionExpression: "#y = :year",
    IndexName: "byYear",
    ExpressionAttributeValues: {
      ":year": {S: getYearKey(new Date())},
    },
    ExpressionAttributeNames: {"#n": "name", "#y": "year"},
    ProjectionExpression: `#n, score, createdAt`,
    ScanIndexForward: false,
    Limit: 100,
  });
  const {Items} = await dyno.send(get);
  return (Items || []).map(simplifyItem);
};

type HighscoreItem = {
  id: string;
  ipHash: string;
  score: number;
  name: string;
  createdAt: string;
  yearAndWeek: string;
  yearAndDay: string;
  yearAndMonth: string;
  year: string;
  appVersion: string;
};

type HighscoreInput = Omit<
  HighscoreItem,
  "id" | "yearAndWeek" | "yearAndDay" | "yearAndMonth" | "year" | "createdAt" | "ipHash"
>;

const processIp = async (ip: string) => {
  const m = ip.match(/(.*)\.\w+\.\w+/);
  const prefix = m ? `${m[1]}` : ip.slice(0, Math.round(ip.length * 0.75));
  const hashArray = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
  const hashHex = Array.from(new Uint8Array(hashArray))
    .slice(0, 4)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${prefix}_${hashHex}`;
};

export const addHighscore = async (opts: {item: HighscoreInput; ip: string}) => {
  const {item, ip} = opts;
  const dyno = getClient();
  const date = new Date();

  const get = new PutItemCommand({
    TableName: AWS_DYNAMO_TABLE,
    Item: {
      id: {S: crypto.randomUUID()},
      ipHash: {S: await processIp(ip)},
      score: {N: `${item.score}`},
      name: {S: item.name},
      createdAt: {S: date.toISOString()},
      yearAndWeek: {S: getYearWeekKey(date)},
      yearAndDay: {S: getYearDayKey(date)},
      yearAndMonth: {S: getYearMonthKey(date)},
      year: {S: getYearKey(date)},
      appVersion: {S: item.appVersion},
    },
  });
  await dyno.send(get);
};
