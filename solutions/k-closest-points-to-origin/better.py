import heapq

class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        heap = []                               # (−distance², x, y): farthest on top
        for x, y in points:
            heapq.heappush(heap, (-(x * x + y * y), x, y))
            if len(heap) > k:
                heapq.heappop(heap)
        return [[x, y] for _, x, y in heap]
