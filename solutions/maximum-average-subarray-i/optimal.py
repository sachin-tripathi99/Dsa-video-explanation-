class Solution:
    def findMaxAverage(self, nums: List[int], k: int) -> float:
        s = sum(nums[:k])
        best = s
        for r in range(k, len(nums)):
            s += nums[r] - nums[r - k]          # one in, one out
            best = max(best, s)
        return best / k
