class Solution:
    def findMinArrowShots(self, points: List[List[int]]) -> int:
        intact = list(range(len(points)))
        arrows = 0
        while intact:
            x = min(points[i][1] for i in intact)   # end of the balloon ending first
            arrows += 1
            intact = [i for i in intact if not (points[i][0] <= x <= points[i][1])]
        return arrows
