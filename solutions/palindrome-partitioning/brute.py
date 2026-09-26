class Solution:
    def partition(self, s: str) -> List[List[str]]:
        out, path = [], []

        def go(i):
            if i == len(s):
                out.append(path[:])
                return
            for j in range(i + 1, len(s) + 1):
                piece = s[i:j]
                if piece == piece[::-1]:        # O(n) check
                    path.append(piece)
                    go(j)
                    path.pop()

        go(0)
        return out
