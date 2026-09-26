class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        out, path = [], []

        def go(open_, close):
            if len(path) == 2 * n:
                out.append("".join(path))
                return
            if open_ < n:
                path.append("(")
                go(open_ + 1, close)
                path.pop()
            if close < open_:
                path.append(")")
                go(open_, close + 1)
                path.pop()

        go(0, 0)
        return out
