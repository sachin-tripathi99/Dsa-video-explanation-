class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        n = len(candidates)
        seen = set()
        for mask in range(1 << n):
            s = [candidates[i] for i in range(n) if mask >> i & 1]
            if sum(s) == target:
                seen.add(tuple(sorted(s)))
        return [list(t) for t in seen]
