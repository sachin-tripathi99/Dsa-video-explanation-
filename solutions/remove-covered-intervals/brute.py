class Solution:
    def removeCoveredIntervals(self, intervals: List[List[int]]) -> int:
        kept = 0
        for i, (a, b) in enumerate(intervals):
            if not any(j != i and c <= a and b <= d for j, (c, d) in enumerate(intervals)):
                kept += 1
        return kept
