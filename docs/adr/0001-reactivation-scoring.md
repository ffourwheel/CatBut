# Reactivation scoring and combo

The original prototype rule gave every Reactivation a fixed `+50` and did not increase Combo. The first accepted scoring scale kept Reactivation rewarding but diminished with repeated use: its base score was `50, 40, 30, 20, 10` with a floor of `10`, multiplied by the current Combo, and every successful Reactivation increased Combo up to `x4`. The counter was kept per button for the duration of a Stage and reset on Retry, preserving the incentive to open new buttons while preventing one repeatedly sabotaged button from producing unlimited full-value points. The numeric scale was later amended below without changing that behaviour.

## Scale amendment

The prototype now uses a compact ten-point score scale so feedback remains readable on mobile. The relative rule is unchanged: new activations start at `10`, while Reactivation uses `5, 4, 3, 2, 1` with a floor of `1`, and both values are multiplied by the current Combo. The per-button reactivation counter and `x4` Combo cap remain unchanged.
