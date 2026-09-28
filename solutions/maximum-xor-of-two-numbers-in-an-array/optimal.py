class Solution:
    def findMaximumXOR(self, nums: List[int]) -> int:
        root = {}
        for x in nums:                          # insert bits, highest first
            cur = root
            for b in range(30, -1, -1):
                cur = cur.setdefault((x >> b) & 1, {})
        best = 0
        for x in nums:
            cur, xr = root, 0
            for b in range(30, -1, -1):
                want = ((x >> b) & 1) ^ 1       # prefer the opposite bit
                if want in cur:
                    xr |= 1 << b
                    cur = cur[want]
                else:
                    cur = cur[want ^ 1]
            best = max(best, xr)
        return best
