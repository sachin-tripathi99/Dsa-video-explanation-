class Solution:
    def gameOfLife(self, board: List[List[int]]) -> None:
        m, n = len(board), len(board[0])
        for r in range(m):
            for c in range(n):
                live = sum(board[r + dr][c + dc] & 1              # bit 0 = current state
                           for dr in (-1, 0, 1) for dc in (-1, 0, 1)
                           if (dr or dc) and 0 <= r + dr < m and 0 <= c + dc < n)
                alive = board[r][c] & 1
                if (alive and live in (2, 3)) or (not alive and live == 3):
                    board[r][c] |= 2                            # bit 1 = next state
        for r in range(m):
            for c in range(n):
                board[r][c] >>= 1
