class Solution:
    def minGroups(self, intervals: List[List[int]]) -> int:
        st = sorted(s for s, _ in intervals)
        en = sorted(e for _, e in intervals)
        j = groups = 0
        for s in st:
            if s > en[j]:
                j += 1                          # an interval finished: reuse its group
            else:
                groups += 1
        return groups
