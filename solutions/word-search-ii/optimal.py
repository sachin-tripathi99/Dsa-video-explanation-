class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        root = {}
        for w in words:
            cur = root
            for ch in w:
                cur = cur.setdefault(ch, {})
            cur["$"] = w
        R, C = len(board), len(board[0])
        res = []

        def dfs(r, c, parent):
            ch = board[r][c]
            node = parent.get(ch)
            if node is None:
                return                          # not a prefix of any word → prune
            if "$" in node:
                res.append(node.pop("$"))       # report once
            board[r][c] = "#"
            for nr, nc in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
                if 0 <= nr < R and 0 <= nc < C and board[nr][nc] != "#":
                    dfs(nr, nc, node)
            board[r][c] = ch
            if not node:
                parent.pop(ch)                  # prune an empty branch

        for r in range(R):
            for c in range(C):
                dfs(r, c, root)
        return res
