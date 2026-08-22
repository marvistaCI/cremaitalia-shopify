"""One-shot port: move the BUILD GATE block from the hand-edited workbook into the generator.

Written 2026-08-22. The 12 BUILD GATE rows were added by hand to the delivered .xlsx before this
directory existed - i.e. to the RENDER, which the README forbids, because the next generator run
overwrites it. This script puts the same change into the SOURCE. Run it once, then run
build_inventory.py, then delete this file.

Idempotent: refuses to run twice.
"""
import io, re, sys

P = 'build_inventory.py'
with io.open(P, encoding='utf-8') as f:
    src = f.read()

if 'BUILD GATE' in src:
    sys.exit('ALREADY PORTED - build_inventory.py already contains BUILD GATE. Nothing to do.')

n = 0
def sub(old, new, why):
    """Exact-string replace, asserting the anchor is unique."""
    global src, n
    assert src.count(old) == 1, 'anchor %r matched %d times (%s)' % (old[:60], src.count(old), why)
    src = src.replace(old, new)
    n += 1

# 1. subtitle -------------------------------------------------------------
sub('ds["A2"] = "The decision layer behind the inventory. LOCKED means',
    'ds["A2"] = "The decision layer behind the inventory. BUILD GATE means it must be true before '
    'the production build starts - those rows sit at the top. LOCKED means',
    'A2 subtitle')

# 2. the five new gate rows, inserted at the head of D ---------------------
NEW = '''D = [
["BUILD GATE","One signed roaster and 2-3 real SKUs","Roaster onboarding / Shopify data model","The production build starts against real product data, not the POC fixture catalogue. Minimum viable: ONE signed roaster and 2-3 real SKUs carrying real landed cost, real bag sizes, real tasting notes, and a real roaster bio and region.","THE SCHEDULE DRIVER, and bigger than the 3PL gap. The whole sec13 data model was reverse-engineered from invented data, and Review B already caught two places where a fixture ACCIDENT had been transcribed into the production schema as though it were design - the whole-bean string in crema_italia.brewing, and the assumption that a coffee only ever sits on one shelf. Fixture data cannot find the rest: by construction it agrees with whatever we assumed.","Gate set 2026-08-22","production_build_spec.md sec13, sec15.2; POC11_change_list.md sec0"],
["BUILD GATE","Pricing matrix validated against real landed costs","Pricing / landed-cost model","Run the first real SKUs through the markup matrix against Crema_Italia_Landed_Cost_Model_v1.xlsx before any production price-display code is written. Standard sec12.3 has said specified, never validated since 2026-07-13.","If the multipliers are wrong we find out BEFORE building a display layer around them. And the matrix has never been checked against the 3.7% all-in on subscription orders (Shopify 2.7% + Loop 1.0%), which is the shelf the entire subscriber model rests on.","Gate set 2026-08-22","Store Operating Standards sec12.3 (open since 2026-07-13)"],
["BUILD GATE","Execute the locked plan decision - upgrade to Grow","Shopify","The plan floor was LOCKED 2026-08-21 (Basic disqualified, Grow sufficient) and never executed - the cost line still reads Basic $39. Upgrade to Grow, billed annually at $79/mo.","Basic includes ZERO extra staff accounts and the team is four people; the build will want Lucia and Lauren in the admin. Nothing else in the design needs more than Grow - Functions and account extensions both run on all plans, and checkout extensibility was already declined at ~$24k/yr.","Gate set 2026-08-22","This sheet, row Shopify plan floor (LOCKED 2026-08-21)"],
["BUILD GATE","Publish the two selling plans; stay on Loop Free during the build","Loop Subscriptions","Publish founder 12% and subscriber 10% as two selling plans on the REAL store so the build binds to real plan IDs. Stay on Loop FREE for the duration of the build; Starter ($99/mo) goes on before the first real signup, not before the first line of code.","Standard v1.15 puts the subscriber rate ON THE SELLING PLAN, so the plans are now a build INPUT rather than a launch task. And there is no reason to pay $99/mo through a build. Carry the proven trap forward: contract rates cannot be corrected in bulk, so verify each published rate before the first signup.","Gate set 2026-08-22","Store Operating Standards v1.15 sec11; this sheet, Contract rates cannot be corrected in bulk"],
["BUILD GATE","POC21 is the frozen reference","Governance / theme repo","On the day the build starts, POC21 becomes the frozen reference implementation. After the freeze a POC change happens ONLY if it is a decision that needs modelling before we commit to it in production. Never polish.","The POC stopped earning its keep at POC18: the scorecard ran 7.9 across POC17 to POC20 and the last three batches were correctness work. The two dimensions still short of 9 are gated on PHOTOGRAPHY AND REAL SKUs, not on code. Without a freeze, every further tweak is work done twice - once in the POC and once in production.","Gate set 2026-08-22","CLAUDE.md sec10 scorecard; docs/POC20_rescore.md; docs/scoring-history.md"],
'''
sub('D = [\n', NEW, 'head of the D list')

# 3. promote seven existing rows ------------------------------------------
for state, name in [('OPEN', '3PL'),
                    ('GAP',  'Duplicate SKUs give INDEPENDENT stock pools - overselling, not just mis-picking'),
                    ('OPEN', 'Benefit visibility'),
                    ('OPEN', 'Account branding'),
                    ('GAP',  'Analytics stack'),
                    ('OPEN', 'Does the site publish a phone number?'),
                    ('OPEN', 'Flow reliability')]:
    sub('["%s","%s"' % (state, name), '["BUILD GATE","%s"' % name, 'promote ' + name)

# 4. their TRACK entries: new Next action / By when ------------------------
TRACK_NEW = {
 '3PL': ('Steve',
   'Shortlist and ask the three QUALIFYING questions in Standard sec12.9. The ANSWERS gate the build; the contract does not.',
   'Answers: BEFORE BUILD STARTS. Contract: before launch.'),
 'Duplicate SKUs give INDEPENDENT stock pools - overselling, not just mis-picking': ('Steve + Code',
   'Re-open the three sec13.9.2 candidates against overselling, not just mis-picking. Decide once the 3PL answers land - it picks whether Offerta is a second product, a variant, or a tag.',
   'BEFORE BUILD STARTS - it is a data shape, not a page.'),
 'Benefit visibility': ('Steve + Code',
   'Decide whether the theme renders the subscriber benefit from base-vs-plan price. It changes cart and product markup, so it is cheaper to decide than to retrofit.',
   'BEFORE BUILD STARTS'),
 'Account branding': ('Steve',
   'Settings > Checkout > Configurations > Edit - does the branding editor offer Marcellus, or accept an uploaded font? Two minutes, with the Browser pane displayed.',
   'BEFORE BUILD STARTS'),
 'Analytics stack': ('Steve',
   'Choose an analytics stack. It is a snippet in theme.liquid plus a consent posture, so it wants deciding before the layout is written, not after.',
   'BEFORE BUILD STARTS'),
 'Does the site publish a phone number?': ('Steve + Code',
   'Decide whether the storefront carries a tel: link. Feeds the contact page and the JSON-LD contactPoint.',
   'BEFORE BUILD STARTS'),
 'Flow reliability': ('Code',
   'Test a Flow scheduled trigger with Run-code date arithmetic on the dev store. Test the FAILURE MODE - the reported problem is that date comparison fails silently.',
   'BEFORE BUILD STARTS (its own stated deadline)'),
}
for key, vals in TRACK_NEW.items():
    pat = re.compile(r'^ "%s": \([^\n]*\),$' % re.escape(key), re.M)
    hits = pat.findall(src)
    assert len(hits) == 1, 'TRACK key %r matched %d lines' % (key, len(hits))
    src = pat.sub(lambda m: ' "%s": (%s),' % (key, ', '.join('"%s"' % v for v in vals)), src)
    n += 1

# 5. TRACK entries for the five new rows ----------------------------------
NEW_TRACK = '''TRACK = {
 "One signed roaster and 2-3 real SKUs": ("Steve + Lucia", "Sign the first roaster; collect the per-SKU data listed in build spec sec15.2.", "GATES THE BUILD START DATE"),
 "Pricing matrix validated against real landed costs": ("Steve", "Run 3-5 real SKUs through the matrix; confirm or amend the multipliers.", "BEFORE BUILD STARTS (needs the roaster gate first)"),
 "Execute the locked plan decision - upgrade to Grow": ("Steve", "Upgrade the plan. Five minutes.", "BEFORE BUILD STARTS"),
 "Publish the two selling plans; stay on Loop Free during the build": ("Steve + Code", "Create and publish the two plans on the production store.", "BEFORE BUILD STARTS"),
 "POC21 is the frozen reference": ("Steve + Code", "Declare the freeze on the day the build starts; log it in CLAUDE.md sec9.", "AT BUILD START"),
'''
sub('TRACK = {\n', NEW_TRACK, 'head of TRACK')

# 6. float the gate block to the top - stable sort, everything else keeps order
sub('D = [d + list(TRACK.get(d[1], ("-", "-", "-"))) for d in D]',
    'D.sort(key=lambda d: 0 if d[0] == "BUILD GATE" else 1)   # stable: gate block floats to the top\n'
    'D = [d + list(TRACK.get(d[1], ("-", "-", "-"))) for d in D]',
    'gate sort')

# 7. row fill --------------------------------------------------------------
sub('fill = {"LOCKED": "FFEFF6EF", "PART RESOLVED": "FFEFF6EF", "RESOLVED": "FFEFF6EF",',
    'fill = {"BUILD GATE": "FFF2E4CE",   # pale Crema Gold tint - used by no other state\n'
    '            "LOCKED": "FFEFF6EF", "PART RESOLVED": "FFEFF6EF", "RESOLVED": "FFEFF6EF",',
    'gate fill')

# 8. legend ----------------------------------------------------------------
sub('block("Status values", [\n',
    'block("Status values", [\n'
    ' ("BUILD GATE", "Decisions sheet only. Must be true BEFORE the production build starts, as '
    'distinct from before launch. Most open items on this sheet are launch-blocking, not '
    'build-blocking - waiting on those costs weeks and buys nothing. Build-blocking means: if this '
    'is wrong, we rewrite rather than edit."),\n',
    'legend entry')

with io.open(P, 'w', encoding='utf-8', newline='') as f:
    f.write(src)
print('ported: %d patches applied to %s' % (n, P))
print('now run:  python build_inventory.py')
