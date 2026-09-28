class Solution:
    def rob(self, nums: List[int]) -> int:
        prev2 = prev1 = 0                       # best up to i − 2, i − 1
        for x in nums:
            prev2, prev1 = prev1, max(prev1, prev2 + x)   # skip or rob
        return prev1
