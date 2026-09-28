class Solution:
    def deleteAndEarn(self, nums: List[int]) -> int:
        pts = [0] * (max(nums) + 1)
        for x in nums:
            pts[x] += x                         # bucket points by value
        prev2 = prev1 = 0
        for p in pts:                           # House Robber over values
            prev2, prev1 = prev1, max(prev1, prev2 + p)
        return prev1
