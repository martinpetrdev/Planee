import { redirect } from "next/navigation";
import { WebConfig } from "@/config";

export default function Page() {
	redirect(WebConfig.marketingWeb.baseUrl);
}
