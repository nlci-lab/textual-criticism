# Screenshots via headless Edge. 360px shots: Edge headless has a ~500px minimum window,
# so the page is rendered in a 360px iframe and cropped.
import subprocess, pathlib, sys
from PIL import Image
E = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
R = pathlib.Path(__file__).parent.resolve()
def shot(url, out, w, h, scheme):
    subprocess.run([E, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
        f"--blink-settings=preferredColorScheme={scheme}", f"--window-size={w},{h}", f"--screenshot={out}", url],
        capture_output=True, timeout=60)
for d in sorted(R.glob("[1-5]-*")):
    for k in ["home", "witness", "guide"]:
        f = (d / f"{k}.html").as_uri()
        shot(f, d / f"{k}-1280.png", 1280, 1600, 1)
        frame = d / f"_{k}-frame.html"
        frame.write_text(f'<!doctype html><body style="margin:0"><iframe src="{k}.html" style="border:0;width:360px;height:2400px"></iframe>', encoding="utf-8")
        tmp = d / f"_{k}.png"
        shot(frame.as_uri(), tmp, 600, 2400, 1)
        Image.open(tmp).crop((0, 0, 360, 2400)).save(d / f"{k}-360.png")
        tmp.unlink(); frame.unlink()
    shot((d / "witness.html").as_uri(), d / "witness-1280-dark.png", 1280, 1000, 0)
    print(d.name)
