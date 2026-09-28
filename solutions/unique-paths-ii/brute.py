class Solution:
    def uniquePathsWithObstacles(self, obstacleGrid: List[List[int]]) -> int:
        g = obstacleGrid

        def paths(r, c):
            if r < 0 or c < 0 or g[r][c] == 1:
                return 0                        # off-grid or rock
            if r == 0 and c == 0:
                return 1
            return paths(r - 1, c) + paths(r, c - 1)

        return paths(len(g) - 1, len(g[0]) - 1)
