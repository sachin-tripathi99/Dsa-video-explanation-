class Solution:
    def lastStoneWeightII(self, stones: List[int]) -> int:
        total = sum(stones)
        half = total // 2
        best = 0

        def search(i, s):                       # every subset as group B
            nonlocal best
            if s > half:
                return
            best = max(best, s)
            if i == len(stones):
                return
            search(i + 1, s + stones[i])
            search(i + 1, s)

        search(0, 0)
        return total - 2 * best
