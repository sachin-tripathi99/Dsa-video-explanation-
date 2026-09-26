import heapq
from collections import Counter

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        heap = []                               # (count, key), least frequent on top
        for key, c in Counter(nums).items():
            heapq.heappush(heap, (c, key))
            if len(heap) > k:
                heapq.heappop(heap)
        return [key for _, key in heap]
