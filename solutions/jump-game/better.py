class Solution:
    def canJump(self, nums: List[int]) -> bool:
        n = len(nums)
        good = [False] * n
        good[-1] = True
        for i in range(n - 2, -1, -1):
            good[i] = any(good[i + s] for s in range(1, min(nums[i], n - 1 - i) + 1))
        return good[0]
