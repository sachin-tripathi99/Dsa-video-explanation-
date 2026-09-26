class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        found = set()
        for i in range(len(nums)):
            seen = set()
            for j in range(i + 1, len(nums)):
                need = -nums[i] - nums[j]
                if need in seen:
                    found.add(tuple(sorted((nums[i], nums[j], need))))
                seen.add(nums[j])
        return [list(t) for t in found]
