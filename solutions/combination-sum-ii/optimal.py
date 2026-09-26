class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates.sort()
        out, path = [], []

        def go(start, remain):
            if remain == 0:
                out.append(path[:])
                return
            for i in range(start, len(candidates)):
                if i > start and candidates[i] == candidates[i - 1]:
                    continue                    # duplicate at this depth
                if candidates[i] > remain:
                    break                       # overshoot
                path.append(candidates[i])
                go(i + 1, remain - candidates[i])   # i + 1: use once
                path.pop()

        go(0, target)
        return out
