class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates.sort()
        out, path = [], []

        def go(start, remain):
            if remain == 0:
                out.append(path[:])
                return
            for i in range(start, len(candidates)):
                if candidates[i] > remain:
                    break                       # sorted: the rest are bigger
                path.append(candidates[i])
                go(i, remain - candidates[i])   # i: reuse allowed
                path.pop()

        go(0, target)
        return out
