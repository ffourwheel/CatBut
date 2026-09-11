# Reactivation scoring and combo

The original prototype rule gave every Reactivation a fixed `+50` and did not increase Combo. We decided that Reactivation should remain rewarding but diminish with repeated use: its base score is `50, 40, 30, 20, 10` with a floor of `10`, multiplied by the current Combo, and every successful Reactivation increases Combo up to `x4`. The counter is kept per button for the duration of a Stage and resets on Retry, preserving the incentive to open new buttons while preventing one repeatedly sabotaged button from producing unlimited full-value points.
