class Solution:
    def longestOnes(self, nums: List[int], k: int) -> int:
        l = zeros = best = 0
        for r, x in enumerate(nums):
            zeros += x == 0
            while zeros > k:                    # shrink until valid
                zeros -= nums[l] == 0
                l += 1
            best = max(best, r - l + 1)
        return best
