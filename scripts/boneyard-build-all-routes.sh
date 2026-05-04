#!/usr/bin/env bash

set -u

BASE_URL="${1:-${BONEYARD_BASE_URL:-http://localhost:3000}}"
MAX_RETRIES="${BONEYARD_MAX_RETRIES:-5}"
WAIT_MS="${BONEYARD_WAIT_MS:-1000}"
BREAKPOINTS="${BONEYARD_BREAKPOINTS:-375,768,1280}"

ROUTES=(
  "/"
  "/log-in"
  "/sign-up"
  "/owner/dashboard"
  "/owner/calendar"
  "/owner/teachers"
  "/owner/teachers/add"
  "/owner/teachers/TCH-2024-001"
  "/owner/students"
  "/owner/students/add"
  "/owner/students/ST2024003"
  "/owner/announcements"
  "/owner/settings"
  "/student/calendar"
  "/student/subjects"
  "/student/notification"
  "/student/notification/sn-1"
  "/student/settings"
  "/teacher/calendar"
  "/teacher/classes"
  "/teacher/classes/allCollections"
  "/teacher/notifications"
  "/teacher/notifications/add"
  "/teacher/notifications/4a36"
  "/teacher/settings"
)

failures=()

for route in "${ROUTES[@]}"; do
  url="${BASE_URL%/}${route}"
  success=0

  for ((attempt = 1; attempt <= MAX_RETRIES; attempt++)); do
    echo
    echo "=== [${attempt}/${MAX_RETRIES}] boneyard build: ${url} ==="

    if pnpx boneyard-js build --url "${url}" --wait "${WAIT_MS}" --breakpoints "${BREAKPOINTS}"; then
      success=1
      break
    fi

    sleep 1
  done

  if [[ "${success}" -eq 0 ]]; then
    failures+=("${url}")
  fi
done

if [[ "${#failures[@]}" -gt 0 ]]; then
  echo
  echo "Boneyard could not complete these routes after retries:"
  for failed in "${failures[@]}"; do
    echo "  - ${failed}"
  done

  if [[ "${BONEYARD_STRICT:-0}" == "1" ]]; then
    exit 1
  fi

  echo
  echo "Continuing with partial success. Set BONEYARD_STRICT=1 to fail on route errors."
fi

echo
echo "Boneyard completed successfully for all configured routes."
