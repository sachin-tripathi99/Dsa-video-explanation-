class Solution:
    def smallestRange(self, nums: List[List[int]]) -> List[int]:
        best = None
        for lo in sorted(x for l in nums for x in l):
            hi = float("-inf")
            for l in nums:
                cand = next((x for x in l if x >= lo), None)   # first element ≥ lo
                if cand is None:
                    return best
                hi = max(hi, cand)
            if best is None or hi - lo < best[1] - best[0]:
                best = [lo, hi]
        return best
