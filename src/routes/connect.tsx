import { createFileRoute } from "@tanstack/react-router";
import { Plug } from "lucide-react";
import { ComingSoon } from "./business";

export const Route = createFileRoute("/connect")({
  head: () => ({ meta: [{ title: "Luvvu Connect — скоро" }] }),
  component: () => (
    <ComingSoon icon={Plug} title="Luvvu Connect" subtitle="Интеграции с вашими любимыми сервисами" />
  ),
});
