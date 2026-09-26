class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        hi = lo = best = nums[0]
        for x in nums[1:]:
            candidates = (x, hi * x, lo * x)    # use the old hi and lo
            hi, lo = max(candidates), min(candidates)
            best = max(best, hi)
        return best
