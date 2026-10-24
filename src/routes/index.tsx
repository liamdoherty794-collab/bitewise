import { createFileRoute } from "@tanstack/react-router";
import { BitewiseApp } from "@/components/nara/app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <BitewiseApp />;
}
