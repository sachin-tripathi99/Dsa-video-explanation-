class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        out = []
        for mask in range(1 << n):
            if bin(mask).count("1") == k:       # right size only
                out.append([i + 1 for i in range(n) if mask >> i & 1])
        return out
