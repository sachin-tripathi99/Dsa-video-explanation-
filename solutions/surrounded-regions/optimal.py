class Solution:
    def solve(self, board: List[List[str]]) -> None:
        m, n = len(board), len(board[0])

        def mark(r, c):
            if r < 0 or c < 0 or r >= m or c >= n or board[r][c] != "O":
                return
            board[r][c] = "S"                   # reachable from the border
            mark(r + 1, c); mark(r - 1, c); mark(r, c + 1); mark(r, c - 1)

        for r in range(m):                      # border O cells
            mark(r, 0)
            mark(r, n - 1)
        for c in range(n):
            mark(0, c)
            mark(m - 1, c)
        for r in range(m):
            for c in range(n):
                board[r][c] = "O" if board[r][c] == "S" else "X"   # safe stays, the rest is captured
