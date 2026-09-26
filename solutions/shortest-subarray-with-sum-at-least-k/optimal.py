from collections import deque

class Solution:
    def shortestSubarray(self, nums: List[int], k: int) -> int:
        P = [0]
        for x in nums:
            P.append(P[-1] + x)
        dq, best = deque(), float("inf")        # prefix indices, P increasing
        for j, p in enumerate(P):
            while dq and p - P[dq[0]] >= k:
                best = min(best, j - dq.popleft())
            while dq and P[dq[-1]] >= p:
                dq.pop()                        # dominated start
            dq.append(j)
        return -1 if best == float("inf") else best
