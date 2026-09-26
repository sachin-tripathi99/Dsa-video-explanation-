import heapq

class Solution:
    def smallestRange(self, nums: List[List[int]]) -> List[int]:
        heap = [(l[0], i, 0) for i, l in enumerate(nums)]   # one pick per list
        heapq.heapify(heap)
        mx = max(l[0] for l in nums)
        best = None
        while True:
            lo, i, j = heapq.heappop(heap)      # current minimum pick
            if best is None or mx - lo < best[1] - best[0]:
                best = [lo, mx]
            if j + 1 == len(nums[i]):
                return best                     # that list is exhausted
            nx = nums[i][j + 1]
            heapq.heappush(heap, (nx, i, j + 1))
            mx = max(mx, nx)
