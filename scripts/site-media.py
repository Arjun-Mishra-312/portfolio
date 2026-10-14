"""Build the website's media from the film projects in videos/ (gitignored source material).

Writes:
  public/arjun-lake-avatar.webp              avatar, cropped from the Whistler lake photo
  public/films/introducing{,-60}.mp4/.jpg/.vtt  the intro films (720p web encodes, posters, captions)
  public/case-studies/mune-*.webp, mune-ask.mp4  Mune screens and the affordability-check recording
  public/roadpack/surfaces/*                 Lock Screen capture, Live Activity, app icon
  public/life/films/f1-sim.mp4/.webp         the F1 simulator clip

Captions come from the narration's word timings (videos/film-launch/assets/vo/words-film.json), with the
text taken from the recorded script so the speech recogniser's slips ("Lego technique") never reach a viewer.
usage: python scripts/site-media.py   (from the repo root; needs ffmpeg and Pillow)
"""
import difflib
import json
import os
import re
import subprocess

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
Image.open(f"{FULL}/assets/img/arjun-lake.jpg").convert("RGB").crop((470, 420, 810, 760)).save(
    f"{OUT}/arjun-lake-avatar.webp", "WEBP", quality=86, method=6)

# ---------- intro films ----------
os.makedirs(f"{OUT}/films", exist_ok=True)
FILMS = {
    "introducing": (f"{FULL}/renders/introducing-v11-share.mp4", 7.9),
    "introducing-60": (f"{CUT}/renders/introducing-60s-v3-share.mp4", 6.6),
}
for name, (src, poster_at) in FILMS.items():
    ff("-i", src, "-vf", "scale=1280:720:flags=lanczos", "-c:v", "libx264", "-preset", "slow", "-crf", "24",
       "-maxrate", "1600k", "-bufsize", "3200k", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k",
       "-movflags", "+faststart", f"{OUT}/films/{name}.mp4")
    ff("-ss", str(poster_at), "-i", src, "-frames:v", "1", "-vf", "scale=1280:720:flags=lanczos", "-q:v", "3",
       f"{OUT}/films/{name}.jpg")

# The narration as recorded, one caption per phrase.
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
    "At IFS Copperleaf, his co-op became a part-time role,",
    "building data pipelines and a return-on-investment portal for senior leadership.",
    "And away from the keyboard?", "He flies drones over Fuji and Vancouver's fireworks.",
    "He hikes. Builds LEGO Technic.", "And has two hackathon prizes.",
    "Oh. One more thing.", "Arjun Mishra.", "Available May 2027.",
    "For software, forward-deployed, and AI engineering roles.",
]
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
words = json.load(open(f"{FULL}/assets/vo/words-film.json"))
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
    assert hits, cue
    ws = [words[h] for h in hits]
    # A word stranded by the drone's inserted bar ("He ... flies") starts the caption too early.
    if len(ws) > 1 and ws[1]["start"] - ws[0]["start"] > 1.5:
        ws = ws[1:]
    spans.append([ws[0]["start"], ws[-1]["end"], cue])
# The recogniser hears "Arjun" in the silence before the close; the name is spoken on the music's re-drop.
next(s for s in spans if s[2] == "Arjun Mishra.")[0] = 111.37


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


vtt(spans, f"{OUT}/films/introducing.vtt")

# The 60-second cut keeps whole phrases from the full film, re-timed at 1.06x.
T = json.load(open(f"{CUT}/timeline60.json"))
VO60 = {"hook": [(1.30, 5.20)], "Introducing": [(6.25, 8.75)], "macOS runners, Windows PC": [(15.95, 24.48)],
        "Roadpack": [(25.25, 29.80)], "first paying subscriber, Mune, MLX": [(42.0, 46.90), (46.95, 53.52), (53.58, 58.92)],
        "86% vs 36%": [(75.10, 81.98)], "IFS Copperleaf": [(86.52, 90.08)],
        "One more thing, the close": [(108.28, 110.12), (111.35, 119.45)]}


def to60(t):
    for s in T["segments"]:
        if any(a - 0.15 <= t <= b for a, b in VO60.get(s["label"], [])):
            return s["start"] + (t - s["src"][0]) / T["rate"]
    return None


cut = []
for a, b, text in spans:
    a60 = to60(a)
    if a60 is not None:
        cut.append([a60, a60 + (b - a) / T["rate"], text])
vtt(cut, f"{OUT}/films/introducing-60.vtt")
print("captions", len(spans), "full,", len(cut), "in the 60-second cut")

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
os.makedirs(f"{OUT}/roadpack/surfaces", exist_ok=True)
lock = Image.open(f"{FULL}/assets/ui/rp-lockscreen.jpg").convert("RGB")
d = ImageDraw.Draw(lock)
d.rectangle((40, 26, 220, 84), fill=lock.getpixel((30, 60)))  # carrier name
lock.save(f"{OUT}/roadpack/surfaces/lockscreen.webp", "WEBP", quality=84, method=6)
webp(f"{FULL}/assets/ui/rp-live-activity.webp", f"{OUT}/roadpack/surfaces/live-activity.webp", quality=88)
Image.open(f"{FULL}/assets/ui/roadpack-icon.png").save(f"{OUT}/roadpack/surfaces/icon.png")

# ---------- Life: the F1 simulator ----------
ff("-i", f"{FULL}/assets/video/f1sim.mp4", "-an", "-vf", "scale=576:720:flags=lanczos", "-c:v", "libx264", "-preset", "slow",
   "-crf", "26", "-pix_fmt", "yuv420p", "-movflags", "+faststart", f"{OUT}/life/films/f1-sim.mp4")
ff("-ss", "1.2", "-i", f"{FULL}/assets/video/f1sim.mp4", "-frames:v", "1", "-vf", "scale=576:720", f"tmp/f1.png")
webp("tmp/f1.png", f"{OUT}/life/films/f1-sim.webp")
print("done")
