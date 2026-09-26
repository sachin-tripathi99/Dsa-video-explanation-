class Solution:
    def shortestSubarray(self, nums: List[int], k: int) -> int:
        P = [0]
        for x in nums:
            P.append(P[-1] + x)
        best = float("inf")
        for j in range(1, len(P)):
            for i in range(j):
                if P[j] - P[i] >= k:
                    best = min(best, j - i)
        return -1 if best == float("inf") else best
