class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        end, removed = float("-inf"), 0
        for s, e in sorted(intervals, key=lambda x: x[1]):   # by end
            if s >= end:
                end = e                         # keep
            else:
                removed += 1                    # overlaps the kept set
        return removed
