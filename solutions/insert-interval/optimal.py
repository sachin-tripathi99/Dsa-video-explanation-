class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        out, (s, e), i, n = [], newInterval, 0, len(intervals)
        while i < n and intervals[i][1] < s:      # before
            out.append(intervals[i])
            i += 1
        while i < n and intervals[i][0] <= e:     # overlap
            s, e = min(s, intervals[i][0]), max(e, intervals[i][1])
            i += 1
        out.append([s, e])
        return out + intervals[i:]              # after
