import destinationsJson from "./destinations.json" with { type: "json" };
import disruptionsJson from "./disruptions.json" with { type: "json" };
import groundTruthJson from "./groundTruth.json" with { type: "json" };

export const destinationsData = destinationsJson;
export const disruptionsData = disruptionsJson;
export const groundTruthData = groundTruthJson;

export default {
  destinationsData,
  disruptionsData,
  groundTruthData,
};
