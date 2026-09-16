/**
 * Resolve the only two outcomes of a successful button activation.
 * Stage completion takes precedence over a new cat reaction so a final tap
 * cannot be undone by a sabotage that was queued in the same frame.
 */
export function resolveButtonCompletion({
  allActivated,
  onStageClear,
  onPlayerActivated,
  slotId,
}) {
  if (allActivated) {
    onStageClear();
    return 'stage-clear';
  }

  onPlayerActivated(slotId);
  return 'cat-reaction';
}
