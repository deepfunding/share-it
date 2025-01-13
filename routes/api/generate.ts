import { define } from "~/utils.ts";

const randomFloat = (max: number) => Math.random() * max;

const generateData = (length: number) =>
  Array.from({ length }, (_, idx) => [
    idx,
    randomFloat(1),
  ]);

const generateCSV = (data: number[][]) =>
  [["id", "pred"], ...data].map((row) => row.join(",")).join("\n");

export const handler = define.handlers({
  GET: (request) => {
    const { url } = request;
    const params = new URLSearchParams(url.search);
    const length = Number(params.get("amount")) || 500;

    const data = generateData(length);
    const csv = generateCSV(data);

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
      },
    });
  },
});
