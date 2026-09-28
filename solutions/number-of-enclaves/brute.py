from collections import deque

class Solution:
    def numEnclaves(self, grid: List[List[int]]) -> int:
        m, n = len(grid), len(grid[0])

        def escapes(sr, sc):                    # fresh search per land cell
            seen, q = {(sr, sc)}, deque([(sr, sc)])
            while q:
                r, c = q.popleft()
                if r in (0, m - 1) or c in (0, n - 1):
                    return True
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < m and 0 <= nc < n and (nr, nc) not in seen and grid[nr][nc] == 1:
                        seen.add((nr, nc))
                        q.append((nr, nc))
            return False

        return sum(1 for r in range(m) for c in range(n) if grid[r][c] == 1 and not escapes(r, c))
