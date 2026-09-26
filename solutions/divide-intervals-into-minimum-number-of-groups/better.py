import heapq

class Solution:
    def minGroups(self, intervals: List[List[int]]) -> int:
        ends = []                               # end time of each group
        for s, e in sorted(intervals):
            if ends and ends[0] < s:
                heapq.heapreplace(ends, e)      # reuse the group that frees first
            else:
                heapq.heappush(ends, e)
        return len(ends)
