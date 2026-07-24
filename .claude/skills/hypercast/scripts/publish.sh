#!/usr/bin/env bash
# hypercast publish — convert and publish a blog post to dev.to as a draft
# Usage: bash publish.sh <slug> [--dry-run]
# Env:   DEVTO_API_KEY must be set (unless --dry-run)
set -euo pipefail

exec node "$(dirname "$0")/convert.js" "$@"
