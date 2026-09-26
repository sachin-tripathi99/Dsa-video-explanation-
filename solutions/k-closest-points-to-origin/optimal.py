import random

class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        d = lambda p: p[0] * p[0] + p[1] * p[1]
        lo, hi = 0, len(points) - 1
        while lo < hi:
            p = random.randint(lo, hi)
            points[p], points[hi] = points[hi], points[p]   # random pivot to the end
            piv, s = d(points[hi]), lo
            for i in range(lo, hi):
                if d(points[i]) < piv:
                    points[i], points[s] = points[s], points[i]
                    s += 1
            points[s], points[hi] = points[hi], points[s]   # pivot at its sorted position s
            if s == k:
                break
            if s < k:
                lo = s + 1
            else:
                hi = s - 1
        return points[:k]
