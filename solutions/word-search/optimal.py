class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        R, C = len(board), len(board[0])

        def dfs(r, c, k):
            if r < 0 or c < 0 or r >= R or c >= C or board[r][c] != word[k]:
                return False                    # mismatch or used
            if k == len(word) - 1:
                return True
            saved, board[r][c] = board[r][c], "#"   # mark as used
            ok = dfs(r + 1, c, k + 1) or dfs(r - 1, c, k + 1) or dfs(r, c + 1, k + 1) or dfs(r, c - 1, k + 1)
            board[r][c] = saved                 # unmark
            return ok

        return any(dfs(r, c, 0) for r in range(R) for c in range(C))
