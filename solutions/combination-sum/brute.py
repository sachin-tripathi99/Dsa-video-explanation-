class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        seen = set()

        def go(remain, seq):
            if remain == 0:
                seen.add(tuple(sorted(seq)))    # order duplicates collapse here
                return
            for x in candidates:                # any candidate, any order
                if x <= remain:
                    go(remain - x, seq + [x])

        go(target, [])
        return [list(t) for t in seen]
