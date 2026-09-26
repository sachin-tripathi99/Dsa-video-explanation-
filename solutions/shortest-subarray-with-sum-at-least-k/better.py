import heapq

class Solution:
    def shortestSubarray(self, nums: List[int], k: int) -> int:
        heap = [(0, 0)]                         # (prefix, index)
        P, best = 0, float("inf")
        for j, x in enumerate(nums, 1):
            P += x
            while heap and P - heap[0][0] >= k:
                best = min(best, j - heapq.heappop(heap)[1])
            heapq.heappush(heap, (P, j))
        return -1 if best == float("inf") else best
