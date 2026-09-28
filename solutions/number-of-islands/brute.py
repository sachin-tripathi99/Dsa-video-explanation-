from collections import deque

class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        m, n = len(grid), len(grid[0])
        seen = [[False] * n for _ in range(m)]
        count = 0
        for r in range(m):
            for c in range(n):
                if grid[r][c] != "1" or seen[r][c]:
                    continue
                count += 1
                q = deque([(r, c)])
                seen[r][c] = True
                while q:                        # BFS over this island
                    cr, cc = q.popleft()
                    for nr, nc in ((cr + 1, cc), (cr - 1, cc), (cr, cc + 1), (cr, cc - 1)):
                        if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == "1" and not seen[nr][nc]:
                            seen[nr][nc] = True
                            q.append((nr, nc))
        return count
