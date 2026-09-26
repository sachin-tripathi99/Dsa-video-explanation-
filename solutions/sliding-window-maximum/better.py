import heapq

class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        heap, out = [], []                      # (−value, index): a max-heap
        for i, x in enumerate(nums):
            heapq.heappush(heap, (-x, i))
            if i >= k - 1:
                while heap[0][1] <= i - k:
                    heapq.heappop(heap)         # lazily drop expired tops
                out.append(-heap[0][0])
        return out
