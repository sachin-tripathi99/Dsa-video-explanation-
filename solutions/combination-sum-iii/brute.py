class Solution:
    def combinationSum3(self, k: int, n: int) -> List[List[int]]:
        out = []
        for mask in range(1 << 9):
            c = [i + 1 for i in range(9) if mask >> i & 1]
            if len(c) == k and sum(c) == n:
                out.append(c)
        return out
