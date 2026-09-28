class Solution:
    def uniquePathsWithObstacles(self, obstacleGrid: List[List[int]]) -> int:
        n = len(obstacleGrid[0])
        row = [1] + [0] * (n - 1)               # the start (reset below if blocked)
        for g in obstacleGrid:
            for c in range(n):
                if g[c] == 1:
                    row[c] = 0                  # rock: no paths
                elif c > 0:
                    row[c] += row[c - 1]        # above (old) + left (new)
        return row[-1]
