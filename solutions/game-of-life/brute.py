class Solution:
    def gameOfLife(self, board: List[List[int]]) -> None:
        m, n = len(board), len(board[0])
        nxt = [[0] * n for _ in range(m)]
        for r in range(m):
            for c in range(n):
                live = sum(board[r + dr][c + dc]
                           for dr in (-1, 0, 1) for dc in (-1, 0, 1)
                           if (dr or dc) and 0 <= r + dr < m and 0 <= c + dc < n)
                nxt[r][c] = int(live in (2, 3)) if board[r][c] else int(live == 3)
        board[:] = nxt
