class Solution:
    def shortestPathBinaryMatrix(self, grid: List[List[int]]) -> int:
        n = len(grid)
        if grid[0][0]:
            return -1
        best = float("inf")
        on_path = set()

        def dfs(r, c, length):                  # every simple path
            nonlocal best
            if length >= best:
                return
            if r == n - 1 and c == n - 1:
                best = length
                return
            on_path.add((r, c))
            for dr in (-1, 0, 1):
                for dc in (-1, 0, 1):
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < n and 0 <= nc < n and not grid[nr][nc] and (nr, nc) not in on_path:
                        dfs(nr, nc, length + 1)
            on_path.discard((r, c))

        dfs(0, 0, 1)
        return -1 if best == float("inf") else best
