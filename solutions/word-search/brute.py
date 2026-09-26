class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        R, C = len(board), len(board[0])
        used = [[False] * C for _ in range(R)]

        def walk(r, c, path):                   # build a whole path, compare only at the end
            if r < 0 or c < 0 or r >= R or c >= C or used[r][c]:
                return False
            path.append(board[r][c])
            used[r][c] = True
            if len(path) == len(word):
                ok = "".join(path) == word
            else:
                ok = walk(r + 1, c, path) or walk(r - 1, c, path) or walk(r, c + 1, path) or walk(r, c - 1, path)
            used[r][c] = False
            path.pop()
            return ok

        return any(walk(r, c, []) for r in range(R) for c in range(C))
