import httpx


def fetch_jobs_from_remoteok(limit: int = 20) -> list[dict]:
    """
    Fetch remote job listings from the RemoteOK public API.
    Returns a list of simplified job dictionaries.
    """
    url = "https://remoteok.com/api"
    headers = {"User-Agent": "Mozilla/5.0"}  # RemoteOK requires a User-Agent header

    response = httpx.get(url, headers=headers, timeout=15.0)
    response.raise_for_status()

    raw_jobs = response.json()

    # The first item in RemoteOK's response is metadata, not a job - skip it
    raw_jobs = raw_jobs[1:] if len(raw_jobs) > 0 else []

    jobs = []
    for job in raw_jobs[:limit]:
        jobs.append({
            "title": job.get("position", "Untitled"),
            "company": job.get("company"),
            "location": job.get("location") or "Remote",
            "description": job.get("description", ""),
            "source_url": job.get("url"),
            "source": "remoteok"
        })

    return jobs