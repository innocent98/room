import { prisma } from "@/lib/db";

// Define plan limits for easy reference
export const PLAN_LIMITS = {
  FREE: {
    maxForms: 2,
    maxResponses: 10,
    maxTeams: 0,
    maxTeamMembers: 0,
    allowApiAccess: false,
    maxApiKeys: 0,
  },
  BASIC: {
    maxForms: 10,
    maxResponses: 100,
    maxTeams: 1,
    maxTeamMembers: 3,
    allowApiAccess: true,
    maxApiKeys: 1,
  },
  PRO: {
    maxForms: 50,
    maxResponses: 1000,
    maxTeams: 3,
    maxTeamMembers: 10,
    allowApiAccess: true,
    maxApiKeys: 5,
  },
  ENTERPRISE: {
    maxForms: -1, // Unlimited
    maxResponses: -1, // Unlimited
    maxTeams: -1, // Unlimited
    maxTeamMembers: -1, // Unlimited
    allowApiAccess: true,
    maxApiKeys: -1, // Unlimited
  },
};

// Get the current user's subscription
export async function getUserSubscription(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: "active",
      OR: [{ endDate: null }, { endDate: { gt: new Date() } }],
    },
    include: {
      plan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return subscription;
}

// Check if a user has an active subscription
export async function hasActiveSubscription(userId: string) {
  const subscription = await getUserSubscription(userId);
  return !!subscription;
}

// Get the user's current plan (including free plan if no subscription)
export async function getUserPlan(userId: string) {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    // Return the free plan
    const freePlan = await prisma.plan.findFirst({
      where: {
        price: 0,
      },
    });

    return (
      freePlan || {
        id: "free",
        name: "Free",
        maxForms: PLAN_LIMITS.FREE.maxForms,
        maxResponses: PLAN_LIMITS.FREE.maxResponses,
        maxTeams: PLAN_LIMITS.FREE.maxTeams,
        maxTeamMembers: PLAN_LIMITS.FREE.maxTeamMembers,
        allowApiAccess: PLAN_LIMITS.FREE.allowApiAccess,
        maxApiKeys: PLAN_LIMITS.FREE.maxApiKeys,
        price: "",
        features: "",
        interval: "",
      }
    );
  }

  return subscription.plan;
}

// Check if a user can create a new form
export async function canCreateForm(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return false;

  const plan = await getUserPlan(userId);

  // Check if the user has a subscription with unlimited forms
  if (plan.maxForms === -1) return true;

  // Check if the user has reached their monthly form limit
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  // Reset the monthly form count if it's a new month
  if (user.lastFormCountReset < currentMonth) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        monthlyFormCount: 0,
        lastFormCountReset: new Date(),
      },
    });
    return true;
  }

  return user.monthlyFormCount < plan.maxForms;
}

// Check if a form can receive more responses
export async function canReceiveResponses(formId: string) {
  const form = await prisma.form.findUnique({
    where: { id: formId },
    include: {
      user: true,
      responses: {
        select: { id: true },
      },
    },
  });

  if (!form || form.disabled) return false;

  const plan = await getUserPlan(form.userId);

  // If the plan allows unlimited responses
  if (plan.maxResponses === -1) return true;

  // Check if the form has reached its response limit
  return form.responses.length < plan.maxResponses;
}

// Increment the user's monthly form count
export async function incrementFormCount(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return;

  // Check if we need to reset the counter (new month)
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  if (user.lastFormCountReset < currentMonth) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        monthlyFormCount: 1,
        lastFormCountReset: new Date(),
      },
    });
  } else {
    await prisma.user.update({
      where: { id: userId },
      data: {
        monthlyFormCount: {
          increment: 1,
        },
      },
    });
  }
}

// Check if a user can create or use API keys
export async function canUseApiKeys(userId: string) {
  const plan = await getUserPlan(userId);
  return plan.allowApiAccess;
}

// Check if a user can create a new team
export async function canCreateTeam(userId: string) {
  const plan = await getUserPlan(userId);

  if (plan.maxTeams === -1) return true;

  const teamsCount = await prisma.team.count({
    where: {
      ownerId: userId,
    },
  });

  return teamsCount < plan.maxTeams;
}

// Check if a team can add more members
export async function canAddTeamMember(teamId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: {
        select: { id: true },
      },
      owner: {
        select: { id: true },
      },
    },
  });

  if (!team) return false;

  const plan = await getUserPlan(team.owner.id);

  if (plan.maxTeamMembers === -1) return true;

  return team.members.length < plan.maxTeamMembers;
}

// Update form status based on subscription
export async function updateFormStatusBasedOnSubscription(userId: string) {
  const plan = await getUserPlan(userId);
  const forms = await prisma.form.findMany({
    where: { userId },
    include: {
      responses: {
        select: { id: true },
      },
    },
  });

  // If the user has an unlimited plan, enable all forms
  if (plan.maxResponses === -1) {
    await prisma.form.updateMany({
      where: { userId },
      data: { disabled: false },
    });
    return;
  }

  // Otherwise, check each form
  for (const form of forms) {
    const shouldDisable = form.responses.length >= plan.maxResponses;

    if (form.disabled !== shouldDisable) {
      await prisma.form.update({
        where: { id: form.id },
        data: { disabled: shouldDisable },
      });
    }
  }
}

// Get usage statistics for a user
export async function getUserUsageStats(userId: string) {
  // Get or create usage stats
  let usageStats = await prisma.usageStats.findUnique({
    where: { userId },
  });

  if (!usageStats) {
    usageStats = await prisma.usageStats.create({
      data: { userId },
    });
  }

  // Get current plan
  const plan = await getUserPlan(userId);

  // Get form count
  const formsCount = await prisma.form.count({
    where: { userId },
  });

  // Get total responses
  const responsesCount = await prisma.response.count({
    where: {
      form: {
        userId,
      },
    },
  });

  // Get API keys count
  const apiKeysCount = await prisma.apiKey.count({
    where: { userId },
  });

  // Get teams count
  const teamsCount = await prisma.team.count({
    where: { ownerId: userId },
  });

  return {
    ...usageStats,
    formsCount,
    responsesCount,
    apiKeysCount,
    teamsCount,
    plan,
  };
}
