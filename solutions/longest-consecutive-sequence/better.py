class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        if not nums:
            return 0
        nums.sort()
        best = run = 1
        for i in range(1, len(nums)):
            if nums[i] == nums[i - 1]:          # duplicate: ignore
                continue
            run = run + 1 if nums[i] == nums[i - 1] + 1 else 1
            best = max(best, run)
        return best
