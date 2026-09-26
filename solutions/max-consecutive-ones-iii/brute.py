class Solution:
    def longestOnes(self, nums: List[int], k: int) -> int:
        best = 0
        for i in range(len(nums)):
            zeros = 0
            for j in range(i, len(nums)):
                zeros += nums[j] == 0
                if zeros > k:
                    break
                best = max(best, j - i + 1)
        return best
