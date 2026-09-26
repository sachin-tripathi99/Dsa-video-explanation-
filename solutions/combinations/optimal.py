class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        out, path = [], []

        def go(start):
            if len(path) == k:
                out.append(path[:])
                return
            need = k - len(path)
            for x in range(start, n - need + 2):    # enough numbers left
                path.append(x)
                go(x + 1)
                path.pop()

        go(1)
        return out
