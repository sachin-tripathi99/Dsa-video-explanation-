class Solution:
    def checkValidString(self, s: str) -> bool:
        lo = hi = 0                             # min / max possible unmatched "("
        for c in s:
            if c == "(":
                lo, hi = lo + 1, hi + 1
            elif c == ")":
                lo, hi = lo - 1, hi - 1
            else:
                lo, hi = lo - 1, hi + 1         # * could close or open
            if hi < 0:
                return False                    # too many ")"
            lo = max(lo, 0)
        return lo == 0
