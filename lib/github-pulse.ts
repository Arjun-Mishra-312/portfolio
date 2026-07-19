export type GithubPulsePayload = {
  days: Array<{ date: string; count: number; level: number }>;
  total: number;
  streak: number;
  latest: { repo: string; label: string; url: string; occurredAt: string } | null;
  status: "ready" | "fallback";
  fetchedAt: string;
};

const GITHUB_USER = "Arjun-Mishra-312";

function recentActivityDays() {
  const today = new Date();
  return Array.from({ length: 126 }, (_, index) => {
    const date = new Date(today);
    date.setUTCDate(today.getUTCDate() - (125 - index));
    return { date: date.toISOString().slice(0, 10), count: 0, level: 0 };
  });
}

function normalizeDays(
  weeks: Array<{ contributionDays: Array<{ date: string; contributionCount: number }> }>,
) {
  return weeks
    .flatMap((week) => week.contributionDays)
    .slice(-126)
    .map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: day.contributionCount === 0 ? 0 : Math.min(4, Math.ceil(day.contributionCount / 2)),
    }));
}

function currentStreak(days: GithubPulsePayload["days"]) {
  let streak = 0;
  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index].count === 0) {
      if (index === days.length - 1) continue;
      break;
    }
    streak += 1;
  }
  return streak;
}

async function getLatestActivity() {
  const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=20`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "arjun-os-portfolio",
      ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
    },
    next: { revalidate: 3600 },
  });
  if (!response.ok) return null;
  const events = (await response.json()) as Array<{
    type: string;
    repo?: { name?: string };
    created_at?: string;
  }>;
  const event = events.find((item) => item.repo?.name);
  if (!event?.repo?.name) return null;
  const shortRepo = event.repo.name.split("/").at(-1) ?? event.repo.name;
  return {
    repo: shortRepo,
    label: event.type.replace(/Event$/, ""),
    url: `https://github.com/${event.repo.name}`,
    occurredAt: event.created_at ?? new Date().toISOString(),
  };
}

async function fetchGraphqlContributions(from: string, to: string) {
  if (!process.env.GITHUB_TOKEN) return null;
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "arjun-os-portfolio",
    },
    body: JSON.stringify({
      query: `query($login:String!,$from:DateTime!,$to:DateTime!){user(login:$login){contributionsCollection(from:$from,to:$to){contributionCalendar{weeks{contributionDays{date contributionCount}}}}}}`,
      variables: { login: GITHUB_USER, from: `${from}T00:00:00Z`, to },
    }),
    next: { revalidate: 3600 },
  });
  if (!response.ok) return null;
  const json = await response.json();
  const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks;
  return Array.isArray(weeks) ? normalizeDays(weeks) : null;
}

/** Public calendar fallback when no GitHub token is configured. */
async function fetchPublicContributions() {
  const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`, {
    headers: { Accept: "application/json", "User-Agent": "arjun-os-portfolio" },
    next: { revalidate: 3600 },
  });
  if (!response.ok) return null;
  const json = (await response.json()) as {
    contributions?: Array<{ date: string; count: number; level: number }>;
  };
  if (!Array.isArray(json.contributions) || json.contributions.length === 0) return null;
  return json.contributions.slice(-126).map((day) => ({
    date: day.date,
    count: day.count,
    level: Math.max(0, Math.min(4, day.level ?? (day.count === 0 ? 0 : Math.min(4, Math.ceil(day.count / 2))))),
  }));
}

export async function fetchGithubPulse(): Promise<GithubPulsePayload> {
  let days = recentActivityDays();
  let status: GithubPulsePayload["status"] = "fallback";

  try {
    const from = days[0].date;
    const to = new Date().toISOString();
    const graphqlDays = await fetchGraphqlContributions(from, to);
    const publicDays = graphqlDays ? null : await fetchPublicContributions();
    const resolved = graphqlDays ?? publicDays;
    if (resolved && resolved.length > 0) {
      days = resolved;
      status = "ready";
    }

    const latest = await getLatestActivity();
    return {
      days,
      total: days.reduce((sum, day) => sum + day.count, 0),
      streak: currentStreak(days),
      latest,
      status,
      fetchedAt: new Date().toISOString(),
    };
  } catch {
    return {
      days,
      total: 0,
      streak: 0,
      latest: null,
      status: "fallback",
      fetchedAt: new Date().toISOString(),
    };
  }
}
