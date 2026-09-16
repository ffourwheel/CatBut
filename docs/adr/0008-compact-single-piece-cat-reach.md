# ADR-0008: Compact single-piece cat reach

- Status: Accepted
- Date: 2026-09-15

## Context

The first connected reach prototype split the visible arm into upper-arm and forearm layers. In visual QA, the multiple joints read as a long segmented limb and could make the cat look deformed, especially when reaching to a side button. The user also asked for a smaller, rounder cat with a short arm and a body that turns toward the button before pressing it.

## Decision

Use one compact, continuous arm-and-paw asset per side as the runtime reach layer. Before the reach, rotate and shift the cat body, shoulder, and head toward the selected button. Show only the near arm during the action; keep the far arm tucked/hidden. The arm may scale modestly to close the remaining distance, but it must not be assembled from visible elbow segments.

The v3 upper-arm and forearm assets remain in the repository as legacy/reference assets and are not required for Cat Rig activation.

## Consequences

- The silhouette reads as one short, connected cat limb.
- Side targets get a readable body/head turn without requiring a long arm extension.
- Runtime asset readiness is simpler: both compact side-arm assets are required, while segmented v3 assets are optional legacy references.
- Detailed elbow articulation is intentionally traded for a cleaner, more natural-looking prototype motion.
