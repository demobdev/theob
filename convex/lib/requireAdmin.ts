import { Auth } from "convex/server";

const ADMIN_IDS = ["user_3CgMcrOXROcFAbLzOX5jxgtCGqq"];

/**
 * Ensures the current user is an admin.
 * Throws an error if the user is not authenticated or lacks the admin role.
 */
export async function requireAdmin(ctx: { auth: Auth }) {
  const identity = await ctx.auth.getUserIdentity();
  
  if (!identity) {
    console.log("[requireAdmin] Authentication failed: No identity found. Check CLERK_ISSUER_URL and JWT Template.");
    throw new Error("Not authenticated");
  }

  // Check hardcoded IDs (for initial setup/emergencies)
  if (ADMIN_IDS.includes(identity.subject)) {
    console.log(`[requireAdmin] Access granted via hardcoded ID: ${identity.subject}`);
    return identity;
  }

  // Check Clerk metadata role
  // Clerk typically maps metadata to the identity object if configured in the JWT template
  const role = identity.role || (identity as any).publicMetadata?.role;
  
  if (role !== "admin") {
    console.log(`[requireAdmin] Access denied for ${identity.subject}. Role: ${role}`);
    throw new Error("Not authorized: Admin access required");
  }

  console.log(`[requireAdmin] Access granted via role for ${identity.subject}`);

  return identity;
}
