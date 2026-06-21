import { makePage } from "@keystatic/astro/ui";
import config from "virtual:keystatic-config";

const KeystaticPage = makePage(config);

export default function KeystaticAdmin() {
  return <KeystaticPage />;
}
