import { env } from "./env";

export type DeployEnv = "local" | "production";

export function getDeployEnv(): DeployEnv {
  const explicit = env("DEPLOY_ENV").toLowerCase();
  if (explicit === "production" || explicit === "local") {
    return explicit;
  }

  const root = (env("ROOT_DOMAIN") || env("NEXT_PUBLIC_ROOT_DOMAIN")).toLowerCase();
  if (root.includes("localhost")) return "local";
  if (process.env.NODE_ENV !== "production") return "local";
  return "production";
}

export function isProductionDeploy(): boolean {
  return getDeployEnv() === "production";
}

export function shouldUseSecureCookies(): boolean {
  return isProductionDeploy();
}
