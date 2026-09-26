class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        m, n = len(matrix), len(matrix[0])
        seen = [[False] * n for _ in range(m)]
        dirs = [(0, 1), (1, 0), (0, -1), (-1, 0)]           # right, down, left, up
        out = []
        r = c = d = 0
        for _ in range(m * n):
            out.append(matrix[r][c])
            seen[r][c] = True
            nr, nc = r + dirs[d][0], c + dirs[d][1]
            if not (0 <= nr < m and 0 <= nc < n) or seen[nr][nc]:
                d = (d + 1) % 4                             # turn right
                nr, nc = r + dirs[d][0], c + dirs[d][1]
            r, c = nr, nc
        return out
