from collections import deque

class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        n = len(grid)

        def reach(t):
            seen = {(0, 0)}
            q = deque([(0, 0)])
            while q:
                r, c = q.popleft()
                if (r, c) == (n - 1, n - 1):
                    return True
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < n and 0 <= nc < n and (nr, nc) not in seen and grid[nr][nc] <= t:
                        seen.add((nr, nc))
                        q.append((nr, nc))
            return False

        t = grid[0][0]
        while not reach(t):                     # raise the water step by step
            t += 1
        return t
