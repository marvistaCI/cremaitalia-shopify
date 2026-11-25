"""Apply the policy sources in docs/legal/policies/ to the live store, then prove it by fetching
the public pages.

WHY THIS EXISTS (2026-11-25). The four policies were first put live by pasting hard-wrapped plain
text from ready-to-paste.md into Settings -> Policies. Shopify's editor kept every wrapped line as a
forced break and had no way to know which lines were headings, so all three pasted policies went
live with sentences snapping mid-phrase and headings set as body copy. The paste was the fragile
step, so this script removes it: the HTML file in the repo is the source, this script sets the
policy body to exactly that file through the Admin API, and the public page is fetched and checked
afterwards - the same source / apply / prove ritual the theme pushes follow.

USAGE
    py docs/legal/apply_policies.py            # apply all four, then verify
    py docs/legal/apply_policies.py shipping   # one policy
    py docs/legal/apply_policies.py --verify   # fetch and check only, write nothing

PREREQUISITE, once per machine: the CLI store connector must be authorised against the store's
PERMANENT domain (the alias is refused at the OAuth callback):
    shopify store auth -s br1qrr-tt.myshopify.com --scopes read_legal_policies,write_legal_policies

Privacy is deliberately NOT here: it is still Shopify's generated policy (docs/legal/README.md), and
the trigger to replace it is the taste-profile customer metafield.
"""
import json
import re
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

STORE = "br1qrr-tt.myshopify.com"          # permanent domain; crema-italia.myshopify.com is the alias
PUBLIC = "https://cremaitalia.com/policies/"
HERE = Path(__file__).resolve().parent / "policies"

# key -> (Admin API ShopPolicyType, public path, source file)
POLICIES = {
    "contact":  ("CONTACT_INFORMATION", "contact-information", "contact-information.html"),
    "shipping": ("SHIPPING_POLICY",     "shipping-policy",     "shipping-policy.html"),
    "refund":   ("REFUND_POLICY",       "refund-policy",       "refund-policy.html"),
    "terms":    ("TERMS_OF_SERVICE",    "terms-of-service",    "terms-of-service.html"),
}

MUTATION = """
mutation($p: ShopPolicyInput!) {
  shopPolicyUpdate(shopPolicy: $p) {
    shopPolicy { type url }
    userErrors { field message }
  }
}
"""


def source(key):
    return (HERE / POLICIES[key][2]).read_text(encoding="utf-8").strip()


def apply(key):
    ptype, _, _ = POLICIES[key]
    body = source(key)
    # Query and variables go through files: on Windows the CLI runs via the shell, and a multi-line
    # query or a JSON body passed inline arrives mangled ("--query flag value is empty").
    with tempfile.TemporaryDirectory() as td:
        qf = Path(td) / "mutation.graphql"
        vf = Path(td) / "variables.json"
        qf.write_text(MUTATION, encoding="utf-8")
        vf.write_text(json.dumps({"p": {"type": ptype, "body": body}}), encoding="utf-8")
        cmd = ["shopify", "store", "execute", "-s", STORE, "--allow-mutations", "--no-input", "-j",
               "--query-file", str(qf), "--variable-file", str(vf)]
        out = subprocess.run(cmd, capture_output=True, text=True, shell=(sys.platform == "win32"))
    # The CLI prints progress lines, then the result pretty-printed from a line that is exactly "{".
    lines = out.stdout.splitlines()
    starts = [i for i, l in enumerate(lines) if l.strip() == "{"]
    res = json.loads("\n".join(lines[starts[-1]:])) if starts else {}
    data = res.get("data", res)
    upd = (data.get("shopPolicyUpdate") or {}) if isinstance(data, dict) else {}
    errs = upd.get("userErrors") or []
    if errs or not upd.get("shopPolicy"):
        print(f"  {key}: FAILED", errs or out.stdout[-400:] or out.stderr[-400:])
        return False
    print(f"  {key}: applied ->", upd["shopPolicy"]["url"])
    return True


def fetch_body(path):
    req = urllib.request.Request(PUBLIC + path, headers={"User-Agent": "crema-policy-check"})
    html = urllib.request.urlopen(req, timeout=30).read().decode("utf-8")
    m = re.search(r'<div class="rte">(.*?)</div>\s*</div>\s*</div>', html, re.S)
    return (m.group(1) if m else "").strip()


def verify(key):
    """The public page must carry the source's headings and paragraphs, no stray breaks, and none of
    the paste damage. A stray <br> is the defect this script exists to prevent; the contact card's
    four address lines are the one place a <br> belongs, and the source carries them."""
    _, path, _ = POLICIES[key]
    src = source(key)
    live = fetch_body(path)
    want_h2 = src.count("<h2>")
    want_br = src.count("<br>")
    got_h2 = len(re.findall(r"<h2[ >]", live))
    got_br = live.count("<br>")
    sealed = "roaster's own sealed bag" in live or "roaster&rsquo;s own sealed bag" in live
    spans = live.count("<div><span>")
    ok = got_h2 == want_h2 and got_br == want_br and not sealed and spans == 0 and len(live) > 0
    print(f"  {key}: h2 {got_h2}/{want_h2}  br {got_br}/{want_br}  div-span {spans}  sealed {sealed}"
          f"  -> {'OK' if ok else 'MISMATCH'}")
    return ok


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    keys = args or list(POLICIES)
    bad = [k for k in keys if k not in POLICIES]
    if bad:
        sys.exit(f"unknown policy {bad}; choose from {list(POLICIES)}")
    if "--verify" not in sys.argv:
        print("Applying to", STORE)
        if not all(apply(k) for k in keys):
            sys.exit(2)
    print("Verifying on", PUBLIC)
    sys.exit(0 if all(verify(k) for k in keys) else 3)
