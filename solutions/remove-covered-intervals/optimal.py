class Solution:
    def removeCoveredIntervals(self, intervals: List[List[int]]) -> int:
        kept, max_end = 0, float("-inf")
        for s, e in sorted(intervals, key=lambda x: (x[0], -x[1])):   # start ↑, end ↓
            if e > max_end:                     # sticks out → not covered
                kept += 1
                max_end = e
        return kept
