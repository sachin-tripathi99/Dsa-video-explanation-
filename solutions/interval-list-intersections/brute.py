class Solution:
    def intervalIntersection(self, firstList: List[List[int]], secondList: List[List[int]]) -> List[List[int]]:
        out = []
        for a in firstList:
            for b in secondList:
                lo, hi = max(a[0], b[0]), min(a[1], b[1])
                if lo <= hi:
                    out.append([lo, hi])
        return out
