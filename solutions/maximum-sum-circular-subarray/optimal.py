class Solution:
    def maxSubarraySumCircular(self, nums: List[int]) -> int:
        hi = lo = best_hi = best_lo = total = nums[0]
        for x in nums[1:]:
            hi = max(x, hi + x)
            best_hi = max(best_hi, hi)
            lo = min(x, lo + x)
            best_lo = min(best_lo, lo)
            total += x
        if best_hi < 0:
            return best_hi                      # all negative: wrapping would mean empty
        return max(best_hi, total - best_lo)
