import heapq

class Solution:
    def minStoneSum(self, piles: List[int], k: int) -> int:
        heap = [-p for p in piles]              # max-heap via negatives
        heapq.heapify(heap)
        for _ in range(k):
            x = -heapq.heappop(heap)
            heapq.heappush(heap, -(x - x // 2))
        return -sum(heap)
