class Solution:
    def findGCD(self, nums: List[int]) -> int:
        mn, mx = min(nums), max(nums)
        for d in range(mn, 0, -1):
            if mn % d == 0 and mx % d == 0:
                return d
        return 1
