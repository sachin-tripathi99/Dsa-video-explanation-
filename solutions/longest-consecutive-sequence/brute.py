class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        best = 0
        for x in nums:
            length = 1
            while x + length in nums:      # list membership: linear scan
                length += 1
            best = max(best, length)
        return best
