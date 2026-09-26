import heapq

class Solution:
    def longestSubarray(self, nums: List[int], limit: int) -> int:
        mx, mn = [], []                         # (−value, index) and (value, index)
        l = best = 0
        for r, x in enumerate(nums):
            heapq.heappush(mx, (-x, r))
            heapq.heappush(mn, (x, r))
            while True:
                while mx[0][1] < l:
                    heapq.heappop(mx)           # lazily drop stale tops
                while mn[0][1] < l:
                    heapq.heappop(mn)
                if -mx[0][0] - mn[0][0] <= limit:
                    break
                l += 1
            best = max(best, r - l + 1)
        return best
