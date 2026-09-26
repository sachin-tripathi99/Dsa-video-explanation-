class Solution:
    def findMinArrowShots(self, points: List[List[int]]) -> int:
        arrows, x = 0, float("-inf")
        for s, e in sorted(points, key=lambda p: p[1]):   # by end
            if s > x:                           # still intact → new arrow at its end
                arrows += 1
                x = e
        return arrows
