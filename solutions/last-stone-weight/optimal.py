import heapq

class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:
        heap = [-s for s in stones]                 # negatives: max-heap with heapq
        heapq.heapify(heap)
        while len(heap) > 1:
            y, x = -heapq.heappop(heap), -heapq.heappop(heap)
            if y != x:
                heapq.heappush(heap, -(y - x))
        return -heap[0] if heap else 0
