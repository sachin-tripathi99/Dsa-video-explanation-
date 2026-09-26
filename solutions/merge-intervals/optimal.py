class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        out = []
        for s, e in sorted(intervals, key=lambda x: x[0]):
            if out and s <= out[-1][1]:
                out[-1][1] = max(out[-1][1], e)   # extend
            else:
                out.append([s, e])              # new group
        return out
