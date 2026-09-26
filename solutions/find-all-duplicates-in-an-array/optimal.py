class Solution:
    def findDuplicates(self, nums: List[int]) -> List[int]:
        out = []
        for x in nums:
            j = abs(x) - 1
            if nums[j] < 0:
                out.append(abs(x))              # seen before
            else:
                nums[j] = -nums[j]              # mark as seen
        return out
