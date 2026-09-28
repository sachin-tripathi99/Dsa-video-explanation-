class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        R, C = len(board), len(board[0])

        def dfs(w, r, c, i):
            if i == len(w):
                return True
            if r < 0 or c < 0 or r >= R or c >= C or board[r][c] != w[i]:
                return False
            tmp, board[r][c] = board[r][c], "#"    # mark used
            ok = any(dfs(w, r + dr, c + dc, i + 1) for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)))
            board[r][c] = tmp
            return ok

        # a full search per word
        return [w for w in words if any(dfs(w, r, c, 0) for r in range(R) for c in range(C))]
