class Solution:
    def minGroups(self, intervals: List[List[int]]) -> int:
        return max(sum(1 for c, d in intervals if c <= a <= d) for a, _ in intervals)
