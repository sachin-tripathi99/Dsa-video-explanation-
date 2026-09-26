class Solution:
    def findMaxLength(self, nums: List[int]) -> int:
        best = 0
        for i in range(len(nums)):
            bal = 0
            for j in range(i, len(nums)):
                bal += 1 if nums[j] else -1
                if bal == 0:
                    best = max(best, j - i + 1)
        return best
