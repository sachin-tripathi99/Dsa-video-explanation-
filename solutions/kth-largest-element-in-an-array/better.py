import heapq

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        heap = []                                  # min-heap of the k largest
        for x in nums:
            heapq.heappush(heap, x)
            if len(heap) > k:
                heapq.heappop(heap)                # drop the smallest
        return heap[0]
