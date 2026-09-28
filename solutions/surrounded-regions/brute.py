from collections import deque

class Solution:
    def solve(self, board: List[List[str]]) -> None:
        m, n = len(board), len(board[0])

        def escapes(sr, sc):                    # fresh search per cell
            seen, q = {(sr, sc)}, deque([(sr, sc)])
            while q:
                r, c = q.popleft()
                if r in (0, m - 1) or c in (0, n - 1):
                    return True
                for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                    if 0 <= nr < m and 0 <= nc < n and (nr, nc) not in seen and board[nr][nc] == "O":
                        seen.add((nr, nc))
                        q.append((nr, nc))
            return False

        capture = [(r, c) for r in range(m) for c in range(n) if board[r][c] == "O" and not escapes(r, c)]
        for r, c in capture:
            board[r][c] = "X"
