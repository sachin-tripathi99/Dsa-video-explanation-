class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        s = set(nums)
        best = 0
        for x in s:
            if x - 1 in s:                 # not the start of a run
                continue
            length = 1
            while x + length in s:
                length += 1
            best = max(best, length)
        return best
