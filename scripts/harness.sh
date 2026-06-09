#!/usr/bin/env bash
# Objective-gate harness for the autonomous improvement loop.
# Runs every hard gate; any failure means "do not accept this iteration".
# The soft (visual / feel) judgement happens separately, in the browser.

set -uo pipefail
cd "$(dirname "$0")/.."

fail=0
hr() { printf '%.0s─' {1..50}; echo; }

hr; echo "▶ lint"
npm run -s lint || fail=1

hr; echo "▶ build"
if npm run -s build >/dev/null 2>&1; then echo "  build ok"; else echo "  build FAILED"; fail=1; fi

hr; echo "▶ solvability (500 seeds)"
node scripts/verify-solvable.mjs 500 || fail=1

hr; echo "▶ playability metrics (500 seeds)"
node scripts/playtest.mjs 500

hr
if [ "$fail" -eq 0 ]; then echo "HARNESS: PASS ✅"; else echo "HARNESS: FAIL ❌"; fi
exit "$fail"
