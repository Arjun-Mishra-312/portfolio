"""Build the website's media from the film projects in videos/ (gitignored source material).

Writes:
  public/arjun-lake-avatar.webp              avatar, cropped from the Whistler lake photo
  public/films/introducing{,-60}.mp4/.jpg/.vtt  the intro films (720p web encodes, posters, captions): the full
                                             film (v13, 2:26) and the short cut (v4, 1:12)
  public/case-studies/mune-*.webp, mune-ask.mp4  Mune screens and the affordability-check recording
  public/roadpack/surfaces/*                 Lock Screen capture, Live Activity, app icon
  public/life/films/f1-sim.mp4/.webp         the F1 simulator clip

Captions come from the narration's word timings (the v13 body's words-v12.json at 1.10x, then the finale's; for
the short cut, its timeline75.json and words-short.json), with the text taken from the recorded script so the
speech recogniser's slips ("Lego technique") never reach a viewer.
usage: python scripts/site-media.py [avatar|films|mune|roadpack|f1 ...]   (from the repo root; needs ffmpeg and
Pillow; with no arguments it rebuilds everything)
"""
import difflib
import json
import os
import re
import subprocess
import sys

from PIL import Image, ImageDraw, ImageFont

V = "videos"
FULL = f"{V}/film-launch"
CUT = f"{V}/film-launch-60"
OUT = "public"


def ff(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)


def webp(src, dst, size=None, quality=82):
    im = Image.open(src).convert("RGB")
    if size:
        im = im.resize(size, Image.LANCZOS)
    im.save(dst, "WEBP", quality=quality, method=6)
    return im.size


# ---------- avatar ----------
def avatar():
    Image.open(f"{FULL}/assets/img/arjun-lake.jpg").convert("RGB").crop((470, 420, 810, 760)).save(
        f"{OUT}/arjun-lake-avatar.webp", "WEBP", quality=86, method=6)


# ---------- intro films ----------
FILMS = {
    "introducing": (f"{FULL}/renders/introducing-v13-share.mp4", 7.6),          # the full film, v13 (2:26)
    "introducing-60": (f"{CUT}/renders/introducing-75-v4-share.mp4", 6.6),     # the short cut, v4 (1:12)
}

# The narration as recorded, one caption per phrase (v13: the internship line, the grid finale).
CUES = [
    "Some people wait for the perfect setup.", "Arjun doesn't.", "Introducing Arjun Mishra.",
    "He wanted to build for iPhone.", "He didn't own a Mac.", "So the cloud became his Mac.",
    "On GitHub's macOS runners, his app is built, tested, signed,",
    "and shipped to the App Store, all from a Windows PC.",
    "That app is Roadpack: one live trip for every car in the group,",
    "kept in sync in real time, even when the signal drops.",
    "And it lives where you look: in Live Activities,", "the Dynamic Island, widgets, and Siri.",
    "Three releases in,", "a paying subscriber within the first six downloads, before any marketing.",
    "Then he co-founded Mune,", "a finance app where every AI answer happens on your iPhone.",
    "With Apple's MLX, a 4-billion-parameter model runs right on the device.",
    "And it doesn't just answer. It acts.",
    "Checking what you can afford, building budgets, setting goals,", "all from one conversation.",
    "At UBC, his research asks a bigger question.", "Can AI agents check the web for accessibility?",
    "His forty agents found 86% of real issues.", "A standard checker? 36%.",
    "First author. Submitted to CHI 2027.",
    "At IFS Copperleaf, his internship ended with an offer:", "keep building, part-time, through his final year.",
    "Data pipelines, and a return-on-investment portal for senior leadership.",
    "And away from the keyboard?", "He flies over Fuji and Vancouver's fireworks.",
    "He hikes. Builds LEGO Technic.", "And has two hackathon prizes.",
    "Put it all together.", "A computer science student at UBC, with a minor in commerce,",
    "two apps on the App Store, shipped from a Windows PC,", "research that makes AI show its work,",
    "and two papers submitted to CHI.", "More than 250 students taught,", "and a company that asked him to stay.",
    "He takes an idea all the way,", "from the design, to the code, to the people who use it.",
    "Give him a hard problem.", "He'll find a way to ship it.", "No perfect setup required.",
    "Arjun Mishra.", "Available May 2027,", "for software, forward-deployed, and AI engineering roles.",
]
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())


def spans_for(words, rename=None):
    """Caption spans for a film from its word timings: each cue spans the words it matched (cues not spoken are left out)."""
    asr = [norm(w["text"]) for w in words]
    script, owner = [], []
    for i, cue in enumerate(CUES):
        for tok in re.split(r"[\s\-]+", cue):
            if norm(tok):
                script.append(norm(tok)); owner.append(i)
    match = {}
    for a, b, n in difflib.SequenceMatcher(None, script, asr, autojunk=False).get_matching_blocks():
        for k in range(n):
            match[a + k] = b + k
    spans = []
    for i, cue in enumerate(CUES):
        hits = [match[j] for j in range(len(script)) if owner[j] == i and j in match]
        if len(hits) * 2 < sum(1 for o in owner if o == i):          # a cue counts as spoken when most of it is
            continue
        ws = [words[h] for h in hits]
        if len(ws) > 1 and ws[1]["start"] - ws[0]["start"] > 1.5:   # a stranded first word starts the caption too early
            ws = ws[1:]
        spans.append([ws[0]["start"], ws[-1]["end"], (rename or {}).get(cue, cue)])
    return spans


def stamp(t):
    return f"{int(t // 3600):02d}:{int(t % 3600 // 60):02d}:{t % 60:06.3f}"


def vtt(cues, path):
    cues = sorted(cues)
    lines = ["WEBVTT", ""]
    for k, (a, b, text) in enumerate(cues):
        nxt = cues[k + 1][0] if k + 1 < len(cues) else b + 2
        b = min(b + 0.45, nxt - 0.15)
        lines += [f"{stamp(max(0, a - 0.08))} --> {stamp(b)}", text, ""]
    open(path, "w", encoding="utf-8").write("\n".join(lines))


def duration(path):
    return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
                                capture_output=True, text=True, check=True).stdout)


def films():
    os.makedirs(f"{OUT}/films", exist_ok=True)
    for name, (src, poster_at) in FILMS.items():
        ff("-i", src, "-vf", "scale=1280:720:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "24",
           "-maxrate", "1600k", "-bufsize", "3200k", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k",
           "-movflags", "+faststart", f"{OUT}/films/{name}.mp4")
        ff("-ss", str(poster_at), "-i", src, "-frames:v", "1", "-vf", "scale=1280:720:flags=lanczos", "-q:v", "3",
           f"{OUT}/films/{name}.jpg")

    # The full film: the body's words (composition time, played at 1.10x), then the finale's after the body's last frame.
    speed = 1.10
    body = duration(f"{FULL}/renders/.v13/body-v.mp4")
    words = [{**w, "start": w["start"] / speed, "end": w["end"] / speed} for w in json.load(open(f"{FULL}/assets/vo/words-v12.json", encoding="utf-8"))]
    words += [{**w, "start": w["start"] + body, "end": w["end"] + body} for w in json.load(open(f"{FULL}/assets/vo/words-finale.json", encoding="utf-8"))]
    full = spans_for(words)
    vtt(full, f"{OUT}/films/introducing.vtt")

    # The short cut: the words inside each section's narration ranges, re-timed to the cut, then its finale's.
    T = json.load(open(f"{CUT}/timeline75.json"))
    body_words = json.load(open(f"{FULL}/assets/vo/words-v12.json", encoding="utf-8"))
    short = []
    for seg in T["segments"]:
        for w in body_words:
            if any(a - 0.15 <= w["start"] <= b for a, b in seg["vo"]):
                st = seg["start"] + (w["start"] - seg["in"]) / T["speed"]
                short.append({"text": w["text"], "start": st, "end": st + (w["end"] - w["start"]) / T["speed"]})
    body = duration(f"{CUT}/renders/introducing-75-v4-body.mp4")
    short += [{**w, "start": w["start"] + body, "end": w["end"] + body} for w in json.load(open(f"{CUT}/words-short.json", encoding="utf-8"))]
    short.sort(key=lambda w: w["start"])
    cut = spans_for(short, rename={"And has two hackathon prizes.": "Two hackathon prizes."})
    vtt(cut, f"{OUT}/films/introducing-60.vtt")
    print("captions", len(full), "in the full film,", len(cut), "in the short cut")


# ---------- Mune ----------
FONT = ImageFont.truetype("C:/Windows/Fonts/seguisb.ttf", 33)


def clean(im, island=False):
    """Apple's 9:41 product-shot status bar; the island covers the screen-recording dot."""
    d = ImageDraw.Draw(im)
    box = (0, 12, 214, 84)
    edge = sorted((im.getpixel((x, y)) for x in range(box[0], box[2], 6) for y in (box[1], box[3])), key=sum)
    bg = edge[len(edge) // 2]
    d.rectangle(box, fill=bg)
    d.text((60, 25), "9:41", font=FONT, fill=(255, 255, 255) if sum(bg) / 3 < 128 else (0, 0, 0))
    if island:
        d.rounded_rectangle((160, 12, 440, 78), radius=33, fill=(0, 0, 0))
    return im


def mune():
    """Mune screens with a clean 9:41 status bar, and the affordability-check recording."""
    dims = json.load(open(f"{OUT}/case-studies/dimensions.json"))
    for name in ("mune-insights", "mune-budgets", "mune-doordash"):
        dst = f"{OUT}/case-studies/{name}.webp"
        w, h = webp(f"{FULL}/assets/screens/{name}.jpg", dst)
        dims[name] = {"width": w, "height": h, "bytes": os.path.getsize(dst)}

    # The affordability check: typing (sped up), sending, then the answer. The model's visible reasoning
    # between them is cut, so the clip shows what a user sees first and last.
    RAW = f"{FULL}/assets/rec/mune-ai-raw.mp4"
    parts = [(1.0, 12.6, 2.4), (12.6, 15.0, 1.0), (30.9, 38.2, 1.0)]
    tmp = "tmp/mune-ask"
    os.makedirs(tmp, exist_ok=True)
    for k, (a, b, speed) in enumerate(parts):
        ff("-ss", str(a), "-to", str(b), "-i", RAW, "-an", "-vf", f"setpts=PTS/{speed},fps=30,scale=600:1300:flags=lanczos",
           "-q:v", "2", f"{tmp}/p{k}_%04d.jpg")
    frames = sorted(f for f in os.listdir(tmp) if f.endswith(".jpg"))
    for f in frames:
        clean(Image.open(f"{tmp}/{f}").convert("RGB"), island=True).save(f"{tmp}/{f}", quality=92)
    with open(f"{tmp}/list.txt", "w") as fh:
        for f in frames:
            fh.write(f"file '{f}'\nduration {1 / 30:.6f}\n")
    ff("-f", "concat", "-safe", "0", "-i", f"{tmp}/list.txt", "-vf", "fps=30", "-c:v", "libx264", "-preset", "slow", "-crf", "25",
       "-pix_fmt", "yuv420p", "-movflags", "+faststart", f"{OUT}/case-studies/mune-ask.mp4")
    last = clean(Image.open(f"{tmp}/{frames[-1]}").convert("RGB"), island=True)
    last.save(f"{OUT}/case-studies/mune-ask.webp", "WEBP", quality=82, method=6)
    dims["mune-ask"] = {"width": 600, "height": 1300, "bytes": os.path.getsize(f"{OUT}/case-studies/mune-ask.webp")}
    json.dump(dims, open(f"{OUT}/case-studies/dimensions.json", "w"), indent=2)



# ---------- Roadpack surfaces ----------
def roadpack():
    """The Lock Screen capture (carrier masked), the Live Activity, and the app icon."""
    os.makedirs(f"{OUT}/roadpack/surfaces", exist_ok=True)
    lock = Image.open(f"{FULL}/assets/ui/rp-lockscreen.jpg").convert("RGB")
    d = ImageDraw.Draw(lock)
    d.rectangle((40, 26, 220, 84), fill=lock.getpixel((30, 60)))  # carrier name
    lock.save(f"{OUT}/roadpack/surfaces/lockscreen.webp", "WEBP", quality=84, method=6)
    webp(f"{FULL}/assets/ui/rp-live-activity.webp", f"{OUT}/roadpack/surfaces/live-activity.webp", quality=88)
    Image.open(f"{FULL}/assets/ui/roadpack-icon.png").save(f"{OUT}/roadpack/surfaces/icon.png")



# ---------- Life: the F1 simulator ----------
def f1():
    """The F1 simulator clip and its poster."""
    os.makedirs("tmp", exist_ok=True)
    ff("-i", f"{FULL}/assets/video/f1sim.mp4", "-an", "-vf", "scale=576:720:flags=lanczos", "-c:v", "libx264", "-preset", "slow",
       "-crf", "26", "-pix_fmt", "yuv420p", "-movflags", "+faststart", f"{OUT}/life/films/f1-sim.mp4")
    ff("-ss", "1.2", "-i", f"{FULL}/assets/video/f1sim.mp4", "-frames:v", "1", "-vf", "scale=576:720", f"tmp/f1.png")
    webp("tmp/f1.png", f"{OUT}/life/films/f1-sim.webp")


PARTS = {"avatar": avatar, "films": films, "mune": mune, "roadpack": roadpack, "f1": f1}
for part in sys.argv[1:] or PARTS:
    PARTS[part]()
print("done")
