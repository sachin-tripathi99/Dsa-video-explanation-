class Solution:
    def combinationSum3(self, k: int, n: int) -> List[List[int]]:
        out, path = [], []

        def go(start, remain):
            if len(path) == k:
                if remain == 0:
                    out.append(path[:])
                return
            for x in range(start, 10):
                if x > remain:
                    break                       # larger numbers overshoot too
                path.append(x)
                go(x + 1, remain - x)
                path.pop()

        go(1, n)
        return out
