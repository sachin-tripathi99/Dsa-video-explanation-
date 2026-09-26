class Solution:
    def maxAbsoluteSum(self, nums: List[int]) -> int:
        hi = lo = best_hi = best_lo = 0
        for x in nums:
            hi = max(x, hi + x)                 # Kadane for the maximum
            lo = min(x, lo + x)                 # Kadane for the minimum
            best_hi = max(best_hi, hi)
            best_lo = min(best_lo, lo)
        return max(best_hi, -best_lo)
